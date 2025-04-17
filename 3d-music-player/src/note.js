import * as THREE from 'three';

function createCanvas() {
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100 * dpr;
    const h = canvas.height = 100 * dpr;

    const ctx = canvas.getContext('2d');
    ctx.translate(w / 2, h / 2);

    ctx.moveTo(-20 * dpr, 40 * dpr);
    ctx.lineTo(-20 * dpr, -10 * dpr);
    ctx.lineTo(20 * dpr, -10 * dpr);
    ctx.lineTo(20 * dpr, 30 * dpr);

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    ctx.beginPath();
    // 参数: x、y，长短半轴长，旋转角度，开始结束角度
    ctx.ellipse(10 * dpr, 30 * dpr, 8 * dpr, 12 * dpr, Math.PI / 2, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-30 * dpr, 40 * dpr, 8 * dpr, 12 * dpr, Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
}

function createNote() {
    const texture = new THREE.CanvasTexture(createCanvas());
    const material = new THREE.SpriteMaterial({
        map: texture
    });

    const note = new THREE.Sprite(material);
    note.scale.set(100, 100);

    return note;
}


const group = new THREE.Group();

for (let i = 0; i < 100; i ++) {
    const note = createNote();

    const x = -1000 + 2000 * Math.random();
    const y = -1000 + 2000 * Math.random();
    const z = -2000 + 4000 * Math.random();
    note.position.set(x, y, z);

    group.add(note);
}


export default group;
