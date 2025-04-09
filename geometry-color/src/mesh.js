import * as THREE from 'three';

// 用 BufferGeometry 来创建自定义几何体，用 setFromPoints 来确定顶点位置。
const geometry = new THREE.BufferGeometry();

const point1 = new THREE.Vector3(0, 0, 0);
const point2 = new THREE.Vector3(0, 100, 0);
const point3 = new THREE.Vector3(100, 0, 0);
geometry.setFromPoints([point1, point2, point3]);

// color 的三个值分别是红绿蓝，从 0 到 1
const colors = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);

// 设置 geometry.attributes.color 和顶点一一对应的顶点颜色
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);



// * 1. 点模型
// const material = new THREE.PointsMaterial({
//     // * 在材质里设置 vertexColors 为 true 才会用你自定义的顶点颜色。
//     vertexColors: true,
//     size: 30,
// });
// const points = new THREE.Points(geometry, material);
// export default points;


// * 2. 换成线模型，用首尾相连的 LineLoop
// const material = new THREE.LineBasicMaterial({
//     vertexColors: true
// });
// const line = new THREE.LineLoop(geometry, material);
// export default line;


// * 3. 网格模型渲染
const material = new THREE.MeshBasicMaterial({
    vertexColors: true
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;


