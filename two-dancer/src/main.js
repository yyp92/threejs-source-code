import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import {OutlinePass} from 'three/addons/postprocessing/OutlinePass.js'
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import {Tween, Easing, Group} from '@tweenjs/tween.js'
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import stage from './stage.js';

const scene = new THREE.Scene();

scene.add(stage);

const directionLight = new THREE.DirectionalLight(0xffffff, 10);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const spotLight = new THREE.SpotLight('white', 5000000);
spotLight.angle = Math.PI / 6;
spotLight.position.set(0, 800, 0);
spotLight.lookAt(0, 0, 0);
scene.add(spotLight);
// 开启聚光灯的投射阴影属性
spotLight.castShadow = true;
spotLight.shadow.camera.far = 10000;


// 用 CameraHelper 可视化一下阴影相机。
const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(cameraHelper);



const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)
// 开启下 renderer 的阴影设置
renderer.shadowMap.enabled = true;

// function render() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }


// * 后期效果
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// GlitchPass 是闪屏的效果
// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);

// * 伽马校正 - 来修复颜色
// const gammaPass= new ShaderPass(GammaCorrectionShader);
// composer.addPass(gammaPass);

const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
const outlinePass = new OutlinePass(v, scene, camera);
outlinePass.edgeStrength = 10;
outlinePass.edgeThickness = 10;
outlinePass.pulsePeriod = 1;
composer.addPass(outlinePass);

const tweenGroup = new Group();

const css2Renderer = new CSS2DRenderer();
css2Renderer.setSize(width, height);

function render(time) {
    css2Renderer.render(scene, camera);
    composer.render();

    composer.render();
    requestAnimationFrame(render);

    // tweenGroup.update(time);
    tweenGroup.getAll().map(item => item.update(time))
}

render();

const div = document.createElement('div');
div.style.position = 'relative';
div.appendChild(css2Renderer.domElement);
css2Renderer.domElement.style.position = 'absolute';
css2Renderer.domElement.style.left = '0px';
css2Renderer.domElement.style.top = '0px';
css2Renderer.domElement.style.pointerEvents = 'none';
div.appendChild(renderer.domElement);
document.body.appendChild(div);

// document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => {
    console.log(camera.position);
});
  

window.onresize = function () {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width,height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};


// 加载音频
const listener = new THREE.AudioListener();
const audio = new THREE.Audio( listener );
const loader = new THREE.AudioLoader();
loader.load('./superman.mp3', function ( buffer ) {
    audio.setBuffer( buffer );
});

document.body.addEventListener('click', () => {
    if (!audio.isPlaying) {
        audio.setLoop(true);
        audio.setVolume(0.1);
        audio.play();
    }
});


// 选中添加发光的后期处理
renderer.domElement.addEventListener('click', (e) => {
    const y = -((e.offsetY / height) * 2 - 1);
    const x = (e.offsetX / width) * 2 - 1;
  
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);
  
    const intersections = rayCaster.intersectObjects(stage.children);
   
    // 这里我用了 Set 去重，因为可能点中一个人身体的多个部位，只保留一个 dancer。
    // 而且可能从某个方向能同时点中两个人，这种只保留一个数组元素
    const set = new Set();
    intersections.forEach(item => {
        if (item.object.target) {
            set.add(item.object.target);
        }
    });

    const dancerArr = [...set].slice(0, 1);
    outlinePass.selectedObjects = set.size ? dancerArr : [];

    // 点击 dancer 的时候，修改相机位置，启动 tween 动画
    if (dancerArr.length) {
        const isDancer1 = dancerArr[0].name === 'dancer1';
        const tween = new Tween(camera.position)
            .to(
                isDancer1
                    ? {x: 24, y: 955, z: -580}
                    : {x: 42, y: 1008, z:479 },
                2000
            )
            .repeat(0)
            .easing(Easing.Quadratic.InOut)
            .onUpdate((obj) => {
                camera.position.copy(new THREE.Vector3(obj.x, obj.y, obj.z));
                camera.lookAt(0, 0, 0);
            })
            .start();

        tweenGroup.add(tween);
    }


    // if (dancerArr.length) {
    //     const isDancer1 = dancerArr[0].name === 'dancer1';

    //     if (isDancer1) {
    //         camera.position.set(24, 955, -580);
    //         camera.lookAt(0, 0, 0);
    //     }
    //     else {
    //         camera.position.set(42, 1008, 479);
    //         camera.lookAt(0, 0, 0);
    //     }
    // }
});

