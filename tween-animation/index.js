import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {Tween, Easing} from '@tweenjs/tween.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const pointLight = new THREE.DirectionalLight(0xffffff);
pointLight.position.set(100, 300, 200);
scene.add(pointLight);

const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(200, 50, 200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

// * 方法1
// function render() {
//     if (mesh.position.x < 100) {
//         mesh.position.x += 1;
//         mesh.position.y += 1;
//     }
    
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }

// * 方法2
// const clock = new THREE.Clock();
// function render() {
//     const delta = clock.getDelta();

//     if (mesh.position.x < 100) {
//         mesh.position.x += delta * 30;
//         mesh.position.y += delta * 30;
//     }

//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }

// * 方法2：tween.js
// 只需要指定开始的数值、结束的数值，运动时间，然后指定用先加速再减速的动画 InOut 就可以了
// const tween = new Tween(mesh.position)
//     .to({ x: 100, y: 100}, 2000)
//     .easing(Easing.Quadratic.InOut)
//     .start();

// function render(time) {
//     tween.update(time);

//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }


// 指定 angle 从 0 到 360 度变化，默认是匀速的，5s 转一圈。
const r = 50; 
const tween = new Tween({ angle: 0 })
    .to({ angle: Math.PI * 2 }, 5000)
    // onUpdate 的时候改变 camera 的 position.x position.z 调整 lookAt
    .onUpdate(function(obj){
        camera.position.x = r * Math.cos(obj.angle);
        camera.position.z = r * Math.sin(obj.angle);

        camera.lookAt(0, 0, 0);
    })
    .easing(Easing.Quadratic.InOut)
    .repeat(Infinity)
    .start();


function render(time) {
    tween.update(time);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
