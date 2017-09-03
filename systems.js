var Systems = {};

Systems.render = function() {
	Game.display.clear();
	Game.entities.forEach(e => {
		if (e.components.apperance && e.components.position) {
			Game.display.draw(e.components.position.x,
							e.components.position.y,
							e.components.apperance.glyph,
							e.components.apperance.color);
		}
	});
}

Systems.getInput = function() {
	Game.engine.lock();
	// wait for user input; do stuff when user hits a key
	window.addEventListener("keydown", function(e) {
		var playerEntityIndex = Game.entities.findIndex(e => {
			return e.components.player;
		});
		var code = e.keyCode;

		var keyMap = {};
		keyMap[ROT.VK_K] = 0;
		keyMap[ROT.VK_U] = 1;
		keyMap[ROT.VK_L] = 2;
		keyMap[ROT.VK_N] = 3;
		keyMap[ROT.VK_J] = 4;
		keyMap[ROT.VK_B] = 5;
		keyMap[ROT.VK_H] = 6;
		keyMap[ROT.VK_Y] = 7;

		if (!(code in keyMap)) return;

		var diff = ROT.DIRS[8][keyMap[code]];
		var newX = Game.entities[playerEntityIndex].components.position.x + diff[0];
		var newY = Game.entities[playerEntityIndex].components.position.y + diff[1];

		var collides = Game.entities.filter(e => {
			return e.components.position.x == newX &&
				e.components.position.y == newY &&
				e.components.collides;
		});

		if (collides.length > 0) return;

		// Perform player move
		Game.entities[playerEntityIndex].components.position.x = newX;
		Game.entities[playerEntityIndex].components.position.y = newY;
		console.log("getInput", Game.entities[2000].components.position);
		window.removeEventListener("keydown", self);
		Game.engine.unlock();
	});
}