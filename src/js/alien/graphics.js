"use strict";

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


	this.drawSprite = function(context, box, name, frame, transform)
	{
		if(!(name in this.sprites))
			return;

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


SpriteManager.keyToInteger = function(key)
{
	return key[0] * 256 + key[1];
}


SpriteManager.prototype.getFrameCount = function(sprite)
{
	if(!(sprite in this.sprites))
		return;

	return this.sprites[sprite].length;
}


SpriteManager.prototype.loadFromSpriteTable =  function(spriteTable)
{
	/** Load sprites from sprite table **/
	for(var i = 0; i < spriteTable.length; i++) {
		var key = SpriteManager.keyToInteger(spriteTable[i]['key']);

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
