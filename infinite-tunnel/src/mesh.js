import * as THREE from 'three';

// 32 是分段数，第六个参数是是否空心，设置为 true
const geometry = new THREE.CylinderGeometry( 30, 50, 1000, 32, 32, true);

// 加载纹理图片，设置颜色空间，然后设置到材质的颜色贴图
const loader = new THREE.TextureLoader();
const texture = loader.load('./storm.png');
texture.colorSpace = THREE.SRGBColorSpace;
// 竖直方向重复，就要设置 wrapT
texture.wrapT = THREE.RepeatWrapping;
// 设置竖直方向重复两次
texture.repeat.set(1, 2)

const material = new THREE.MeshBasicMaterial({ 
    // map: texture,

    transparent: true,
    alphaMap: texture,
    side: THREE.BackSide
});

const tunnel = new THREE.Mesh(geometry, material);

export default tunnel;
