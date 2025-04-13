import * as THREE from 'three';

const geometry = new THREE.CylinderGeometry(200, 200, 500);
const material = new THREE.MeshStandardMaterial({
    color: 'orange',
    roughness: 0,
    metalness: 1,
    envMap: textureCube,
    envMapIntensity: 1
});
const mesh = new THREE.Mesh(geometry, material);

export default mesh
