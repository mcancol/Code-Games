
function Level(levelMap)
{
	this.levelMap = levelMap;
	this.collisionTypes = {};


	this.setup = function()
	{
		for(var i = 0; i < spriteTable.length; i++) {
			var key = spriteTable[i]['key'];
			this.collisionTypes[key[0] * 256 + key[1]] = spriteTable[i]['collision'];
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

		for(var i = 0; i < this.getHeight(); i++) {
			for(var j = 0; j < this.getWidth(); j++) {
				if(this.levelMap[i][j] in this.collisionTypes) {
					var type = this.collisionTypes[this.levelMap[i][j]];

					if(!type)
						continue;

					var box = {x: j * 32, y: i * 32, width: 32, height: 32, type: type};

					boxes.push(box);
				}
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

		if(sprite == 1 && this.game && !this.game.editMode)
			return;

		return this.game.spriteManager.drawSprite(context, box, sprite, frame);
	}


	/**
	 * Draw entire level
	 */
	this.draw = function(context)
	{
		for(var i = 0; i < this.levelMap.length; i++) {
			for(var j = 0; j < this.levelMap[0].length; j++) {
				this.drawSprite(context, j, i, this.levelMap[i][j]);
			}
		}
	}
}


Level.prototype.getHeight = function()
{
	return this.levelMap.length;
}


Level.prototype.getWidth = function()
{
	return this.levelMap[0].length;
}


/**
 * Sets the sprite at a specific block
 */
Level.prototype.setSprite = function(coords, sprite)
{
	// Check invalid coordinates
	if(coords.x < 0 || coords.y < 0)
		return false;

	// Expand level if not big enough
	if(this.levelMap.length < ( 1 + coords.y) ||
	   this.levelMap[0].length < coords.x) {

		// Required dimensions
		var height = Math.max(1 + coords.y, this.levelMap.length);
		var width = Math.max(1 + coords.x, this.levelMap[0].length);

		for(var i = 0; i < height; i++) {
			if(i >= this.levelMap.length)
				this.levelMap[i] = [];

			for(var j = this.levelMap[i].length; j < width; j++)
				this.levelMap[i][j] = 0;
		}
	}

	this.levelMap[coords.y][coords.x] = sprite;
}


/**
* Save the level to the server
*/
Level.prototype.saveLevel = function(name)
{
	var level = this;

	return new Promise(function(resolve, reject) {
		if(typeof(server) == 'undefined' || !server)
			reject();

		jQuery.ajax({
			url: server + "ldb/set_level.php?name=" + name,
			data: JSON.stringify(level.levelMap),
			contentType: 'text/plain',
			method: 'POST'
		}).done(function(data) {
			resolve();
		}.bind(level)).fail(function(response) {
			reject(response.responseText);
		});
	});
}
