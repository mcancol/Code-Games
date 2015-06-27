"use strict";

function Engine()
{

	Engine.prototype.initializeEngine = function(element, width, height)
	{
		this.canvas = document.getElementById(element);
		this.context = this.canvas.getContext("2d");

		this.setSize(width, height);

		window.requestAnimationFrame(this.update.bind(this));

		this.input = new Keyboard();
  	this.mouse = new Mouse(this.canvas);
		this.objects = {};

		this.scroll = {x: 0, y: 0};
		this.deadzone = {w: 128};

		this.levelBounds = {x: 0, y: 0, width: 32, height: 32 };

		this.editMode = false;
		this.debugMode = false;
	}
}

Engine.prototype.gameover = function()
{
};

Engine.prototype.startEditMode = function()
{
	this.editMode = true;

	// Reset all objects to their default states
	for(var key in this.objects)
		this.objects[key].setup();
}

Engine.prototype.setSize = function(width, height)
{
	this.canvas.width = width;
	this.canvas.height = height;
};


Engine.prototype.setLevelBounds = function(bounds)
{
	this.levelBounds = bounds;
}


/**
 * Updates translation offset in canvas when the player exits the dead-zone.
 */
Engine.prototype.updateTranslation = function()
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
    // DIFF: this.levelBounds.x not used in maze
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

  // Not used in maze
	this.scroll.y = this.levelBounds.y;
}


/**
 * Scrolls the screen
 */
Engine.prototype.applyTranslation = function()
{
	this.context.translate(-this.scroll.x, -this.scroll.y)
}


Engine.prototype.update = function(timestamp)
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

  // Not used in maze game!
	this.applyTranslation();

	for(var key in this.objects)
		this.objects[key].draw(this.context);

	this.context.restore()

	window.requestAnimationFrame(this.update.bind(this));
};


/******************************
 * Adding objects to the game *
 ******************************/

Engine.prototype.addObject = function(name, object)
{
	object.game = this;
	this.objects[name] = object;
	this.objects[name].setup();
};

Engine.prototype.getObject = function(name)
{
	return this.objects[name];
};


Engine.prototype.deleteObject = function(name)
{
	delete this.objects[name];
};


Engine.prototype.deleteAllObjects = function()
{
	this.objects = {};
};
