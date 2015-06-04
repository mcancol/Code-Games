
function Editor(element, width, height, levelName)
{
	this.game = new Game(element, width, height);
	this.game.startEditMode();

	this.canvas = this.game.canvas;
	this.context = this.game.context;

	this.game.spriteManager = new SpriteManager();

	this.mouse = new Mouse(this.canvas);

	var level = new Level();
	level.loadLevel(levelName);

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

	if(event.detail.buttons & 1)
		this.game.getObject("level").setSprite(coords, this.currentSprite);
	else if(event.detail.buttons & 2)
		this.game.getObject("level").setSprite(coords, 0);
}


Editor.prototype.setupMouse = function()
{
	var canvas = this.canvas;

	/**
	 * Disable context-menu on right click
	 */
	document.addEventListener("contextmenu",
		function(event) {
			event.preventDefault();
			return false;
		}, false);

	this.canvas.addEventListener("game-move", this.mouseMove.bind(this));
}
