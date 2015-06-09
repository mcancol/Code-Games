

function Enemy(x, y)
{
  this.baseX = x;
  this.baseY = y;

  this.width = 32;
  this.height = 32;

  this.velY = 0;

  this.alive = true;


  this.setup = function()
  {
    this.targetX = this.baseX;
    this.targetY = this.baseY;

    this.x = this.baseX;
    this.y = this.baseY;

    this.gravity = 0.3;

    this.alive = true;
  }


  this.update = function()
  {
    var player = this.game.getObject("player");
    var level = this.game.getObject("level");


    if(this.alive) {
      /** Move towards player **/
      if(player.x + player.width / 2 >= this.x &&
        player.x + player.width / 2 <= this.x + this.width &&
        player.y > this.y) {

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
        if(collision.normal.y < 0)
          player.alive = false;
          else
          this.alive = false;
      }
    } else {
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
    }
  }


  this.draw = function(context)
  {
    var frame = Math.floor((this.game.timestamp / 120) % 2);

    if(this.alive) {
      sprite = SpriteManager.keyToInteger([10, 3]);
      this.game.spriteManager.drawSprite(context, this, sprite, frame);
    } else {
      sprite = SpriteManager.keyToInteger([10, 4]);
      this.game.spriteManager.drawSprite(context, this, sprite, 0);
    }


  }
}
