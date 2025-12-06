import './style.css'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

// --- CONFIGURATION OBJECT ---
// This stores the state of our app for the GUI to control
const params = {
    lampColor: '#ff6b6b',
    metalness: 0.2,
    roughness: 0.1,
    lightIntensity: 100,
    lightColor: '#ffaa00',
    bgLight: true,
    view: 'overview' // 'overview' or 'detail'
};

// --- 1. SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8e8e8); // Matches CSS background
scene.fog = new THREE.Fog(0xe8e8e8, 10, 50);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 12);

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // IMPORTANT: Enable Shadows
renderer.shadowMap.type = THREE.SoftShadowMap;

// --- 2. LIGHTING (Studio Setup) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Main Key Light (Casts Shadow)
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// --- 3. BUILD THE LAMP (Procedural Geometry) ---
const lampGroup = new THREE.Group();

// A. The Material (We use one shared material for simplicity)
const lampMaterial = new THREE.MeshStandardMaterial({
    color: params.lampColor,
    metalness: params.metalness,
    roughness: params.roughness,
});

// B. The Base (Cylinder)
const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 64);
const base = new THREE.Mesh(baseGeo, lampMaterial);
base.position.y = 0.25;
base.castShadow = true;
base.receiveShadow = true;
lampGroup.add(base);

// C. The Stem (Tall thin cylinder)
const stemGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 32);
const stem = new THREE.Mesh(stemGeo, lampMaterial);
stem.position.y = 3.25; // 0.25 (base center) + 3 (half height)
stem.castShadow = true;
stem.receiveShadow = true;
lampGroup.add(stem);

// D. The Shade (Hemisphere)
const shadeGeo = new THREE.SphereGeometry(3, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
const shade = new THREE.Mesh(shadeGeo, lampMaterial);
shade.position.y = 6.25; // Top of stem
shade.rotation.x = Math.PI; // Flip it upside down so it's a dome
shade.scale.y = 0.7; // Flatten it slightly
shade.castShadow = true;
shade.receiveShadow = true; // The bulb inside needs to cast shadow? No.
lampGroup.add(shade);

// E. The "Bulb" (The actual light source)
const bulbLight = new THREE.PointLight(params.lightColor, params.lightIntensity, 10);
bulbLight.position.set(0, 5.5, 0); // Inside the shade
bulbLight.castShadow = true;
bulbLight.shadow.bias = -0.0001;
lampGroup.add(bulbLight);

// Add the lamp to the scene
scene.add(lampGroup);


// --- 4. THE FLOOR ---
const floorGeo = new THREE.PlaneGeometry(50, 50);
const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0xe8e8e8, 
    roughness: 1, 
    metalness: 0 
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);


// --- 5. INTERACTION & ANIMATION (GSAP + GUI) ---
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going below floor

// Setup GUI
const gui = new GUI({ title: 'Configurator' });

// Material Folder
const folderMaterial = gui.addFolder('Material Finish');
folderMaterial.addColor(params, 'lampColor').name('Color').onChange((val) => {
    // GSAP tween for smooth color transition
    gsap.to(lampMaterial.color, { r: new THREE.Color(val).r, g: new THREE.Color(val).g, b: new THREE.Color(val).b, duration: 0.5 });
});
folderMaterial.add(params, 'metalness', 0, 1).name('Metalness').onChange(val => lampMaterial.metalness = val);
folderMaterial.add(params, 'roughness', 0, 1).name('Roughness').onChange(val => lampMaterial.roughness = val);

// Light Folder
const folderLight = gui.addFolder('Lighting');
folderLight.add(params, 'lightIntensity', 0, 200).name('Intensity').onChange(val => bulbLight.intensity = val);
folderLight.addColor(params, 'lightColor').name('Light Color').onChange((val) => {
    gsap.to(bulbLight.color, { r: new THREE.Color(val).r, g: new THREE.Color(val).g, b: new THREE.Color(val).b, duration: 0.5 });
});

// Camera Views Folder
const folderView = gui.addFolder('Camera Angles');
const views = {
    Overview: () => moveCamera(0, 5, 12),
    TopDown: () => moveCamera(0, 12, 1),
    Detail: () => moveCamera(3, 7, 3),
};
folderView.add(views, 'Overview');
folderView.add(views, 'TopDown');
folderView.add(views, 'Detail');

function moveCamera(x, y, z) {
    gsap.to(camera.position, {
        x: x, y: y, z: z,
        duration: 1.5,
        ease: "power3.inOut"
    });
}


// --- 6. RESIZE & LOOP ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
    const time = clock.getElapsedTime();
    
    // Subtle float animation for the lamp (Optional "magical" feel, remove for strict realism)
    // lampGroup.position.y = Math.sin(time) * 0.1;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();