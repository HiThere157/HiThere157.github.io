const settings = {};
function setDefaultSettings() {
  settings.particleCount = 250;
  settings.mouseRadius = 200;
  settings.connectedRadius = 130;
  settings.velocityBias = { x: 0, y: 0 };
}
setDefaultSettings();

class Particle {
  static particles = [];
  static generateParticles() {
    Particle.particles = [];
    for (let i = 0; i < settings.particleCount; i++) {
      Particle.particles.push(new Particle(Math.random() * windowWidth, Math.random() * windowHeight));
    }
  }

  static particlesInRadius(x, y, radius2) {
    return Particle.particles.filter(particle => {
      const distance = Math.pow(particle.x - x, 2) + Math.pow(particle.y - y, 2);
      return distance < radius2;
    });
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;

    this.velocity = {
      x: Math.random() * 4 - 1,
      y: Math.random() * 4 - 1
    };
  }

  update() {
    this.x += this.velocity.x + settings.velocityBias.x;
    this.y += this.velocity.y + settings.velocityBias.y;

    if (this.x > windowWidth) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = windowWidth;
    }

    if (this.y > windowHeight) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = windowHeight;
    }

    var dx_mouse = this.x - mouseX;
    var dy_mouse = this.y - mouseY;
    var distance = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

    var mouseFactor = Math.min(
      Math.max((1 / settings.mouseRadius) * (-1 * Math.pow(distance / settings.mouseRadius, 2) + 1) * settings.mouseRadius * 100, 0), 50
    );

    this.x += dx_mouse / distance * mouseFactor;
    this.y += dy_mouse / distance * mouseFactor;

    //connect particles in radius
    Particle.particlesInRadius(this.x, this.y, settings.connectedRadius * settings.connectedRadius).forEach(particle => {
      line(this.x, this.y, particle.x, particle.y);
    });

  }

  draw() {
    circle(this.x, this.y, this.radius);
  }
}

function initOverlay() {
  const pane = new Tweakpane.Pane();

  const general = pane.addFolder({ title: "Particle Settings" });
  general.addInput(settings, "particleCount", { min: 0, max: 500, step: 1, label: "Count" }).on("change", Particle.generateParticles);
  general.addInput(settings, "mouseRadius", { min: 100, max: 500, step: 1, label: "Mouse Radius" });
  general.addInput(settings, "connectedRadius", { min: 50, max: 300, step: 1, label: "Lines Radius" });
  general.addInput(settings, "velocityBias", { label: "Velocity Bias" });
  general.addButton({ title: "Reset" }).on("click", () => {
    setDefaultSettings();
    pane.refresh();
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  Particle.generateParticles();
  initOverlay();
  stroke(255);
  strokeWeight(.1);
}

function draw() {
  background(0);

  Particle.particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}