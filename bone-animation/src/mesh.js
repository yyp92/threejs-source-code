import * as THREE from 'three';

// 用 Bone 创建了 3 个关节，就像手臂一样
const bone1 = new THREE.Bone();
const bone2 = new THREE.Bone();
const bone3 = new THREE.Bone();

bone1.add(bone2);
bone2.add(bone3);

bone1.position.x = 100;

bone2.position.y = 100;
bone3.position.y = 50;

const pos = new THREE.Vector3();
bone3.getWorldPosition(pos);
console.log(pos);


const group = new THREE.Group();
group.add(bone1);

bone1.rotateZ(Math.PI/4);
bone2.rotateZ(-Math.PI/4);


// 用 SkeletonHelper 可视化
const skeletonHelper = new THREE.SkeletonHelper(group);
group.add(skeletonHelper);

export default group;
