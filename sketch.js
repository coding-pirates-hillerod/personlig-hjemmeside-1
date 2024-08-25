// Daniel's Particle brush

let particles = []; // Array to store all particles
let speed = 1.9;
let connectRadius = 100;
let decelerationFactor = 0.98;
let particleLifespan = 40;
let prevMouseX, prevMouseY; // Variables to store the previous mouse position

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(0.1);

  // Initialize previous mouse positions
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function draw() {
  background(0);

  // Check if the mouse has moved
  if (mouseX !== prevMouseX || mouseY !== prevMouseY) {
    // If the mouse has moved, create a new particle
    let p = new Particle(mouseX, mouseY);
    particles.push(p);
  }

  // Update previous mouse positions
  prevMouseX = mouseX;
  prevMouseY = mouseY;

  // Loop through all particles in reverse order to update and display them
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    // Check if the particle's lifespan is over
    if (particles[i].lifespan <= 0) {
      particles.splice(i, 1); // Remove the particle from the array
    }
  }

  // Check for particles within a radius of 50 and draw lines if 3 or more are close
  checkForCloseParticles();
}

// Function to check for close particles and draw lines
function checkForCloseParticles() {
  let closeGroups = []; // Array to store groups of close particles

  // Loop through all particles to find groups of close particles
  for (let i = 0; i < particles.length; i++) {
    let closeParticles = [particles[i]]; // Start a new group with the current particle

    // Check distances to all other particles
    for (let j = 0; j < particles.length; j++) {
      if (i != j) {
        let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        if (d <= connectRadius) {
          closeParticles.push(particles[j]); // Add particle to the group if it's within radius
        }
      }
    }

    // If 3 or more particles are close, add this group to closeGroups
    if (closeParticles.length >= 3) {
      closeGroups.push(closeParticles);
    }
  }

  // Draw lines between particles in each group
  for (let group of closeGroups) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        stroke(100, 100, 255, 60);
        line(group[i].x, group[i].y, group[j].x, group[j].y);
      }
    }
  }
}

// Particle class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lifespan = particleLifespan; // Lifespan set to 40 frames

    // Generate a random speed and direction
    this.vx = random(-speed, speed); // Velocity in the x direction
    this.vy = random(-speed, speed); // Velocity in the y direction

    this.deceleration = decelerationFactor; // Deceleration factor
  }

  // Method to update position and decrease lifespan
  update() {
    this.x += this.vx; // Update x position
    this.y += this.vy; // Update y position

    // Apply deceleration to velocities
    this.vx *= this.deceleration;
    this.vy *= this.deceleration;

    this.lifespan -= 1; // Decrease lifespan
  }

  // Method to display the particle
  display() {
    stroke(0);
    point(this.x, this.y);
  }
}
