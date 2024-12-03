class Vehicle {
  constructor(x, y, color, projectileColor) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(3); // Vitesse initiale aléatoire
    this.acc = createVector(0, 0);
    this.maxSpeed = 5; // Vitesse maximale
    this.maxForce = 1; // Force maximale
    this.r = 20; // Taille du véhicule
    this.color = color; // Couleur du corps du véhicule
    this.projectileColor = projectileColor; // Couleur des projectiles
    this.projectiles = [];
    this.angle = 0; // Rotation dynamique
  }

  // Déplacement aléatoire
  randomMovement() {
    let randomForce = p5.Vector.random2D().mult(0.1);
    this.applyForce(randomForce);
  }

  // Tir de projectile
  shoot(target) {
    let direction = p5.Vector.sub(target, this.pos).setMag(5);
    this.projectiles.push(new Projectile(this.pos.copy(), direction, this.projectileColor));
  }

  // Mise à jour des projectiles
  updateProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.update();
      return !projectile.offScreen();
    });
  }

  // Affichage des projectiles
  showProjectiles() {
    this.projectiles.forEach((projectile) => projectile.show());
  }

  // Rebonds sur les bords
  bounceOnEdges() {
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x *= -1;
      this.angle += HALF_PI / 2;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y *= -1;
      this.angle += HALF_PI / 2;
    }
  }

  // Éviter les obstacles
  avoidObstacles(obstacles) {
    obstacles.forEach((obstacle) => {
      let d = dist(this.pos.x, this.pos.y, obstacle.x, obstacle.y);
      if (d < 50) {
        let fleeForce = p5.Vector.sub(this.pos, obstacle).setMag(this.maxForce);
        this.applyForce(fleeForce);
      }
    });
  }

  // Appliquer une force au véhicule
  applyForce(force) {
    this.acc.add(force);
  }

  // Mise à jour des mouvements
  update(obstacles) {
    this.avoidObstacles(obstacles);
    this.vel.add(this.acc).limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.bounceOnEdges();
  }

  // Affichage du véhicule
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    // Corps du véhicule
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.r * 2, this.r, 5);

    // Roues
    fill(50);
    ellipse(-this.r / 1.2, -this.r / 2, this.r / 2);
    ellipse(-this.r / 1.2, this.r / 2, this.r / 2);
    ellipse(this.r / 1.2, -this.r / 2, this.r / 2);
    ellipse(this.r / 1.2, this.r / 2, this.r / 2);

    // Vitres
    fill(200, 200, 255, 150);
    rect(0, -this.r / 4, this.r * 1.2, this.r / 2);
    rect(0, this.r / 4, this.r * 1.2, this.r / 2);

    pop();
  }
}

class Projectile {
  constructor(pos, vel, color) {
    this.pos = pos;
    this.vel = vel;
    this.r = 5;
    this.color = color;
    this.trail = [];
  }

  update() {
    this.trail.push(this.pos.copy());
    if (this.trail.length > 10) {
      this.trail.shift();
    }
    this.pos.add(this.vel);
  }

  show() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    this.trail.forEach((point, index) => {
      let alpha = map(index, 0, this.trail.length, 0, 255);
      stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);
      ellipse(point.x, point.y, this.r);
    });
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  offScreen() {
    return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
  }
}
