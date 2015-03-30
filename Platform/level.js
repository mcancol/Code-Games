
function Level()
{	
	// Server to load levels from
	this.server = "http://www.ivarclemens.nl/platform_game/ldb/";

	this.levelMap = [[0]];
	


	this.setup = function()
	{
		// Determine level boundaries
		this.levelHeight = this.levelMap.length;
		this.levelWidth = this.levelMap[0].length;
		
		if('game' in this) {
			this.game.setLevelBounds({
				x: 32,
				y: 32,
				width: this.levelWidth * 32 - 64,
				height: this.levelHeight * 32 - 64
			});
		}
		
		// Create collision boxes
		this.collisionBoxes = this.generateCollisionBoxes();	
	}
	
	
	/**
	 * Compresses the level geometry into collision boxes
	 */
	this.generateCollisionBoxes = function()
	{
		var boxes = [];
		
		for(var i = 0; i < this.levelHeight; i++) {			
			for(var j = 0; j < this.levelWidth; j++) {
				if(this.levelMap[i][j] == 'l' || this.levelMap[i][j] == 'x' || this.levelMap[i][j] == 'c')
					boxes.push({x: j * 32, y: i * 32, width: 32, height: 32, type: 'Impassable'});
				if(this.levelMap[i][j] == 'w')
					boxes.push({x: j * 32, y: i * 32, width: 32, height: 32, type: 'Water'});
			}
		}

		return boxes;
	}
	
	

	
	this.update = function(input)
	{
	}

	
	/**
	 * Function to handle simple sprite animations
	 */
	this.animate = function(base, frames)
	{
		var deltaT = this.game.timestamp / 140;
		return base + Math.floor(1 + deltaT % frames);
	}
	
	
	/**
	 * Draws a single sprite in the grid
	 */
	this.drawSprite = function(context, x, y, sprite)
	{
		box = {x: x * 32, y: y * 32, width: 32, height: 32};
		
		var frames = this.game.spriteManager.getFrameCount(sprite);
		var deltaT = this.game.timestamp / 140;
		var frame = Math.floor(deltaT % frames);
			
		return this.game.spriteManager.drawSprite(context, box, sprite, frame);
	}


	/**
	 * Draw entire level
	 */
	this.draw = function(context)
	{
		for(var i = 0; i < this.levelHeight; i++) {
			for(var j = 0; j < this.levelWidth; j++) {
				this.drawSprite(context, j, i, this.levelMap[i][j]);
			}
		}
	}
}


/**
 * Clears the current level, filling it completely with air
 */
Level.prototype.resetLevel = function(width, height)
{
	this.levelMap = [];
	
	for(var j = 0; j < height; j++) {
		this.levelMap[j] = [];
		
		for(var i = 0; i < width; i++) {		
			if(i == 0 || j == 0 || i == (width -  1) || j == (height - 1)) {
				this.levelMap[j][i] = 1;
			} else {
				this.levelMap[j][i] = 0;
			}
		}
	}
	
	this.setup();
}


/**
 * Loads the level with the given name from the server
 */
Level.prototype.loadLevel = function(name)
{
	jQuery.ajax({
		url: this.server + "/get_level.php?name=" + name,
		dataType: 'json'
	}).done(function(data) {
		this.levelMap = data;
	}.bind(this));
	
	this.setup();
}


/**
 * Save the level to the server
 */
Level.prototype.saveLevel = function(name)
{
	jQuery.ajax({
		url:  this.server + "/set_level.php?name=" + name, 
		data: JSON.stringify(this.levelMap),
		contentType: 'text/plain',
		method: 'POST'
	});
}
