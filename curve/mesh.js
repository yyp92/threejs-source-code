/**
 * * 椭圆、圆 曲线
 */
import * as THREE from 'three';

// 用 EllipseCurve 画一条椭圆曲线，椭圆中心是 0,0，长短半轴长分别是 100、50
// 椭圆
// const arc = new THREE.EllipseCurve(0, 0, 100, 50);

// 圆
// const arc = new THREE.EllipseCurve(0, 0, 100, 100);
const arc = new THREE.EllipseCurve(0, 0, 100, 100, 0, Math.PI / 2);

// 用 getPoints 方法从中取出一些点的坐标，传入的是分段数，20 段就是 21 个点。
// const pointsList = arc.getPoints(20);
const pointsList = arc.getPoints(50);


// 用这 21 个点的坐标设置为 BufferGeometry 的顶点，通过 setFromPoints 方法。
const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsList);


// 创建点模型
// const material = new THREE.PointsMaterial({
//     color: new THREE.Color('orange'),
//     size: 10
// });
// const points = new THREE.Points(geometry, material);
// console.log(points);

// export default points;


const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('orange')
});

const line = new THREE.Line(geometry, material);


export default line;
