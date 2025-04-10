import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import {GlitchPass} from 'three/addons/postprocessing/GlitchPass.js';
import {AfterimagePass} from 'three/addons/postprocessing/AfterimagePass.js'
import {FilmPass} from 'three/addons/postprocessing/FilmPass.js'
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js'
import {HalftonePass} from 'three/addons/postprocessing/HalftonePass.js'
import {OutlinePass} from 'three/addons/postprocessing/OutlinePass.js'
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js'
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';


const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(300, 300, 300);
const material = new THREE.MeshLambertMaterial({
    color: 'orange'
});
const mesh = new THREE.Mesh(geometry, material);
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
camera.position.set(400, 500, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)



// * 后期处理
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// * GlitchPass 故障闪屏: 它是一种出故障的闪屏效果, 每过几秒一次
// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);

// * AfterimagePass 残影: 这个通道会在物体运动的时候产生残影效果
// const afterimagePass = new AfterimagePass();
// composer.addPass(afterimagePass);

// * FilmPass 电影雪花效果: 这个后期通道可以产生电影雪花的效果
// 第一参数是强度，第二个参数设置 true 就是黑白电视的效果
// const filmPass = new FilmPass(0.5, true);
// composer.addPass(filmPass);

// * UnrealBloomPass 发光效果: 这个通道可以产生发光效果
// const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// const bloomPass = new UnrealBloomPass(v);
// // 强度
// bloomPass.strength = 0.8;
// // 发光半径
// bloomPass.radius = 10;
// composer.addPass(bloomPass);

// * HalftonePass 三色圆点效果: 这个通道可以给场景添加三色圆点效果
// const halftonePass = new HalftonePass({
//     // 调节圆点的半径
//     radius: 8
// });
// composer.addPass(halftonePass);

// * OutlinePass 描边效果: 描边效果，可以给选中的物体添加描边。
// const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// const outlinePass = new OutlinePass(v, scene, camera);
// // visibleEdgeColor 描边颜色
// outlinePass.visibleEdgeColor.set('blue');
// // edgeStrength 强度，影响描边是否明显
// outlinePass.edgeStrength = 20;
// // edgeThickness 边缘厚度
// outlinePass.edgeThickness = 10;
// // pulsePeriod 闪烁周期，单位是秒
// outlinePass.pulsePeriod = 1;
// outlinePass.selectedObjects = [mesh];
// composer.addPass(outlinePass);

// * SMAAPass 抗锯齿
const pixelRatio = renderer.getPixelRatio();
const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
composer.addPass(smaaPass);

// * 伽马校正
const gammaPass= new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaPass);



function render() {
    composer.render();

    // renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
