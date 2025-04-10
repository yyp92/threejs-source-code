import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// import mesh from './mesh.js';
import mesh from './mesh2.js';

const scene = new THREE.Scene();

scene.add(mesh);

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(300, 200, 400);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(0, 500, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)



// * 后期处理
const composer = new EffectComposer(renderer);
// 第一个 Pass 是 RenderPass 就是渲染 3D 场景
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// 第二个 Pass 我们用 OutlinePass 给选中的物体添加描边
// 它的第一个参数是宽高比，我们用网页宽高比。
const outlinePass = new OutlinePass(v, scene, camera);
// visibleEdgeColor 是颜色
outlinePass.visibleEdgeColor.set('orange');
// edgeStrength 是亮度
outlinePass.edgeStrength = 10;
// edgeThickness 是描边厚度
outlinePass.edgeThickness = 10;
// pulsePeriod 是闪烁频率，每 1 秒闪烁一次
outlinePass.pulsePeriod = 1;

composer.addPass(outlinePass);

// 添加 UnrealBloomPass，调一下发光强度
const bloomPass = new UnrealBloomPass(v);
bloomPass.strength = 0.5;
// composer.addPass(bloomPass);



function render() {
    composer.render();

    // renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


// 射线和点击的处理
renderer.domElement.addEventListener('click', (e) => {
    const y = -((e.offsetY / height) * 2 - 1);
    const x = (e.offsetX / width) * 2 - 1;

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersections = rayCaster.intersectObjects(mesh.children);

    if (intersections.length) {
        // outlinePass.selectedObjects = [intersections[0].object];
        outlinePass.selectedObjects = [intersections[0].object.target];

        // 点击选中的时候再添加这个 Pass
        if (!composer.passes.includes(bloomPass)) {
            composer.addPass(bloomPass);
        }      
    }
    else {
        outlinePass.selectedObjects = [];
        composer.removePass(bloomPass);
    }

    intersections.forEach(item => {
        // item.object.material.color.set('blue')
    });
});
