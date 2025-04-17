import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {SimplexNoise} from 'three/examples/jsm/Addons.js'
import _ from 'lodash-es';
import { Easing, Group, Tween } from '@tweenjs/tween.js';
import player from './player';
import analyser from './analyser'
import lyricList, {lyricPositions} from './lyric'
import group from './note'

const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);

const loader = new THREE.AudioLoader();
loader.load('./superman.mp3', function (buffer) {
    audio.setBuffer(buffer);
    audio.autoplay = false;
});


const scene = new THREE.Scene();
scene.add(lyricList)
lyricList.position.y = 650;

scene.add(player);
player.position.x = 950;
player.position.z = 600;

scene.add(analyser)
analyser.position.y = -200;
analyser.scale.z = 0.5;
analyser.rotateX(Math.PI /8);

scene.add(group);


const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 600, 10000);
camera.position.set(0, 920, 1650);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(width, height)


const audioAnalyser = new THREE.AudioAnalyser(audio);
function updateHeight() {
    const frequencyData = audioAnalyser.getFrequencyData();

    const sumArr = _.map(_.chunk(frequencyData, 50), (arr) => {
        return _.sum(arr);
    }).reverse();

    for (let i = 0; i < analyser.children.length; i++) {
        const mesh = analyser.children[i];
        const height = sumArr[i] / 4000;

        // 这里因为旋转过，所以是修改 scale.z
        mesh.scale.z = height;
    }
}

const simplex = new SimplexNoise();

let time = 0;
function updatePosition() {
    // 这里并不是随机的运动，而是随机且连续的位置改变。
    // 这种就要用噪声库了。
    // 这里要在 x、y、z 之外加入一个时间维度，来实现连续的随机值

    group.children.forEach(sprite => {
        const { x, y, z} = sprite.position;
        const x2 = x + simplex.noise(x, time) * 100;
        const y2 = y + simplex.noise(y, time) * 100;
        const z2 = z + simplex.noise(z, time) * 100;

        const tween= new Tween(sprite.position)
            .to({
                x: x2,
                y: y2,
                z: z2
            }, 500)
            .easing(Easing.Quadratic.InOut)
            .repeat(0)
            .start()
            .onComplete(() => {
                tweenGroup.remove(tween);
            })

        tweenGroup.add(tween);
    });

    time++;
}


// 创建一个 Group 来管理所有的 tween，每帧渲染的时候调用下 group.update()
const tweenGroup = new Group();
// costTime 是已经度过的总时间
let costTime = 0;
// startTime 是点击播放按钮时的时间
let startTime = 0;
let i = 0;
const updatePosition2 = _.throttle(updatePosition, 500);
function render() {
    if (lyricPositions.length && audio.isPlaying) {
        // const mSeconds = Math.floor(audio.context.currentTime * 1000);

        // 每次的 currentTime 就是已经度过的总时间 costTime + （当前时间减去点播放按钮时的时间）
        let currentTime = costTime + Date.now() - startTime;

        const mSeconds = currentTime;


        // 如果 i 是 lyricPositions.length - 1 也就是最后一个了，那就直接修改 position.z 为最后一句歌词的。
        if (i >= lyricPositions.length - 1) {
            lyricList.position.z = lyricPositions[lyricPositions.length - 1][1];
        }
        // 每帧渲染的时候，拿到当前播放时间 audio.context.currentTime，判断下是不是在这句歌词和下句歌词的播放时间范围内。
        else if (mSeconds > lyricPositions[i][0] && mSeconds < lyricPositions[i + 1][0]) {
            // 是的话就修改 position.z 为这句歌词的 z
            const tween= new Tween(lyricList.position)
                .to({
                    z: lyricPositions[i][1] + 300
                }, 300)
                .easing(Easing.Quadratic.InOut)
                .repeat(0)
                .start()
                // onComplete 的时候把这个 tween 删除凋用
                .onComplete(() => {
                    tweenGroup.remove(tween);
                })

            // 把之前直接修改 position.z 改为用 tween 做缓动动画。
            tweenGroup.add(tween);
            i++;
        }
    }

    tweenGroup.update();
    updateHeight();
    updatePosition2()

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
            // 点击按钮的时候记录下 startTime，更新下 costTime
            if (obj.name === 'playBtn') {
                // 按钮 scale 0.6，有个按下的感觉，高度还剩 0.6，那 positon.y 就要向下移动 0.4 的高度
                obj.scale.y = 0.6;
                // 但之前中心点在按钮中间，中心点只需要下移一半就好了：
                obj.position.y = -80 * 0.4 / 2;

                startTime = Date.now();
                pauseBtn.scale.y = 1;
                pauseBtn.position.y = 0;
                audio.play()
            }
            else if (obj.name === 'pauseBtn') {
                obj.scale.y = 0.6;
                obj.position.y = -80 * 0.4 / 2;

                costTime += Date.now() - startTime;
                playerBtn.scale.y = 1;
                playerBtn.position.y = 0;
                audio.pause()
            }
        }
    }
});

