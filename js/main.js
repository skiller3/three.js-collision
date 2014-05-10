/**
* main.js
*
* Nate Beatty | May 9, 2014
*
* All of the logic for rendering graphics using ThreeJS is contained within
* this main JS file.
*/

// Define some global variables
var aspect = window.innerWidth / window.innerHeight;
var assetpath = 'shed/Shed.obj';
var isAnimating = true;

var scene, camera, renderer, controls, clock, model;

function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0025);

  camera = new THREE.PerspectiveCamera(60, aspect, 1, 10000); // FOV, Aspect, Near, Far
  camera.position.y = 55;
  scene.add(camera);

  controls = new THREE.KeyControls(camera);
  controls.movementSpeed = 100;
  controls.lookSpeed = 0.05;
  controls.invertVertical = true;
  controls.noFly = true;

  // Add meshes to the scene
  buildScene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.backgroundColor = '#D6F1FF';
  renderer.setClearColor('#D6F1FF');
  document.body.appendChild(renderer.domElement);
}

function buildScene() {
  // Build the floor
  var floor = new THREE.Mesh(
    new THREE.CubeGeometry(1000, 10, 1000),
    new THREE.MeshLambertMaterial({
      color: 0xEDCBA0
    })
  );
  scene.add(floor);

  // Import the shed
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };
  var loader = new THREE.OBJLoader(manager);
  loader.load(assetpath, function(object) {
    object.position.y = 10;
    object.position.x = 250;
    scene.add(object);
  });

  // Add the lighting
  var directionalLight1 = new THREE.DirectionalLight(0xF7EFBE, 0.7);
  directionalLight1.position.set(0.5, 1, 0.5);
  scene.add(directionalLight1);
  var directionalLight2 = new THREE.DirectionalLight(0xF7EFBE, 0.5);
  directionalLight2.position.set(-0.5, -1, -0.5);
  scene.add(directionalLight2);
}

function animate() {
  if (isAnimating) {
    requestAnimationFrame(animate);
  }
  render();
}

function render() {
  controls.updateView(clock.getDelta());

  // Repaint the scene
  renderer.render(scene, camera);
}


$(document).ready(function() {
  init();
  animate();
});
