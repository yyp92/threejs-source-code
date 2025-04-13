import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const listener = new THREE.AudioListener();

const audio = new THREE.Audio(listener);

const loader = new THREE.AudioLoader();
loader.load('./superman.mp3', function (buffer) {
    audio.setBuffer(buffer);
    // audio.play();
});

// document.body.addEventListener('click', () => {
//     // setLoop 设置循环播放
//     audio.setLoop(true);
//     // seetVolume 调节音量
//     audio.setVolume(0.5);
//     // playbackRate 调整播放速率
//     audio.playbackRate = 2;

//     // isPlaying 判断播放状态，然后 pause、play 分别是暂停播放。
//     if (audio.isPlaying) {
//         audio.pause();
//     }
//     else {
//         audio.play();
//     }
// })



// * 用 gui 来做下可视化调节，这样可以感受下不同属性对音频的影响
// 改了属性后要暂停播放才会生效
const gui = new GUI();
const obj = {
    volume: 1,
    loop: true,
    playbackRate: 1,
    offset: 0,
    detune: 0,
    play() {
        audio.play();
    },
    pause() {
        audio.pause();
    }
}
gui.add(obj, 'volume', 0, 1).onChange(value => {
    audio.setVolume(value);
});
gui.add(obj, 'playbackRate', [0.5, 1, 2]).onChange(value => {
    audio.playbackRate = value;
    audio.pause();
    audio.play();
});
gui.add(obj, 'loop').onChange(value => {
    audio.setLoop(value);
    audio.pause();
    audio.play();
});
gui.add(obj, 'offset', 0, 150).onChange(value => {
    audio.offset = value;
    audio.pause();
    audio.play();
});
gui.add(obj, 'detune', 0, 1000).onChange(value => {
    audio.detune = value;
    audio.pause();
    audio.play();
});
gui.add(obj, 'play');
gui.add(obj, 'pause');




const scene = new THREE.Scene();

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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


