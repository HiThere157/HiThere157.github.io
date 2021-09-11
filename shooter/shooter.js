class _Shooter {
  constructor(x, y, h, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = 0;

    this.vx = 0;
    this.vy = 0;

    this.v = 0;
    this.maxV = 15;
    this.a = 0;

    this.wh = window.innerHeight;
    this.ww = window.innerWidth;

    this.particles = [];
    this.lastShot = 0;

    this.popupOpen = false;
    this.score = 0;

    this.shooterElem = document.createElement("div");
    this.shooterElem.style = `width: 0; height: 0; border-style: solid; border-width: 0 ${this.w / 2}px ${this.h}px ${this.w / 2}px; border-color: transparent transparent #007bff transparent;; position: absolute; z-index: 999;`
    this.shooterElem.setAttribute("name", "_shooter");

    this.popupElem = document.createElement("div");
    this.popupElem.style = "background-color: #cececeaa; position: absolute; top: 0; left: 50%; transform: translate(-50%, 0); margin: 5px; padding: 10px; align-items: center; border-radius: 20px; font-size: x-large; text-align: center"
    this.popupElem.setAttribute("name", "_shooter");
    this.popupElem.innerText = "Bomb is ready! Press F to Fire!"
    this.popupElem.style.display = "none";

    document.getElementsByTagName("html")[0].style.overflow = "hidden";
    document.body.appendChild(this.shooterElem);
    document.body.appendChild(this.popupElem);
  }

  updatePos() {
    this.v += this.a

    //max velocity
    if (this.v > this.maxV) {
      this.v = this.maxV;
    }
    if (this.v < -this.maxV) {
      this.v = -this.maxV;
    }

    //drag
    this.v -= this.v * 0.03
    this.a *= 0.5;

    this.vx = -1 * Math.sin(this.r * Math.PI / 180) * this.v;
    this.vy = Math.cos(this.r * Math.PI / 180) * this.v;
    this.x += this.vx;
    this.y += this.vy;

    //overflow detection
    if (this.x > this.ww) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = this.ww;
    }
    if (this.y > this.wh) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = this.wh;
    }

    this.shooterElem.style.left = (this.x - this.w * 0.5) + "px";
    this.shooterElem.style.top = (this.y - this.h * 0.5) + "px";
    this.shooterElem.style.transform = "rotate(" + this.r + "deg)";
  }

  shoot() {
    this.particles.push(new Particle(this.x, this.y, this.r, 6, 10, 0, 20, true, "#F00"));
  }

  explode(x, y, n) {
    let colors = ["#bb0e0e", "#e99d11", "#d4b60d", "#c03737"];
    for (let i = 0; i < n; i++) {
      _shooter.particles.push(new Particle(x, y, Math.random() * 360, Math.random() * 4 + 2, 0, 0.05 + Math.random() * 0.05, 15, false, colors[parseInt(Math.random() * 4)]));
    }
  }

  isDestroyable(element) {
    return (element != null && element.getAttribute("name") != "_shooter" && element.childElementCount == 0 || element != null && element.tagName == "SELECT");
  }
}

class Particle {
  constructor(x, y, r, d, ttl, dr, v, recurse, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = d;
    this.ttl = ttl;
    this.dr = dr;
    this.v = v;
    this.recurse = recurse;
    this.color = color;

    this.wh = _shooter.wh;
    this.ww = _shooter.ww;

    this.vx = 0;
    this.vy = 0;

    this.particleElem = document.createElement("div");
    this.particleElem.style = "position: absolute; z-index: 1000;"
    this.particleElem.setAttribute("name", "_shooter")
    this.particleElem.style.height = d + "px";
    this.particleElem.style.width = d + "px";
    this.particleElem.style.backgroundColor = color;
    this.particleElem.style.transform = "rotate(" + this.r + "deg)";

    document.body.appendChild(this.particleElem);
  }

  updatePos() {
    this.v -= this.v * this.dr

    this.vx = -1 * Math.sin(this.r * Math.PI / 180) * -1 * this.v;
    this.vy = Math.cos(this.r * Math.PI / 180) * -1 * this.v;
    this.x += this.vx;
    this.y += this.vy;

    //overflow detection
    if (this.x > this.ww) {
      this.x = 0;
      this.ttl -= 1;
    } else if (this.x < 0) {
      this.x = this.ww;
      this.ttl -= 1;
    }
    if (this.y > this.wh) {
      this.y = 0;
      this.ttl -= 1;
    } else if (this.y < 0) {
      this.y = this.wh;
      this.ttl -= 1;
    }

    //time to live
    if (this.ttl < 0 || this.v < 1) {
      this.ttl = -1
      this.particleElem.remove();
    }

    this.particleElem.style.left = (this.x - this.d / 2) + "px";
    this.particleElem.style.top = (this.y - this.d / 2) + "px";
  }

  collide() {
    if (this.recurse == true) {
      let tmp = document.elementFromPoint(this.x + this.vx, this.y + this.vy);

      if (_shooter.isDestroyable(tmp)) {
        this.ttl = -1;
        tmp.remove();

        _shooter.explode(this.x, this.y, 20);
        _shooter.score += 1000;
      }
    }
  }
}

var _shooter = new _Shooter(150, 150, 40, 30);
_shooter.explode(_shooter.x, _shooter.y, 50);

function play() {
  _shooter.score += 1;

  if (_shooter.popupOpen == false && _shooter.score > 25000) {
    _shooter.popupOpen = true;
    _shooter.popupElem.style.display = "flex";
  } else if (_shooter.popupOpen == true && _shooter.score < 25000) {
    _shooter.popupOpen = false;
    _shooter.popupElem.style.display = "none";
  }

  if (keyDowns["ArrowRight"] == true) {
    _shooter.r += 6;
  }
  if (keyDowns["ArrowLeft"] == true) {
    _shooter.r += -6;
  }
  if (keyDowns["ArrowUp"] == true) {
    _shooter.a = -1.5;
  }
  if (keyDowns["ArrowDown"] == true) {
    _shooter.a = 1.5;
  }
  if (keyDowns[" "] == true) {
    let time = new Date();
    if (time.getTime() - _shooter.lastShot > 200) {
      _shooter.lastShot = time.getTime();
      _shooter.shoot();
    }
  }

  if (keyDowns["f"] == true) {
    if (_shooter.score > 25000) {
      _shooter.score -= 25000;
      for (let i = 0; i < 10; i++) {
        _shooter.explode(parseInt(Math.random() * _shooter.ww), parseInt(Math.random() * _shooter.wh), 15);
      }
    }
  }

  _shooter.updatePos();

  for (let i = 0; i < _shooter.particles.length; i++) {
    if (_shooter.particles[i].ttl < 0) {
      _shooter.particles.splice(i, 1);
    } else {
      _shooter.particles[i].collide();
      _shooter.particles[i].updatePos();
    }
  }
}

setInterval(play, 20);

var keyDowns = {};
function _keyDown(event) {
  keyDowns[event.key] = true;
}
function _keyUp(event) {
  delete keyDowns[event.key];
}
window.addEventListener("keydown", _keyDown);
window.addEventListener("keyup", _keyUp);


window.addEventListener("onload", function () {  })