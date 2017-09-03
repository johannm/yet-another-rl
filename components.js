var Components = {};

Components.Health = function(value) {
	value = value || 20;
	this.value = value;
};
Components.Health.prototype.name = 'health';

Components.Position = function(params) {
	params = params || {};
	this.x = params.x || 0;
	this.y = params.y || 0;
	return this;
};
Components.Position.prototype.name = 'position';

Components.Collides = function() {
};
Components.Collides.prototype.name = 'collides';

Components.Player = function() {
};
Components.Player.prototype.name = 'player';

Components.Apperance = function(params) {
	params = params || {};
	this.glyph = params.glyph || '#';
	this.color = params.color || '#ff0';
	/*if (!this.color) {
		this.color = {
			r: 255,
			g: 255,
			w: 255
		}
	}*/
};
Components.Apperance.prototype.name = 'apperance';

