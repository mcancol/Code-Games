/** @module Common **/
"use strict";


/**
 * Game engine - responsible for render loop
 * @class
 */
function Engine()
{

	Engine.prototype.initializeEngine = function(element, width, height, game)
	{
		this.canvas = document.getElementById(element);
		if(!this.canvas)
			throw new Error("Canvas element passed to engine initialization is invalid.");

		this.context = this.canvas.getContext("2d");
		if(!this.context)
			throw new Error("Could not create 2d context during engine initialization.");

		this.game = game;
		this.game.engine = this;

		this.setSize(width, height);

		this.input = new Keyboard();
  	this.mouse = new Mouse(this.canvas);

		this.editMode = false;
		this.debugMode = false;

		window.requestAnimationFrame(this.update.bind(this));

		//this.game.initialize();
		this.game.setup();
	}
}


/**
 * Returns width of the game window
 */
Engine.prototype.getWidth = function()
{
	return this.canvas.width;
}


/**
 * Returns height of the game window
 */
Engine.prototype.getHeight = function()
{
	return this.canvas.height;
}


/**
 * Set size of the game window.
 *
 * @param {Number} width - Width of the game window
 * @param {Number} height - Height of the game window
 */
Engine.prototype.setSize = function(width, height)
{
	this.canvas.width = width;
	this.canvas.height = height;
};


/**
 * Update game state and then render frame
 */
Engine.prototype.update = function(timestamp)
{
	this.timestamp = timestamp;

	/**
	 * Handle input, update physics and scrolling
	 */
	this.game.update(this.input);

	/**
	 * Redraw entire scene
	 */
	this.context.save()
	this.game.draw(this.context);
	this.context.restore()

	window.requestAnimationFrame(this.update.bind(this));
};
