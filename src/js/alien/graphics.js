/** @module Alien **/
"use strict";


/**
 * Create a new sprite manager object.
 *
 * @class
 * @classdesc Manages sprites in the alien girl game.
 */
function SpriteManager()
{
	this.sprites = {};
	var imageMap = {};

	this.loadFromSpriteTable(spriteTable);

	for(var i = 1; i < 4; i++) {
		imageMap['player_idle_left_' + i] = 'tiles/sara/idle/l/' + i + '.png';
		imageMap['player_walk_left_' + i] = 'tiles/sara/walk/l/' + i + '.png';
		imageMap['player_jump_left_' + i] = 'tiles/sara/jump/l/' + i + '.png';

		imageMap['player_idle_right_' + i] = 'tiles/sara/idle/r/' + i + '.png';
		imageMap['player_walk_right_' + i] = 'tiles/sara/walk/r/' + i + '.png';
		imageMap['player_jump_right_' + i] = 'tiles/sara/jump/r/' + i + '.png';
	}

	for(name in imageMap) {
		if(typeof imageMap[name] == 'array') {
			for(var i = 0; i < imageMap[name].length; i++) {
				imageMap[name].length
			}
		} else {
			this.sprites[name] = new Image();
			this.sprites[name].src = imageMap[name];
		}
	}


	/**
	 * Returns whether a given sprite is valid.
	 *
	 * @param {String} name - Name of the sprite to check
	 * @return {boolean} True if valid, false if not
	 */
	this.isSpriteValid = function(name)
	{
		return (name in this.sprites);
	}


	/**
	 * Draw a sprite to the context
	 *
	 * @param {Context} context - Context to draw to
	 * @param {Object} box - Bounding box {x, y, width, height} to draw to
	 * @param {String} name - Name of the sprite to draw
	 * @param {number} frame - Number of the frame to draw
	 * @param {Function} transform - Special transform function to call before drawing
	 */
	this.drawSprite = function(context, box, name, frame, transform)
	{
		var sprite = this.sprites[name];

		if(frame in sprite)
			sprite = sprite[frame];

		if(transform) {
			context.save();
			context.translate(box.x + box.width / 2, box.y + box.height / 2);

			transform(context);

			context.drawImage(sprite, -box.width / 2, -box.height / 2, box.width, box.height);
			context.restore();
		} else {
			context.drawImage(sprite, box.x, box.y, box.width, box.height);
		}
	}
}


SpriteManager.prototype.getFrameCount = function(sprite)
{
	if(!(sprite in this.sprites))
		return;

	return this.sprites[sprite].length;
}


/**
 * Returns the width of a sprite.
 *
 * @param {number} sprite - Number of the sprite.
 * @returns {number} Width in pixels.
 */
SpriteManager.prototype.getWidth = function(sprite)
{
	if(!(sprite in this.sprites))
		return;

	if(this.sprites[sprite].length > 1)
		return this.sprites[sprite][0].width;
	return this.sprites[sprite].width;
}


/**
 * Returns the height of a sprite.
 *
 * @param {number} sprite - Number of the sprite.
 * @returns {number} Height in pixels.
 */
SpriteManager.prototype.getHeight = function(sprite)
{
	if(!(sprite in this.sprites))
		return;

	if(this.sprites[sprite].length > 1)
		return this.sprites[sprite][0].height;
	return this.sprites[sprite].height;
}


SpriteManager.prototype.loadFromSpriteTable =  function(spriteTable)
{
	/** Load sprites from sprite table **/
	for(var i = 0; i < spriteTable.length; i++) {
		var key = spriteTable[i]['key'];

		if('frames' in spriteTable[i]) {
			var sprite_array = [];
			for(var j = 1; j <= spriteTable[i]['frames']; j++) {
				sprite_array[j - 1] = new Image();
				sprite_array[j - 1].src = 'tiles/' + spriteTable[i]['src'] + "_" + j + '.png';
			}

			this.sprites[key]  = sprite_array;
		} else {
			this.sprites[key] = [new Image()];
			this.sprites[key][0].src = 'tiles/' + spriteTable[i]['src'] + '.png';
		}
	}
}
