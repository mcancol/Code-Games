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

  this.Sprite_Player = 0x0002;
  this.Sprite_Enemy_Fly = 0x0A00;
  this.Sprite_Enemy_Bee = 0x0A03;
  this.Sprite_Enemy_Bat = 0x0A06;

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
        function(data) {
          var level = new Level(data.level);

          this.setLevelBounds(level);
          this.game.addObject('level', level);

          this.setupPlayers(data.players);
          this.setupEnemies(data.enemies);

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

    for(var i = 0; i < enemies.length; i++) {
      var enemy = new Enemy();

      enemy.setStartingPosition(enemies[i].x, enemies[i].y);
      enemy.setBaseSprite(enemies[i].type);

      if(enemies[i].type == this.Sprite_Enemy_Bee)
        enemy.setAggressionLevel(0);
      else
        enemy.setAggressionLevel(1);

      this.game.addObject(enemy.name, enemy);
    }
  }


  /**
   * Create player objects
   *
   * @param {Array} players - List of players to setup
   */
  this.setupPlayers = function(players)
  {
    var player = new Player();
    player.setStartingPosition(players[0].x, players[0].y);
    this.game.addObject(players[0].name, player);
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

        if($.isArray(data))
          data = upgradeLevelVersion1(data);

  			resolve(data);
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

}


/**
 * Upgrade level from version 1 to version 2.
 *
 * @param {Array} data - Version 1 level returned from server
 */
function upgradeLevelVersion1(data)
{
  // Convert format
  data = {
    'version': 2,
    'level': data,
    'players': [],
    'enemies': []
  };

  /**
   * Scans the level for special items, such as the player and enemies,
   * adds them to a list and removes them from the level.
   */
  var i_player = 0;
  var i_enemy = 0;

  for(var x = 0; x < data.level[0].length; x++) {
    for(var y = 0; y < data.level.length; y++) {

      // Extract location of player objects
      if(data.level[y][x] == 2) {
        data.players.push({ x: x * 32, y: y * 32 - 12, name: 'player_' + (i_player++) });
        data.level[y][x] = 0;
      }

      // Extract location of enemy objects
      if(isEnemy(data.level[y][x])) {
        data.enemies.push({ type: data.level[y][x], x: x * 32, y: y * 32, name: 'enemy_' + (i_enemy++) });
        data.level[y][x] = 0;
      }
    }
  }

  // Add default player if none are found
  if(data.players.length == 0)
    data.players.push({ x: 32, y: 128 });

  return data;
};
