import * as THREE from 'three';
import { createNoise2D } from "simplex-noise";
import loadTree from './tree';

const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

// 用噪声库 simplex-noise 给顶点设置随机的 z，这个 z 是传入 x、y 算出来的有连续性的随机值。
const noise2D = createNoise2D();

const positions = geometry.attributes.position;

for (let i = 0 ; i < positions.count; i ++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    const z = noise2D(x / 800, y / 800) * 50;

    positions.setZ(i, z);
}

// * 给山坡根据不同的高度来设置不同颜色
// 因为旋转之前这个山坡是在 XY 平面的，也就是 Z 坐标是高度。
// 我们拿到所有顶点的 Z，排一下序。
const heightArr = [];
for (let i = 0; i < positions.count; i++) {
    heightArr.push(positions.getZ(i));
}
heightArr.sort();

// 计算出最低和最高的高度，高度差就是山坡的整体高度。
const minHeight = heightArr[0];
const maxHeight = heightArr[heightArr.length - 1];
const height = maxHeight - minHeight;

const colorsArr = [];
const color1 = new THREE.Color('#eee');
const color2 = new THREE.Color('white');

// 遍历每个顶点，用当前高度减去最低高度，算出百分比，这样就可以实现颜色插值
for (let i = 0; i < positions.count; i++) {
    const percent = (positions.getZ(i) - minHeight) / height;

    // 用 color.lerp 方法，指定一个开始颜色、一个结束颜色，然后根据高度算出百分比之后，就可以算出这个百分比对应的颜色。
    const c = color1.clone().lerp(color2, percent);
    colorsArr.push(c.r, c.g, c.b); 
}
// 把算出的 colors 数组设置到 geometry.attributes.color
const colors = new Float32Array(colorsArr);
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

const material = new THREE.MeshLambertMaterial({
    // color: new THREE.Color('white'),
    // wireframe: true

    // 材质里开启 vertextColors 为 true，使用顶点颜色。
    vertexColors: true,
});

const mountainside = new THREE.Mesh(geometry, material);
mountainside.rotateX(- Math.PI / 2);
mountainside.receiveShadow = true


// 拿到山坡的顶点信息，随机拿到一些顶点的 x、y、z，把树种上：
loadTree((tree) => {
    let i = 0;

    while(i < positions.count) {
        const newTree = tree.clone();

        newTree.position.x = positions.getX(i);
        newTree.position.y = positions.getY(i);
        newTree.position.z = positions.getZ(i);

        mountainside.add(newTree);
        newTree.rotateX(Math.PI / 2);

        i += Math.floor(300 * Math.random());
    }
})


export default mountainside;
