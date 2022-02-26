window.onload = initThree;
window.onresize = () => {
  ww = window.innerWidth, wh = window.innerHeight;

  renderer.setSize(ww, wh);
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
}

function copySettings(source, target) {
  Object.keys(source).forEach(key => {
    if (typeof source[key] != "object") {
      target[key] = source[key];
    }
  });
}

const settings = {
  lightPos: {
    r: 100,
    p: 0,
    z: 50,
  },

  worldGen: {
    radius: 20,
    hexShape: true,
    scale: 7
  },

  colorMap: {
    colors: { l0: "#1C3BD5", l1: "#E7C68F", l2: "#59804D", l3: "#9A9A9A", l4: "#D5D5D5", l5: "#FFFFFF" },
    waterLevel: 1,
    l1: 0.2,
    l2: 0.7,
    l3: 0.9
  },

  advColor: {
    backgroundColor: "#98b6df",
    fogEnabled: false,
    fogNear: 0,
    fogFar: 100,
  }
}

const settingsDefault = JSON.parse(JSON.stringify(settings));

class Hexagon {
  constructor(scene, x, y, size) {
    this.ix = x;
    this.iy = y;
    this.s = size;

    this.height = 1;

    this.body = new THREE.Mesh(new THREE.CylinderGeometry(this.s, this.s, 1, 6, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    this.body.material.flatShading = true;
    this.body.position.set(this.ix * this.s * Math.sqrt(3) - this.s * Math.sqrt(0.75), 0, this.iy * this.s * 2 * 0.75);

    this.body.castShadow = true;
    this.body.receiveShadow = true;

    if (this.iy % 2 == 0) {
      this.body.position.x += this.s * Math.sqrt(0.75);
    }

    scene.add(this.body);
  }

  setHeight(newHeight) {
    this.height = newHeight;
    this.body.material.color.set(mapToColor(newHeight));

    newHeight += settings.colorMap.waterLevel + 1;
    if (newHeight < 1) {
      this.body.scale.y = 0.6;
      this.body.position.y = 0.5;
    } else {
      this.body.scale.y = newHeight;
      this.body.position.y = newHeight * 0.5;
    }

  }

}

function mapToColor(height) {
  var heightPercent = (height + settings.colorMap.waterLevel) / (maxHeight + settings.colorMap.waterLevel);
  var colors = settings.colorMap.colors;

  if (heightPercent < 0) {
    return colors.l0;
  } else if (heightPercent <= settings.colorMap.l1) {
    return colors.l1;
  } else if (heightPercent <= settings.colorMap.l2) {
    return colors.l2;
  } else if (heightPercent <= settings.colorMap.l3) {
    return colors.l3;
  } else {
    return colors.l4;
  }
}

var maxHeight;
function updateAllHeights() {
  maxHeight = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      var newHeight = perlin.get(i / 7, j / 7) * settings.worldGen.scale;
      maxHeight = (maxHeight < newHeight) ? newHeight : maxHeight;
    }
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      var newHeight = perlin.get(i / 7, j / 7) * settings.worldGen.scale;
      points[i][j].setHeight(newHeight);
    }
  }
}

// https://www.redblobgames.com/grids/hexagons/
function offsetToCube(x, y) {
  var q = y
  var r = x - (y + (y & 1)) / 2
  return [q, r, -q - r];
}

var scene, camera, renderer;
var points;
function generateWorld() {
  if (points) {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points[i].length; j++) {
        var thisBody = points[i][j].body;
        thisBody.material.dispose();
        thisBody.geometry.dispose();
        scene.remove(thisBody);
      }
    }
  }

  var r = settings.worldGen.radius;
  points = [];
  for (let i = -r + 1; i < r; i++) {
    var row = [];
    for (let j = -r + 1; j < r; j++) {
      if (offsetToCube(i, j).reduce((sum, n) => sum + Math.abs(n), 0) <= settings.worldGen.radius || !settings.worldGen.hexShape) {
        row.push(new Hexagon(scene, i, j, 1));
      }
    }
    points.push(row);
  }
  updateAllHeights();

}

function initOverlay() {
  const pane = new Tweakpane.Pane();
  const tab = pane.addTab({
    pages: [
      { title: "Settings" },
      { title: "Advanced" },
    ],
  });

  const [mainTab, advancedTab] = tab.pages;

  function updateLight() {
    light.position.set(Math.sin(settings.lightPos.p) * settings.lightPos.r, settings.lightPos.z, Math.cos(settings.lightPos.p) * settings.lightPos.r);
  }

  function updateFog(nearInp, farInp) {
    scene.background = new THREE.Color(settings.advColor.backgroundColor);
    if (settings.advColor.fogEnabled) {
      scene.fog = new THREE.Fog(scene.background, settings.advColor.fogNear, settings.advColor.fogFar)
    } else {
      scene.fog = null;
    }

    if (nearInp && farInp) {
      nearInp.disabled = !settings.advColor.fogEnabled;
      farInp.disabled = !settings.advColor.fogEnabled;
    }
  }

  function callAndRefresh(fun) {
    fun();
    pane.refresh();
  }

  const lightPos = mainTab.addFolder({ title: "Light Position", expanded: false });
  lightPos.addInput(settings.lightPos, "r", { min: 0, max: 100, step: 1 }).on("change", updateLight);
  lightPos.addInput(settings.lightPos, "p", { min: 0, max: Math.PI * 2, step: 0.05 }).on("change", updateLight);
  lightPos.addInput(settings.lightPos, "z", { min: 0, max: 100, step: 1 }).on("change", updateLight);
  lightPos.addButton({ title: "Reset" }).on("click", () => {
    copySettings(settingsDefault.lightPos, settings.lightPos);
    callAndRefresh(updateLight);
  });

  const worldGen = mainTab.addFolder({ title: "World Generation" });
  worldGen.addInput(settings.worldGen, "radius", { min: 3, max: 50, step: 1, label: "Radius" }).on("change", generateWorld);
  worldGen.addInput(settings.worldGen, "hexShape", { label: "Hex Shape" }).on("change", generateWorld);
  worldGen.addInput(settings.worldGen, "scale", { min: 1, max: 15, step: 1, label: "Scale" }).on("change", updateAllHeights);
  worldGen.addButton({ title: "New Seed" }).on("click", () => { perlin.seed(); updateAllHeights(); });
  worldGen.addButton({ title: "Reset" }).on("click", () => {
    copySettings(settingsDefault.worldGen, settings.worldGen);
    callAndRefresh(generateWorld);
  });

  const colorMap = mainTab.addFolder({ title: "Color Mapping" });
  colorMap.addInput(settings.colorMap, "waterLevel", { min: -2, max: 5, step: 1, label: "Water Level" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap.colors, "l0", { label: "Water Color" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap, "l1", { min: 0, max: 1, step: 0.05, label: "Layer 1" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap, "l2", { min: 0, max: 1, step: 0.05, label: "Layer 2" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap, "l3", { min: 0, max: 1, step: 0.05, label: "Layer 3" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap.colors, "l1", { label: "L1 Color" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap.colors, "l2", { label: "L2 Color" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap.colors, "l3", { label: "L3 Color" }).on("change", updateAllHeights);
  colorMap.addInput(settings.colorMap.colors, "l4", { label: "L4 Color" }).on("change", updateAllHeights);
  colorMap.addButton({ title: "Reset" }).on("click", () => {
    copySettings(settingsDefault.colorMap, settings.colorMap);
    copySettings(settingsDefault.colorMap.colors, settings.colorMap.colors);
    callAndRefresh(updateAllHeights);
  });

  const debug = advancedTab.addFolder({ title: "Debug" });
  debug.addMonitor(scene.children, "length", { label: "Children", interval: 2000 });
  debug.addButton({ title: "Toggle Debug View" }).on("click", () => {
    helpers.forEach(helper => {
      helper.visible = !helper.visible;
    });
  });

  const advColor = advancedTab.addFolder({ title: "Color" });
  advColor.addInput(settings.advColor, "backgroundColor", { picker: "inline", expanded: true, label: "Background Color" }).on("change", updateFog);
  var fogEnable = advColor.addInput(settings.advColor, "fogEnabled", { label: "Enable Fog" });
  var nearInp = advColor.addInput(settings.advColor, "fogNear", { min: 0, max: 100, step: 1, disabled: true, label: "Fog Near" }).on("change", updateFog);
  var farInp = advColor.addInput(settings.advColor, "fogFar", { min: 0, max: 250, step: 1, disabled: true, label: "For Far" }).on("change", updateFog);
  advColor.addButton({ title: "Reset" }).on("click", () => {
    copySettings(settingsDefault.advColor, settings.advColor);
    callAndRefresh(updateFog);
  });

  fogEnable.on("change", () => { updateFog(nearInp, farInp) });
}

var light;
const helpers = [];
function initThree() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(10, 5, 4);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(settings.advColor.backgroundColor);

  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.shadow.mapSize.width = light.shadow.mapSize.height = 512 * 32;
  light.shadow.camera.left = light.shadow.camera.bottom = -128;
  light.shadow.camera.right = light.shadow.camera.top = 128;
  light.position.set(Math.sin(settings.lightPos.p) * settings.lightPos.r, settings.lightPos.z, Math.cos(settings.lightPos.p) * settings.lightPos.r);
  light.castShadow = true;
  scene.add(light);

  helpers.push(new THREE.CameraHelper(light.shadow.camera), new THREE.AxesHelper(100));
  helpers.forEach(helper => { helper.visible = false });
  scene.add(...helpers);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  generateWorld();
  initOverlay();

  new THREE.OrbitControls(camera, renderer.domElement);
  const render = () => {
    setTimeout(() => {
      requestAnimationFrame(render);
    }, 1000 / 60);
    renderer.render(scene, camera);
  }
  render();
}
