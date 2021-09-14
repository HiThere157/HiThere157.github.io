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
    this.pages = 0;
    this.htmlHeight = window.getComputedStyle(document.getElementsByTagName("html")[0]).height;
    this.htmlHeight = parseInt(this.htmlHeight.substr(0, this.htmlHeight.length - 2));

    if (this.htmlHeight < this.wh) {
      this.htmlHeight = this.wh;
    }

    this.colors = ["#bb0e0e", "#e99d11", "#d4b60d", "#c03737"];
    this.particles = [];
    this.lastShot = 0;
    this.ignoreElems = ["BR", "SCRIPT", "STYLE", "TITLE", "META", "HEAD", "OPTION", "OPTGROUP", "LINK"];
    this.minSize = 5;

    this.score = 0;

    this.shooterElem = document.createElement("div");
    this.shooterElem.style = `width: 0; height: 0; border-style: solid; border-width: 0 ${this.w / 2}px ${this.h}px ${this.w / 2}px; border-color: transparent transparent #BBB transparent;; position: absolute; z-index: 10001;`
    this.shooterElem.setAttribute("name", "_shooter");

    document.getElementsByTagName("html")[0].style.overflow = "hidden";
    document.body.appendChild(this.shooterElem);
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
    if (this.y > this.wh * (this.pages + 1)) {
      if (this.y < this.htmlHeight) {
        this.pages += 1;
        window.scroll(0, this.wh * this.pages);
      } else {
        this.y = this.wh * _shooter.pages;
      }

    } else if (this.y < this.wh * this.pages) {
      this.pages -= 1;
      if (this.pages < 0) {
        this.pages = 0;
        this.y = this.wh;
      }
      window.scroll(0, this.wh * this.pages);
    }

    this.shooterElem.style.left = (this.x - this.w * 0.5) + "px";
    this.shooterElem.style.top = (this.y - this.h * 0.5) + "px";
    this.shooterElem.style.transform = "rotate(" + this.r + "deg)";
  }

  shoot() {
    this.particles.push(new Particle(this.x, this.y, this.r, 4, 5, 0, 20, true, "#F00", 5));
  }

  explode(x, y, n) {
    for (let i = 0; i < n; i++) {
      _shooter.particles.push(new Particle(x, y, Math.random() * 360, Math.random() * 4 + 2, 0, 0.05 + Math.random() * 0.05, 15, false, this.colors[parseInt(Math.random() * 4)], 2));
    }
  }

  isDestroyable(element) {
    if (element == null || this.shouldIgnoreElement(element)) {
      return false;
    }

    for (let i = 0; i < element.childNodes.length; i++) {
      let child = element.childNodes[i];

      if (child.nodeType == 1) {
        let style = window.getComputedStyle(child);
        let w = style.width;
        let h = style.height;

        w = parseInt(w.substr(0, w.length - 2));
        h = parseInt(h.substr(0, h.length - 2));

        if (this.ignoreElems.indexOf(child.tagName) == -1 && style.visibility != "hidden" && w * h != 0) {
          return false;
        }
      }
    }

    return true;
  }

  shouldIgnoreElement(element) {
    if (element.nodeType !== 1) {
      return true;
    }

    if (element == document.documentElement || element == document.body) {
      return true;
    }

    if (this.ignoreElems.indexOf(element.tagName) != -1) {
      return true;
    }

    if (element.style.visibility == "hidden" || element.style.display == "none") {
      return true;
    }

    if (element.getAttribute("name") == "_shooter") {
      return true;
    }

    return false;
  }
}

class Particle {
  constructor(x, y, r, d, ttl, dr, v, recurse, color, ex) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.w = parseInt(d);
    this.h = parseInt(d * ex);

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
    this.particleElem.style = "position: absolute; z-index: 10000;"
    this.particleElem.setAttribute("name", "_shooter")
    this.particleElem.style.height = this.h + "px";
    this.particleElem.style.width = this.w + "px";
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
    if (this.y > this.wh * (this.pages + 1)) {
      this.ttl -= 1;
    } else if (this.y < this.wh * this.pages) {
      this.ttl -= 1;
    }

    //time to live
    if (this.ttl < 0 || Math.abs(this.v) < 1 || this.y < 0 || this.y > _shooter.htmlHeight) {
      this.ttl = -1
      this.particleElem.remove();
    }

    this.particleElem.style.left = (this.x - this.w / 2) + "px";
    this.particleElem.style.top = (this.y - this.h / 2) + "px";
  }

  collide() {
    if (this.recurse == true) {
      let tmp = document.elementFromPoint(this.x + this.vx, (this.y + this.vy) - this.wh * _shooter.pages);

      if (_shooter.isDestroyable(tmp)) {
        this.ttl = -1;
        tmp.remove();

        _shooter.explode(this.x, this.y, 20);
        _shooter.score += 1000;
      }
    }
  }
}

function play() {
  _shooter.score += 1;

  if (keyDowns["ArrowRight"] == true) {
    _shooter.r = (_shooter.r + 6) % 360;
  }
  if (keyDowns["ArrowLeft"] == true) {
    _shooter.r = (_shooter.r - 6) % 360;
  }
  if (keyDowns["ArrowUp"] == true) {
    _shooter.a = -1.5;
    _shooter.particles.push(new Particle(_shooter.x + (Math.random() - 0.5) * 10, _shooter.y + (Math.random() - 0.5) * 10, _shooter.r + (Math.random() - 0.5) * 20, Math.random() * 4 + 2, 1, 0.1 + Math.random() * 0.05, -15, false, _shooter.colors[parseInt(Math.random() * 4)], 2))
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

var _shooter;
function _start() {
  if (_shooter == undefined) {
    _shooter = new _Shooter(150, 150, 40, 30);
    setInterval(play, 20);
  } else {
    _shooter.x = 150;
    _shooter.y = 150;
  }

  window.scroll(0, 0);
  _shooter.explode(_shooter.x, _shooter.y, 50);
}
_start();

var keyDowns = {};
function _keyDown(event) {
  keyDowns[event.key] = true;
}
function _keyUp(event) {
  delete keyDowns[event.key];
}
window.addEventListener("keydown", _keyDown);
window.addEventListener("keyup", _keyUp);