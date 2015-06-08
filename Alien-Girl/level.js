
function Level(levelMap)
{
	this.levelMap = levelMap;
	this.collisionTypes = {};

	this.lines = [];


	this.setup = function()
	{
		for(var i = 0; i < spriteTable.length; i++) {
			var key = spriteTable[i]['key'];
			this.collisionTypes[key[0] * 256 + key[1]] = spriteTable[i]['collision'];
		}
	}


	this.update = function(input)
	{
	}


	this.worldToLevelCoords = function(worldCoord)
	{
		return {
			x: Math.floor(worldCoord.x / 32),
			y: Math.floor(worldCoord.y / 32)
		};
	}


	/**
	* Pixel level sensor line for collision detection.
	*
	* Starts a sensor line at _origin_ in direction _dir_
	* and calls the function _func_ for all collisions until
	* the distance is greater than _length_ or the function
	* _func_ returns a value.
	 */
	this.sensor = function(origin, dir, length, func)
	{
		var o = this.worldToLevelCoords(origin);

		var result = this.spriteSensor(o, dir, length / 32, function(hit)
		{
			// Coordinates of top left corner
			hit.x = hit.sx * 32;
			hit.y = hit.sy * 32;

			// Fix the x coordinate for vertical sensors
			if(dir.x == 0) hit.x = origin.x;

			// Fix the y coordinate for horizontal sensors
			if(dir.y == 0) hit.y = origin.y;

			// Collide with right most edge for leftward sensors
			if(dir.x < 0) hit.x += 32;

			// Collide with bottom edge for upward sensors
			if(dir.y < 0)	hit.y += 32;

			// Half blocks
			if(hit.type == 'topHalf') {
				if(dir.y < 0) hit.y -= 14;
				if(dir.x != 0 && origin.y - hit.sy * 32 > 18) return false;
			}

			// Ramp down
			if(hit.type == 'hillDown') {
				if(dir.y == 0) hit.x += (hit.sy * 32 - origin.y) + 32;
				if(dir.x == 0) hit.y += (hit.sx * 32 - origin.x) + 32;
			}

			// Ramp up
			if(hit.type == 'hillUp') {
				if(dir.y == 0) hit.x -= (hit.sy * 32 - origin.y) + 32;
				if(dir.x == 0) hit.y -= (hit.sx * 32 - origin.x);
			}

			// Compute difference
			hit.dx = hit.x - origin.x;
			hit.dy = hit.y - origin.y;

			// Do not report hits in opposite direction
			if(dir.x != 0 && dir.x * hit.dx <= 0)
				return false;

			//if(dir.y != 0 && dir.y * hit.dy <= 0)
			//	return false;

			// Invoke callback
			hit = func(hit);

			if(hit)
				return hit;
		});

		// Draw result
		if(dir.x != 0)
			this.lines.push({ a: origin, b: result, color: 'blue' });
		else
			this.lines.push({ a: origin, b: result, color: 'red' });

		return result;
	}

	this.drawDebugLines = function()
	{
		for(var i = 0; i < this.lines.length; i++)
			this.drawLine(this.lines[i].a, this.lines[i].b, this.lines[i].color);
		this.lines = [];
	}


	this.drawLine = function(a, b, color)
	{
		var ctx = this.game.context;

		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.closePath();
		ctx.strokeStyle = color;
		ctx.stroke();
	}


	/**
	 * Sprite level sensor line for collision detection.
	 *
	 * Starts a sensor line at _origin_ in direction _dir_
	 * and calls the function _func_ for all collisions until
	 * the distance is greater than _length_ or the function
	 * _func_ returns a value.
	 */
	this.spriteSensor = function(origin, dir, length, func)
	{
		for(i = 0; i < Math.ceil(length); i++)
		{
			var l = {
				sx: origin.x + dir.x * i,
				sy: origin.y + dir.y * i
			};

			/**
			 * Out of bounds, return 'Bounds'
			 */
			if(l.sy < 0 || l.sy >= this.getHeight() || l.sx < 0 || l.sx >= this.getWidth())
				return {
					type: 'Bounds',
					sx: clamp(l.sx, 0, this.getWidth()),
					sy: clamp(l.sy, 0, this.getHeight())
				};

			// Get sprite number
			var sprite = this.levelMap[l.sy][l.sx];

			if(sprite in this.collisionTypes) {
				// Add type of collision to hit object
				l.sprite = sprite;
				l.type = this.collisionTypes[sprite];

				// Invoke callback, it will return the hit if it was accepted
				var hit = func(l);

				// If we hit something, return it, otherwise continue
				if(hit)
					return hit;
			}
		}

		// We did not hit anything, return false
		return { type: false };
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

		this.drawDebugLines();
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
