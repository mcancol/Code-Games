/** @module Alien **/
"use strict";

/**
 * Level editor for alien girl game
 *
 * @class
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
	var coords = {x: Math.floor((this.game.scroll.x + event.detail.x) / 32),
	 			  y: Math.floor(event.detail.y / 32)};

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
