
function Input()
{
	this.KEY_BACKSPACE = 8;
	this.KEY_TAB = 9;

	this.KEY_ENTER = 13;
	this.KEY_SHIFT = 16;
	this.KEY_CTRL = 17;
	this.KEY_ALT = 18;
	
	this.KEY_PAUSE = 19;
	this.KEY_CAPS = 20;
	this.KEY_ESCAPE = 27;

	this.KEY_SPACE = 32;
	
	this.KEY_LEFT = 37;
	this.KEY_UP = 38;
	this.KEY_RIGHT = 39;
	this.KEY_DOWN = 40;	
	
	this.KEY_A = 65;
	this.KEY_B = 66;
	this.KEY_C = 67;
	this.KEY_D = 68;
	this.KEY_E = 69;
	this.KEY_F = 70;
	this.KEY_G = 71;
	this.KEY_H = 72;
	this.KEY_I = 73;
	this.KEY_J = 74;
	this.KEY_K = 75;
	this.KEY_L = 76;
	this.KEY_M = 77;
	this.KEY_N = 78;
	this.KEY_O = 79;
	this.KEY_P = 80;
	this.KEY_Q = 81;
	this.KEY_R = 82;
	this.KEY_S = 83;
	this.KEY_T = 84;
	this.KEY_U = 85;
	this.KEY_V = 86;	
	this.KEY_W = 87;
	this.KEY_X = 88;
	this.KEY_Y = 89;
	this.KEY_Z = 90;
	
	this.keys = {};
	
	this.keydown = function(event) {
		this.keys[event.keyCode] = true;
	};
	
	this.keyup = function(event) {
		this.keys[event.keyCode] = false;
	};
	
	document.body.addEventListener("keydown", this.keydown.bind(this));
	document.body.addEventListener("keyup", this.keyup.bind(this));;
}
