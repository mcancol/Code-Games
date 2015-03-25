
function SpriteManager()
{
	this.sprites = {};
	
	var imageMap = {};
	
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

	
	this.drawSprite = function(context, box, name, transform )
	{
		if(transform) {
			context.save();
			context.translate(box.x + box.width / 2, box.y + box.height / 2);
			
			transform(context);
			
			context.drawImage(this.sprites[name], -box.width / 2, -box.height / 2, box.width, box.height);
			context.restore();
		} else {
			context.drawImage(this.sprites[name], box.x, box.y, box.width, box.height);
		}
	}
}