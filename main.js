console.log('🚀 Starting Simple WebXR Viewer...');

// Import Three.js and modules using import map
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
renderer.setClearColor(0x421C, 1); // Off-white grey background
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
console.log('✅ Renderer created');

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI;
console.log('✅ Orbit controls created');

// Home button
const homeButton = document.createElement('button');
homeButton.textContent = '🏠';
homeButton.style.position = 'absolute';
homeButton.style.top = '20px';
homeButton.style.right = '20px';
homeButton.style.width = '50px';
homeButton.style.height = '50px';
homeButton.style.borderRadius = '50%';
homeButton.style.border = 'none';
homeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
homeButton.style.color = '#333';
homeButton.style.fontSize = '20px';
homeButton.style.cursor = 'pointer';
homeButton.style.zIndex = '1000';
homeButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
homeButton.style.transition = 'all 0.3s ease';

homeButton.addEventListener('mouseenter', () => {
  homeButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  homeButton.style.transform = 'scale(1.1)';
});

homeButton.addEventListener('mouseleave', () => {
  homeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  homeButton.style.transform = 'scale(1)';
});

homeButton.addEventListener('click', () => {
  camera.position.set(0, 1.5, 3);
  camera.lookAt(0, 0, 0);
  controls.reset();
});

document.body.appendChild(homeButton);
console.log('✅ Home button created');

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Area light from the top
const areaLight = new THREE.RectAreaLight(0xffffff, 5, 4, 4);
areaLight.position.set(0, 5, 0);
areaLight.lookAt(0, 0, 0);
scene.add(areaLight);

// Additional directional light for better shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(2, 4, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
scene.add(directionalLight);

console.log('✅ Lighting setup complete');

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
console.log('✅ Ground plane created');

// Model loading
const loader = new GLTFLoader();
let model;

loader.load(
  'assets/models/DamagedHelmet.glb',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    console.log('✅ Model loaded successfully');
  },
  (progress) => {
    console.log('Loading model...', (progress.loaded / progress.total * 100) + '%');
  },
  (error) => {
    console.error('Error loading model:', error);
    // Fallback cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    model = new THREE.Mesh(geometry, material);
    model.castShadow = true;
    scene.add(model);
    console.log('✅ Fallback cube created');
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  controls.update();
  
  if (model) {
    model.rotation.y += 0.005;
  }
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
console.log('✅ Animation loop started'); 