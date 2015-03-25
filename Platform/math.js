
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
