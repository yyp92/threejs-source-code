import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();
scene.add(mesh);

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
camera.position.set(500, 500, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height)

// function render() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }

// render();

document.body.append(renderer.domElement);




// * 控制器
// * 轨道控制器（OrbitControls）
// const controls = new OrbitControls(camera, renderer.domElement);


// * 拖放控制器（DragControls
// DragControls 是在 3D 场景内实现拖动交互的控制器。
// const box1 = scene.getObjectByName('box');
// const box2 = scene.getObjectByName('box2');

// const controls = new DragControls([box1, box2], camera, renderer.domElement);

// controls.addEventListener('dragstart', function (event) {
//     event.object.material.color.set('lightgreen');
// });

// controls.addEventListener('dragend', function (event) {
//     // console.log('====event', event)
//     event.object.material.color.set('orange');
// });

// controls.addEventListener('hoveron', (event) => {
//     event.object.material.wireframe = true;
// });

// controls.addEventListener('hoveroff', (event) => {
//     event.object.material.wireframe = false;
// });


// * FlyControls 飞行控制器，相机有一种飞行的效果，可以通过键盘上下左右键控制往哪边转，然后按住左键前进，按住右键后退。
// const controls = new FlyControls(camera, renderer.domElement);
// // movementSpeed 是调节移动速度
// controls.movementSpeed = 100;
// // rollSpeed 是方向旋转速度。
// controls.rollSpeed = Math.PI / 10;


// * FirstPersonControls 第一人称控制器
// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 100;


// * TransformControls 变换控制器
// const box1 = scene.getObjectByName('box');
// const box2 = scene.getObjectByName('box2');

// const controls = new TransformControls(camera, renderer.domElement);
// controls.attach(box1);
// // 禁用掉 x 轴的箭头
// controls.showX = false;
// scene.add(controls.getHelper());


// * MapControls 地图控制器
const controls = new MapControls(camera, renderer.domElement);




const clock = new THREE.Clock();
function render() {
    controls.update(clock.getDelta());

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
