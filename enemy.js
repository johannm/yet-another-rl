var Enemy = function(x, y) {
	this._x = x;
	this._y = y;
}

Enemy.prototype.getX = function() { return this._x; }

Enemy.prototype.getY = function() { return this._y; }

Enemy.prototype._draw = function() {
	Game.display.draw(this._x, this._y, "g", "red");
}

Enemy.prototype.act = function() {
	var targetX = Game.player.getX();
	var targetY = Game.player.getY();
	var passableCallback = function(x, y) {
		return Game.map[x + "," + y] === ".";
	}
	var astar = new ROT.Path.AStar(targetX, targetY, passableCallback, {topology:8});

	var path = [];
	var pathCallback = function(x, y) {
		path.push([x, y]);
	}
	astar.compute(this._x, this._y, pathCallback);

	if (path.length < 3) {
		Game.engine.lock();
		alert("Game Over");
	} else {
		var newX, newY;
		[newX, newY] = path[1];
		Game.display.draw(this._x, this._y, Game.map[this._x + "," + this._y]);
		this._x = newX;
		this._y = newY;
		this._draw();
	}
}