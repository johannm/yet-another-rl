var Systems = {};

Systems.render = function() {
	Game.display.clear();
	for (var key in Game.map) {
		var x = parseInt(key.split(",")[0]);
		var y = parseInt(key.split(",")[1]);
		Game.display.draw(x, y, Game.map[key].glyph, Game.map[key].color);
	}
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
	window.addEventListener("keydown", Systems.handleInput);
}

Systems.handleInput = function(event) {
	var playerEntityIndex = Game.entities.findIndex(e => {
		return e.components.player;
	});
	var code = event.keyCode;

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
		return e.components.position.x === newX &&
			e.components.position.y === newY &&
			e.components.collides;
	});

	if (collides.length > 0) return;

	if (Game.map[newX + "," + newY].glyph === "#") return;

	// Perform player move
	Game.entities[playerEntityIndex].components.position.x = newX;
	Game.entities[playerEntityIndex].components.position.y = newY;
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Systems.processEnemy = function() {
	Game.entities.forEach(function(entity, i) {
		if (!entity.components.enemy)
			return;

		var player = Game.entities.find(e => {
			return e.components.player;
		});
		var targetX = player.components.position.x;
		var targetY = player.components.position.y;
		var passableCallback = function(x, y) {
			return Game.map[x + "," + y].glyph === ".";
		}
		var astar = new ROT.Path.AStar(targetX, targetY, passableCallback, {topology:8});

		var path = [];
		var pathCallback = function(x, y) {
			path.push([x, y]);
		}
		astar.compute(entity.components.position.x, entity.components.position.y, pathCallback);

		if (path.length > 2) {
			var newX, newY;
			[newX, newY] = path[1];
			Game.entities[i].components.position.x = newX;
			Game.entities[i].components.position.y = newY;
		} else {
			if ([newX, newY] === [targetX, targetY]) {
				Game.engine.lock();
				alert("Game Over");
			}
		}
	});
}
