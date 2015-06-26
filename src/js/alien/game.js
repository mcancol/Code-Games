
function Game(element, width, height)
{
  this.initializeEngine(element, width, height);
}


Game.prototype = new Engine();


/**
 * When the game is over, reset all objects
 * which effectively restarts the game.
 */
Game.prototype.gameover = function()
{
  // Reset all objects to their default states
  for(var key in this.objects)
    this.objects[key].setup();
}
