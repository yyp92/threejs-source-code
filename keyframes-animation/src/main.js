import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// import mesh from './mesh.js';
import mesh from './mesh2.js';

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
scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(300, 300, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)



// * 关键帧动画
// 给 mesh 加上 name 属性，然后定义它在 0、2、5 秒的值，创建 KeyframeTrack，也就是一个属性变化的关键帧。
// mesh.name = "Box";
// const times = [0, 2, 5];
// const values = [0, 0, 0, 0, 100, 0, 0, 0, -100];
// const track = new THREE.KeyframeTrack('Box.position', times, values);

// // 加一个 scale 变化的关键帧，在 1 秒的时候 scale.y 为 2，在 4 秒的时候为 0.5
// const times2 = [0, 1, 4];
// const values2 = [1, 1, 1, 1, 2, 1, 1, 0.5, 1];
// const track2 = new THREE.KeyframeTrack('Box.scale', times2, values2);

// // 之后用 AnimationClip 定义这个动画的名字、持续时间，有哪些 KeyframeTrack（也就是有哪些属性变化）
// const clip = new THREE.AnimationClip("hello", 5, [track, track2]);

// // 之后用动画播放器 AnimationMixer 播放 mesh 上的动画，调用 play 方法，并且每次 render 的时候根据时间 update 一下
// const mixer = new THREE.AnimationMixer(mesh);
// const clipAction = mixer.clipAction(clip); 
// clipAction.play(); 

// // 调整播放速度 timeScale, 暂停 paused
// // 设置播放速度为 2 倍，那 2s 后停止的时候，高度应该是 4s 时的 0.5
// clipAction.timeScale = 2;
// setTimeout(() => {
//     clipAction.paused = true;
// }, 2000);



const clock = new THREE.Clock();
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    const delta = clock.getDelta();
    // mixer.update(delta);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

