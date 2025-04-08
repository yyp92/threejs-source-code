import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// import { mesh, light } from './mesh.js';
// import { mesh, light } from './mesh2.js';
// import { mesh, light } from './mesh3.js';
// import { mesh, light } from './mesh4.js';
import { mesh, light } from './mesh5.js';

const scene = new THREE.Scene();
scene.add(mesh, light);



// const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

// GridHelper 坐标格辅助对象
// const gridHelper = new THREE.GridHelper(
//     1000, 
//     10,
//     new THREE.Color('green'),
//     new THREE.Color('pink')
// );
// scene.add(gridHelper);

// CameraHelper 相机辅助对象
// const camera2 = new THREE.PerspectiveCamera(20, 16 / 9, 100, 300)
// let cameraHelper = new THREE.CameraHelper(camera2)
// scene.add(cameraHelper);

// ArrowHelper 箭头辅助对象
// origin 是起点，dir 是方向，这里用 nomalize 方法把它变为长度为 1 的单位向量。
// const origin = new THREE.Vector3( 0, 0, 0 );
// const dir = new THREE.Vector3( 1, 2, 0 );
// dir.normalize();
// const arrowHelper = new THREE.ArrowHelper( dir, origin, 500, new THREE.Color('yellow') );
// scene.add( arrowHelper );

// PolarGridHelper 极坐标格辅助对象
// 第一个参数是半径，第二个参数是画多少直线，第三个参数是画多少圆圈，第四个参数就是圆的分段数了。
// const helper = new THREE.PolarGridHelper( 500, 10, 5, 64 );
// const helper = new THREE.PolarGridHelper( 500, 5, 20, 8 );
// scene.add( helper );




const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(200, 800, 800);
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
