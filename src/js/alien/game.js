/** @module Alien **/
"use strict";


/**
 * Main class for alien girl game
 *
 * @class
 * @param {String} element - Name of canvas element to draw to
 * @param {number} width - Required width of canvas element
 * @param {number} height - Required height of canvas element
 */
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
