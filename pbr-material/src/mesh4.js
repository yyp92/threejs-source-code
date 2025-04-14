import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// export const textureCube = new THREE.CubeTextureLoader()
//     .setPath('./forest/')
//     .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const loader = new THREE.TextureLoader();
const texture = loader.load('./zhuan.jpg');
texture.colorSpace = THREE.SRGBColorSpace;


const geometry = new THREE.TorusGeometry(300, 100);
const material = new THREE.MeshPhysicalMaterial({
    color: 'blue',
    sheen: 1,
    sheenRoughness: 1,
    sheenColor: 'white',
    // 光泽层颜色贴图看下效果
    sheenColorMap: texture
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
