let vehicles = [];
let obstacles = [];
let stars = [];
let enemy = null;
let scores = [];
let snakeMode = false;
let followCursorSnake = false;
let gameDuration = 60; // Durée du jeu en secondes
let timeLeft;
let gameOver = false;
let gameStarted = false;
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialiser le temps restant
  timeLeft = gameDuration * 60;

  // Créer des étoiles pour l'arrière-plan
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(150, 255),
    });
  }

  let colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300"];
  let projectileColors = ["#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#FFFF00"];

  for (let i = 0; i < 5; i++) {
    vehicles.push(new Vehicle(random(width), random(height), colors[i], color(projectileColors[i])));
    scores.push(0);
  }

  for (let i = 0; i < 5; i++) {
    obstacles.push(createVector(random(width), random(height)));
  }
}

function draw() {
  if (!gameStarted) {
    displayWelcomeScreen(); // Affiche l'écran d'accueil
    return;
  }

  if (gameOver) {
    displayWinner(); // Affiche l'écran de fin avec le gagnant
    return;
  }

  // Arrière-plan animé
  background(10, 10, 30);

  // Dessiner les étoiles
  noStroke();
  stars.forEach((star) => {
    fill(star.brightness);
    ellipse(star.x, star.y, star.size);
    star.brightness += random(-5, 5);
    star.brightness = constrain(star.brightness, 150, 255);
  });

  // Afficher le temps restant
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);
  text(`Temps restant: ${(timeLeft / 60).toFixed(1)}s`, width / 2, 10);

  // Décrémenter le temps restant
  timeLeft--;
  if (timeLeft <= 0) {
    gameOver = true; // Marquer le jeu comme terminé
    return;
  }

  // Dessiner un cadre pour les scores
  fill(50, 50, 50, 200); // Fond semi-transparent
  stroke(255, 100);
  strokeWeight(2);
  rect(10, 10, 240, scores.length * 30 + 20, 15); // Rectangle avec coins arrondis

  // Empêcher les obstacles d'être dans le cadre des scores
  repositionObstacles();

  // Afficher les scores avec des couleurs correspondant aux véhicules
  textSize(16);
  noStroke();
  for (let i = 0; i < scores.length; i++) {
    fill(vehicles[i].color); // Couleur du véhicule
    textAlign(LEFT, TOP);
    text(`Véhicule ${i + 1}: ${scores[i]} points`, 20, 40 + i * 30); // Scores bien alignés
  }

  // Dessiner les obstacles
  obstacles.forEach((obstacle, index) => {
    let glow = sin(frameCount * 0.05 + index) * 100 + 150;
    fill(glow, 100, 200);
    noStroke();
    ellipse(obstacle.x, obstacle.y, 50 + cos(frameCount * 0.05 + index) * 10); // Taille animée
  });

  // Mettre à jour les véhicules
  if (snakeMode) {
    formSnake();
  } else {
    updateVehicles();
  }

  // Dessiner l'ennemi
  if (enemy) {
    drawEnemy();
  }
}


function displayWelcomeScreen() {
  background(10, 10, 35); // Couleur de fond sombre pour un effet nocturne

  // Ajouter des étoiles scintillantes en arrière-plan
  noStroke();
  stars.forEach((star) => {
    fill(star.brightness);
    ellipse(star.x, star.y, star.size);
    star.brightness += random(-5, 5);
    star.brightness = constrain(star.brightness, 150, 255);
  });

  // Texte principal
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(60);
  textStyle(BOLD);
  text("🎮 Bienvenue dans le Jeu ! 🎮", width / 2, height / 4);

  // Section des instructions avec un cadre stylisé
  let instructionsX = width / 2 - 250;
  let instructionsY = height / 2 - 100;
  let instructionsWidth = 500;
  let instructionsHeight = 300;

  fill(30, 30, 50, 200); // Fond semi-transparent
  stroke(200, 200, 255); // Bordure lumineuse
  strokeWeight(2);
  rect(instructionsX, instructionsY, instructionsWidth, instructionsHeight, 20);

  // Texte des instructions
  textAlign(LEFT, CENTER);
textSize(22);
fill(255);
noStroke();
text("Instructions :", instructionsX + 20, instructionsY + 30);

fill(200, 200, 255); // Couleur lumineuse
textSize(20);
text("- Appuyez sur 'S' : Mode Serpent 🐍", instructionsX + 20, instructionsY + 70);
text("- Appuyez sur 'R' : Mode Aléatoire 🎲", instructionsX + 20, instructionsY + 110);
text("- Appuyez sur 'C' : Suivre le Curseur 🖱️", instructionsX + 20, instructionsY + 150);
text("- Appuyez sur 'O' : Ajouter un Obstacle 🟠", instructionsX + 20, instructionsY + 190);
text("- Cliquez sur l'Écran : Faire apparaître un Ennemi 👾", instructionsX + 0, instructionsY + 230);
  // Texte pour démarrer le jeu
  textAlign(CENTER, CENTER);
  fill(255, 200, 100);
  textSize(18);
  text("Cliquez ou appuyez sur une touche pour commencer", width / 2, height - 80);

  // Animation lumineuse circulaire en bas
  let glow = sin(frameCount * 0.1) * 30 + 80;
  noStroke();
  fill(255, glow, 150, 150); // Lumière pulsante
  ellipse(width / 2, height - 50, 20 + glow * 0.3); // Animation clignotante
}


function drawStars() {
  noStroke();
  stars.forEach((star) => {
    fill(star.brightness);
    ellipse(star.x, star.y, star.size);
    star.brightness += random(-5, 5);
    star.brightness = constrain(star.brightness, 150, 255);
  });
}

function displayTime() {
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);
  text(`Temps restant: ${(timeLeft / 60).toFixed(1)}s`, width / 2, 10);
}

function displayScores() {
  // Dessiner un cadre stylisé pour les scores
  fill(50, 50, 50, 200); // Fond semi-transparent
  stroke(255, 100); // Bordure légère
  strokeWeight(2);
  rect(10, 10, 240, scores.length * 30 + 20, 15); // Rectangle avec coins arrondis

  // Afficher les scores avec les couleurs des véhicules
  textSize(16);
  textAlign(LEFT, CENTER);
  noStroke();
  for (let i = 0; i < scores.length; i++) {
    fill(vehicles[i].color); // Couleur correspondant au véhicule
    text(
      `Véhicule ${i + 1}: ${scores[i]} points`,
      20, // Marges pour aligner
      30 + i * 30
    );
  }
}


function drawObstacles() {
  obstacles.forEach((obstacle, index) => {
    let glow = sin(frameCount * 0.05 + index) * 100 + 150;
    fill(glow, 100, 200);
    noStroke();
    ellipse(obstacle.x, obstacle.y, 50 + cos(frameCount * 0.05 + index) * 10);
  });
}
function repositionObstacles() {
  obstacles.forEach((obstacle) => {
    // Vérifier si l'obstacle est dans le cadre des scores
    if (
      obstacle.x < 250 && // Si l'obstacle est dans la largeur du cadre
      obstacle.y < scores.length * 30 + 40 // Si l'obstacle est dans la hauteur du cadre
    ) {
      // Repositionner l'obstacle en dehors du cadre
      obstacle.x = random(250, width); // Déplacer à droite du cadre
      obstacle.y = random(scores.length * 30 + 40, height); // Déplacer en dessous du cadre
    }
  });
}


function displayWinner() {
  let maxScore = max(scores);
  let winnerIndex = scores.indexOf(maxScore);

  background(20, 20, 50);

  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Jeu terminé !", width / 2, height / 4);

  fill(vehicles[winnerIndex].color);
  textSize(30);
  text(`Véhicule ${winnerIndex + 1} est le gagnant !`, width / 2, height / 2);
  text(`Score: ${maxScore}`, width / 2, height /
    2 + 50);

    // Dessiner le véhicule gagnant
    push();
    translate(width / 2, height * 0.75);
    vehicles[winnerIndex].show();
    pop();
  }
  
  function updateVehicles() {
    if (followCursorSnake) {
      let spacing = 50;
  
      vehicles.forEach((vehicle, index) => {
        if (index === 0) {
          let target = createVector(mouseX, mouseY);
          let direction = p5.Vector.sub(target, vehicle.pos).setMag(vehicle.maxSpeed);
          vehicle.applyForce(direction);
        } else {
          let leader = vehicles[index - 1];
          let target = leader.pos.copy();
          let direction = p5.Vector.sub(target, vehicle.pos);
  
          if (direction.mag() > spacing) {
            direction.setMag(vehicle.maxSpeed);
            vehicle.applyForce(direction);
          } else {
            vehicle.vel.mult(0.9);
          }
        }
  
        vehicle.update(obstacles);
        vehicle.show();
        vehicle.updateProjectiles();
        vehicle.showProjectiles();
      });
    } else {
      vehicles.forEach((vehicle, index) => {
        vehicle.randomMovement();
  
        if (enemy && frameCount % 60 === 0) {
          vehicle.shoot(enemy);
        }
  
        vehicle.update(obstacles);
        vehicle.show();
        vehicle.updateProjectiles();
        vehicle.showProjectiles();
  
        vehicle.projectiles.forEach((projectile, projIndex) => {
          if (enemy && dist(projectile.pos.x, projectile.pos.y, enemy.x, enemy.y) < 20) {
            scores[index]++;
            enemy = null;
            vehicle.projectiles.splice(projIndex, 1);
          }
        });
      });
    }
  }
  
  function formSnake() {
    let spacing = 50;
  
    vehicles.forEach((vehicle, index) => {
      if (index === 0) {
        vehicle.randomMovement();
      } else {
        let leader = vehicles[index - 1];
        let target = leader.pos.copy();
        let direction = p5.Vector.sub(target, vehicle.pos);
  
        if (direction.mag() > spacing) {
          direction.setMag(vehicle.maxSpeed);
          vehicle.applyForce(direction);
        } else {
          vehicle.vel.mult(0.9);
        }
      }
  
      vehicle.update(obstacles);
      vehicle.show();
      vehicle.updateProjectiles();
      vehicle.showProjectiles();
  
      if (enemy && frameCount % 60 === 0) {
        vehicle.shoot(enemy);
      }
  
      vehicle.projectiles.forEach((projectile, projIndex) => {
        if (enemy && dist(projectile.pos.x, projectile.pos.y, enemy.x, enemy.y) < 20) {
          scores[index]++;
          enemy = null;
          vehicle.projectiles.splice(projIndex, 1);
        }
      });
    });
  }
  
  function drawEnemy() {
    push();
    translate(enemy.x, enemy.y);
  
    fill(255, 50, 50);
    noStroke();
    ellipse(0, 0, 60, 60);
  
    noFill();
    stroke(255, 50, 50, 100);
    strokeWeight(8);
    ellipse(0, 0, 80 + sin(frameCount * 0.1) * 10);
  
    fill(255);
    noStroke();
    ellipse(-15, -10, 15, 20);
    ellipse(15, -10, 15, 20);
  
    fill(0);
    ellipse(-15 + sin(frameCount * 0.2) * 2, -10, 7, 7);
    ellipse(15 + sin(frameCount * 0.2) * 2, -10, 7, 7);
  
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    arc(0, 10, 30, 20, 0, PI);
  
    stroke(0);
    strokeWeight(3);
    line(-20, -30, -40, -50);
    line(20, -30, 40, -50);
  
    stroke(255, 50, 50);
    strokeWeight(4);
    let armAngle = sin(frameCount * 0.1) * PI / 6;
    line(-30, 10, -50 + cos(armAngle) * 10, 30);
    line(30, 10, 50 - cos(armAngle) * 10, 30);
  
    pop();
  }
  function displayWinner() {
    // Identifier le véhicule gagnant
    let maxScore = max(scores);
    let winnerIndex = scores.indexOf(maxScore);
  
    // Arrière-plan pour l'écran de fin
    background(20, 20, 50);
  
    // Texte principal pour la fin du jeu
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("🎉 Jeu Terminé ! 🎉", width / 2, height / 4);
  
    // Texte pour afficher le gagnant
    fill(vehicles[winnerIndex].color);
    textSize(30);
    text(`🏆 Véhicule ${winnerIndex + 1} est le gagnant ! 🏆`, width / 2, height / 2);
    text(`Score: ${maxScore} points`, width / 2, height / 2 + 50);
  
    // Dessiner le véhicule gagnant pour plus de visuel
    push();
    translate(width / 2, height * 0.75);
    vehicles[winnerIndex].show();
    pop();
  
    
  }
  
  function keyPressed() {
    if (!gameStarted) {
      gameStarted = true; // Le jeu démarre lorsque l'utilisateur appuie sur une touche
      return;
    }
  
    // Contrôles du jeu
    if (key === 's' || key === 'S') {
      snakeMode = true;
      followCursorSnake = false;
    } else if (key === 'r' || key === 'R') {
      snakeMode = false;
      followCursorSnake = false;
    } else if (key === 'c' || key === 'C') {
      followCursorSnake = true;
      snakeMode = false;
    } else if (key === 'o' || key === 'O') {
      obstacles.push(createVector(random(width), random(height)));
    }
  }
  
  
  function mousePressed() {
    if (!gameStarted) {
      gameStarted = true; // Le jeu démarre lorsque l'utilisateur clique
    } else if (!followCursorSnake) {
      enemy = createVector(mouseX, mouseY);
    }
  }