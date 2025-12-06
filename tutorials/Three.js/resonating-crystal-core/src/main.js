import './style.css'
import * as THREE from "three";
// Importing Post-Processing tools to add "Bloom" (glow)
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// --- 1. SETUP SCENE & RENDERER ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.02); // Heavy fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Tone mapping helps handle extremely bright lights without washing out colors
renderer.toneMapping = THREE.ReinhardToneMapping; 
renderer.toneMappingExposure = 1.5;

// --- 2. POST-PROCESSING SETUP (The Glow Effect) ---
const renderScene = new RenderPass(scene, camera);

// Resolution, Strength, Radius, Threshold
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    1.5,  // Strength: higher = more glow
    0.4,  // Radius: how far the glow spreads
    0.85  // Threshold: only pixels brighter than this will glow
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


// --- 3. THE HERO OBJECT (Resonating Crystal) ---
// Using Icosahedron for a crystal shape with many vertices
const crystalGeometry = new THREE.IcosahedronGeometry(4, 10); // High detail level (10)

// We need to save the original positions of the vertices to animate them later
const positionAttribute = crystalGeometry.attributes.position;
const originalPositions = [];
for (let i = 0; i < positionAttribute.count; i++) {
    originalPositions.push(
        new THREE.Vector3().fromBufferAttribute(positionAttribute, i)
    );
}

const crystalMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 1.0, // Highly reflective like chrome
    roughness: 0.1, // Very smooth
    flatShading: true // Gives it the faceted "low-poly" crystal look
});

const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
scene.add(crystal);


// --- 4. ORBITING LIGHTS ---
// Create two lights that will spin around the crystal
const light1 = new THREE.PointLight(0xff0055, 10, 50); // Intensity 10
scene.add(light1);

const light2 = new THREE.PointLight(0x0055ff, 10, 50);
scene.add(light2);


// --- 5. INSTANCED DEBRIS FIELD (High Performance) ---
// InstancedMesh lets us draw thousands of the same object in one draw call.
const debrisCount = 3000;
const debrisGeometry = new THREE.TetrahedronGeometry(0.2, 0);
const debrisMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.8,
    roughness: 0.2
});

const debrisMesh = new THREE.InstancedMesh(debrisGeometry, debrisMaterial, debrisCount);

const dummy = new THREE.Object3D(); // A helper to calculate matrix positions
for (let i = 0; i < debrisCount; i++) {
    // Random position in a sphere around the center
    const r = 10 + Math.random() * 30; // Radius between 10 and 40
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
    );
    dummy.rotation.set(Math.random(), Math.random(), Math.random());
    dummy.scale.setScalar(Math.random() * 0.5 + 0.5);

    dummy.updateMatrix();
    debrisMesh.setMatrixAt(i, dummy.matrix);
}
scene.add(debrisMesh);


// --- 6. RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Update composer too
});


// --- 7. ANIMATION LOOP ---
const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // A. Animate Crystal Vertices (The "Resonance")
    // We loop through every vertex and nudge it using sin/cos waves
    for (let i = 0; i < positionAttribute.count; i++) {
        const oldPos = originalPositions[i];
        // Create a noise-like pattern based on position and time
        const offset = Math.sin(elapsedTime * 3 + oldPos.x * 0.5) * Math.cos(elapsedTime * 2 + oldPos.y * 0.5) * 0.3;
        
        // Move vertex outward along its normal vector
        // (Simple way: just multiply position vector)
        positionAttribute.setXYZ(
            i,
            oldPos.x * (1 + offset),
            oldPos.y * (1 + offset),
            oldPos.z * (1 + offset)
        );
    }
    positionAttribute.needsUpdate = true; // Tell Three.js geometry changed
    crystal.rotation.y = elapsedTime * 0.1;


    // B. Animate Lights orbiting
    light1.position.x = Math.sin(elapsedTime * 0.7) * 8;
    light1.position.z = Math.cos(elapsedTime * 0.7) * 8;
    light1.position.y = Math.sin(elapsedTime * 1.2) * 4;

    light2.position.x = Math.sin(elapsedTime * 0.5 + Math.PI) * 10; // Offset by PI to be opposite
    light2.position.z = Math.cos(elapsedTime * 0.5 + Math.PI) * 10;
    light2.position.y = Math.cos(elapsedTime * 0.9) * -4;

    // C. Slowly rotate debris field
    debrisMesh.rotation.y = elapsedTime * 0.05;

    // IMPORTANT: Render via the composer, not the renderer
    composer.render();
    requestAnimationFrame(animate);
};

animate();