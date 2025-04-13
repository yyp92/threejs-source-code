import * as THREE from 'three';

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);
plane.position.y = -50;

const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const box2 = box.clone();
box2.position.x = 200;

const mesh = new THREE.Group();
mesh.add(plane);
mesh.add(box);
mesh.add(box2);



const img = new Image();
img.src = './heart.png';
img.onload = function() {
    const texture = new THREE.CanvasTexture(createCanvas('aaa', img));

    // * 用 Sprite 来做标注
    const spriteMaterial = new THREE.SpriteMaterial({
        // color: 'lightgreen',
        map: texture
    });

    const tag1 = new THREE.Sprite(spriteMaterial);
    tag1.scale.set(80, 50);
    tag1.position.y = 100;
    box.add(tag1);

    const tag2 = new THREE.Sprite(spriteMaterial);
    tag2.scale.set(80, 50);
    tag2.position.y = 100;
    box2.add(tag2);
}


// 创建一个 canvas 元素，用 CanvasTexture 作为 SpriteMaterial 的纹理。
function createCanvas(text) {
    const canvas = document.createElement("canvas");
    const w = canvas.width = 80;
    const h = canvas.height = 50;

    const c = canvas.getContext('2d');
    c.drawImage(img, 0, 0, w/2, h/2);
    
    // c.fillStyle = "white";
    // c.fillRect(0, 0, w, h);

    // c.fillStyle = "green";
    // c.fillRect(10, 10, w - 20, h - 20);

    c.translate(w / 2, h / 2);
    c.fillStyle = "#ffffff";
    c.font = "normal 24px 微软雅黑";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.fillText(text, 0, 0);

    return canvas;
}

// const texture = new THREE.CanvasTexture(createCanvas('aaa'));

// // * 用 Sprite 来做标注
// const spriteMaterial = new THREE.SpriteMaterial({
//     // color: 'lightgreen',
//     map: texture
// });

// const tag1 = new THREE.Sprite(spriteMaterial);
// tag1.scale.set(80, 50);
// tag1.position.y = 100;
// box.add(tag1);

// const tag2 = new THREE.Sprite(spriteMaterial);
// tag2.scale.set(80, 50);
// tag2.position.y = 100;
// box2.add(tag2);


export default mesh;
