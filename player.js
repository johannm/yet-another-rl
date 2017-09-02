var Player = function(x, y) {
	this._x = x;
	this._y = y;
	this._bullets = 6;
}

Player.prototype.getX = function() { return this._x; }

Player.prototype.getY = function() { return this._y; }

Player.prototype._draw = function() {
	Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.act = function() {
	Game.engine.lock();
	// wait for user input; do stuff when user hits a key
	window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
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

		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
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
	var newX = this._x + diff[0];
	var newY = this._y + diff[1];

	if (Game.map[newX + "," + newY] !== ".") return;

	// Perform player move
	Game.display.draw(this._x, this._y, Game.map[this._x + "," + this._y]);
	this._x = newX;
	this._y = newY;
	this._draw();
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}