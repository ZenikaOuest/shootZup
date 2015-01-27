function Physics() {
	
	this.canvasWidth = 480;
	this.canvasHeight = 640;
	
	this.moveSize = 10;
	
	// Positions du vaisseau.
	this.x = 200;
	this.y = 600;
}

Physics.prototype.canMoveLeft = function(spaceship) {
	return this.x >= 0 + this.moveSize + (spaceship.animationFrameWidth/2);
}

Physics.prototype.canMoveRight = function(spaceship) {
	return this.x <= this.canvasWidth - this.moveSize - (spaceship.animationFrameWidth/2);
}

Physics.prototype.canMoveUp = function(spaceship) {
	return this.y >= 0 + this.moveSize + (spaceship.animationFrameHeight/2);
}

Physics.prototype.canMoveDown = function(spaceship) {
	return this.y <= this.canvasHeight - this.moveSize - (spaceship.animationFrameHeight/2);
}

Physics.prototype.detectCollisionOnEnnemies = function(ennemies, playersLasers, exploding) {
	
	var ennemiesToDelete = [];
	var lasersToDelete = [];
	var score = 0;
	
	for (var i in ennemies) {
		var ennemy = ennemies[i];
		var minX = ennemy.x - ennemy.animationFrameWidth/2;
		var maxX = ennemy.x + ennemy.animationFrameWidth/2;
		var minY = ennemy.y - ennemy.animationFrameHeight/2;
		var maxY = ennemy.y + ennemy.animationFrameHeight/2;
		
		for (var j=0; j<playersLasers.length; j++) {
			var laser = playersLasers[j];
			var laserMinX = laser.x;
			var laserMaxX = laser.x + laser.frameWidth;
			var laserMinY = laser.y - laser.frameHeight;
			var laserMaxY = laser.y;
			
			// collisions basées sur boites englobantes
			if (minX < laserMaxX &&
				maxX > laserMinX &&
				minY < laserMaxY &&
				maxY > laserMinY) {
					
				ennemy.life--;
				if (ennemy.life <= 0 && ennemiesToDelete.indexOf(ennemy) == -1) {
					// Pour éviter de supprimer 2 fois le même (2 lasers peuvent être en même temps en collision sur un vaisseau)
					ennemiesToDelete.push(ennemy);
				}
				
				lasersToDelete.push(laser);
			}
		}
		
		for (var i=0; i<lasersToDelete.length; i++) {
			var laserIndex = playersLasers.indexOf(lasersToDelete[i]);
			playersLasers.splice(laserIndex, 1);
		}	
	}
	
	for (var i=0; i<ennemiesToDelete.length; i++) {
		delete ennemies[ennemiesToDelete[i].id];
		score += 10;
		
		var explosion = new Explosion(ennemiesToDelete[i].x, ennemiesToDelete[i].y);
		exploding.push(explosion);
		explosion.startOnce(explosion.BOOM, function() {
			exploding.splice(exploding.indexOf(explosion), 1);
		});
	}	
	
	return score;
}