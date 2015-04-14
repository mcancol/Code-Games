
function Level()
{	
	// Server to load levels from
	//this.server = "http://www.ivarclemens.nl/platform_game/ldb/";

	this.levelMap = [[3]];
	
	if(querySt("player") == 1)
	this.levelMap = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	                 [1,3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	if(querySt("player") == 2)
	this.levelMap = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	                 [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1],
	                 [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	                 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	
	
	this.setup = function()
	{			
		this.bombImage = new Image();
		this.bombImage.src = "bomb.png";
		
		if('game' in this) {
			var bounds = {
					x: 0,
					y: 0,
					width: (this.getWidth()-1)/2 * widthspace +  (this.getWidth()+1)/2 * widthwall,
					height: (this.getHeight()-1)/2 * widthspace +  (this.getHeight()+1)/2 * widthwall
				};
			this.game.setLevelBounds(bounds);
						
			this.game.setSize(bounds.width, bounds.height);
		}	
	}
	
	
	this.update = function(input)
	{
	}

	
	/**
	 * Draws a single sprite in the grid
	 
	this.drawSprite = function(context, x, y, sprite)
	{
		if(sprite == 1 && this.game && !this.game.editMode)
			return;
		
		return this.game.spriteManager.drawSprite(context, box, sprite, frame);
	}
   */
	
	/**
	 * Draw entire level
	 */
	this.draw = function(context)
	{
		for(var i = 0; i < this.levelMap.length; i++) {
			for(var j = 0; j < this.levelMap[0].length; j++) {
				if(j % 2 == 0){
					x = j*(widthspace+widthwall)/2;
					w = widthwall;
				}
				else{
					x = (j-1)*(widthspace+widthwall)/2 + widthwall;
					w = widthspace;
				}
				if(i % 2 == 0){
					y = i*(widthspace+widthwall)/2;
					h = widthwall;
				}
				else{
					y = (i-1)*(widthspace+widthwall)/2 + widthwall;
					h = widthspace;
				}
				
			
				if (this.levelMap[i][j] == 1){
					context.fillStyle="#000000";
					context.fillRect(x,y,w,h);
				}
				
				if (this.levelMap[i][j] == 2){
					context.drawImage(this.bombImage, x, y, w, h);
				}
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
	if(this.levelMap.length < coords.y || 
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
		this.setup();
	}.bind(this));
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
