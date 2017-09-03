var Game = {

	display: null,
	engine: null,
	entities: [],

	init: function() {
		this.display = new ROT.Display();
		document.body.appendChild(this.display.getContainer());

		this._generateMap();
		var playerEntity = this._generatePlayer()
		Game.entities.push(playerEntity);
		var enemyEntity = this._generateEnemy()
		Game.entities.push(enemyEntity);
		
		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add({act: Systems.render}, true);
		scheduler.add({act: Systems.getInput}, true);
		
		this.engine = new ROT.Engine(scheduler)
		this.engine.start();
	},

	_generateMap: function() {
		var digger = new ROT.Map.Digger();
		
		var digCallback = function(x, y, wall) {
			var entity = new Game.Entity();
			entity.addComponent(new Components.Position({x: x, y: y}));
			if (wall) {
				entity.addComponent(new Components.Apperance({glyph: "#", color: "#aaa"}));
				entity.addComponent(new Components.Collides());
			}
			else {
				entity.addComponent(new Components.Apperance({glyph: ".", color: "#fff"}));
			}
			this.entities.push(entity);
		}
		digger.create(digCallback.bind(this));
	},

	_generatePlayer: function() {
		var freeEntities = this.entities.filter(function(e) {
			if (typeof e.components === 'undefined') console.log("error", e);
			return !e.components.collides;
		});
		var index = Math.floor(ROT.RNG.getUniform() * freeEntities.length);
		var newPosition = freeEntities[index].components.position;

		var entity = new Game.Entity();
		entity.addComponent(new Components.Apperance({glyph: "@", color: "#ff0"}));
		entity.addComponent(new Components.Position({x: newPosition.x, y: newPosition.y}));
		entity.addComponent(new Components.Collides);
		entity.addComponent(new Components.Player);

		return entity;
	},

	_generateEnemy: function() {
		var freeEntities = this.entities.filter(function(e) {
			if (typeof e.components === 'undefined') console.log("error", e);
			return !e.components.collides;
		});
		var index = Math.floor(ROT.RNG.getUniform() * freeEntities.length);
		var newPosition = freeEntities[index].components.position;

		var entity = new Game.Entity();
		entity.addComponent(new Components.Apperance({glyph: "g", color: "#f00"}));
		entity.addComponent(new Components.Position({x: newPosition.x, y: newPosition.y}));
		entity.addComponent(new Components.Collides);

		return entity;
	},
};