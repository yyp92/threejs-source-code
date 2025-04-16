import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import _ from 'lodash-es';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const scene = new THREE.Scene();



const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);

const loader = new THREE.AudioLoader();
loader.load('./superman.mp3', function (buffer) {
    audio.setBuffer(buffer);
});

document.body.addEventListener('click', () => {
    audio.pause();
    audio.play();
})



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
camera.position.set(0, 1500, 1700);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)



const group = new THREE.Group();
for (let i = 0; i < 21; i++) {
    const geometry = new THREE.BoxGeometry(100, 500, 100);
    const material = new THREE.MeshPhongMaterial({
        // color: 'orange'

        // 启用顶点颜色需要设置 vertexColors 为 true
        vertexColors: true
    });
    const mesh = new THREE.Mesh(geometry,material);
    mesh.position.y = 250;
    mesh.position.x = i * 150;
    group.add(mesh);
}
scene.add(group);
group.position.x = -1500;
group.position.y = -500;

// * 创建 AudioAnalyser，传入要分析的音频
const analyser = new THREE.AudioAnalyser(audio);

// 用 chunk 分组，然后 map 之后用 sum 求和
function updateHeight() {
    const frequencyData = analyser.getFrequencyData();

    const sumArr = _.map(_.chunk(frequencyData, 50), (arr) => {
        return _.sum(arr);
    });

    // 高度变了，position.y 也得变，这样才能底部和 x 轴平齐。
    // 创建新 BoxGeometry 要把之前的那个的 cpu 资源释放掉，调用 geometry.dispose()
    for (let i = 0; i < group.children.length; i++) {
        const box = group.children[i];
        const height = sumArr[i] / 10;
        box.geometry.dispose();
        box.geometry = new THREE.BoxGeometry(100, height, 100);
        box.position.y = height / 2;


        const positions = box.geometry.attributes.position;
        const colorsArr = [];
        const color1 = new THREE.Color('blue');
        const color2 = new THREE.Color('red');

        // 这里到达 300 高度红色，否则蓝色，根据高度计算一个比例，然后用 color.lerp 计算颜色插值，设置到 geometry.attributes.color
        for (let i = 0; i < positions.count; i++) {
            const percent = positions.getY(i) / 300;
            const c = color1.clone().lerp(color2, percent);
            colorsArr.push(c.r, c.g, c.b); 
        }

        const colors = new Float32Array(colorsArr);
        box.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
    } 
}


// 加一下性能分析的 Stats 工具
const stats = new Stats();
document.body.appendChild( stats.domElement );

function render() {
    updateHeight();
    stats.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

