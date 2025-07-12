console.log('🚀 Starting Simple WebXR Viewer...');

// Import Three.js and modules using import map
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

console.log('✅ All modules loaded');

// Scene setup
const scene = new THREE.Scene();
console.log('✅ Scene created');

// Camera setup
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);
console.log('✅ Camera created');

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
console.log('✅ Renderer created');

// Remove existing loading indicator
const existingLoading = document.getElementById('loading');
if (existingLoading) {
  existingLoading.style.display = 'none';
}

// Add basic lighting first
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);
console.log('✅ Basic lighting added');

// Add a simple cube as fallback
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);
cube.castShadow = true;
scene.add(cube);
console.log('✅ Fallback cube added');

// VR and AR buttons
try {
  const vrButton = VRButton.createButton(renderer);
  vrButton.style.position = 'absolute';
  vrButton.style.top = '20px';
  vrButton.style.left = '20px';
  document.body.appendChild(vrButton);

  const arButton = ARButton.createButton(renderer, { 
    requiredFeatures: ['hit-test']
  });
  arButton.style.position = 'absolute';
  arButton.style.top = '20px';
  arButton.style.left = '120px';
  document.body.appendChild(arButton);
  console.log('✅ WebXR buttons added');
} catch (error) {
  console.warn('WebXR buttons not available:', error);
}

// Controls (fallback for desktop)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10;
controls.minDistance = 1;
controls.update();
console.log('✅ Controls added');

// Add ground plane
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x808080,
  transparent: true,
  opacity: 0.3
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
console.log('✅ Ground plane added');

// Try to load HDRI
const rgbeLoader = new RGBELoader();
rgbeLoader.setPath('assets/env/');

rgbeLoader.load(
  'studio_small_09_1k.hdr', 
  function (texture) {
    console.log('✅ HDRI loaded successfully');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
    loadModel();
  },
  function (progress) {
    console.log('HDRI loading progress:', (progress.loaded / progress.total * 100) + '%');
  },
  function (error) {
    console.warn('HDRI loading failed, using fallback lighting:', error);
    loadModel();
  }
);

function loadModel() {
  const loader = new GLTFLoader();
  
  loader.load(
    'assets/models/DamagedHelmet.glb', 
    function (gltf) {
      console.log('✅ Model loaded successfully');
      const model = gltf.scene;
      model.position.set(0, 1.4, 0);
      model.scale.setScalar(1);
      
      // Enable shadows for all meshes
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          
          // Enhance PBR materials
          if (node.material) {
            node.material.envMapIntensity = 1.0;
            node.material.needsUpdate = true;
          }
        }
      });
      
      scene.add(model);
      
      // Remove the fallback cube
      scene.remove(cube);
      
      console.log('✅ Scene ready!');
    },
    function (progress) {
      console.log('Model loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    function (error) {
      console.error('Error loading model:', error);
      console.log('Using fallback cube');
    }
  );
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start animation
animate();
console.log('✅ Animation started');

// Add info panel
const infoDiv = document.createElement('div');
infoDiv.style.cssText = `
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  z-index: 1000;
`;
infoDiv.innerHTML = `
  <div>WebXR Photorealistic Viewer</div>
  <div>Desktop: Orbit with mouse</div>
  <div>VR: Use VR button</div>
  <div>AR: Use AR button (Android)</div>
`;
document.body.appendChild(infoDiv);

console.log('🚀 WebXR Photorealistic Viewer initialized'); 