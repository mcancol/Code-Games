
var topBox = [{x: 0, y: 0, width: 32, height: 16, type: true}];
var bottomBox = [{x: 0, y: 16, width: 32, height: 16, type: true}];

var stairsUp = [];
var stairsDown = [];

for(var i = 0; i < 32; i++) {
	stairsUp.push({x: i, y: 32 - i, width: 32 - i, height: 2, type: 'Stairs'});
	stairsDown.push({x: 0, y: 32 - i, width: 32 - i, height: 2, type: 'Stairs'});
}


var spriteTable = [
	{key: [0, 1], src: 'clipping', collision: true},

	/* Grass */
	{key: [1, 1], src: 'grass/grassLeft', collision: true},
	{key: [1, 2], src: 'grass/grassMid', collision: true},
	{key: [1, 3], src: 'grass/grassRight', collision: true},	
	{key: [1, 4], src: 'grass/grassCenter', collision: true},
	{key: [1, 5], src: 'grass/grassCliff_left', collision: true},	
	{key: [1, 6], src: 'grass/grassCliff_right', collision: true},
	{key: [1, 7], src: 'grass/grassCliffAlt_left', collision: true},	
	{key: [1, 8], src: 'grass/grassCliffAlt_right', collision: true},
	{key: [1, 9], src: 'grass/grassCorner_left', collision: true},	
	{key: [1, 10], src: 'grass/grassCorner_right', collision: true},
	{key: [1, 11], src: 'grass/grassHill_left', collision: stairsDown},
	{key: [1, 12], src: 'grass/grassHill_right', collision: stairsUp},
	{key: [1, 13], src: 'grass/grassHalf', collision: true},
	{key: [1, 14], src: 'grass/grassHalf_left', collision: topBox},
	{key: [1, 15], src: 'grass/grassHalf_mid', collision: topBox},
	{key: [1, 16], src: 'grass/grassHalf_right', collision: topBox},


	/* Snow */
	{key: [1, 32], src: 'snow/snowLeft', collision: true},
	{key: [1, 33], src: 'snow/snowMid', collision: true},
	{key: [1, 34], src: 'snow/snowRight', collision: true},	
	{key: [1, 35], src: 'snow/snowCenter', collision: true},
	{key: [1, 36], src: 'snow/snowCliff_left', collision: true},	
	{key: [1, 37], src: 'snow/snowCliff_right', collision: true},
	{key: [1, 38], src: 'snow/snowCliffAlt_left', collision: true},	
	{key: [1, 39], src: 'snow/snowCliffAlt_right', collision: true},
	{key: [1, 40], src: 'snow/snowCorner_left', collision: true},	
	{key: [1, 41], src: 'snow/snowCorner_right', collision: true},
	{key: [1, 42], src: 'snow/snowHill_left', collision: stairsDown},
	{key: [1, 43], src: 'snow/snowHill_right', collision: stairsUp},
	{key: [1, 44], src: 'snow/snowHalf', collision: true},
	{key: [1, 45], src: 'snow/snowHalf_left', collision: topBox},
	{key: [1, 46], src: 'snow/snowHalf_mid', collision: topBox},
	{key: [1, 47], src: 'snow/snowHalf_right', collision: topBox},
	
	
	{key: [1, 20], src: 'metalCenter', collision: true},
	
	{key: [2, 1], src: 'liquidWaterTop_mid', frames: 2, collision: "Water"},
	{key: [2, 2], src: 'liquidWater', frames: 2, collision: "Water"},
	
	{key: [3, 1], src: 'plant', collision: false},
	{key: [3, 2], src: 'pineSapling', collision: false},
	{key: [3, 3], src: 'pineSaplingAlt', collision: false},
	{key: [3, 4], src: 'cactus', collision: false},
	
	{key: [4, 1], src: 'spikes', collision: "Water"},
	{key: [4, 2], src: 'doorOpen', collision: 'Door'},
	{key: [4, 3], src: 'doorOpenTop', collision: false},
	
	
	{key: [5, 4], src: 'signRight', collision: false},
	{key: [5, 5], src: 'signExit', collision: false},

	{key: [6, 1], src: 'cloud1-left', collision: true},
	{key: [6, 2], src: 'cloud1-right', collision: true},
	
	{key: [9, 1], src: 'numbers/1', collision: false},
	{key: [9, 2], src: 'numbers/2', collision: false},
	{key: [9, 3], src: 'numbers/3', collision: false},
	{key: [9, 4], src: 'numbers/4', collision: false},
	{key: [9, 5], src: 'numbers/5', collision: false},
];			

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
		var key = spriteTable[i]['key'];		
		key = key[0] * 256 + key[1];

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
