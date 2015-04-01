
/**
 * Checks whether two objects are colliding and returns
 * a possible resolution strategy.
 */
function collisionCheck(objectA, objectB)
{
	var gapXA = objectA.x - (objectB.x + objectB.width);
	var gapXB = objectB.x - (objectA.x + objectA.width);

	var gapYA = objectA.y - (objectB.y + objectB.height);
	var gapYB = objectB.y - (objectA.y + objectA.height);

	
	// Touching or no collision
	if(gapXA >= 0 || gapXB >= 0 || gapYA >= 0 || gapYB >= 0)
		return false;
	
	// Collision information object
	ci = {normal: {x: 0, y: 0}};
	ci.type = objectB.type;
	
	// Compute collision normal in X
	if(gapXA < gapXB) {
		ci.normal['x'] = gapXB;
	} else {
		ci.normal['x'] = -gapXA;
	}
	
	// Compute collision normal in Y
	if(gapYA < gapYB) {
		ci.normal['y'] = gapYB;
	} else {
		ci.normal['y'] = -gapYA;
	}
	
	ci.axis = Math.abs(ci.normal.x) < Math.abs(ci.normal.y)?'x':'y';
	
	return ci;	
}


function detectCollisionArray(objectA, objectsB, callback, offset)
{
	for(var key in objectsB) {	
		if(offset) {
			// Copy box for collision detection
			var box = {x: objectsB[key].x + offset.x, 
					   y: objectsB[key].y + offset.y, 
					   width: objectsB[key].width, 
					   height: objectsB[key].height, 
					   type: objectsB[key].type};		
		} else {
			var box = objectsB[key];
		}
		
		var ci = collisionCheck(objectA, box);
		
		if(!ci)
			continue;
		
		if(typeof ci.type == "object") {
			detectCollisionArray(objectA, ci.type, callback, box);			
		} else {
			callback(ci);
		}
	}
}


/**
 * Returns the sign of the number, 1 for positive, -1 for negative.
 */
function sign(number)
{
	return (number >= 0)?1:-1;
}


/**
 * Linear interpolation
 */
function lerp(from, to, t)
{
	return from + (to - from) * t;
}
