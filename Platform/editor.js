
function Editor(element, width, height)
{
	this.game = new Game(element, width, height);
	this.game.startEditMode();
	
	this.canvas = this.game.canvas;
	this.context = this.game.context;
	
	this.game.spriteManager = new SpriteManager();
	
	this.layer =  {
		'level': new Level()
	}
	
	this.layer['level'].loadLevel("demo");
	this.layer['level'].resetLevel(20, 10);
	this.layer['level'].saveLevel("demo");
	
	this.game.addObject('level', this.layer['level']);
	
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

 
 
Editor.prototype.mouseMove = function(position)
{
	if(this.mouse['down']) {
		var coords = {x: Math.floor(position.x / 32),
				  y: Math.floor(position.y / 32)};

		this.layer['level'].levelMap[coords.y][coords.x] = this.currentSprite;
	}
}

Editor.prototype.mouseDown = function(position)
{
	this.mouse['down']  = true;
}

Editor.prototype.mouseUp = function(position)
{
	var coords = {x: Math.floor(position.x / 32),
			  y: Math.floor(position.y / 32)};

	this.layer['level'].levelMap[coords.y][coords.x] = this.currentSprite;
	
	this.mouse['down'] = false;
}

Editor.prototype.setupMouse = function()
{
	var canvas = this.canvas;
	this.mouse = {down: false};
	
	var positionFromEvent = function(event) {
		var rect = canvas.getBoundingClientRect();		
		return {x: event.clientX - rect.left, y:  event.clientY - rect.top};
	}

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
