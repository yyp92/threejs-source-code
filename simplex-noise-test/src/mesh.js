import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';


// 创建 BufferGeometry，然后用噪声库来改变 z，根据 x、y 来计算连续随机的 z
const geometry = new THREE.PlaneGeometry(3000, 3000, 200, 200);

const simplex = new SimplexNoise();

const positions = geometry.attributes.position;

for (let i = 0 ; i < positions.count; i ++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    // 先用第一重噪声生成基本地形，然后再用更多重噪声来增加崎岖不平的效果。
    let z = simplex.noise(x / 1000, y / 1000) * 300;
    z += simplex.noise(x / 400, y / 400) * 100;  
    z += simplex.noise(x / 200, y / 200) * 50;  

    positions.setZ(i, z);
}

const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(- Math.PI / 2);
// console.log(mesh);

export default mesh;
