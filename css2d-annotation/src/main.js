import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
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
scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

// function render() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }

// render();

// 创建 CSS2DRenderer，它也会返回一个 domElement
const css2Renderer = new CSS2DRenderer();
css2Renderer.setSize(width, height);

// 我们创建一个 div，把两个 domElement 放进去，并且让 css2dRenderer.domElement 绝对定位并且不响应鼠标事件
const div = document.createElement('div');
div.style.position = 'relative';
div.appendChild(css2Renderer.domElement);
css2Renderer.domElement.style.position = 'absolute';
css2Renderer.domElement.style.left = '0px';
css2Renderer.domElement.style.top = '0px';
css2Renderer.domElement.style.pointerEvents = 'none';

div.appendChild(renderer.domElement);
document.body.appendChild(div);

// 在 render 循环里调用 css2dRenderer.render 来一帧帧渲染
function render() {
    css2Renderer.render(scene, camera);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

// 只要在窗口 resize 的时候重新计算下宽高比，调整下 renderer 的 size，更新下相机的 aspect 参数就好了，调完相机参数还要 updateProjectionMatrix 更新相机投影矩阵才能生效。
window.onresize = function () {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    css2Renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};


// 点击的时候，拿到射线射中的物体，根据 name 查找标签，设置 visible 就好了。
renderer.domElement.addEventListener('click', (e) => {
    const y = -((e.offsetY / height) * 2 - 1);
    const x = (e.offsetX / width) * 2 - 1;

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersections = rayCaster.intersectObjects(mesh.children);

    if (intersections.length) {
        const obj = intersections[0].object;
        const tag = obj.getObjectByName('tag');

        if (tag) {
            tag.visible = !tag.visible;
        }
    }
});



// document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

