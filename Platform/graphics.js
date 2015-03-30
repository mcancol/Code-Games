
var spriteTable = [
	{key: [1, 2], src: 'grassLeft'},
	{key: [1, 1], src: 'grassMid'},
	{key: [1, 3], src: 'grassRight'},
					
	{key: [2, 1], src: 'liquidWaterTop_mid', frames: 2},
	{key: [2, 2], src: 'liquidWater', frames: 2},
	
	{key: [3, 1], src: 'plant'},
	{key: [3, 2], src: 'pineSapling'},
	{key: [3, 3], src: 'pineSaplingAlt'},
	
	{key: [4, 1], src: 'spikes'},				
	{key: [4, 2], src: 'springboardDown'},
	{key: [4, 3], src: 'springboardUp'},
	
	{key: [3, 4], src: 'signRight'},
	{key: [3, 5], src: 'signExit'},
];
			

function SpriteManager()
{
	this.sprites = {};	
	var imageMap = {};
	
	this.loadFromSpriteTable(spriteTable);	

	imageMap['metal'] = 'tiles/metalCenter.png';
	imageMap['cloud'] = 'tiles/cloud1.png';

	imageMap['sign_exit'] = 'tiles/signExit.png';
	imageMap['sign_right'] = 'tiles/signRight.png';	
	
	imageMap['grass'] = 'tiles/grassMid.png';
	imageMap['grass_center'] = 'tiles/grassCenter.png';
	imageMap['grass_left'] = 'tiles/grassLeft.png';
	imageMap['grass_right'] = 'tiles/grassRight.png';
	
	imageMap['water_1'] = 'tiles/liquidWater_1.png';
	imageMap['water_2'] = 'tiles/liquidWater_2.png';
	imageMap['water_top_1'] = 'tiles/liquidWaterTop_mid_1.png';
	imageMap['water_top_2'] = 'tiles/liquidWaterTop_mid_2.png';
	
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
	
		if(transform) {
			context.save();
			context.translate(box.x + box.width / 2, box.y + box.height / 2);
			
			transform(context);
			
			context.drawImage(this.sprites[name][frame], -box.width / 2, -box.height / 2, box.width, box.height);
			context.restore();
		} else {		
			context.drawImage(this.sprites[name][frame], box.x, box.y, box.width, box.height);
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
	console.log(spriteTable.length);
	
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
