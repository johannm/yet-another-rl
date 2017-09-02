var Game = {
	display: null,
	map: {},
	freeCells: [],
	player: null,
	enemy: null,
	engine: null,

	init: function() {
		this.display = new ROT.Display();
		document.body.appendChild(this.display.getContainer());

		this._generateMap();
		this.player = this._generateBeing(Player, this.freeCells);
		this.enemy = this._generateBeing(Enemy, this.freeCells);
		this._drawMap();
		this.player._draw();
		this.enemy._draw();

		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this.player, true);
		scheduler.add(this.enemy, true);
		this.engine = new ROT.Engine(scheduler);
		this.engine.start();
		
	},

	_generateMap: function() {
		var digger = new ROT.Map.Digger();
		

		var digCallback = function(x, y, wall) {
			var key = x + "," + y;
			if (wall)
				this.map[key] = "#";
			else {
				this.map[key] = ".";
				this.freeCells.push(key);
			}
		}
		digger.create(digCallback.bind(this));
	},

	_drawMap: function() {
		for(var key in this.map) {
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this.display.draw(x, y, this.map[key]);
		}
	},

	_generateBeing: function(what, freeCells) {
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var x = parseInt(key.split(",")[0]);
		var y = parseInt(key.split(",")[1]);
		return new what(x, y);
	},

	dist(x1, y1, x2, y2) {
		var a = x2 - x1;
		var b = y2 - y1;
		return Math.sqrt(a * a + b * b);
	}
};

Game.init();