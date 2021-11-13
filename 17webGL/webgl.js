document.body.onload = init;
var settings;

var modelSettings = {
  "castle": { cam: [-30, 50, 60], scale: [0.5, 0.5, 0.5], pos: [0, -20, 0], shadowD: 100, selfShadow: true, fog: true, zoom: [10, 400], credits: '"stylised sky player home dioroma" (<u>https://skfb.ly/P6nF</u>) by Sander Vander Meiren is licensed under Creative Commons Attribution (<u>http://creativecommons.org/licenses/by/4.0/</u>).' },
  "gun": { cam: [-20, 15, 120], scale: [0.15, 0.15, 0.15], pos: [0, -50, 0], shadowD: 300, selfShadow: false, fog: false, zoom: [20, 400], credits: '"RAINIER AK - 3D" (<u>https://skfb.ly/6ynGy</u>) by skartemka is licensed under Creative Commons Attribution-NonCommercial (<u>http://creativecommons.org/licenses/by-nc/4.0/</u>).' }
}

var sceneSettings = {
  backgroundColor: 0x2785c4,
  backgroundIntensity: 0.5,
  ambientIntensity: 0.4,
  lightIntensity: 0.9,
  lightPos: [-70, 200, 250]
}

var modelName = window.location.search.substr(1) || "castle";

function init() {
  if (modelSettings[modelName] == undefined) {
    return 0;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);
  const gltfLoader = new THREE.GLTFLoader();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(sceneSettings.backgroundColor, sceneSettings.backgroundIntensity);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  //load gltf model
  gltfLoader.load("assets/" + modelName + "/scene.gltf", function (gltf) {
    document.getElementById("credits").innerHTML = modelSettings[modelName].credits;
    model = gltf.scene;
    model.scale.set(...modelSettings[modelName].scale);
    model.position.set(...modelSettings[modelName].pos);

    if (modelSettings[modelName].selfShadow) {
      model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
    }

    scene.add(gltf.scene);
  });

  //add lights
  const light = getDLight(...sceneSettings.lightPos, modelSettings[modelName].shadowD);
  scene.add(light);
  const Alight = getALight(sceneSettings.ambientIntensity);
  scene.add(Alight);
  if (modelSettings[modelName].fog) { scene.fog = new THREE.Fog(sceneSettings.backgroundColor) }

  //set camera
  camera.position.set(...modelSettings[modelName].cam);
  camera.lookAt(0, 0, 0);

  //add helpers
  const shadowHelper = new THREE.CameraHelper(light.shadow.camera);
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(shadowHelper);
  scene.add(axesHelper);
  axesHelper.visible = false;
  shadowHelper.name = "shadowHelper";
  axesHelper.name = "axesHelper";

  //GUI
  const gui = new dat.GUI();
  settings = {
    helperShadowVis: true,
    helperAxesVis: false,
    res: reset = () => {
      light.position.set(...sceneSettings.lightPos);
      light.intensity = sceneSettings.lightIntensity;
    },
    hS: helpShadow = () => {
      this.helperShadowVis = !this.helperShadowVis;
      scene.getObjectByName("shadowHelper").visible = this.helperShadowVis;
    },
    hA: helpAxes = () => {
      this.helperAxesVis = !this.helperAxesVis;
      scene.getObjectByName("axesHelper").visible = this.helperAxesVis;
    },
    printCam: printCamPos = () => {
      alert([...camera.position].map(val => { return Number(val.toFixed(3)) }).join(", "));
    }
  }
  const lightFolder = gui.addFolder("Light");
  lightFolder.add(light.position, "x", -500, 500).listen();
  lightFolder.add(light.position, "y", -500, 500).listen();
  lightFolder.add(light.position, "z", -500, 500).listen();
  lightFolder.add(light, "intensity", 0, 1).listen();
  lightFolder.add(settings, "res").name("Reset");
  lightFolder.open();

  const AlightFolder = gui.addFolder("Ambient Light");
  AlightFolder.add(Alight, "intensity", 0, 1)
  AlightFolder.open()

  const helperFolder = gui.addFolder("Helpers");
  helperFolder.add(settings, "hS").name("Toogle Shadow Helper")
  helperFolder.add(settings, "hA").name("Toogle Axes Helper")

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(settings, "printCam").name("Print Camera Position");

  //rederer & controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  [controls.minDistance, controls.maxDistance] = modelSettings[modelName].zoom;
  const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}