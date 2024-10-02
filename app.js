// app.js

let scene, camera, renderer;
let arToolkitSource, arToolkitContext;
let markerRoot;
let model;

init();
animate();

function init() {
  // Create a scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.Camera();
  scene.add(camera);

  // Setup renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  document.body.appendChild(renderer.domElement);

  // Setup AR.js source (webcam)
  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
  });

  arToolkitSource.init(function onReady() {
    onResize();
  });

  // Handle window resize
  window.addEventListener('resize', function () {
    onResize();
  });

  // Setup AR.js context
  arToolkitContext = new THREEx.ArToolkitContext({
    detectionMode: 'mono',
    matrixCodeType: '3x3',
    canvasWidth: 80 * 3,
    canvasHeight: 60 * 3,
  });

  // Initialize AR context
  arToolkitContext.init(function () {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  // Setup marker root and NFT marker
  markerRoot = new THREE.Group();
  scene.add(markerRoot);

  // NFT marker controls for image tracking
  new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'nft',
    descriptorsUrl: 'assets/images/nft/image',
    changeMatrixMode: 'modelViewMatrix',
  });

  // Load GLB model
  let loader = new THREE.GLTFLoader();
  loader.load('assets/models/model.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    markerRoot.add(model);
  });
}

function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);

  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

function update() {
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
  }

  if (model) {
    // Optionally rotate the model
    model.rotation.y += 0.01;
  }
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}
