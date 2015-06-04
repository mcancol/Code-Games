
var topBox = [{x: 0, y: 0, width: 32, height: 16, type: true}];
var bottomBox = [{x: 0, y: 16, width: 32, height: 16, type: true}];

var stairsUp = [];
var stairsDown = [];

for(var i = 0; i < 32; i++) {
	stairsUp.push({x: i, y: 32 - i, width: 32 - i, height: 2, type: 'StairsUp'});
	stairsDown.push({x: 0, y: 32 - i, width: 32 - i, height: 2, type: 'StairsDown'});
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


	/* Planet */
	{key: [1, 48], src: 'planet/planetLeft', collision: true},
	{key: [1, 49], src: 'planet/planetMid', collision: true},
	{key: [1, 50], src: 'planet/planetRight', collision: true},
	{key: [1, 51], src: 'planet/planetCenter', collision: true},
	{key: [1, 52], src: 'planet/planetCliff_left', collision: true},
	{key: [1, 53], src: 'planet/planetCliff_right', collision: true},
	{key: [1, 54], src: 'planet/planetCliffAlt_left', collision: true},
	{key: [1, 55], src: 'planet/planetCliffAlt_right', collision: true},
	{key: [1, 56], src: 'planet/planetCorner_left', collision: true},
	{key: [1, 57], src: 'planet/planetCorner_right', collision: true},
	{key: [1, 58], src: 'planet/planetHill_left', collision: stairsDown},
	{key: [1, 59], src: 'planet/planetHill_right', collision: stairsUp},
	{key: [1, 60], src: 'planet/planetHalf', collision: true},
	{key: [1, 61], src: 'planet/planetHalf_left', collision: topBox},
	{key: [1, 62], src: 'planet/planetHalf_mid', collision: topBox},
	{key: [1, 63], src: 'planet/planetHalf_right', collision: topBox},


	{key: [1, 20], src: 'metalCenter', collision: true},

	{key: [2, 1], src: 'liquidWaterTop_mid', frames: 2, collision: "Water"},
	{key: [2, 2], src: 'liquidWater', frames: 2, collision: "Water"},

	{key: [2, 3], src: 'water_high', frames: 2, collision: "Water"},
	{key: [2, 4], src: 'water_low1', frames: 1, collision: "Water"},

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

	{key: [9, 1], src: 'numbers/1', collision: true},
	{key: [9, 2], src: 'numbers/2', collision: true},
	{key: [9, 3], src: 'numbers/3', collision: true},
	{key: [9, 4], src: 'numbers/4', collision: true},
	{key: [9, 5], src: 'numbers/5', collision: true},

	{key: [10, 0], src: 'fly/fly', frames: 2, collision: 'Fly'},
	{key: [10, 1], src: 'fly/fly_dead', collision: true},

	{key: [10, 3], src: 'bee/bee', frames: 2, collision: 'Bee'},
	{key: [10, 4], src: 'bee/bee_dead', collision: true},
];
