import * as THREE from 'three';
import {Tween} from '@tweenjs/tween.js'

const group = new THREE.Group();

export const textureCube = new THREE.CubeTextureLoader()
    .setPath('./city/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);


// 参数 128 是 size，也就是 128 * 128 像素，一般设置 2 的多少次方，比如 32、64、128、256、512、1024 这种
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
// 创建 CubeCamera，它只有近裁截面、远裁截面 2 个参数，我们指定 1 到 1000 的范围
// 然后指定渲染目标，渲染到 WebGLRenderTarget 对象
export const cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );


const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.MeshStandardMaterial({
    color: 'white',
    metalness: 1,
    roughness: 0,
    // 渲染出来后把 cubeRenderTarget.texture 作为 envMap 就好了。
    envMap: cubeRenderTarget.texture
});
const mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

const geometry2 = new THREE.SphereGeometry(100);
const material2 = new THREE.MeshStandardMaterial({
    color: 'lightgreen'
});
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.set(0, 0, 500);
group.add(mesh2);


// 让小球动一下
let r = 800;
export const ballTween = new Tween({ angle: 0})
.to({
    angle: Math.PI
}, 5000)
.repeat(Infinity)
.onUpdate(obj => {
    mesh2.position.x = Math.cos(obj.angle) * r;
    mesh2.position.z = Math.sin(obj.angle) * r;
}).start();


export default group;
