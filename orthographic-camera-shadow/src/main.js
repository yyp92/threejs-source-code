import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI();


const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(100, 100, 100);
// const material = new THREE.MeshLambertMaterial({
//     color: new THREE.Color('orange')
// });
// const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);


// const directionalLight = new THREE.DirectionalLight(0xffffff);
// const directionalLight = new THREE.PointLight(0xffffff, 10000000);
const directionalLight = new THREE.SpotLight(0xffffff, 10000000);

// directionalLight.position.set(400, 200, 300);
directionalLight.position.set(1000, 1000, 500);
directionalLight.castShadow = true;
// 正投影相机要设置上下左右，远近裁截面距离
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 10000;

gui.add(directionalLight.position, 'x', 0, 10000);
gui.add(directionalLight.position, 'y', 0, 10000);
gui.add(directionalLight.position, 'z', 0, 10000);


scene.add(directionalLight);

console.log(directionalLight.shadow.camera)
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);


const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;


// * 透视相机
// const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
// camera.position.set(400, 200, 300);
// camera.lookAt(0, 0, 0);

// * 正交相机
// 按照网页的宽高比来设置宽高，先计算出宽高比 aspectRatio
// const aspectRatio = width / height;
// const num = 500;
// // -num 到 num 是高度，那乘以宽高比之后 -num * aspectRatio 到 num * aspectRatio 就是宽度
// const camera2 = new THREE.OrthographicCamera(
//     - num * aspectRatio, 
//     num * aspectRatio,
//     num,
//     -num,
//     0.1,
//     5000
// );
// camera2.position.set(400, 200, 300);
// camera2.lookAt(0, 0, 0);

// // 用 CameraHelper 可视化正投影相机
// const cameraHelper = new THREE.CameraHelper(camera2);
// scene.add(cameraHelper);

// 还需要一个透视相机来观察
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(1000, 2000, 1000);
camera.lookAt(0, 0, 0);




const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)
// 开启 Renderer 的阴影
renderer.shadowMap.enabled = true;


function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
