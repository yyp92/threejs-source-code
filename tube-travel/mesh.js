import * as THREE from 'three';

// 用三维样条曲线 CatmullRomCurve3 创建穿过 6 个点的一条曲线
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-100, 20, 90),
    new THREE.Vector3(-40, 80, 100),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(100, -40, 80),
    new THREE.Vector3(150, 60, 60)
]);

// TubeGeometry 创建管道几何体。
// 设置管道分段数 100，圆分段数 30，半径 5
const geometry = new THREE.TubeGeometry(path, 100, 5, 30);

const loader = new THREE.TextureLoader();
const texture = loader.load('./stone.png')
texture.wrapS = THREE.RepeatWrapping;
texture.colorSpace = THREE.SRGBColorSpace;
// x 方向重复 20 次
texture.repeat.x = 20;


const material = new THREE.MeshBasicMaterial({
    // color: new THREE.Color('orange'),
    map: texture,

    // 受环境光影响的纹理贴图
    aoMap: texture, 

    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);


// 取 1000 个均匀的点
export const tubePoints = path.getSpacedPoints(1000);

export default mesh;
