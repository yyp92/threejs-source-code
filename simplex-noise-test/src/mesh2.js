/**
 * * 随机运动轨迹
 */

import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';
import { Easing, Group, Tween } from 'three/examples/jsm/libs/tween.module.js';
import { throttle } from 'lodash-es';

const group = new THREE.Group();

for (let i = 0; i < 100; i ++) {
    const material = new THREE.SpriteMaterial({
        color: 'orange'
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(100,100);
    group.add(sprite);

    const x = -2000 + 4000 * Math.random();
    const y = -2000 + 4000 * Math.random();
    const z = -2000 + 4000 * Math.random();

    sprite.position.set(x, y, z);
}

const simplex = new SimplexNoise();
const tweenGroup = new Group();

let time = 0;
export function updatePosition() {
    group.traverse(obj => {
        if (obj.isSprite) {
            const { x, y, z} = obj.position;

            const x2 = x + simplex.noise(x, time) * 10;
            const y2 = y + simplex.noise(y, time) * 10;
            const z2 = z + simplex.noise(z, time) * 10;

            // obj.position.set(x2, y2, z2);

            const tween= new Tween(obj.position)
            .to({
                x: x2,
                y: y2,
                z: z2
            }, 500)
            .easing(Easing.Quadratic.InOut)
            .repeat(0)
            .start()
            .onComplete(() => {
                tweenGroup.remove(tween);
            })

            tweenGroup.add(tween);
        }
    })

    time++;
}

// 这个 udpatePosition 的函数也需要 500ms 调一次，我们用 lodash 的 throttle 方法来节流
const updatePosition2 = throttle(updatePosition, 500);

function render() {
    tweenGroup.update()
    updatePosition2();
    requestAnimationFrame(render);
}

render();


export default group;

