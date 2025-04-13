/**
 * * 玻璃效果
 */
import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

export const textureCube = new THREE.CubeTextureLoader()
    .setPath('./forest/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 十二面几何体 DodecahedronGeometry
const geometry = new THREE.DodecahedronGeometry(300);


/**
 * * 玻璃材质
 * 玻璃的话金属度 metalness 肯定是 0，光滑的玻璃粗糙度 roughness 也是 0
 * 透光率 transmission 设置 0.9，差不多完全透光，ior 折射率范围是 0 到 2.33
 */
const material = new THREE.MeshPhysicalMaterial({
    color: 'blue',
    metalness: 0,
    roughness: 0,
    envMap:textureCube,
    transmission: 0.9,
    ior: 1.8,
});

const gui = new GUI();
gui.addColor(material, 'color');
gui.add(material, 'transmission', 0, 1);
gui.add(material, 'ior', 0, 2.33);

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
