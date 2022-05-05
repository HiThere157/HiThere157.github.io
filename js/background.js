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

    Particle.particles.forEach(particle => {
      if(Math.pow(particle.x - this.x, 2) + Math.pow(particle.y - this.y, 2) < 27500){
        Particle.context.beginPath();
        Particle.context.moveTo(this.x, this.y);
        Particle.context.lineTo(particle.x, particle.y);
  
        // let opacity = 4 - (distance2 / (27500 / 4));
        // Particle.context.globalAlpha = opacity;
        Particle.context.stroke();
      }
    });

    // Particle.context.globalAlpha = 1;

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
