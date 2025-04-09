
import * as THREE from 'three';

const group = new THREE.Group();

function createLine(type) {
    const points = [
        new THREE.Vector3(0, 0, 0),
        type === 'y' 
            ? new THREE.Vector3(0, 100, 0)
            : new THREE.Vector3(100, 0, 0)
    ]
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });
    geometry.setFromPoints(points);
    
    const line = new THREE.Line(geometry, material);
    return line;
}

// 画一下刻度
// 每两个点构成一条线段，用 LineSegments 画出来
function createScaleLine(type) {
    const points = [];

    for (let i = 0; i <= 100; i += 10) {
        if (type === 'y') {
            points.push(new THREE.Vector3(0, i, 0));
            points.push(new THREE.Vector3(-5, i, 0));
        }
        else {
            points.push(new THREE.Vector3(i, 0, 0));
            points.push(new THREE.Vector3(i, -5, 0));
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });

    const scaleLine = new THREE.LineSegments(geometry, material);
    return scaleLine;
}

// 画布宽高 100 * 100，字体大小 48，把坐标原点移到画布中心，然后写个数字
function createCanvas(text) {
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100;
    const h = canvas.height = 100;

    const c = canvas.getContext('2d');
    c.translate(w / 2, h / 2);
    c.fillStyle = "#ffffff";
    c.font = "normal 48px 宋体";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.fillText(text, 0, 0);

    return canvas;
}


function createNum(dataArr) {
    const nums = new THREE.Group();

    dataArr.forEach((item, i) => {
        // 用 CanvasTexture 创建纹理，作为矩形平面的颜色贴图
        const texture = new THREE.CanvasTexture(createCanvas(item));
        
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshBasicMaterial({
            // color: 'orange'
            map: texture
        });
        const num = new THREE.Mesh(geometry, material);
        num.position.y = item + 10;
        num.position.x = 10 + i * 20 + 5;
        nums.add(num);
    })

    return nums;
}

// 画柱状图，这里用 PlaneGeometry 就行
// 传入数组，根据高度创建平面，这里调整每个 bar 的 y 就是高度的一半，x 是留出刚开始的 10，然后每 20 宽度放一个，还要加上宽度的一半也就是 5
function createBar(dataArr) {
    const bars = new THREE.Group(); 

    dataArr.forEach((item, i) => {
        const geometry = new THREE.PlaneGeometry(10, item, 1, 20);

        // 拿到所有的顶点
        const positions = geometry.attributes.position;
        const height = 100;

        const colorsArr = [];
        const color1 = new THREE.Color('green');
        const color2 = new THREE.Color('blue');
        const color3 = new THREE.Color('red');

        for (let i = 0; i < positions.count; i++) {
            // 根据 y 值和高度的比值算出颜色百分比，用 color.lerp 来计算颜色
            // 这里 y 要加上高度的一半，也就是下边和 x 轴平齐的位置再算
            const y = positions.getY(i) + item / 2

            if (y <= 50) {
                const percent = y / 50;
                const c = color1.clone().lerp(color2, percent);
                colorsArr.push(c.r, c.g, c.b);
            }
            else if (y > 50 && y <= 100) {
                const percent = ( y - 50 ) / 50;
                const c = color2.clone().lerp(color3, percent);
                colorsArr.push(c.r, c.g, c.b);
            }
        }
        
        // 最后把算出的顶点颜色设置到 geometry.attributes.color
        const colors = new Float32Array(colorsArr);
        geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

        // 在 material 设置 vertexColors 为 true，使用顶点颜色
        const material = new THREE.MeshBasicMaterial({
            // color: 'orange'
            vertexColors: true
        });

        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = 10 + i * 20 + 5;
        bar.position.y = item / 2;
        bars.add(bar);
    });

    bars.add(createNum(dataArr));

    return bars;
}


const xLine = createLine('x');
const yLine = createLine('y');


const xScaleLine = createScaleLine('x');
const yScaleLine = createScaleLine('y');

const bar = createBar([70, 20, 100, 40, 50]);

group.add(xLine, yLine, xScaleLine, yScaleLine, bar);

export default group;
