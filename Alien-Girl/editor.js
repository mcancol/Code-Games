
function Editor(element, width, height)
{
	this.game = new Game(element, width, height);
	this.game.startEditMode();
	
	this.canvas = this.game.canvas;
	this.context = this.game.context;
	
	this.game.spriteManager = new SpriteManager();
	
	this.mouse = new Mouse(this.canvas);
	
	var level = new Level();
	level.loadLevel("level1");
	
	this.game.addObject('level', level);
	
	this.currentSprite = 'l';
	
	this.setupMouse();
}


Editor.prototype.setSprite = function(sprite)
{
	this.currentSprite = sprite;
}


/************************************
 * Handle mouse movement and clicks *
 ************************************/

  
Editor.prototype.mouseMove = function(event)
{
	var coords = {x: Math.floor((this.game.scroll.x + event.detail.x) / 32),
	 			  y: Math.floor(event.detail.y / 32)};

	console.log(event.detail);
				  
	if(event.detail.buttons & 1)
		this.game.getObject("level").setSprite(coords, this.currentSprite);
	else if(event.detail.buttons & 2)
		this.game.getObject("level").setSprite(coords, 0);
}

Editor.prototype.mouseDown = function(event)
{
	this.mouse = event;
}

Editor.prototype.mouseUp = function(event)
{
	var coords = {x: Math.floor((this.game.scroll.x + event.x) / 32),
				  y: Math.floor(event.y / 32)};

	if(this.mouse.buttons & 1)
		this.game.getObject("level").setSprite(coords, this.currentSprite);
	else if(this.mouse.buttons & 2)
		this.game.getObject("level").setSprite(coords, 0);
}

Editor.prototype.setupMouse = function()
{
	var canvas = this.canvas;
	
	document.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; }, false);
	
	this.canvas.addEventListener("game-move", this.mouseMove.bind(this));
	
	
	/*this.canvas.addEventListener('mousedown', function(event) {
		this.mouseDown(positionFromEvent(event));
	}.bind(this));
	
	this.canvas.addEventListener('mouseup', function(event) { 
		this.mouseUp(positionFromEvent(event));
	}.bind(this));	*/
}




/*
	
	this.mousemove = function(event)
	{
		if(event.detail.type == 'mouse' && event.detail.buttons != 1)
			return;
		
		var width = (widthspace + widthwall);
		
		// Compute position in grid		
		var x = event.detail.x / width;
		var y = event.detail.y / width;
		
		// Ignore walls
		if(x - Math.floor(x) < widthwall / width)
			return;
		
		if(y - Math.floor(y) < widthwall / width)
			return;
		
		// Round grid position and convert to level coordinates
		x = Math.floor(x) * 2 + 1;
		y = Math.floor(y) * 2 + 1;

		// Propose move
		this.move(x, y);
	}
*/
