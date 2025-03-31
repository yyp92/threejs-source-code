/**
 * * 纹理贴图 Texture
 */
import * as THREE from 'three';


const loader = new THREE.TextureLoader();
const texture = loader.load('./zhuan.jpg');
// 设置在水平（wrapS）和竖直（wrapT）方向重复，然后设置重复次数。
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(3, 3);
texture.colorSpace = THREE.SRGBColorSpace;


// 创建了一个 PlaneGeometry，然后给 MeshBasicMaterial 设置了纹理贴图
const geometry = new THREE.PlaneGeometry(1000, 1000);

const material = new THREE.MeshBasicMaterial({
    map: texture,

    // 因为 map 只是把贴图的颜色加上去了，没有做进一步的处理，如果你想要那种受环境光影响的凹凸感，需要设置 aoMap 属性
    // * 这个属性就是基于光线对贴图的影响来做一次计算，加上凹凸感。
    aoMap: texture
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;


