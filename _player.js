var Player = function() {
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
	}
}