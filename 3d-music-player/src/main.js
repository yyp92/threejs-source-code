import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import player from './player';

const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);

const loader = new THREE.AudioLoader();
loader.load('./superman.mp3', function (buffer) {
    audio.setBuffer(buffer);
    audio.autoplay = false;
});


const scene = new THREE.Scene();
scene.add(player);

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
    antialias: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


const playerBtn = player.getObjectByName('playBtn');
const pauseBtn = player.getObjectByName('pauseBtn');

renderer.domElement.addEventListener('click', (e) => {
    const y = -((e.offsetY / height) * 2 - 1);
    const x = (e.offsetX / width) * 2 - 1;

    // 用 RayCaster 来判断点击事件，点中的物体拿到 target 属性
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersections = rayCaster.intersectObjects(player.children);

    if (intersections.length) {
        const obj = intersections[0].object.target;

        // 点击按钮的时候，让另一个按钮弹起
        if (obj) {
            if (obj.name === 'playBtn') {
                // 按钮 scale 0.6，有个按下的感觉，高度还剩 0.6，那 positon.y 就要向下移动 0.4 的高度
                obj.scale.y = 0.6;
                // 但之前中心点在按钮中间，中心点只需要下移一半就好了：
                obj.position.y = -80 * 0.4 / 2;

                pauseBtn.scale.y = 1;
                pauseBtn.position.y = 0;
                audio.play()
            } 
            else if (obj.name === 'pauseBtn') {
                obj.scale.y = 0.6;
                obj.position.y = -80 * 0.4 / 2;

                playerBtn.scale.y = 1;
                playerBtn.position.y = 0;
                audio.pause()
            }
        }
    }
});

