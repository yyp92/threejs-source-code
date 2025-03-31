/**
 * * 虚线材质 LineDashedMaterial
 */
import * as THREE from 'three';

// BoxGeometry 想渲染线模型，不能直接用，要用 EdgesGeometry 转换成线框模型才行
const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
const geometry = new THREE.EdgesGeometry(boxGeometry);

// 用 LineDashedMaterial 虚线材质，设置虚线的大小
const material = new THREE.LineDashedMaterial(({
    color: new THREE.Color('orange'),
    dashSize: 10,
    gapSize: 10
}));

const line = new THREE.Line(geometry, material);
// 调用下 computeLineDistances 方法来计算虚线。
line.computeLineDistances();

console.log(line);

export default line;
