import * as THREE from 'three';
import { createNoise2D } from "simplex-noise";

// 创建一个 300 * 300 的平面几何体，分成 10 段
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

// const positions = geometry.attributes.position;
const noise2D = createNoise2D();

// for (let i = 0 ; i < positions.count; i ++) {
//     const x = positions.getX(i);
//     const y = positions.getY(i);

//     // 就把他当成 Math.random() 就行，返回 0 到 1 的数，只不过是跟那个位置的 x、y 有关系的随机数，然后乘以 50 就是 0 到 50
//     const z = noise2D(x / 300, y / 300) * 50;
//     positions.setZ(i, z);
// }

export function updatePosition() {
    const positions = geometry.attributes.position;

    for (let i = 0 ; i < positions.count; i ++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        const z = noise2D(x / 300, y / 300) * 50;

        // 因为 Math.sin 是从 -1 到 1 变化的，所以 * 10 就是 -10 到 10 变化，这样就有 20 的高度波动。
        // sin 的参数首先是传入时间，因为它是不断变化的，所以传入它就有 -1 到 1 的 sin 的不断变化。
        // 当然，它的值很大，我们要把它变小一点，乘以 0.002，这个值可以调。
        // 然后为啥要加上一个 x 呢？
        // 不加 x 是这样的：
        // 它虽然是上下不断起伏，但是是整体一起的。
        // 我们想让每个顶点都不一样，所以 sin 的参数还要传入一个 x 坐标，这样每个顶点变化的值不同，是符合正弦规律的变化。
        const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10;

        positions.setZ(i, z + sinNum);
    }

    // * 要设置 positions.needUpdate 为 true，告诉 GPU 顶点变了，需要重新渲染，不然默认不会更新顶点
    positions.needsUpdate = true;
}


const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(Math.PI / 2);

console.log(mesh);

export default mesh;

