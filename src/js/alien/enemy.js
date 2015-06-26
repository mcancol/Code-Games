

function Enemy(x, y, sprite)
{
  this.baseX = x;
  this.baseY = y;

  this.width = 32;
  this.height = 32;

  this.velY = 0;
  this.gravity = 0.3;
  this.alive = true;

  this.sprite = sprite;

  this.setup = function()
  {
    this.targetX = this.baseX;
    this.targetY = this.baseY;

    this.x = this.baseX;
    this.y = this.baseY;

    this.alive = true;
  }


  /**
   * Updates the enemy; it is hunting the player
   */
  this.updateHunting = function()
  {
    var player = this.game.getObject("player");

    var player_underneath =
      player.x + player.width / 2 >= this.x &&
      player.x + player.width / 2 <= this.x + this.width &&
      player.y > this.y;

    var player_went_past = (player.x - 2 * player.width) > this.baseX;

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

    /** Check collision with player **/
    var collision = collisionCheck(this, player);
    if(this.alive && collision) {
      if(collision.normal.y < 0 || player_went_past) {
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
    var level = this.game.getObject("level");

    var dirY = Math.sign(this.gravity);
    var oriY = this.y + 10 + (dirY == 1) * (this.height - 20);

    var hit = level.sensor(
      { x: this.x + this.width / 2, y: oriY },
      { x: 0, y: dirY }, 256, function(hit) { return hit; });

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


  this.draw = function(context)
  {
    var frame = Math.floor((this.game.timestamp / 120) % 2);

    if(this.alive) {
      //sprite = SpriteManager.keyToInteger([10, 3]);
      this.game.spriteManager.drawSprite(context, this, this.sprite, frame);
    } else {
      this.game.spriteManager.drawSprite(context, this, this.sprite + 1, 0, function(context) {
        context.rotate(this.rotation);
      }.bind(this));
    }
  }
}
