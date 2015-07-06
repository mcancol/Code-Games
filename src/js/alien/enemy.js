/** @module Alien **/
"use strict";

/**
 * Creates new enemy object.
 *
 * @class
 * @classdesc Object representing an enemy in the alien girl game.
 */
function Enemy()
{
  this.baseX = 0;
  this.baseY = 0;

  this.width = 32;
  this.height = 32;

  this.velY = 0;
  this.gravity = 0.3;
  this.alive = true;
  this.aggressionLevel = 0;

  this.sprite = 0;


  /**
   * Setups the enemy at the start of the game
   */
  this.setup = function()
  {
    this.targetX = this.baseX;
    this.targetY = this.baseY;

    this.x = this.baseX;
    this.y = this.baseY;

    this.alive = true;
  }


  /**
   * Set the aggression level of the enemy
   *
   * @param {number} aggressionLevel - Aggressiveness of animal
   */
  this.setAggressionLevel = function(aggressionLevel)
  {
    this.aggressionLevel = aggressionLevel;
  }


  /**
	 * Update stating position of the player
	 *
	 * @param {number} x - X coordinate of player starting location
   * @param {number} y - Y coordinate of player starting location
   */
	this.setStartingPosition = function(x, y)
	{
		this.baseX = x;
		this.baseY = y;
	}


  /**
   * Set base sprite for enemy
   * @param {number} sprite - ID of base sprite (dead sprite is +1)
   */
  this.setBaseSprite = function(sprite)
  {
    this.sprite = sprite;
  }

  /**
   * Updates the enemy; it is hunting the player
   */
  this.updateHunting = function()
  {
    var player = this.parent.getObject("player");

    var player_underneath =
      player.x + player.width / 2 >= this.x &&
      player.x + player.width / 2 <= this.x + this.width &&
      player.y > this.y;

    var player_went_past = (player.x - 2 * player.width) > this.baseX;


    if(this.aggressionLevel != 0)
    {
      /** Move towards player when player is underneath **/
      if(player_underneath || player_went_past) {
        this.targetX = player.x;
        this.targetY = player.y;
      } else {
        this.targetX = this.baseX;
        this.targetY = this.baseY;
      }

      this.x = lerp(this.x, this.targetX, 0.2);
      this.y = lerp(this.y, this.targetY, 0.3);
    }

    /** Check collision with player **/
    var collision = collisionCheck(this, player);
    if(this.alive && collision) {
      if(collision.normal.y < 0 || player_went_past) {
        if(this.aggressionLevel != 0)
          player.kill("enemy");
      } else {
        this.alive = false;
        player.events.push("KILLED_ENEMY");

        // Reset rotation
        this.rotation = 0;

        // Player kills the bee, make sure it falls with the same speed
        // as the player, otherwise the player will pass it.
        this.velY = player.velY;
      }
    }
  }


  /**
   * Updates the enemy; it is dying
   */
  this.updateDying = function()
  {
    var level = this.parent.getObject("level");

    var dirY = Math.sign(this.gravity);
    var oriY = this.y + 10 + (dirY == 1) * (this.height - 20);

    /**
     * Make sure hitting spikes or water causes the enemy to touch the surface
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

    this.rotation = lerp(this.rotation, Math.PI, 0.025);
  }


  /**
   * Updates the enemy
   */
  this.update = function()
  {
    if(this.alive) {
      this.updateHunting();
    } else {
      this.updateDying();
    }
  }


  /**
   * Draws the enemy to the specified context
   *
   * @param {Context} context - Context to draw to
   */
  this.draw = function(context)
  {
    var frame = Math.floor((this.getEngine().timestamp / 120) % 2);

    if(this.alive) {
      //sprite = SpriteManager.keyToInteger([10, 3]);
      this.parent.spriteManager.drawSprite(context, this, this.sprite, frame);
    } else {
      this.parent.spriteManager.drawSprite(context, this, this.sprite + 1, 0, function(context) {
        context.rotate(this.rotation);
      }.bind(this));
    }
  }
}

Enemy.prototype = new BaseObject();
