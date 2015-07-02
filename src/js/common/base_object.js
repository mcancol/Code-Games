/** @module Common **/
"use strict";


/**
 * Base class for game objects.
 *
 * @class
 */
function BaseObject()
{
  this.children = {};
}


BaseObject.prototype.setup = function()
{
}


/**
 * Update (physics) state of current node
 *
 * @param {Keyboard} keyboard - State of the keyboard
 */
BaseObject.prototype.update = function(keyboard)
{
  this.updateChildren(keyboard);
}


/**
 * Draw the current node
 *
 * @param {Context} context - Context to draw to
 */
BaseObject.prototype.draw = function(context)
{
  this.drawChildren(context);
}


// //////////////////////////// //
// Functions to manage children //
// //////////////////////////// //


/**
 * Add a child object
 *
 * @param {String} name - Name of the child object
 * @param {BaseObject} object - Object to be added
 */
BaseObject.prototype.addObject = function(name, object)
{
	object.game = this;
	this.objects[name] = object;
	this.objects[name].setup();
};


/**
 * Retreive a specific child object
 *
 * @param {String} name - Name of the object to retreive
 * @returns {BaseObject} Returned object
 */
BaseObject.prototype.getObject = function(name)
{
	return this.objects[name];
};


/**
 * Delete a specific child object
 *
 * @param {String} name - Name of the object to delete
 */
BaseObject.prototype.deleteObject = function(name)
{
	delete this.objects[name];
};


/**
 * Remove all child objects
 */
BaseObject.prototype.deleteAllObjects = function()
{
	this.objects = {};
};



/**
 * Update (physics) state of child objects
 *
 * @param {Keyboard} keyboard - State of the keyboard
 */
BaseObject.prototype.updateChildren = function(keyboard)
{
  for(var key in this.objects)
    this.objects[key].update(keyboard);
}


/**
 * Invoke the draw function on all children
 *
 * @param {Context} context - Context to draw to
 */
BaseObject.prototype.drawChildren = function(context)
{
  for(var key in this.objects)
		this.objects[key].draw(context);
}