// Daniel's Particle brush

// Rezie window
function windowResized() {
	if (fullscreen()) resizeCanvas(displayWidth, displayHeight);
	else resizeCanvas(windowWidth, windowHeight);
}
let particles = []; // Array to store all particles
let speed = 1.5
let connectRadius = 130
let acceleration = 1.03
let particleLifespan = 40;
let prevMouseX, prevMouseY; // Variables to store the previous mouse position
let drawShapes = false; // Flag to switch between drawing lines and shapes
let colorIndex = 0; // Index for color selection
let newAlpha = 100; // Desired new opacity

// Declare the colors array globally, but initialize it in setup()
let colors;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill(); // No fill initially
  prevMouseX = mouseX;
  prevMouseY = mouseY;

  // Initialize the array of 11 colors to cycle through (indexed from 0 to 10)
  colors = [
    color(255, 0, 0, 100),    // Red
    color(0, 255, 0, 100),    // Green
    color(0, 0, 255, 100),    // Blue
    color(255, 255, 0, 100),  // Yellow
    color(0, 255, 255, 100),  // Cyan
    color(255, 0, 255, 100),  // Magenta
    color(192, 192, 192, 100), // Silver
    color(255, 165, 0, 100),  // Orange
    color(75, 0, 130, 100),   // Indigo
    color(238, 130, 238, 100), // Violet
    color(255, 192, 203, 100)  // Pink
  ];
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

  // Loop through all particles in reverse order to update them
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();

    // Check if the particle's lifespan is over
    if (particles[i].lifespan <= 0) {
      particles.splice(i, 1); // Remove the particle from the array
    }
  }

  // Draw lines or shapes between particles based on the toggle flag
  if (drawShapes) {
    drawShapesBetweenParticles();
  } else {
    drawLinesBetweenParticles();
  }
}

// Function to draw lines between close particles
function drawLinesBetweenParticles() {
  let c = colors[colorIndex];
  c.setAlpha(255);
  stroke(c); // Set stroke color based on current color index
  strokeWeight(0.4);

  noFill(); // No fill for lines

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d <= connectRadius) {
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
  c.setAlpha(70); 

}

// Function to check for close particles and draw shapes
function drawShapesBetweenParticles() {
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

  // Draw shapes between particles in each group
  for (let group of closeGroups) {
    // Sort particles in the group by angle from the first particle
    group.sort((a, b) => atan2(a.y - group[0].y, a.x - group[0].x) - atan2(b.y - group[0].y, b.x - group[0].x));

    fill(colors[colorIndex]); // Set fill color based on current color index
    stroke(colors[colorIndex]); // Set stroke color for the shape

    beginShape();
    for (let particle of group) {
      vertex(particle.x, particle.y); // Add a vertex at each particle's position
    }
    endShape(CLOSE); // Close the shape to form a plane
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

    this.deceleration = acceleration; // Deceleration factor
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

  // No display method needed since particles (dots) should not be visible
}

// Function to handle key presses
function keyPressed() {
  if (key === ' ') {
    drawShapes = !drawShapes; // Toggle between drawing shapes and lines
  }

  if (key === 'c' || key === 'C') {
    colorIndex = (colorIndex + 1) % colors.length; // Cycle through colors
  }
}
