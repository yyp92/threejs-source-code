import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export const textureCube = new THREE.CubeTextureLoader()
    .setPath('./forest/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const geometry = new THREE.CylinderGeometry(200, 200, 500);
const material = new THREE.MeshStandardMaterial({
    color: 'orange',

    // roughness 是粗糙度，设置为 0 就是完全光滑的镜面
    roughness: 0,

    // metalness 是金属度，设置为 1 就是完全的金属效果
    metalness: 1,

    // envMap 环境贴图
    envMap: textureCube,
    envMapIntensity: 1
});

const mesh = new THREE.Mesh(geometry, material);


const gui = new GUI();
gui.addColor(material, 'color');
gui.add(material, 'roughness', 0, 1);
gui.add(material, 'metalness', 0, 1);
gui.add(material, 'envMapIntensity', 0, 5);


export default mesh
