/**
 * * 线模型 Line
 */
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    0, 0, 100,
    100, 100, 0
]);
const attribute = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribute;

const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('orange')
});

// const line = new THREE.Line(geometry, material);

// LineLoop 是首尾相连
// const line = new THREE.LineLoop(geometry, material);

// LineSegments 是每两个连一条线段
const line = new THREE.LineSegments(geometry, material);

export default line;

