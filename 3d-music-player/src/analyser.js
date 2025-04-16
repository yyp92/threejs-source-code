import * as THREE from 'three';

const group = new THREE.Group();

const color1 = new THREE.Color('yellow');
const color2 = new THREE.Color('blue');

for (let i = 1; i <= 21; i++) {
    // 用 Shape 画一个圆，然后定义 holes 的孔。
    const shape = new THREE.Shape();
    shape.absarc(0, 0, i * 50, 0, Math.PI * 2);
    
    const path = new THREE.Path();
    path.absarc(0, 0, i * 50 - 20, 0, Math.PI * 2);
    
    shape.holes.push(path);
    
    // 之后用 ExtrudeGeometry 来拉伸成几何体
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 300,
        curveSegments: 50
    });

    const percent = i / 21;
    const color = color1.clone().lerp(color2, percent);

    const material = new THREE.MeshPhysicalMaterial({
        color
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
}

group.rotateX(- Math.PI / 2);

export default group;
