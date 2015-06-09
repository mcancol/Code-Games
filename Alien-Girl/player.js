/**
 * Implements various aspects related to the player:
 *  - Movement (input handling)
 *  - Kinematics
 *  - Visual representation (drawing)
 */
function Player(x, y)
{
	// Depends on sprite
	this.width = 32;
	this.height = 46;

	this.baseX = x;
	this.baseY = y;

	this.sensor_left = 6;
	this.sensor_right = 23;


	this.setup = function()
	{
		// Position
		this.x = this.baseX;
		this.y = this.baseY;
		this.faceRight = true;

		// Velocities
		this.velX = 0;
		this.velY = 0;

		this.speed = 3.5;
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
		this.frictionSnow = 0.99;			// when on snow

		this.scale = 1;
		this.alive = true;
	}


	this.getPermittedActions = function()
	{
		var x = Math.floor(this.x / 32);
		var y = Math.floor(this.y / 32);

		var level = this.game.getObject("level");
		var code = level.levelMap[0][x] - 2304;

		return {
			walk_on_water: code == 1,
			walk_upside_down: code == 3 || code == 1,
			fly: code == 2,
		};
	}


	this.handleInput = function(input)
	{
		permitted = this.getPermittedActions();

		if(!permitted.walk_upside_down && this.gravity < 0)
			this.gravity *= -1;

		// Jump away from gravity
		if(input.keys[input.KEY_SPACE]) {
			if(!this.jumping && this.grounded) {
				this.jumping = true;
				this.grounded = false;
				this.velY = -sign(this.gravity) * this.speed * 2;
			}
		}

		// Flip gravity if up and down are pressed at the same time
		if(input.keys[input.KEY_UP] && input.keys[input.KEY_DOWN])
		{
			// Allow wait at least 200ms before next flip
			if(permitted.walk_upside_down && (!this.lastFlip || this.game.timestamp - this.lastFlip > 200))
			{
				this.lastFlip = this.game.timestamp
				this.gravity *= -1;
			}
		} else {
			// Flying (under normal gravity)
			if(permitted.fly && input.keys[input.KEY_UP])
			{
				this.velY = -this.speed * 0.5;
			}

			// Flying (when gravity is inverted)
			if(permitted.fly && input.keys[input.KEY_DOWN])
			{
				this.velY = this.speed * 0.5;
			}
		}

		// Move to the left
		if(input.keys[input.KEY_LEFT]) {
			if(this.velX > -this.speed)
				this.velX--;
		}

		// Move to the right
		if(input.keys[input.KEY_RIGHT]) {
			if(this.velX < this.speed)
				this.velX++;
		} else if(this.ground.slippery && !input.keys[input.KEY_DOWN]) {
			if(this.ground.type == 'hillDown')
				if(this.velX > 0.5 * -this.speed)
					this.velX -= 0.25;
			if(this.ground.type == 'hillUp')
				if(this.velX < 0.5 * this.speed)
					this.velX += 0.25;
		}

		// Change friction when pressing down
		if(input.keys[input.KEY_DOWN]) {
			this.friction = this.frictionDown;
		} else if(this.ground.slippery) {
			this.friction = this.frictionSnow;
		} else {
			this.friction = this.frictionDefault;
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


	this.collideVerticalDown = function(level)
	{
		var dirY = Math.sign(this.gravity);
		var oriY = this.y + 10 + (dirY == 1) * (this.height - 20);

		var hit_left = level.sensor(
			{ x: this.x + this.sensor_left, y: oriY },
			{ x: 0, y: dirY }, 256, function(hit) { return hit; });

		var hit_right = level.sensor(
			{ x: this.x + this.sensor_right, y: oriY },
			{ x: 0, y: dirY }, 256, function(hit) { return hit; });

		combined = this.combineSensors([hit_left, hit_right]);

		if(dirY > 0 && combined.min && combined.min.dy < 10) {
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
			{ x: 0, y: dirY }, 256, function(hit) { return hit; });

		var hit_right = level.sensor(
			{ x: this.x + this.sensor_right, y: oriY },
			{ x: 0, y: dirY }, 256, function(hit) { return hit; });

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
		var hit = level.sensor(
			{ x: this.x + this.width - 10, y: this.y + this.height - 20 },
			{ x: 1, y: 0 }, 256, function(hit) { return hit; });

		if(hit && hit.type && hit.dx < 10) {
			this.velX = 0;
			this.x = this.x + hit.dx - 10;
		}


		var hit = level.sensor(
			{ x: this.x + 10, y: this.y + this.height - 20 },
			{ x: -1, y: 0 }, 256, function(hit) { return hit; });

		if(hit && hit.type && hit.dx > -10) {
			this.velX = 0;
			this.x = this.x + hit.dx + 10;
		}
	}


	/**
	 * Update kinematics
	 */
	this.updateKinematics = function()
	{
		if(!this.alive)
			return;

		permitted = this.getPermittedActions();
		var level = this.game.getObject("level");

		this.velX *= this.friction;
		this.velY += this.gravity;

		// Update position
		this.x += this.velX;
		this.y += this.velY;


		/** Resolve vertical collisions **/
		this.collideVerticalDown(level);
		this.collideVerticalUp(level);
		this.collideHorizontal(level);


		/*
			if(ci.type == 'Door' && Math.abs(this.velY) < 0.4 && Math.abs(this.velX) < 0.1)
			{
				this.velY = 0;
				this.velY = 0;

				var teleport = this.findTeleportDestination(this.x, this.y);
				this.y += teleport.y - this.y;
				this.x = teleport.x;
			}

			if(ci.type == 'Water')
			{
				if(permitted.walk_on_water && ci.axis == 'y' && Math.abs(this.velX) > 0.1 && !this.jumping) {
					this.y += ci.normal.y;
					this.velY = 0;
					this.grounded = true;
				} else {
					if(ci.normal.y < -16) {
						this.alive = false;
					}
				}
			}
		}.bind(this));*/
	}


	this.findTeleportDestination = function(x, y)
	{
		var map = this.game.getObject('level').levelMap;

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
		this.handleInput(input);
		this.updateKinematics();

		if(this.velX < 0)
			this.faceRight = false;
		else if(this.velX > 0)
			this.faceRight = true;

		if(!this.alive && Math.abs(this.scale) < 0.01) {
			// Recreate character after it died
			this.game.gameover();
		}
	}


	/**
	 * Function to handle simple sprite animations
	 */
	this.animate = function(base, frames)
	{
		if(this.animationBase != base) {
			this.animationStart = this.game.timestamp;
			this.animationBase = base;
		}

		var deltaT = (this.game.timestamp - this.animationStart) / 120;

		return base + Math.floor(1 + deltaT % frames);
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

		if(!this.alive) {
			context.save();

			context.setTransform(1, 0, 0, 1, 0, 0);
			context.font = 'bold 20px Arial';
			context.textAlign = 'center';
			context.fillText("Oops, you died...", this.game.canvas.width / 2, this.game.canvas.height / 2);

			context.restore();
		}

		if(this.velX > 0.3) {
			sprite = this.animate('player_walk_right_', 3);
		} else if(this.velX < -0.3) {
			sprite = this.animate('player_walk_left_', 3);
		} else if(this.faceRight) {
			sprite = this.animate('player_idle_right_', 3);
		} else {
			sprite = this.animate('player_idle_left_', 3);
		}

		this.game.spriteManager.drawSprite(context, this, sprite, 0, function(context) {
			context.scale(1, this.scale);
		}.bind(this));
	}
}
