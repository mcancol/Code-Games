
function Game(element, width, height)
{
  this.initializeEngine(element, width, height);
}

Game.prototype = new Engine();
