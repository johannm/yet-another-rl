Systems.getInput = function() {
	Game.engine.lock();
	// wait for user input; do stuff when user hits a key
	window.addEventListener("keydown", Systems.handleInput);
}

Systems.handleInput = function(event) {
	var code = event.keyCode;

	if (code === ROT.VK_PERIOD) {
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
	}

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

	// Don't walk into walls
	if (Game.map[newX + "," + newY].glyph === "#") return;

	var collides = _.filter(Game.entities, e => 
		e.components.position.x === newX 
			&& e.components.position.y === newY 
			&& e.components.collides);

	if (_.isEmpty(collides)) {
		// Perform player move
		Game.entities[Game.playerId].components.position.x = newX;
		Game.entities[Game.playerId].components.position.y = newY;	
	} else {
		var enemy = _.find(collides, e => e.components.enemy);
		if (enemy) {
			var hp = Game.entities[enemy.id].components.health.value--;
			console.log("player hits", enemy);
			console.log("enemy health", hp);
			if (hp < 1) {
				console.log("enemy killed");
				delete Game.entities[enemy.id];
			}
		}
	}

	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Systems.playerAttack = function(e) {
	var code = e.keyCode;
	
	if (code === ROT.VK_SPACE) {
		this._bullets -= 1;
		if (this._bullets >= 0) {
			Game.display.drawText(1, 24, "%c{green}Bang! " + this._bullets + " bullets left.");
			var percent = ROT.RNG.getPercentage();
			var dist = Math.hypot(this.getX() - Game.enemy.getX(), this.getY() - Game.enemy.getY());
			if ( percent < 80 / dist ) {
				Game.engine.lock();
				alert("You won!");
			}
		}
		else
			Game.display.drawText(1, 24, "%c{red}Click...");
	}
}
