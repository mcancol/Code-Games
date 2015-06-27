/** @module Maze **/
"use strict";


/**
 * Main class for maze game
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
