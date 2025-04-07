import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const texture = loader.load('./muxing.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
// 这里是竖直方向重复，所以设置 wrapT
texture.wrapT = THREE.RepeatWrapping;


const geometry = new THREE.SphereGeometry(50);

const material = new THREE.MeshBasicMaterial({
    map: texture
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
