import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/Addons.js';

const curvePath = new THREE.CurvePath();

const v1 = new THREE.Vector2(0, 0);
const v2 = new THREE.Vector2(0, 300);
const v3 = new THREE.Vector2(300, 0);

// 先画了 1 条直线 LineCurve，然后画了一条曲线 EllipseCurve，之后再画一条直线，用 CurvePath 连接起来（顺序很重要）。
const line1 = new THREE.LineCurve(v1, v3);
curvePath.add(line1);

const arc = new THREE.EllipseCurve(0, 0, 300, 300, 0, Math.PI / 2);
curvePath.add(arc);

const line2 = new THREE.LineCurve(v1, v2);
curvePath.add(line2);

// 从上面取 100 个点来生成 Shape
const points = curvePath.getPoints(100);
const shape = new THREE.Shape(points);

// 用这个 Shape 经过 ExtrudeGeometry 拉伸，形成几何体，创建网格模型
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 100
})
const material = new THREE.MeshPhongMaterial({
    color: 'orange'
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
