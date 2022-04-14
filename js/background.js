class Particle {
  static canvas = document.getElementById("canvas");
  static context = Particle.canvas.getContext("2d");
  static intervalId;
  static init() {
    Particle.canvas.width = window.innerWidth;
    Particle.canvas.height = window.innerHeight;

    setTimeout(() => {
      Particle.canvas.classList.toggle("fadeIn", true);
    }, 0);

    Particle.context.strokeStyle = "#fff";
    Particle.context.lineWidth = .1;
    Particle.context.fillStyle = "#fff";

    const draw = () => {
      Particle.context.clearRect(0, 0, canvas.width, canvas.height);
      Particle.particles.forEach(particle => {
        particle.update();
      });
    };

    if (Particle.intervalId) {
      clearInterval(Particle.intervalId);
    }

    Particle.intervalId = setInterval(draw, 33);
    Particle.generateParticles(Math.floor(window.innerHeight * window.innerWidth * (100 / (1057 * 1920))));
  }

  static particles = [];
  static generateParticles(n) {
    Particle.particles = [];
    for (let i = 0; i < n; i++) {
      Particle.particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  }

  static particlesInRadius(x, y, radius2) {
    return Particle.particles.filter(particle => {
      const distance2 = Math.pow(particle.x - x, 2) + Math.pow(particle.y - y, 2);
      return distance2 < radius2;
    });
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;

    this.velocity = {
      x: Math.random() * 1 - .5,
      y: Math.random() * 1 - .5
    };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x > canvas.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = canvas.width;
    }

    if (this.y > canvas.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = canvas.height;
    }

    Particle.particlesInRadius(this.x, this.y, 27500).forEach(particle => {
      Particle.context.beginPath();
      Particle.context.moveTo(this.x, this.y);
      Particle.context.lineTo(particle.x, particle.y);
      Particle.context.stroke();
    });

    Particle.context.beginPath();
    Particle.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    Particle.context.fill();
  }
}

document.onload = Particle.init();
window.onresize = () => {
  Particle.canvas.classList.toggle("fadeIn", false);
  Particle.init();
};
