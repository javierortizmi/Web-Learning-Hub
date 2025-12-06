import './style.css'
import * as THREE from "three";

// --- 1. SETUP SCENE, CAMERA, RENDERER ---
const scene = new THREE.Scene();
// Add a subtle fog to fade particles into the distance
scene.fog = new THREE.FogExp2(0x000000, 0.005); 

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.z = 50;

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimization

// --- 2. THE HERO OBJECT (Neon Torus Knot) ---
// We create two meshes: a black base and a wireframe skin

const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);

// The base material (dark and shiny)
const materialBase = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.8
});
const torusBase = new THREE.Mesh(geometry, materialBase);
scene.add(torusBase);

// The wireframe material (glowing cyan)
const materialWire = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const torusWire = new THREE.Mesh(geometry, materialWire);
// Scale the wireframe slightly larger to prevent "z-fighting" flickering
torusWire.scale.setScalar(1.001); 
scene.add(torusWire);

// --- 3. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Point light 1 (Hot Pink)
const pointLight1 = new THREE.PointLight(0xff00ff, 2, 50);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

// Point light 2 (Cyan)
const pointLight2 = new THREE.PointLight(0x00ffff, 2, 50);
pointLight2.position.set(-5, -5, 10);
scene.add(pointLight2);

// --- 4. PARTICLE STARFIELD ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

// Create random positions for particles
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100; // Spread across space
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- 5. MOUSE INTERACTION ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    // Normalize mouse position to range -1 to 1
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// --- 6. WINDOW RESIZING ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 7. ANIMATION LOOP ---
const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the Torus
    torusBase.rotation.x = elapsedTime * 0.2;
    torusBase.rotation.y = elapsedTime * 0.3;
    torusWire.rotation.x = elapsedTime * 0.2;
    torusWire.rotation.y = elapsedTime * 0.3;

    // Animate Particles (Gentle wave)
    particlesMesh.rotation.y = -elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseX * 0.5; // Rotate stars based on mouse

    // Parallax Effect (Camera moves slightly opposite to mouse)
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();
