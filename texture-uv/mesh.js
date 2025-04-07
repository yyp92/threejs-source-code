import * as THREE from 'three';

// 创建一个 PlaneGeometry，用 MeshBasicMaterial 材质，加载纹理贴图，然后设置下颜色空间
const geometry = new THREE.PlaneGeometry(200, 100);

// BufferAttribute 设置每 2 个为一个坐标。
// 把 uv 坐标限定在了 0,0 到 0.5,0.5 的区域。
const uvs = new Float32Array([
    0, 0.5,
    0.5, 0.5,
    0, 0,
    0.5, 0
]);
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);


const loader = new THREE.TextureLoader();
const texture = loader.load('./bg.png');
texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial(({
    map: texture
}));

const mesh = new THREE.Mesh(geometry, material);

console.log(mesh);

export default mesh;
