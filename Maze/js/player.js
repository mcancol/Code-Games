
function Player()
{
	// Depends on sprite
	this.width = 32;
	this.height = 46;


	// Keeps track of whether the moves are being sent
	this.sendingInProgress = false;

	// List of moves to be sent to the server
	this.moveBuffer = {};

	// Number of the current move
	this.moveCounter = 0;


	/**
	 * Sets up the player object
	 */
	this.setup = function()
	{
		// Find player start position
		var level = this.game.getObject("level");

		for(var i = 0; i < level.levelMap.length; i++) {
			for(var j = 0; j < level.levelMap[0].length; j++) {
				if (level.levelMap[i][j] == 3){
					this.x = j;
					this.y = i;
				}
			}
		}

		// Load sprite
		this.playerImage = new Image();
		this.playerImage.src = "images/player.png";

		this.game.canvas.addEventListener("game-move", this.mousemove.bind(this));
	}


	/**
	 * Handles player movement
	 */
	this.update = function(input)
	{
		var level = this.game.getObject("level");

		var x = this.x;
		var y = this.y;

		// Move to the left
		if(input.keys[input.KEY_LEFT]) {
			if(!this.left)
				x -= 2;
			this.left = true;
		} else { this.left = false; }

		// Move to the right
		if(input.keys[input.KEY_RIGHT]){
			if(!this.right)
				x += 2;
			this.right = true;
		} else { this.right = false; }

		// Move up
		if(input.keys[input.KEY_UP]){
			if(!this.up)
				y -= 2;
			this.up = true;
		} else { this.up = false; }

		// Move down
		if(input.keys[input.KEY_DOWN]){
			if(!this.down)
				y += 2;
			this.down = true;
		} else { this.down = false; }

		this.move(x, y);
	}


	/**
	 * Move player
	 */
	this.move = function(x, y)
	{
		var level = this.game.getObject("level");

		var delta = Math.abs(this.x - x) + Math.abs(this.y - y);

		if(delta != 2)
			return;

		// Set player angle
		if(this.x < x)
			this.playerAngle = 0;
		else if(this.x > x)
			this.playerAngle = 180;
		else if(this.y < y)
			this.playerAngle = 90;
		else if(this.y > y)
			this.playerAngle = -90;

		// Check if move is valid
		if(level.levelMap[(this.y + y) / 2][(this.x + x) / 2] == 1)
			return;

		if(level.levelMap[y][x] == 2)
			return;


		// Player has moved
		if(this.x != x || this.y != y)
		{
			this.x = x;
			this.y = y;

			// Store move in the move-buffer
			var move = {
				id: this.moveCounter++,
				timestamp: Date.now() / 1000,
				x: x,
				y: y
			};

			this.moveBuffer[move.id] = move;
			this.transmitMoves();
		}
	}


	/**
	 * Handle mouse move
	 */
	this.mousemove = function(event)
	{
		if(event.detail.type == 'mouse' && event.detail.buttons != 1)
			return;

		var width = (widthspace + widthwall);

		// Compute position in grid
		var x = event.detail.x / width;
		var y = event.detail.y / width;

		// Ignore walls
		if(x - Math.floor(x) < widthwall / width)
			return;

		if(y - Math.floor(y) < widthwall / width)
			return;

		// Round grid position and convert to level coordinates
		x = Math.floor(x) * 2 + 1;
		y = Math.floor(y) * 2 + 1;

		// Propose move
		this.move(x, y);
	}


	/**
	 * Attempts to send all moves from the moveBuffer to the server
	 */
	this.transmitMoves = function()
	{
		if(this.sendingInProgress)
			return;

		this.sendingInProcess = true;

		// Send moves to server
		jQuery.ajax({
			url: datasink + "?game=" + gameStart + "&level=" + playerId,
			data: JSON.stringify(this.moveBuffer),
			contentType: 'text/plain',
			dataType: 'json',
			method: 'POST'
		}).done(function(result) {
			// Remove moves from buffer that were successfully sent
			for(var i in result) {
				if(result[i] in this.moveBuffer)
					delete(this.moveBuffer[ result[i] ]);
			}

			this.sendingInProcess = false;
		}.bind(this)).fail(function() {
			this.sendingInProcess = false;
		}.bind(this));
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
