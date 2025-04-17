import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh'

const scene = new THREE.Scene();
scene.add(mesh)

const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height)



const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
// controls.autoRotateSpeed = 10.0;

// 开启惯性
// controls.enableDamping = true;

// 禁用旋转
// controls.enableRotate = false;

// 禁用平移和缩放
// controls.enablePan = false;
// controls.enableZoom  = false;

// 默认右键平移，左键拖动，滚轮缩放
// controls.mouseButtons = {
//     RIGHT: THREE.MOUSE.ROTATE,
//     LEFT: THREE.MOUSE.PAN
// }

// 默认旋转范围是 0 到 Math.PI，我们改成一半：
// controls.maxPolarAngle  = Math.PI /2;

// 经常监听 change 事件来拿到实时的相机位置和焦点
controls.addEventListener('change', () => {
    // 相机位置是 camra.position 相机焦点是 controls.target
    console.log(camera.position, controls.target);
})



function render() {
    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

