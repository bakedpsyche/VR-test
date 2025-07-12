console.log('🚀 Starting Simple WebXR Viewer...');

// Cache clearing functionality - no longer used, kept for reference

// Auto-clear cache on page load if URL has cache parameter
if (window.location.search.includes('clear-cache')) {
  console.log('🔄 Auto-clearing cache...');
  // Remove the clear-cache parameter to prevent loops
  const url = new URL(window.location);
  url.searchParams.delete('clear-cache');
  window.history.replaceState({}, '', url.toString());
  
  // Clear cache without reloading
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
        console.log('🗑️ Cleared cache:', name);
      });
    });
  }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🗑️ Unregistered service worker');
      });
    });
  }
  
  localStorage.clear();
  sessionStorage.clear();
  console.log('🗑️ Cleared local storage');
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

cacheButton.addEventListener('click', () => {
  // Show loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = '🔄 Clearing cache...';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '50%';
  loadingDiv.style.left = '50%';
  loadingDiv.style.transform = 'translate(-50%, -50%)';
  loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  loadingDiv.style.color = 'white';
  loadingDiv.style.padding = '20px';
  loadingDiv.style.borderRadius = '10px';
  loadingDiv.style.zIndex = '9999';
  loadingDiv.style.fontSize = '18px';
  document.body.appendChild(loadingDiv);

  // Clear cache without page reload
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
        console.log('🗑️ Cleared cache:', name);
      });
    });
  }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🗑️ Unregistered service worker');
      });
    });
  }
  
  localStorage.clear();
  sessionStorage.clear();
  console.log('🗑️ Cleared local storage');
  
  // Remove loading indicator and show success message
  setTimeout(() => {
    document.body.removeChild(loadingDiv);
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.textContent = '✅ Cache cleared successfully!';
    successDiv.style.position = 'fixed';
    successDiv.style.top = '50%';
    successDiv.style.left = '50%';
    successDiv.style.transform = 'translate(-50%, -50%)';
    successDiv.style.backgroundColor = 'rgba(0, 128, 0, 0.9)';
    successDiv.style.color = 'white';
    successDiv.style.padding = '20px';
    successDiv.style.borderRadius = '10px';
    successDiv.style.zIndex = '9999';
    successDiv.style.fontSize = '18px';
    document.body.appendChild(successDiv);
    
    // Remove success message after 2 seconds
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 2000);
  }, 1000);
});
document.body.appendChild(cacheButton);
console.log('✅ Cache clear button created');

// Material debug panel for PBR testing
const debugPanel = document.createElement('div');
debugPanel.style.position = 'absolute';
debugPanel.style.top = '80px';
debugPanel.style.right = '20px';
debugPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
debugPanel.style.color = 'white';
debugPanel.style.padding = '15px';
debugPanel.style.borderRadius = '10px';
debugPanel.style.fontSize = '12px';
debugPanel.style.fontFamily = 'monospace';
debugPanel.style.zIndex = '1000';
debugPanel.style.minWidth = '200px';
debugPanel.style.display = 'none'; // Hidden by default

debugPanel.innerHTML = `
  <div style="margin-bottom: 10px; font-weight: bold;">🎨 PBR Material Debug</div>
  <div style="margin-bottom: 5px;">
    <label>Metalness: <span id="metalness-value">0.0</span></label><br>
    <input type="range" id="metalness-slider" min="0" max="1" step="0.01" value="0.0" style="width: 100%;">
  </div>
  <div style="margin-bottom: 5px;">
    <label>Roughness: <span id="roughness-value">0.5</span></label><br>
    <input type="range" id="roughness-slider" min="0" max="1" step="0.01" value="0.5" style="width: 100%;">
  </div>
  <div style="margin-bottom: 5px;">
    <label>Env Intensity: <span id="env-intensity-value">1.0</span></label><br>
    <input type="range" id="env-intensity-slider" min="0" max="2" step="0.1" value="1.0" style="width: 100%;">
  </div>
  <button id="toggle-debug" style="width: 100%; margin-top: 10px; padding: 5px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Hide Debug</button>
`;

document.body.appendChild(debugPanel);

// Debug panel controls
const toggleDebug = document.getElementById('toggle-debug');
const metalnessSlider = document.getElementById('metalness-slider');
const roughnessSlider = document.getElementById('roughness-slider');
const envIntensitySlider = document.getElementById('env-intensity-slider');
const metalnessValue = document.getElementById('metalness-value');
const roughnessValue = document.getElementById('roughness-value');
const envIntensityValue = document.getElementById('env-intensity-value');

toggleDebug.addEventListener('click', () => {
  if (debugPanel.style.display === 'none') {
    debugPanel.style.display = 'block';
    toggleDebug.textContent = 'Hide Debug';
  } else {
    debugPanel.style.display = 'none';
    toggleDebug.textContent = 'Show Debug';
  }
});

// Material update function
function updateMaterials() {
  if (model) {
    model.traverse((child) => {
      if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
        child.material.metalness = parseFloat(metalnessSlider.value);
        child.material.roughness = parseFloat(roughnessSlider.value);
        child.material.envMapIntensity = parseFloat(envIntensitySlider.value);
        child.material.needsUpdate = true;
      }
    });
  }
}

// Update display values
metalnessSlider.addEventListener('input', () => {
  metalnessValue.textContent = metalnessSlider.value;
  updateMaterials();
});

roughnessSlider.addEventListener('input', () => {
  roughnessValue.textContent = roughnessSlider.value;
  updateMaterials();
});

envIntensitySlider.addEventListener('input', () => {
  envIntensityValue.textContent = envIntensitySlider.value;
  updateMaterials();
});

console.log('✅ PBR debug panel created');

// Add a visible debug button
const debugButton = document.createElement('button');
debugButton.textContent = '🎨';
debugButton.style.position = 'absolute';
debugButton.style.top = '20px';
debugButton.style.right = '140px';
debugButton.style.width = '50px';
debugButton.style.height = '50px';
debugButton.style.borderRadius = '50%';
debugButton.style.border = 'none';
debugButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
debugButton.style.color = '#333';
debugButton.style.fontSize = '20px';
debugButton.style.cursor = 'pointer';
debugButton.style.zIndex = '1000';
debugButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
debugButton.style.transition = 'all 0.3s ease';

debugButton.addEventListener('mouseenter', () => {
  debugButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  debugButton.style.transform = 'scale(1.1)';
});

debugButton.addEventListener('mouseleave', () => {
  debugButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  debugButton.style.transform = 'scale(1)';
});

debugButton.addEventListener('click', () => {
  if (debugPanel.style.display === 'none') {
    debugPanel.style.display = 'block';
  } else {
    debugPanel.style.display = 'none';
  }
});

document.body.appendChild(debugButton);
console.log('✅ PBR debug button created');

// PBR Material Presets
const pbrPresets = {
  metal: { metalness: 0.9, roughness: 0.1, envIntensity: 1.0 },
  plastic: { metalness: 0.0, roughness: 0.3, envIntensity: 0.8 },
  ceramic: { metalness: 0.0, roughness: 0.1, envIntensity: 1.2 },
  rubber: { metalness: 0.0, roughness: 0.8, envIntensity: 0.5 },
  chrome: { metalness: 1.0, roughness: 0.05, envIntensity: 1.5 },
  matte: { metalness: 0.0, roughness: 0.9, envIntensity: 0.3 }
};

// Add preset buttons to debug panel
const presetContainer = document.createElement('div');
presetContainer.style.marginTop = '10px';
presetContainer.style.borderTop = '1px solid #555';
presetContainer.style.paddingTop = '10px';

presetContainer.innerHTML = `
  <div style="margin-bottom: 5px; font-weight: bold;">Presets:</div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
    <button class="preset-btn" data-preset="metal" style="padding: 3px; font-size: 10px; background: #444; color: white; border: none; border-radius: 3px; cursor: pointer;">Metal</button>
    <button class="preset-btn" data-preset="plastic" style="padding: 3px; font-size: 10px; background: #444; color: white; border: none; border-radius: 3px; cursor: pointer;">Plastic</button>
    <button class="preset-btn" data-preset="ceramic" style="padding: 3px; font-size: 10px; background: #444; color: white; border: none; border-radius: 3px; cursor: pointer;">Ceramic</button>
    <button class="preset-btn" data-preset="rubber" style="padding: 3px; font-size: 10px; background: #444; color: white; border: none; border-radius: 3px; cursor: pointer;">Rubber</button>
    <button class="preset-btn" data-preset="chrome" style="padding: 3px; font-size: 10px; background: #444; color: white; border: none; border-radius: 3px; cursor: pointer;">Chrome</button>
    <button class="preset-btn" data-preset="matte" style="padding: 3px; font-size: 10px; background: #444; color: white; border: none; border-radius: 3px; cursor: pointer;">Matte</button>
  </div>
`;

debugPanel.appendChild(presetContainer);

// Preset button handlers
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = pbrPresets[btn.dataset.preset];
    if (preset) {
      metalnessSlider.value = preset.metalness;
      roughnessSlider.value = preset.roughness;
      envIntensitySlider.value = preset.envIntensity;
      
      metalnessValue.textContent = preset.metalness;
      roughnessValue.textContent = preset.roughness;
      envIntensityValue.textContent = preset.envIntensity;
      
      updateMaterials();
      console.log('🎨 Applied PBR preset:', btn.dataset.preset);
    }
  });
});

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

// Mobile detection with iOS support
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

// Renderer setup with mobile optimizations and PBR enhancements
const renderer = new THREE.WebGLRenderer({ 
  antialias: !isMobile, // Disable antialiasing on mobile for performance
  powerPreference: "high-performance",
  alpha: false,
  stencil: false,
  depth: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x808080, 1); // Grey background
renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; // Slightly higher exposure for PBR
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMappingWhitePoint = 1.0; // Better PBR rendering
// Mobile-specific optimizations
if (isMobile) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
  
  // iOS Safari specific optimizations
  if (isIOS && isSafari) {
    console.log('📱 iOS Safari detected - applying optimizations');
    // Reduce antialiasing for better performance on iOS
    renderer.antialias = false;
    // Lower pixel ratio for iOS devices
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }
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
const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.8 : 0.3);
scene.add(ambientLight);

// Directional light for both mobile and desktop
const directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 1.2 : 0.8);
directionalLight.position.set(2, 4, 2);
if (!isMobile) {
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -5;
  directionalLight.shadow.camera.right = 5;
  directionalLight.shadow.camera.top = 5;
  directionalLight.shadow.camera.bottom = -5;
}
scene.add(directionalLight);

// Additional fill light for mobile to ensure model is visible
if (isMobile) {
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-2, 2, -2);
  scene.add(fillLight);
  
  // Extra lighting for iOS devices
  if (isIOS) {
    console.log('📱 Adding extra lighting for iOS');
    const iosLight = new THREE.DirectionalLight(0xffffff, 0.3);
    iosLight.position.set(0, 3, 0);
    scene.add(iosLight);
  }
}

console.log('✅ Lighting setup complete');

// Cache busting timestamp - changes every time
const cacheBuster = Date.now();
const version = Math.floor(cacheBuster / 1000); // Version changes every second

// Load HDRI environment with cache busting
const rgbeLoader = new RGBELoader();
rgbeLoader.setPath('assets/env/');

rgbeLoader.load(
  `studio_small_09_1k.hdr?v=${version}`, 
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

// Model loading with cache busting and mobile optimizations
const loader = new GLTFLoader();
let model;

loader.load(
  `assets/models/DamagedHelmet.glb?v=${version}`,
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = !isMobile;
        child.receiveShadow = !isMobile;
        
        // Enhanced PBR material processing
        if (child.material) {
          console.log('🎨 Processing material:', child.material.name || 'unnamed');
          
          // Ensure we're using MeshStandardMaterial for PBR
          if (!child.material.isMeshStandardMaterial) {
            console.log('🔄 Converting to MeshStandardMaterial for PBR');
            const oldMaterial = child.material;
            child.material = new THREE.MeshStandardMaterial({
              color: oldMaterial.color || 0x808080,
              map: oldMaterial.map,
              normalMap: oldMaterial.normalMap,
              roughnessMap: oldMaterial.roughnessMap,
              metalnessMap: oldMaterial.metalnessMap,
              aoMap: oldMaterial.aoMap,
              emissiveMap: oldMaterial.emissiveMap,
              emissive: oldMaterial.emissive || 0x000000,
              emissiveIntensity: oldMaterial.emissiveIntensity || 1.0,
              transparent: oldMaterial.transparent || false,
              opacity: oldMaterial.opacity || 1.0,
              side: oldMaterial.side || THREE.FrontSide
            });
          }
          
          // Apply PBR material enhancements
          const material = child.material;
          
          // Set default PBR properties if not present
          if (material.metalness === undefined) material.metalness = 0.0;
          if (material.roughness === undefined) material.roughness = 0.5;
          if (material.envMapIntensity === undefined) material.envMapIntensity = 1.0;
          
          // Enhanced PBR settings for better realism
          material.metalness = Math.max(0, Math.min(1, material.metalness));
          material.roughness = Math.max(0, Math.min(1, material.roughness));
          material.envMapIntensity = Math.max(0, Math.min(2, material.envMapIntensity));
          
          // Enable PBR features
          material.needsUpdate = true;
          
          // Mobile optimizations
          if (isMobile) {
            material.envMapIntensity = 0.3; // Reduce reflections on mobile
            material.metalness = Math.min(material.metalness, 0.8);
            material.roughness = Math.max(material.roughness, 0.2);
            
            // iOS-specific material optimizations
            if (isIOS) {
              console.log('📱 Applying iOS material optimizations');
              material.envMapIntensity = 0.2; // Even lower reflections for iOS
              material.metalness = Math.min(material.metalness, 0.6);
              material.roughness = Math.max(material.roughness, 0.3);
            }
          }
          
          console.log('✅ PBR material applied:', {
            metalness: material.metalness,
            roughness: material.roughness,
            envMapIntensity: material.envMapIntensity
          });
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