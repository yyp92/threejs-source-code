import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial(({
    color: new THREE.Color('orange')
}));
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);


const gui = new GUI();

const meshFolder = gui.addFolder('立方体');
meshFolder.addColor(mesh.material, 'color');
meshFolder.add(mesh.position, 'x').step(10);
meshFolder.add(mesh.position, 'y').step(10);
meshFolder.add(mesh.position, 'z').step(10);


const pointLight = new THREE.PointLight(0xffffff, 10000);
pointLight.position.set(80, 80, 80);
scene.add(pointLight);

const lightFolder = gui.addFolder('灯光');
lightFolder.add(pointLight.position, 'x').step(10);
lightFolder.add(pointLight.position, 'y').step(10);
lightFolder.add(pointLight.position, 'z').step(10);
lightFolder.add(pointLight, 'intensity').step(1000);


const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);


const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(200, 200, 200);
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


// 首先 addFolder 添加一个分组，然后添加各种控件
// 其实用法都一样，都是 add，dat.gui 内部会自己根据属性的类型使用不同的控件。
// 如果是枚举值，需要用数组、对象的方式在第三个参数里列出来
const otherFolder = gui.addFolder('其他控件类型');

const obj = {
    aaa: '天王盖地虎',
    bbb: false,
    ccc: 0,
    ddd: '111',
    fff: 'Bbb',
    logic: function () {
        alert('执行一段逻辑!');
    }
};

otherFolder.add(obj, 'aaa').onChange((value) => {
    console.log(value)
})

// otherFolder.add(obj, 'aaa');
otherFolder.add(obj, 'bbb');
otherFolder.add(obj, 'ccc').min(-10).max(10).step(0.5);
otherFolder.add(obj, 'ddd', ['111', '222', '333']);
otherFolder.add(obj, 'fff', { Aaa: 0, Bbb: 0.1, Ccc: 5 });
otherFolder.add(obj, 'logic');
