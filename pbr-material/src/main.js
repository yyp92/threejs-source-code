import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import mesh from './mesh.js';

const scene = new THREE.Scene();
// scene.add(mesh);


const textureCube = new THREE.CubeTextureLoader()
    .setPath('./forest/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

scene.background = textureCube;

const geometry = new THREE.CylinderGeometry(200, 200, 500);
const material = new THREE.MeshStandardMaterial({
    color: 'orange',

    // roughness 是粗糙度，设置为 0 就是完全光滑的镜面
    roughness: 0,

    // metalness 是金属度，设置为 1 就是完全的金属效果
    metalness: 1,

    // envMap 环境贴图
    envMap: textureCube,
    envMapIntensity: 1
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const gui = new GUI();
gui.addColor(material, 'color');
gui.add(material, 'roughness', 0, 1);
gui.add(material, 'metalness', 0, 1);
gui.add(material, 'envMapIntensity', 0, 5);



const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
