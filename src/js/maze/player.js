
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
	}


	/**
	 * Handles player movement
	 */
	this.update = function(input)
	{
	}


	/**
	 * Attempt to moves the player one block in the
	 * specified direction
	 */
	this.moveDirection = function(dx, dy)
	{
		// Normalize delta
		if(dx != 0)
			dx /= Math.abs(dx);
		if(dy != 0)
			dy /= Math.abs(dy);

		// Attempt to move player
		return this.move(this.x + dx * 2, this.y + dy * 2)
	}


	/**
	 * Move player, returns whether the proposed move is valid
	 */
	this.move = function(x, y)
	{
		var level = this.game.getObject("level");

		var delta = Math.abs(this.x - x) + Math.abs(this.y - y);

		if(delta != 2)
			return false;

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
			return false;

		if(level.levelMap[y][x] == 2)
			return false;


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

			return true;
		}

		return false;
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