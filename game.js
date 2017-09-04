var Game = {

	display: null,
	engine: null,
	map: {},
	entities: [],
	playerIndex: null,
	freeCells: [],

	init: function() {
		this.display = new ROT.Display();
		document.body.appendChild(this.display.getContainer());

		this._generateMap();
		var playerEntity = this._generatePlayer()
		Game.entities.push(playerEntity);
		playerIndex = this.entities.findIndex(e => { return e.components.player; });

		var enemyEntity = this._generateEnemy()
		Game.entities.push(enemyEntity);
		
		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add({act: Systems.render}, true);
		scheduler.add({act: Systems.getInput}, true);
		scheduler.add({act: Systems.processEnemy}, true);
		
		this.engine = new ROT.Engine(scheduler);
		this.engine.start();
		Systems.render();
	},

	_generateMap: function() {
		var digger = new ROT.Map.Digger();
		
		var digCallback = function(x, y, wall) {
			var key = x + "," + y;
			if (wall) {
				this.map[key] = {glyph: "#", color: "#aaa"};
			}
			else {
				this.map[key] = {glyph: ".", color: "#fff"};
				this.freeCells.push(key);
			}
		}
		digger.create(digCallback.bind(this));
	},

	_generatePlayer: function() {
		var index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
		var pos = this.freeCells[index];
		this.freeCells.splice(index, 1);

		var entity = new Game.Entity();
		entity.addComponent(new Components.Apperance({glyph: "@", color: "#ff0"}));
		entity.addComponent(new Components.Position({x: parseInt(pos.split(",")[0]), y: parseInt(pos.split(",")[1])}));
		entity.addComponent(new Components.Collides);
		entity.addComponent(new Components.Player);

		return entity;
	},

	_generateEnemy: function() {
		var index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
		var pos = this.freeCells[index];
		this.freeCells.splice(index, 1);

		var entity = new Game.Entity();
		entity.addComponent(new Components.Apperance({glyph: "g", color: "#f00"}));
		entity.addComponent(new Components.Position({x: parseInt(pos.split(",")[0]), y: parseInt(pos.split(",")[1])}));
		entity.addComponent(new Components.Collides);
		entity.addComponent(new Components.Enemy);

		return entity;
	},
};