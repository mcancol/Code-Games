

function Player()
{
	// Depends on sprite
	this.width = 32;
	this.height = 46;
	
	this.setup = function()
	{
		// Position
		this.x = 32;
		this.y = 128;
		this.faceRight = true;
		
		// Velocities
		this.velX = 0;
		this.velY = 0;
		
		this.speed = 3.5;
		this.jumping = false;
		this.grounded = false;		
		
		// Physics parameters
		this.gravity = 0.3;
		this.friction = 0.8;
		
		this.scale = 1;
		this.alive = true;
	}
	
	this.handleInput = function(input)
	{
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
			if(!this.lastFlip || this.game.timestamp - this.lastFlip > 200)
			{
				this.lastFlip = this.game.timestamp			
				this.gravity *= -1;
			}
		} else {			
			// Flying (under normal gravity)
			if(input.keys[input.KEY_UP]) 
			{
				this.velY = -this.speed * 0.5;
			}
		
			// Flying (when gravity is inversed)
			if(input.keys[input.KEY_DOWN]) 
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
		if(input.keys[input.KEY_RIGHT])
			if(this.velX < this.speed) 
				this.velX++;
	}
	
	
	/**
	 * Update kinematics
	 */
	this.updateKinematics = function()
	{
		if(!this.alive)
			return;
		
		// Gravity and friction
		this.velX *= this.friction;
		this.velY += this.gravity;
		this.grounded = false;
		
		// Update position
		this.x += this.velX;
		this.y += this.velY;		
		
		// Check and resolve collisions
		var level = this.game.getObject("level");		

		detectCollisionArray(this, level.collisionBoxes, function(ci) {
			if(ci.type == true) 
			{
				if(ci.axis == 'y' || Math.abs(ci.normal.y) < 2) {
					this.y += ci.normal.y;
					this.velY = 0;
					this.grounded = true;
					this.jumping = false;
				}
			
				if(ci.axis == 'x') {
					this.velX = 0;
					this.x += ci.normal.x;
				}
			}
			
			if(ci.type == 'Door' && Math.abs(this.velY) < 0.4 && Math.abs(this.velX) < 0.1) 
			{				
				this.velY = 0;
				this.velY = 0;
				
				var teleport = this.findTeleportDestination(this.x, this.y);
				this.y += teleport.y - this.y;
				this.x = teleport.x;
			}
			
			if(ci.type == 'Stairs')
			{
				this.y += ci.normal.y;
				this.velY = 0;
				this.grounded = true;
			}
			
			if(ci.type == 'Water')
			{
				if(ci.axis == 'y' && Math.abs(this.velX) > 0.1 && !this.jumping) {
					this.y += ci.normal.y;
					this.velY = 0;
					this.grounded = true;
				} else {
					if(ci.normal.y < -16) {
						this.alive = false;
					}					
				}
			}			
		}.bind(this));
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
			this.setup();
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