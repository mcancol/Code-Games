/** @module Alien **/
"use strict";

/**
 * Creates new worm object.
 *
 * @class
 * @classdesc Object representing an worm in the alien girl game.
 */
function Worm()
{
  this.baseX = 0;
  this.baseY = 0;

  this.width = 32;
  this.height = 32;

  this.velY = 0;
  this.gravity = 0.3;

  this.sprite = 0;


  /**
   * Serialize state to array
   */
  this.toArray = function()
  {
    return {
      'x': this.x,
      'y': this.y,
      'type': 'worm',
      'sprite': this.sprite
    };
  }


  /**
   * Unserialize state from array
   */
  this.fromArray = function(array)
  {
    this.setStartingPosition(array.x, array.y);
    this.setBaseSprite(array.sprite);
  }


  /**
   * Setups the worm at the start of the game
   */
  this.reset = function()
  {
    this.x = this.baseX;
    this.y = this.baseY;
  }


  /**
	 * Update stating position of the worm
	 *
	 * @param {number} x - X coordinate of worm starting location
   * @param {number} y - Y coordinate of worm starting location
   */
	this.setStartingPosition = function(x, y)
	{
		this.baseX = x;
		this.baseY = y;
	}


  /**
   * Set base sprite for worm
   * @param {number} sprite - ID of base sprite
   */
  this.setBaseSprite = function(sprite)
  {
    this.sprite = sprite;
  }


  /**
   * Updates the worm
   */
  this.update = function()
  {
    var level = this.parent.getObject("level");

    var dirY = Math.sign(this.gravity);
    var oriY = this.y + 10 + (dirY == 1) * (this.height - 20);

    /**
     * Make sure hitting spikes or water causes the worm to touch the surface
     */
    var callback = function(hit) {
      if(hit.type == 'water') {
        hit.y += 24;
        hit.dy += 24;
      }
      return hit;
    }

    var hit = level.sensor(
      { x: this.x + this.width / 2, y: oriY },
      { x: 0, y: dirY }, 256, callback);

    if(dirY > 0 && hit && hit.dy < 10) {
      this.y = hit.y - this.height;
      this.velY = 0;
    }

    this.velY += this.gravity;
    this.y += this.velY;

    // Check for hits with player
  }


  /**
   * Draws the worm to the specified context
   *
   * @param {Context} context - Context to draw to
   */
  this.draw = function(context)
  {
    this.parent.spriteManager.drawSprite(context, this, this.sprite, 0);
  }
}

Worm.prototype = new BaseObject();
