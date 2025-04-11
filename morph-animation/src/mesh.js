import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const geometry = new THREE.BoxGeometry(300, 300, 300);
const material = new  THREE.MeshLambertMaterial({
    color: 'orange'
});


// * 1.变形动画
// 复制了 2 份顶点坐标 geometry.attributes.position
const positions = geometry.attributes.position.clone();
for (let i = 0; i< positions.count; i++) {
    positions.setY(i, positions.getY(i) * 2);
}

const positions2 = geometry.attributes.position.clone();
for (let i = 0; i< positions2.count; i++) {
    positions2.setX(i, positions2.getX(i) * 2);
}

// 然后放到 geometry.morphAttributes.position 数组，这个是变形目标
geometry.morphAttributes.position = [positions, positions2];


const mesh = new THREE.Mesh(geometry, material);

// 调整 mesh.morphTargetInfluences 影响因子
// mesh.morphTargetInfluences[0] = 0;
// mesh.morphTargetInfluences[1] = 1;



const gui = new GUI();

gui.add(mesh.morphTargetInfluences, '0', 0, 1);
gui.add(mesh.morphTargetInfluences, '1', 0, 1);




// * 2.关键帧做变形动画
// 定义两个 KeyframeTrack 关键帧属性变化，分别改变 morphTargetInfluences[0] 和 [1]，定义在 0-3s 和 3-6s 里对应的值的变化。
mesh.name = "Kkk";
// // 创建一个位置关键帧轨道
// 第一个参数是属性路径，这里表示物体的位置属性
// 第二个参数是关键帧的时间点数组
// 第三个参数是对应时间点的位置值数组，每个元素是一个三维向量

/**
 * * THREE.KeyframeTrack
 * 创建一个位置关键帧轨道
 * 第一个参数是属性路径，这里表示物体的位置属性
 * 第二个参数是关键帧的时间点数组
 * 第三个参数是对应时间点的位置值数组，每个元素是一个三维向量
 * ...
 */
const track1 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[0]', [0, 3], [0, 0.5]);
const track2 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[1]', [3, 6], [0, 2]);
// 用 AnimationClip 定义这个动画的名字、时长
const clip = new THREE.AnimationClip("aaaa", 6, [track1, track2]);

// 之后用 AnimationMixer 来播放这个关键帧动画，并在每次渲染循环里 update 更新数值
const mixer = new THREE.AnimationMixer(mesh);
const clipAction = mixer.clipAction(clip);
clipAction.play();

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    mixer.update(delta);

    requestAnimationFrame(render);
}

render();



export default mesh;
