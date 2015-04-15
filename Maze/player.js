

function Player()
{
	// Depends on sprite
	this.width = 32;
	this.height = 46;
	
	this.setup = function()
	{
		// Position
		var level = this.game.getObject("level");
		
		for(var i = 0; i < level.levelMap.length; i++) {
			for(var j = 0; j < level.levelMap[0].length; j++) {
				if (level.levelMap[i][j] == 3){
					this.x = j;
					this.y = i;
				}
			}
		}
		this.faceRight = true;
		
		this.playerImage = new Image();
		this.playerImage.src = "player.png";
		
	}
	
	this.handleInput = function(input)
	{
		var level = this.game.getObject("level");
		
		var x = this.x;
		var y = this.y;
		
		
		// Move to the left
		if(input.keys[input.KEY_LEFT]) {
			if(!this.left)
				x -= 2;
			this.left = true;
			this.playerAngle = 180;
		} else { this.left = false; }
		
		// Move to the right
		if(input.keys[input.KEY_RIGHT]){
			if(!this.right)
				x += 2;
			this.right = true;
			this.playerAngle = 0;
		} else { this.right = false; }
				
		// Move up
		if(input.keys[input.KEY_UP]){
			if(!this.up)
				y -= 2;
			this.up = true;
			this.playerAngle = -90;
		} else { this.up = false; }
		
		// Move down
		if(input.keys[input.KEY_DOWN]){
			if(!this.down)
				y += 2;
			this.down = true;
			this.playerAngle = 90;
		} else { this.down = false; }
	
		
		// Check if move is valid
		if(level.levelMap[(this.y + y) / 2][(this.x + x) / 2] == 1)
			return;
		
		if(level.levelMap[y][x] == 2)
			return;
		
		this.x = x;
		this.y = y;
	}
	
	
	/**
	 * Handle input
	 */
	this.update = function(input)
	{
		this.handleInput(input);
	}

	
	/**
	 * Draw the correct sprite based on the current state of the player
	 */
	this.draw = function(context)
	{
		
		if(this.x % 2 == 0){
			x = this.x*(widthspace+widthwall)/2;
			w = widthwall;
		}
		else{
			x = (this.x-1)*(widthspace+widthwall)/2 + widthwall;
			w = widthspace;
		}
		if(this.y % 2 == 0){
			y = this.y*(widthspace+widthwall)/2;
			h = widthwall;
		}
		else{
			y = (this.y-1)*(widthspace+widthwall)/2 + widthwall;
			h = widthspace;
		}
		
		context.save();
		context.translate(x + w / 2, y + h / 2);
		context.rotate(this.playerAngle * Math.PI / 180.0);
		
		context.drawImage(this.playerImage, -w / 2, -h / 2, w, h);
		context.restore();
	}
}