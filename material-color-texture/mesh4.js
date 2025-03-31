/**
 * * 纹理贴图 Texture
 */
import * as THREE from 'three';

// 创建 TextureLoader，用它加载一张纹理贴图，设置到材质的 map 属性。
const loader = new THREE.TextureLoader();
const texture = loader.load('./diqiu.jpg');
texture.colorSpace = THREE.SRGBColorSpace;


// 创建一个球状几何体 SphereGeometry，半径为 100
const geometry = new THREE.SphereGeometry(100);

const material = new THREE.MeshBasicMaterial({
    // color: new THREE.Color('orange'),
    map: texture
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;

