import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';


// * 创建了一个 Scene
const scene = new THREE.Scene();

// * 这个 Mesh 的几何体是一个 BoxGeometry 立方体，它的材质是一个漫反射材质 MeshLambertMaterial，这个材质支持漫反射，我们设置了一个橙色。
const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial(({
    color: new THREE.Color('orange')
}));
// 然后传入 geometry 和 material 来创建 Mesh。
// 设置它的位置在 0,0,0。
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);


// * 灯光用了点光源，就和灯泡一样，从一个点发射光线
// 设置颜色为白色，光照强度 10000
// 位置在 80,80,80 的位置，默认照向 0,0,0 的方向
const pointLight = new THREE.PointLight(0xffffff, 10000);
pointLight.position.set(80, 80, 80);
scene.add(pointLight);


// * 加一个展示坐标系的工具 AxesHelper
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);


const width = window.innerWidth;
const height = window.innerHeight;

// * 用了一个透视相机，在 200,200,200 的位置看向 0,0,0
// 第一个参数是角度（fov），也就是看的范围有多大。
// 第二个参数是宽高比，也就是这个视椎体的宽和高的比例。
// 第三个和第四个参数是展示视椎体的哪一部分，最近是哪，最远是哪。
// 设置了角度为 60，宽高比是窗口的宽高比（window.innerWidth/window.innerHeight ）
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

// * 用 Renderer 把 Scene 渲染到 canvas 上
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

// 这里需要把 render 改成渲染循环，用 requestAnimationFrame 来一帧帧的循环渲染。
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render)
}
render()

document.body.append(renderer.domElement);


// * 创建 OrbitControls 的实例，传入 camera 和 canvas 元素
const controls = new OrbitControls(camera, renderer.domElement);

