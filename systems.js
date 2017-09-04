var Systems = {};

Systems.render = function() {
	Game.display.clear();

	_.each(Game.map, (tile, key) => {
		var pos = Game.keyToPos(key);
		Game.display.draw(pos.x, pos.y, tile.glyph, tile.color);
	});

	_(Game.entities)
	.filter(e => e.components.apperance && e.components.position)
	.each(e => {
		Game.display.draw(
			e.components.position.x,
			e.components.position.y,
			e.components.apperance.glyph,
			e.components.apperance.color
		);
	});
}

Systems.getInput = function() {
	Game.engine.lock();
	// wait for user input; do stuff when user hits a key
	window.addEventListener("keydown", Systems.handleInput);
}

Systems.handleInput = function(event) {
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
	var player = Game.entities[Game.entities]
	var newX = Game.getPlayer().components.position.x + diff[0];
	var newY = Game.getPlayer().components.position.y + diff[1];

	var collides = _.filter(Game.entities, e => 
		e.components.position.x === newX 
			&& e.components.position.y === newY 
			&& e.components.collides);

	if (collides.length > 0) return;

	if (Game.map[newX + "," + newY].glyph === "#") return;

	// Perform player move
	Game.entities[Game.playerId].components.position.x = newX;
	Game.entities[Game.playerId].components.position.y = newY;
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Systems.processEnemy = function() {
	_(Game.entities)
	.filter(e => e.components.enemy)
	.forEach(e => {
		var targetX = Game.getPlayer().components.position.x
		var targetY = Game.getPlayer().components.position.y;
		
		var passableCallback = (x, y) => Game.map[x + "," + y].glyph === ".";		
		var astar = new ROT.Path.AStar(targetX, targetY, passableCallback, {topology:8});

		var path = [];
		var pathCallback = (x, y) => path.push([x, y]);
		astar.compute(e.components.position.x, e.components.position.y, pathCallback);

		var newX = path[1][0]
		var newY = path[1][1];
		if (path.length > 2) {
			Game.entities[e.id].components.position.x = newX;
			Game.entities[e.id].components.position.y = newY;
		} else {
			console.log("path length", path.length);
			if (newX === targetX && newY === targetY) {
				Game.engine.lock();
				alert("Game Over");
			}
		}
	});
}
