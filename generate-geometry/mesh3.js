/**
 * * Shape + ShapeGeometry 可以通过 Shape 定义多边形
 * * Shape + ExtrudeGeometry 把 ShapeGeometry 换成拉伸的几何体 ExtrudeGeometry
 */
import * as THREE from 'three';

// 第一种：传入点构造
// const pointsArr = [
//     new THREE.Vector2(100, 0),
//     new THREE.Vector2(50, 20),
//     new THREE.Vector2(0, 0),
//     new THREE.Vector2(0, 50),
//     new THREE.Vector2(50, 100)
// ];
// const shape = new THREE.Shape(pointsArr);

// 第二种定义方式
const shape = new THREE.Shape();
shape.moveTo(100, 0);
shape.lineTo(0, 0);
shape.lineTo(0, 50);
shape.lineTo(80, 100);

const path = new THREE.Path();
path.arc(50, 50, 10);
// shape.holes 可以定义内孔
shape.holes.push(path);


// const geometry = new THREE.ShapeGeometry(shape);
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 100
});
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color('lightgreen')
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
