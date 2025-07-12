console.log('🚀 Starting Simple WebXR Viewer...');

// Cache clearing functionality
function clearCache() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
        console.log('🗑️ Cleared cache:', name);
      });
    });
  }
  
  // Clear service worker cache
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🗑️ Unregistered service worker');
      });
    });
  }
  
  // Force reload with cache busting
  window.location.reload(true);
}

// Add cache clear button
const cacheButton = document.createElement('button');
cacheButton.textContent = '🗑️';
cacheButton.style.position = 'absolute';
cacheButton.style.top = '20px';
cacheButton.style.right = '80px';
cacheButton.style.width = '50px';
cacheButton.style.height = '50px';
cacheButton.style.borderRadius = '50%';
cacheButton.style.border = 'none';
cacheButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
cacheButton.style.color = '#333';
cacheButton.style.fontSize = '20px';
cacheButton.style.cursor = 'pointer';
cacheButton.style.zIndex = '1000';
cacheButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
cacheButton.style.transition = 'all 0.3s ease';

cacheButton.addEventListener('mouseenter', () => {
  cacheButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  cacheButton.style.transform = 'scale(1.1)';
});

cacheButton.addEventListener('mouseleave', () => {
  cacheButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  cacheButton.style.transform = 'scale(1)';
});

cacheButton.addEventListener('click', clearCache);
document.body.appendChild(cacheButton);
console.log('✅ Cache clear button created');

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

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Renderer setup with mobile optimizations
const renderer = new THREE.WebGLRenderer({ 
  antialias: !isMobile, // Disable antialiasing on mobile for performance
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x808080, 1); // Grey background
renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Mobile-specific optimizations
if (isMobile) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
}
document.body.appendChild(renderer.domElement);
console.log('✅ Renderer created');

// Orbit controls with mobile optimizations
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = isMobile ? 0.1 : 0.02; // Faster damping on mobile
controls.screenSpacePanning = true; // Better for mobile
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

// Lighting setup with mobile optimizations
const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.6 : 0.3);
scene.add(ambientLight);

// Simplified lighting for mobile
if (!isMobile) {
  // Additional directional light for better shadows (desktop only)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(2, 4, 2);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024; // Reduced shadow map size
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -5;
  directionalLight.shadow.camera.right = 5;
  directionalLight.shadow.camera.top = 5;
  directionalLight.shadow.camera.bottom = -5;
  scene.add(directionalLight);
}

console.log('✅ Lighting setup complete');

// Cache busting timestamp
const cacheBuster = Date.now();

// Load HDRI environment with cache busting (desktop only for performance)
if (!isMobile) {
  const rgbeLoader = new RGBELoader();
  rgbeLoader.setPath('assets/env/');

  rgbeLoader.load(
    `studio_small_09_1k.hdr?v=${cacheBuster}`, 
    function (texture) {
      console.log('✅ HDRI loaded successfully');
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      console.log('✅ HDRI environment set');
    },
    function (progress) {
      console.log('HDRI loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    function (error) {
      console.warn('HDRI loading failed:', error);
    }
  );
}

// Model loading with cache busting and mobile optimizations
const loader = new GLTFLoader();
let model;

loader.load(
  `assets/models/DamagedHelmet.glb?v=${cacheBuster}`,
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = !isMobile;
        child.receiveShadow = !isMobile;
        // Optimize materials for mobile
        if (isMobile && child.material) {
          child.material.envMapIntensity = 0.5; // Reduce reflections on mobile
        }
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
    model.castShadow = !isMobile;
    scene.add(model);
    console.log('✅ Fallback cube created');
  }
);

// Animation loop with mobile optimizations
let lastTime = 0;
const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
const frameInterval = 1000 / targetFPS;

function animate(currentTime) {
  requestAnimationFrame(animate);
  
  // Frame rate limiting for mobile
  if (isMobile && currentTime - lastTime < frameInterval) {
    return;
  }
  lastTime = currentTime;
  
  controls.update();
  
  // Disable auto-rotation on mobile for better performance
  if (model && !isMobile) {
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