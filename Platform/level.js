
function Level()
{	
	this.levelMap = [
		'cccccccccccccccccccccccccccccc',
		'x............................x',
		'x............................x',
		'x...........................ex',
		'x..........................lll',
		'x.>.................llllllllll',
		'llllllwwwlllllwwwwwlllllllllll',
		'llllllwwwlllllwwwwwlllllllllll'
	];


	this.setup = function()
	{
		// Determine level boundaries
		this.levelHeight = this.levelMap.length;
		this.levelWidth = this.levelMap[0].length;
		
		this.game.setLevelBounds({
			x: 32,
			y: 32,
			width: this.levelWidth * 32 - 64,
			height: this.levelHeight * 32 - 64
		});
		
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
	this.drawSprite = function(context, x, y, sprite, neighbours)
	{
		box = {x: x * 32, y: y * 32, width: 32, height: 32};
		spriteName = '';
		
		if(sprite == 'c') {
			spriteName = 'cloud';
		} else if(sprite == 'l') {
			if(neighbours.top == 'w' || neighbours.top == 'l')
				spriteName = 'grass_center';
			else
				spriteName = 'grass';
		} else if(sprite == 'w') {
			if(neighbours.top == 'w')
				spriteName = this.animate('water_', 2);
			else
				spriteName = this.animate('water_top_', 2);
		} else if(sprite == 'e') {
			spriteName = 'sign_exit';
		} else if(sprite == '>') {
			spriteName = 'sign_right';
		}
		
		if(spriteName != '')		
			this.game.spriteManager.drawSprite(context, box, spriteName);
	}


	/**
	 * Draw entire level
	 */
	this.draw = function(context)
	{
		for(var i = 0; i < this.levelHeight; i++) {
			for(var j = 0; j < this.levelWidth; j++) {
				this.drawSprite(context, j, i, this.levelMap[i][j], {
					left: j > 0?this.levelMap[i][j - 1]:' ',
					right: j < (this.levelWidth - 1)?this.levelMap[i][j + 1]: ' ',
					top: i > 0?this.levelMap[i - 1][j]:' ',
					bottom: i < (this.levelHeight - 1)?this.levelMap[i + 1][j]:' '
				});
			}
		}
	}
}
