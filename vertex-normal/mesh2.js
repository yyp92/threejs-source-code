import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

// 通过顶点坐标和顶点索引来创建自定义几何体的代码。
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    100, 100, -100
]);
const attribute = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribute;

const indexes = new Uint16Array([
    0, 1, 2, 2, 1, 3
]);
geometry.index = new THREE.BufferAttribute(indexes, 1);

// 虽然有 6 个顶点索引，但只有 4 个不重复的顶点，所以我们定义和 position 一一对应的 4 条法线就好。
const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    1, 1, 0
]);
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);


// const material = new THREE.MeshBasicMaterial({
//     color: new THREE.Color('orange')
// });

const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('orange'),
    shininess: 1000
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
