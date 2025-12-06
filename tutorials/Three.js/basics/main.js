import * as THREE from 'three';

// 1. Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3E78AA);

// 2. Add the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Create and add a cube object
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x25724F });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 4. Add lighting
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// 5. Set up the renderer
const renderer = new THREE.WebGLRenderer();
// {
//     canvas: document.querySelector('#myCanvas')
// }
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

// 6. Animate the scene
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();