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

		var newX = path[1][0];
		var newY = path[1][1];
		if (path.length > 2) {
			Game.entities[e.id].components.position.x = newX;
			Game.entities[e.id].components.position.y = newY;
		} else {
			if (newX === targetX && newY === targetY) {
				console.log("enemy hits");
				var hp = Game.entities[Game.playerId].components.health.value--;
				console.log("player health", hp);
				if (hp < 1) {
					console.log("You were killed!");
					Game.engine.lock();
				}
			}
		}
	});
}
