import * as THREE from 'three';
import { LineMaterial } from 'three/examples/jsm/Addons.js';
import createLabel from './lable'


const data = [
    {
        name: '春节销售额',
        value: 1000
    },
    {
        name: '夏节销售额',
        value: 3000
    },
    {
        name: '秋节销售额',
        value: 800
    },
    {
        name: '冬节销售额',
        value: 500
    }
];

// * 一个生成随机颜色的函数
let usedColor = [];
let colors = ['red', 'pink', 'blue', 'purple', 'orange', 'lightblue', 'green', 'lightgreen']
function getRandomColor() {
    // 从 colors 数组里随机取一个下标的颜色返回，用过的颜色记录下来，如果随机到用过的就重新生成。
    let index = Math.floor(Math.random() * colors.length);

    while(usedColor.includes(index)) {
        index = Math.floor(Math.random() * colors.length);
    }

    usedColor.push(index);

    return colors[index];
}

const group = new THREE.Group();

const R = 300;
// * createPieChart 方法里根据传入的数据计算出总数 total，然后计算出每个 part 的角度
function createPieChart(data) {
    let total = 0;

    data.forEach(item => {
        total += item.value;
    });

    const angles = data.map(item => {
        return item.value / total * 360;
    });

    let startAngle = 0;
    angles.forEach((angle, i) => {
        const curvePath = new THREE.CurvePath();

        // 用 MathUtils.degToRad 把角度转为弧度制
        const rad = THREE.MathUtils.degToRad(angle);
        // 开始角度从 0 开始，结束角度就是加上当前的角度。
        const endAngle = startAngle + rad;

        // 通过两条直线一条弧线把形状画出来之后，用 ExtrudeGeometry 拉伸下。
        // 两条直线的 x、y 是通过 cos、sin 算出来的。
        const x1 = R * Math.cos(startAngle);
        const y1 = R * Math.sin(startAngle);

        const x2 = R * Math.cos(endAngle);
        const y2 = R * Math.sin(endAngle);

        const v1 = new THREE.Vector2(0, 0);
        const v2 = new THREE.Vector2(x1, y1);
        const v3 = new THREE.Vector2(x2, y2);

        // 先画了 1 条直线 LineCurve，然后画了一条曲线 EllipseCurve，之后再画一条直线，用 CurvePath 连接起来（顺序很重要）。
        const line1 = new THREE.LineCurve(v1, v2);
        curvePath.add(line1);

        const arc = new THREE.EllipseCurve(0, 0, R, R, startAngle, endAngle);
        curvePath.add(arc);

        const line2 = new THREE.LineCurve(v1, v3);
        curvePath.add(line2);

        // 从上面取 100 个点来生成 Shape
        const points = curvePath.getPoints(100);
        const shape = new THREE.Shape(points);

        // 用这个 Shape 经过 ExtrudeGeometry 拉伸，形成几何体，创建网格模型
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 100
        })
        const material = new THREE.MeshPhongMaterial({
            color: getRandomColor()
        });

        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

        // 每个 part 上记录下角度, 记录下中间的角度。
        mesh.angle = (endAngle + startAngle) / 2;

        // 创建标签，加到 pie 的每个 part 上
        const label = createLabel(data[i].name + ' ' + data[i].value);
        label.position.x = 400 * Math.cos(mesh.angle);
        label.position.y = 400 * Math.sin(mesh.angle);
        label.position.z = 150;
        mesh.add(label);

        label.target = mesh;
        mesh.target = mesh;

        startAngle += rad;
    })
}

createPieChart(data);
group.rotateX(- Math.PI / 2);

export default group;
