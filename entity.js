Game.Entity = function() {
	// Generate a pseudo random ID
	this.id = (+new Date()).toString(16) +
		(Math.random() * 100000000 | 0).toString(16) +
		Game.Entity.prototype._count;

	Game.Entity.prototype._count++;

	// Storage for the components of the entity
	this.components = {};

	return this;
};

// Keep track of no. of entities created
Game.Entity.prototype._count = 0;

Game.Entity.prototype.addComponent = function(component) {
	this.components[component.name] = component;
}

Game.Entity.prototype.removeComponent = function(componentName) {
	var name = componentName;
	if (typeof componentName === 'function') {
		name = componentName.prototype.name;
	}
	delete this.components[name];
}

Game.Entity.prototype.print = function() {
	console.log(JSON.stringify(this, null, 4));
}


