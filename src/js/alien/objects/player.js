/** @module Alien **/
"use strict";

/**
 * Implements player in alien girl game, it is reponsible for input/movement,
 * kinematics, visual representation, collision handling.
 *
 * @class
 * @classdesc Represents the player in the alien girl game.
 */
function Player()
{
	// Depends on sprite
	this.width = 32;
	this.height = 46;
	this.type = 'player';

	this.baseX = 0;
	this.baseY = 0;

	this.sensor_left = 6;
	this.sensor_right = 23;

	this.sink = new Sink(server + "/sink.php?game=AG" +
			"&session=" + options.gameId +
			"&user=" + options.userId +
			"&level=" + options.levelName +
			"&debug=" + (options.debugMode?"true":"false"));

	this.sink.transmitEvery = 20;

	this.events = [];


	this.reset = function()
	{
		this.engine = this.getEngine();

		// Position
		this.x = this.baseX;
		this.y = this.baseY;
		this.faceRight = true;

		// Velocities
		this.velX = 0;
		this.velY = 0;

		this.speed = 3.5;
		this.speedDefault = 3.5;
		this.speedSnow = 7.0;

		this.jumping = false;
		this.grounded = false;

		this.ground = { slippery: false, type: true }

		// Physics parameters
		this.gravity = 0.3;
		this.friction = this.frictionDefault;

		this.slideAccelerationSnow = 0.5;

		// Friction values for
		this.frictionDefault = 0.8;		// normal ground
		this.frictionDown = 0.7;			// when down is pressed
		this.frictionSnow = 0.999;			// when on snow

		this.scale = 1;
		this.alive = true;
		this.finished = false;

		this.events.push("RESTART");
	}


	/**
   * Serialize state to array
   */
  this.toArray = function()
  {
    return {
      'x': this.x,
      'y': this.y,
			'type': 'player'
    };
  }


  /**
   * Unserialize state from array
   */
  this.fromArray = function(array)
  {
    this.setStartingPosition(array.x, array.y);
  }


	/**
	 * Terminates the player
	 *
	 * @param {String} Reason the player was killed
	 */
	this.kill = function(reason)
	{
		if(this.alive) {
			this.events.push("DIED_" + reason.toUpperCase());
			this.sendPosition();
		}

		this.alive = false;
	}


	/**
	 * Update stating position of the player
	 *
	 * @param {number} x - X coordinate of player starting location
   * @param {number} y - Y coordinate of player starting location
   */
	this.setStartingPosition = function(x, y)
	{
		this.baseX = x;
		this.baseY = y;
	}


	/**
	 * Send position to server
	 */
	this.sendPosition = function()
	{
		this.sink.appendData({
			timestamp: Date.now() / 1000,
			x: this.x / 32,
			y: this.y / 32,
			event: JSON.stringify(this.events)
		});

		this.events = [];
	}


	this.getPermittedActions = function()
	{
		var x = Math.floor(this.x / 32);
		var y = Math.floor(this.y / 32);

		var level = this.parent.getObject("level");
		var code = level.levelMap[0][x] - 2304;

		return {
			walk_on_water: code == 1,
			walk_upside_down: code == 3 || code == 1,
			fly: code == 2,
		};
	}


	this.handleInput = function(input)
	{
		var permitted = this.getPermittedActions();

		if(!permitted.walk_upside_down && this.gravity < 0) {
			this.events.push("GRAVITY_NORMAL");
			this.gravity *= -1;
		}

		// Jump away from gravity
		if(input.keys[input.KEY_SPACE]) {
			if(!this.jumping && this.grounded) {
				this.jumping = true;
				this.grounded = false;
				this.velY = -sign(this.gravity) * this.speedDefault * 2;
			}
		}

		// Flip gravity if up and down are pressed at the same time
		if(input.keys[input.KEY_UP] && input.keys[input.KEY_DOWN])
		{
			// Allow wait at least 200ms before next flip
			if(permitted.walk_upside_down && (!this.lastFlip || this.engine.timestamp - this.lastFlip > 200))
			{
				this.lastFlip = this.engine.timestamp
				this.gravity *= -1;

				if(this.gravity < 0)
					this.events.push("GRAVITY_INVERTED")
				else
					this.events.push("GRAVITY_NORMAL");
			}
		} else {
			// Flying (under normal gravity)
			if(permitted.fly && input.keys[input.KEY_UP])
			{
				this.velY = -this.speedDefault * 0.5;
			}

			// Flying (when gravity is inverted)
			if(permitted.fly && input.keys[input.KEY_DOWN])
			{
				this.velY = this.speedDefault * 0.5;
			}
		}

		// Move to the left
		if(input.keys[input.KEY_LEFT] && this.velX > -this.speed)
			this.velX--;

		// Move to the right
		if(input.keys[input.KEY_RIGHT] && this.velX < this.speed)
			this.velX++;

		if(this.ground.slippery && !input.keys[input.KEY_DOWN]) {
			if(this.ground.type == 'hillDown')
				if(this.velX > 0.5 * -this.speed)
					this.velX -= 0.25;
			if(this.ground.type == 'hillUp')
				if(this.velX < 0.5 * this.speed)
					this.velX += 0.25;
		}

		// Change friction when pressing down / ground is slippery
		if(input.keys[input.KEY_DOWN]) {
			this.friction = this.frictionDown;
			this.speed = this.speedDefault;
		} else if(this.ground.slippery) {
			this.friction = this.frictionSnow;
			this.speed = this.speedSnow;
		} else {
			this.friction = this.frictionDefault;
			this.speed = this.speedDefault;
		}
	}


	/**
	 * Takes a list of sensors and returns the closest and furthest sensors
	 */
	this.combineSensors = function(sensors)
	{
		var minSensor = false;
		var maxSensor = false;

		for(var i = 0; i < sensors.length; i++) {
			if(!sensors[i] || !sensors[i].type)
				continue;

			if(!minSensor || sensors[i].y < minSensor.y)
				minSensor = sensors[i];

			if(!maxSensor || sensors[i].y > maxSensor.y)
				maxSensor = sensors[i];
		}

		return { min: minSensor, max: maxSensor };
	}


	this.sensorCallback = function(hit)
	{
		if(hit.type == "exit") {
			if(hit.dx == 0 && !this.finished) {
				this.events.push("EXIT");
				this.finished = true;
			}

			return false;
		}

		return hit;
	}


	/**************************************************************/


	this.collideVerticalDown = function(level)
	{
		var permitted = this.getPermittedActions();

		var dirY = Math.sign(this.gravity);
		var oriY = this.y + 10 + (dirY == 1) * (this.height - 20);

		var hit_left = level.sensor({
			x: this.x + this.sensor_left,
			y: oriY
		}, { x: 0, y: dirY }, 256, this.sensorCallback.bind(this));

		var hit_right = level.sensor({
			x: this.x + this.sensor_right,
			y: oriY
		}, { x: 0, y: dirY }, 256, this.sensorCallback.bind(this));

		var combined = this.combineSensors([hit_left, hit_right]);

		// Determine if player is on water
		var on_water =
			(hit_left && hit_left.type == 'water' &&
			 hit_right && hit_right.type == 'water');

		var on_water_body =
			(hit_left && hit_left.type == 'waterBody' &&
			 hit_right && hit_right.type == 'waterBody');

		if(dirY > 0 && combined.min && combined.min.dy < 10) {
			// If on water and we cannot walk on water, sink and die.
			if(on_water && (!permitted.walk_on_water || Math.abs(this.velX) <= 0.1 || this.jumping)) {
				if(combined.min.dy < -8)
					this.kill("water");
				return;
			}

			if(on_water_body && (!permitted.walk_on_water || Math.abs(this.velX) <= 0.1 || this.jumping)) {
				this.kill("water");
				return;
			}

			this.y = combined.min.y - this.height;
			this.velY = 0;
			this.grounded = true;
			this.jumping = false;

			this.ground.slippery = isSlippery(combined.min.sprite);
			this.ground.type = combined.min.type;
		} else if(dirY < 0 && combined.max && combined.max.dy > -10) {
			this.y = combined.max.y;
			this.velY = 0;
			this.grounded = true;
			this.jumping = false;
		} else {
			this.grounded = false;
		}
	}


	this.collideVerticalUp = function(level)
	{
		var dirY = -Math.sign(this.gravity);
		var oriY = this.y + 10 + (dirY == 1) * (this.height - 20);

		var hit_left = level.sensor(
			{ x: this.x + this.sensor_left, y: oriY },
			{ x: 0, y: dirY }, 256, this.sensorCallback.bind(this));

		var hit_right = level.sensor(
			{ x: this.x + this.sensor_right, y: oriY },
			{ x: 0, y: dirY }, 256, this.sensorCallback.bind(this));

		var combined = this.combineSensors([hit_left, hit_right]);

		if(dirY < 0 && combined.max && combined.max.dy > -4) {
			this.y = combined.max.y - 6;
			this.velY = 0;
		} else if(dirY > 0 && combined.min && combined.min.dy < 4) {
			this.y = combined.min.y - this.height + 6;
			this.velY = 0;
		}
	}


	this.collideHorizontal = function(level)
	{
		// To the right
		var hit = level.sensor({
			x: this.x + this.width - 10,
			y: this.y + this.height - 20
		}, {
			x: 1,
			y: 0
		}, 256, this.sensorCallback.bind(this));


		if(hit && hit.type && hit.dx < 10) {
			this.velX = 0;
			this.x = this.x + hit.dx - 10;
		}

		// To the left
		var hit = level.sensor({
			x: this.x + 10,
			y: this.y + this.height - 20
		}, {
			x: -1,
			y: 0
		}, 256, this.sensorCallback.bind(this));

		if(hit && hit.type && hit.dx > -10) {
			this.velX = 0;
			this.x = this.x + hit.dx + 10;
		}
	}


	/*****************************************************************/


	/**
	 * Update kinematics
	 */
	this.updateKinematics = function()
	{
		if(!this.alive && !this.finished)
			return;

		var oriX = this.x;
		var oriY = this.y;

		var permitted = this.getPermittedActions();
		var level = this.parent.getObject("level");

		this.velX *= this.friction;
		this.velY += this.gravity;

		// Update position
		this.x += this.velX;
		this.y += this.velY;

		/** Resolve vertical collisions **/
		this.collideVerticalDown(level);
		this.collideVerticalUp(level);
		this.collideHorizontal(level);

		if(oriX != this.x || oriY != this.y || this.events.count != 0)
			this.sendPosition();
	}


	this.findTeleportDestination = function(x, y)
	{
		var map = this.parent.getObject('level').levelMap;

		for(var j = 0; j < map.length; j++) {
			for(var i = Math.floor(x / 32); i < map[0].length; i++) {
				if(map[j][i] == 5 * 256 + 4 || map[j][i] == 5 * 256 + 5) {
					return {x: i * 32, y: j * 32};
				}
			}
		}
	}


	/**
	 * Handle input and kinematics
	 */
	this.update = function(input)
	{
		if(!this.finished)
			this.handleInput(input);

		this.updateKinematics();

		if(this.velX < 0)
			this.faceRight = false;
		else if(this.velX > 0)
			this.faceRight = true;

		if(!this.alive && Math.abs(this.scale) < 0.01) {
			// Recreate character after it died
			this.parent.gameover();
		}
	}


	/**
	 * Function to handle simple sprite animations
	 */
	this.animate = function(base, frames)
	{
		if(this.animationBase != base) {
			this.animationStart = this.engine.timestamp;
			this.animationBase = base;
		}

		var deltaT = (this.engine.timestamp - this.animationStart) / 120;

		return base + Math.floor(1 + deltaT % frames);
	}


	/**
	 * Draws the dead message to the context
	 *
	 * @private
	 * @param {Context} context - Context to draw to
	 */
	this.drawDeadMessage = function(context)
	{
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.font = 'bold 20px Arial';
		context.textAlign = 'center';
		context.fillText("Oops, you died...", this.engine.getWidth() / 2, this.engine.getHeight() / 2);
		context.restore();
	}


	/**
	 * Draws the finished message to the context
	 *
	 * @private
	 * @param {Context} context - Context to draw to
	 */
	this.drawFinishedMessage = function(context)
	{
		context.save();

		context.setTransform(1, 0, 0, 1, 0, 0);
		context.font = 'bold 20px Arial';
		context.textAlign = 'center';
		context.fillText("Congratulations, you have finished the game...", this.engine.getWidth() / 2, this.engine.getHeight() / 2);

		context.restore();
	}


	/**
	 * Draw the correct sprite based on the current state of the player
	 */
	this.draw = function(context)
	{
		var sprite = '';

		if(this.alive) {
			this.scale = lerp(this.scale, sign(this.gravity) == -1?-1:1, 0.5);
		} else {
			this.scale = lerp(this.scale, 0, 0.05);
		}

		if(!this.alive)
			this.drawDeadMessage(context);

		if(this.finished)
			this.drawFinishedMessage(context);

		if(this.velX > 0.3) {
			sprite = this.animate('player_walk_right_', 3);
		} else if(this.velX < -0.3) {
			sprite = this.animate('player_walk_left_', 3);
		} else if(this.faceRight) {
			sprite = this.animate('player_idle_right_', 3);
		} else {
			sprite = this.animate('player_idle_left_', 3);
		}

		this.parent.spriteManager.drawSprite(context, this, sprite, 0, function(context) {
			context.scale(1, this.scale);
		}.bind(this));
	}
}

Player.prototype = new BaseObject();
