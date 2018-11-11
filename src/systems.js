Systems.render = function() {
	Game.display.clear();

	_.each(Game.map, (tile, key) => {
		var pos = Game.keyToPos(key);
		Game.display.draw(pos.x, pos.y, tile.glyph, tile.color);
	});

	var enemyHpY = 4;

	_(Game.entities)
	.filter(e => e.components.apperance && e.components.position)
	.each(e => {
		Game.display.draw(
			e.components.position.x,
			e.components.position.y,
			e.components.apperance.glyph,
			e.components.apperance.color
		);

		if (e.components.player) {
			Game.display.drawText(81, 1, "Player");
			Game.display.drawText(81, 2, "HP: " + e.components.health.value);
		}

		if (e.components.enemy) {
			Game.display.drawText(81, enemyHpY, "Enemy");
			Game.display.drawText(81, enemyHpY + 1, "  HP: " + e.components.health.value);
			enemyHpY += 3;
		}
	});


}
