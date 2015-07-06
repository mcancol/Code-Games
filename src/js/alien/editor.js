/** @module Alien **/
"use strict";

/**
 * Creates a new level edior object.
 *
 * @class
 * @classdesc Level editor for alien girl game.
 */
function Editor(game)
{
	this.game = game;
	this.game.startEditMode();

	this.selectedObject = false;
	this.currentSprite = 'l';

	this.setupDone = false;
}


Editor.prototype = new BaseObject();


Editor.prototype.setup = function()
{
	var engine = this.getEngine();

	if(!this.setupDone && engine) {
		this.game.engine = engine;
		this.setupMouse(engine.canvas);
		this.setupDone = true;
	}
}


/**
 * Change the currently active sprite
 *
 * @param {number} sprite - ID of sprite to make active
 */
Editor.prototype.setSprite = function(sprite)
{
	this.currentSprite = sprite;
}


Editor.prototype.draw = function(context)
{
	this.game.draw(context);

	if(this.selectedObject) {
		context.beginPath();
		context.rect(this.selectedObject.x, this.selectedObject.y, this.selectedObject.width, this.selectedObject.height);
		context.lineWidth = 1;
		context.strokeStyle = 'red';
		context.stroke();
	}
}


/************************************
 * Handle mouse movement and clicks *
 ************************************/


/**
 * Called on mouse movement, paints active sprite when
 * moving the mouse while holding the left button. Removes
 * the sprite when moving the mouse while holding the right button.
 *
 * @private
 * @param {Event} event - Mouse movement event
 */
Editor.prototype.mouseMove = function(event)
{
	var keys = this.game.getObjectNames();
	var coords = { x: this.game.scroll.x + event.detail.x, y: event.detail.y };

	for(var i = keys.length - 1; i >= 0; i--) {
		var object = this.game.getObject(keys[i]);

		if(inBox(coords.x, coords.y, object)) {
			if(event.detail.down) {
				this.selectedObject = object;
				console.log("Select: " + keys[i]);

				return;
			}

			// Click to select
			// Do we want drag to work without selecting?


		}
	}

	if(event.detail.down)
		this.selectedObject = false;

	return;

	coords.x = Math.floor(coords.x / 32);
	coords.y = Math.floor(coords.y / 32);

	if(event.detail.buttons & 1)
		this.game.getObject("level").setSprite(coords, this.currentSprite);
	else if(event.detail.buttons & 2)
		this.game.getObject("level").setSprite(coords, 0);
}


/**
 * Sets up mouse movement callback
 *
 * @private
 */
Editor.prototype.setupMouse = function(canvas)
{
	this.mouse = new Mouse(canvas);

	/**
	 * Disable context-menu on right click
	 */
	document.addEventListener("contextmenu",
		function(event) {
			event.preventDefault();
			return false;
		}, false);

	canvas.addEventListener("game-move", this.mouseMove.bind(this));
}
