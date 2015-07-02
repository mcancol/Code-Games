/** @module Alien **/
"use strict";

/**
 * Constructs a level loading class
 *
 * @class
 * @classdesc Level loading class
 */
function LevelLoader(game)
{
  this.game = game;


  /**
   * Loads the level from the list and sets up the game
   * state (players / enemies) accordingly.
   *
   * @param {String} name - Name of the level to load
   */
  this.loadLevel = function(name)
  {
    return new Promise(function(resolve, reject) {
      this.game.deleteAllObjects();
      this.getLevelFromServer(name).then(
        function(level) {
          var locations = this.markSpecialLocations(level);

          this.setLevelBounds(level);
          this.game.addObject('level', level);

          this.setupPlayers(locations.players);
          this.setupEnemies(locations.enemies);

          resolve();
        }.bind(this),
        function(error) {
          console.log("LevelLoader.loadLevel failed: " + error);
          reject(error);
        });
      }.bind(this));
  }


  /**
   * Construct enemies and add them to the game
   *
   * @param {Array} enemies - List of enemies to setup
   */
  this.setupEnemies = function(enemies)
  {
    var spriteManager = this.game.spriteManager;
    var Sprite_Enemy_Bee = SpriteManager.keyToInteger([10, 3]);

    if(this.game.editMode)
      return;

    for(var i = 0; i < enemies.length; i++) {
      var enemy = new Enemy();

      enemy.setStartingPosition(enemies[i].x, enemies[i].y);
      enemy.setBaseSprite(enemies[i].type);

      if(enemies[i].type == Sprite_Enemy_Bee)
        enemy.setAggressionLevel(0);
      else
        enemy.setAggressionLevel(1);

      this.game.addObject('enemy_' + i, enemy);
    }
  }


  /**
   * Create player objects
   *
   * @param {Array} players - List of players to setup
   */
  this.setupPlayers = function(players)
  {
    if(this.game.editMode)
      return;

    // Default location if no players have been found
    if(players.length == 0)
      players.push({ x: 32, y: 128 });

    var player = new Player();
    player.setStartingPosition(players[0].x, players[0].y);
    this.game.addObject('player', player);
  }


  /**
   * Retrieves the level from the server
   *
   * @param {String} name - Name of the level to load
   */
  this.getLevelFromServer = function(name)
  {
  	return new Promise(function(resolve, reject) {
  		if(typeof(server) == 'undefined' || !server)
  			reject();

  		jQuery.ajax({
  			url: server + "ldb/get_level.php?name=" + name,
  			dataType: 'json'
  		}).done(function(data) {
        var level = new Level(data);

  			resolve(level);
  		}).fail(function(response) {
        console.log("LevelLoader.getLevelFromServer() failed " + response);
  			reject(response.responseText);
  		});
  	});
  };


  /**
   * Set level bounds on game object
   */
  this.setLevelBounds = function(level)
  {
    this.game.setLevelBounds({
      x: 32,
      y: 32,
      width: level.getWidth() * 32 - 64,
      height: level.getHeight() * 32 - 64
    });
  };


  /**
   * Scans the level for special items, such as the player and enemies,
   * adds them to a list and removes them from the level.
   */
  this.markSpecialLocations = function(level)
  {
    var locations = {
      players: [],
      enemies: []
    };

    var Sprite_Player = SpriteManager.keyToInteger([0, 2]);
    var Sprite_Enemy_Fly = SpriteManager.keyToInteger([10, 0]);
    var Sprite_Enemy_Bee = SpriteManager.keyToInteger([10, 3]);
    var Sprite_Enemy_Bat = SpriteManager.keyToInteger([10, 6]);

    for(var x = 0; x < level.getWidth(); x++) {
      for(var y = 0; y < level.getHeight(); y++) {

        // Mark location of player objects
        if(level.levelMap[y][x] == Sprite_Player) {
          locations.players.push({ x: x * 32, y: y * 32 });

          if(!this.game.editMode)
            level.levelMap[y][x] = 0;
        }

        // Mark location of enemy objects
        if(level.levelMap[y][x] == Sprite_Enemy_Bee ||
           level.levelMap[y][x] == Sprite_Enemy_Bat ||
           level.levelMap[y][x] == Sprite_Enemy_Fly) {

          locations.enemies.push({ type: level.levelMap[y][x], x: x * 32, y: y * 32 });

          if(!this.game.editMode)
            level.levelMap[y][x] = 0;
        }
      }
    }

    return locations;
  };

}
