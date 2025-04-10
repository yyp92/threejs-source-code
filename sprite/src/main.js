import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// import mesh from './mesh.js';
// import mesh from './mesh2.js';
import mesh from './mesh3.js';

const scene = new THREE.Scene();

scene.add(mesh);

const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

// const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
// camera.position.set(0, 0, 10);
const camera = new THREE.PerspectiveCamera(60, width / height, 100, 1000);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
