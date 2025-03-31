/**
 * * 网格模型材质透明度
 */
import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(100, 100);

const material = new THREE.MeshBasicMaterial(({
    color: new THREE.Color('orange'),
    transparent: true,
    opacity: 0.5
}));

const mesh = new THREE.Mesh(geometry, material);

console.log(mesh);

export default mesh;
