
function Editor(element, width, height)
{
	this.game = new Game(element, width, height);
	this.game.startEditMode();
	
	this.canvas = this.game.canvas;
	this.context = this.game.context;
	
	this.game.spriteManager = new SpriteManager();
	
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
	var coords = {x: Math.floor((this.game.scroll.x + event.x) / 32),
	 			  y: Math.floor(event.y / 32)};

	if(event.buttons & 1)
		this.game.getObject("level").setSprite(coords, this.currentSprite);
	else if(event.buttons & 2)
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
	
	var positionFromEvent = function(event) {
		var rect = canvas.getBoundingClientRect();		
		
		event['x'] = event.clientX - rect.left;
		event['y'] = event.clientY - rect.top;
		
		return event;
	}

	document.addEventListener("contextmenu", function(event) { event.preventDefault(); return false; }, false);
	
	this.canvas.addEventListener('mousemove', function(event) { 
		this.mouseMove(positionFromEvent(event));
	}.bind(this));
	
	this.canvas.addEventListener('mousedown', function(event) {
		this.mouseDown(positionFromEvent(event));
	}.bind(this));
	
	this.canvas.addEventListener('mouseup', function(event) { 
		this.mouseUp(positionFromEvent(event));
	}.bind(this));	
}
