var Game = {

	display: null,
	engine: null,
	map: {},
	floor: [],	
	entities: {},
	playerId: null,

	init: function() {
		this.display = new ROT.Display();
		document.body.appendChild(this.display.getContainer());

		this._generateMap();

		var player = this._generatePlayer()
		this.entities[player.id] = player;
		this.playerId = player.id;
		var enemy = this._generateEnemy()
		this.entities[enemy.id] = enemy;
		
		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add({act: Systems.render}, true);
		scheduler.add({act: Systems.getInput}, true);
		scheduler.add({act: Systems.processEnemy}, true);
		
		this.engine = new ROT.Engine(scheduler);
		this.engine.start();
		Systems.render();
	},

	getPlayer: function() {
		return this.entities[this.playerId];
	},

	_generateMap: function() {
		var digger = new ROT.Map.Digger();
		
		var digCallback = (x, y, wall) => {
			var key = x + "," + y;
			if (wall) {
				this.map[key] = {glyph: "#", color: "#aaa"};
			}
			else {
				this.map[key] = {glyph: ".", color: "#fff"};
				this.floor.push(key);
			}
		}
		digger.create(digCallback.bind(this));
	},

	_generatePlayer: function() {
		var key = this.getRandomFreeCell();

		var entity = new Game.Entity();
		entity.addComponent(new Components.Apperance({glyph: "@", color: "#ff0"}));
		entity.addComponent(new Components.Position(this.keyToPos(key)));
		entity.addComponent(new Components.Collides);
		entity.addComponent(new Components.Player);
		entity.addComponent(new Components.Health(20));

		return entity;
	},

	_generateEnemy: function() {
		var key = this.getRandomFreeCell();

		var entity = new Game.Entity();
		entity.addComponent(new Components.Apperance({glyph: "g", color: "#f00"}));
		entity.addComponent(new Components.Position(this.keyToPos(key)));
		entity.addComponent(new Components.Collides);
		entity.addComponent(new Components.Enemy);
		entity.addComponent(new Components.Health(5));

		return entity;
	},

	getRandomFreeCell: function() {		
		do {
			var key = _.sample(this.floor);
		} while (
			!_.isEmpty(_.filter(Game.entities, e => {
				e.components.collides
				&& e.components.position === this.keyToPos(key);
			})));
		return key;
	},

	keyToPos: function(key) {
		return {x: parseInt(key.split(",")[0]), y: parseInt(key.split(",")[1])}
	}
};