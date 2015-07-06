/** @module Alien **/
"use strict";

/**
 * Creates a new level edior object.
 *
 * @class
 * @classdesc Level editor for alien girl game.
 * @param {String} element - Name of canvas element to draw to
 * @param {number} width - Required width of canvas element
 * @param {number} height - Required height of canvas element
 */
function Editor(element, width, height)
{
	this.game = new Game(element, width, height);
	this.game.startEditMode();

	this.canvas = this.game.canvas;
	this.context = this.game.context;

	this.game.spriteManager = new SpriteManager();

	this.mouse = new Mouse(this.canvas);

	this.currentSprite = 'l';

	this.setupMouse();
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
			console.log("Yes: " + keys[i]);

			// Click to select
			// Do we want drag to work without selecting?


		}
	}

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
