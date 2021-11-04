document.body.onload = init;
function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const cube1 = getBox(1);
  const plane1 = getPlane(10);
  const light = getDLight(0, 10, 0, 1024);

  scene.add(cube1);
  scene.add(plane1);
  scene.add(light);

  camera.position.z = 5;
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  cube1.position.y = 2;
  cube1.castShadow = true;
  plane1.rotation.x = Math.PI / 2;
  plane1.receiveShadow = true;

  scene.add(new THREE.CameraHelper(light.shadow.camera));
  scene.add(new THREE.AxesHelper(5));
  // scene.add(new THREE.CameraHelper(camera));
  // scene.add(new THREE.DirectionalLightHelper(light, 5));

  const gui = new dat.GUI();
  const obj = {
    res: reset = () => {
      light.position.set(0, 10, 0)
    }
  }
  const lightFolder = gui.addFolder('Light');
  lightFolder.add(light.position, 'x', -15, 15).listen();
  lightFolder.add(light.position, 'y', 0, 25).listen();
  lightFolder.add(light.position, 'z', -15, 15).listen();
  lightFolder.open();

  gui.add(obj, "res").name("Reset");

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  const render = () => {
    cube1.rotation.x += 0.005;
    cube1.rotation.y += 0.005;

    // light.position.x = 15 * Math.sin(renderer.info.render.frame / 360 * Math.PI * 0.2);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}

function getBox(w, h = undefined, d = undefined) {
  var geometry = new THREE.BoxGeometry(w, h || w, d || w);
  var material = new THREE.MeshLambertMaterial({ color: 0x00ffaa });

  return new THREE.Mesh(geometry, material);
}

function getPlane(w, d = undefined) {
  var geometry = new THREE.PlaneGeometry(w, d || w);

  var material = new THREE.MeshLambertMaterial({
    color: 0x0095dd,
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(geometry, material);
}

function getDLight(x, y, z, shadowRes = 512) {
  var light = new THREE.PointLight(0xffffff, 0.75, 0, 2);
  light.position.set(x, y, z);
  light.castShadow = true;

  light.shadow.mapSize.width = shadowRes;
  light.shadow.mapSize.height = shadowRes;

  return light;
}

