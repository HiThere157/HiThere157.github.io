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

function getPLight(x, y, z) {
  var light = new THREE.PointLight(0xffffff, 0.75, 0, 2);
  light.position.set(x, y, z);
  light.castShadow = true;

  return light;
}

function getDLight(x, y, z, d) {
  var light = new THREE.DirectionalLight(0xffffff, sceneSettings.lightIntensity);
  light.position.set(x, y, z);
  light.castShadow = true;

  light.shadow.camera.left = - d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = - d;
  light.shadow.bias = -0.001

  light.shadow.mapSize.width = 1024 * 2 * 2;
  light.shadow.mapSize.height = 1024 * 2 * 2;

  return light;
}

function getALight(intensity) {
  return new THREE.AmbientLight(0x505050, intensity);
}