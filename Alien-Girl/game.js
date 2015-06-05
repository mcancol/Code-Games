
function Game(element, width, height)
{
	this.canvas = document.getElementById(element);
	this.context = this.canvas.getContext("2d");

	this.setSize(width, height);

	window.requestAnimationFrame(this.update.bind(this));

	this.input = new Keyboard();
	this.objects = {};

	this.scroll = {x: 0, y: 0};
	this.deadzone = {w: 128};

	this.levelBounds = {x: 0, y: 0, width: 32, height: 32 };

	this.editMode = false;
}

Game.prototype.gameover = function()
{

};

Game.prototype.startEditMode = function()
{
	this.editMode = true;

	// Reset all objects to their default states
	for(var key in this.objects)
		this.objects[key].setup();
}

Game.prototype.setSize = function(width, height)
{
	this.canvas.width = width;
	this.canvas.height = height;
};


Game.prototype.setLevelBounds = function(bounds)
{
	this.levelBounds = bounds;
}


/**
 * Updates translation offset in canvas when the player exits the dead-zone.
 */
Game.prototype.updateTranslation = function()
{
	// Do not use player to scroll in edit mode
	if(this.editMode) {
		if(this.input.keys[this.input.KEY_LEFT])
			this.scroll.x -= 8;
		if(this.input.keys[this.input.KEY_RIGHT])
			this.scroll.x += 8;

		if(this.scroll.x < 0)
			this.scroll.x = 0;

		return;
	}

	if(!this.objects['player'])
		return;

	var playerX = this.objects['player'].x;

	if(this.canvas.width >= this.levelBounds.width) {
		this.scroll.x = (this.canvas.width - this.levelBounds.width) / 2 - this.levelBounds.x;
	} else {
		// Compute boundaries of dead-zone in screen coordinates
		var deadzone_x_min = (this.canvas.width - this.deadzone.w) / 2;
		var deadzone_x_max = (this.canvas.width + this.deadzone.w) / 2;

		// Computer player position in screen coordinates
		var player_x_game = playerX - this.scroll.x;

		// Update scrolling
		if(player_x_game > deadzone_x_max) {
			this.scroll.x += player_x_game - deadzone_x_max;
		} else if(player_x_game < deadzone_x_min) {
			this.scroll.x += player_x_game - deadzone_x_min;
		}

		// Make sure we do not scroll past beginning/end of level
		if(this.scroll.x < this.levelBounds.x)
			this.scroll.x = this.levelBounds.x;
		if(this.scroll.x > (this.levelBounds.x + this.levelBounds.width) - this.canvas.width)
			this.scroll.x = (this.levelBounds.x + this.levelBounds.width) - this.canvas.width;
	}

	this.scroll.y = this.levelBounds.y;
}


/**
 * Scrolls the screen
 */
Game.prototype.applyTranslation = function()
{
	this.context.translate(-this.scroll.x, -this.scroll.y)
}


Game.prototype.update = function(timestamp)
{
	this.timestamp = timestamp;


	/**
	 * Handle input, update physics and scrolling
	 */
	if(!this.editMode)
	{
		for(var key in this.objects)
			this.objects[key].update(this.input);
	}

	this.updateTranslation();


	/**
	 * Redraw entire scene
	 */
	this.context.save()
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.applyTranslation();

	for(var key in this.objects)
		this.objects[key].draw(this.context);

	this.context.restore()

	window.requestAnimationFrame(this.update.bind(this));
};


/******************************
 * Adding objects to the game *
 ******************************/

Game.prototype.addObject = function(name, object)
{
	object.game = this;
	this.objects[name] = object;
	this.objects[name].setup();
};

Game.prototype.getObject = function(name)
{
	return this.objects[name];
};


Game.prototype.deleteObject = function(name)
{
	delete this.objects[name];
};


Game.prototype.deleteAllObjects = function()
{
	this.objects = {};
};
