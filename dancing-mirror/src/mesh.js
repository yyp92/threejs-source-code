import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Reflector } from 'three/examples/jsm/Addons.js';

const group = new THREE.Group();

function createGround() {
    const geometry = new THREE.PlaneGeometry(3000, 3000);
    const material = new THREE.MeshPhongMaterial({
        color: 'orange'
    })

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;

    return mesh;
}

function createMirrors() {
    const mirrors = new THREE.Group();

    // 角度是从 0 到 360 度也就是 0 到 Math.PI * 2，每 90 度也就是 Math.PI / 2 放一面镜子
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        const mirror = new Reflector(geometry);

        // y 是一样的，往上移动高度的一半
        // x、z 通过半径 * 旋转角度的 cos、sin 来算
        mirror.position.y = 500;
        mirror.position.x = 500 * Math.sin(i);
        mirror.position.z = 500 * Math.cos(i);
        mirror.rotateY(i);
        mirror.rotateY(-Math.PI);

        mirrors.add(mirror);
    }

    return mirrors;
}

function loadDancer() {
    const dancer = new THREE.Group();
    const loader = new GLTFLoader();

    loader.load("./Michelle.glb", function (gltf) {
        // console.log(gltf);

        dancer.add(gltf.scene);
        gltf.scene.scale.set(200, 200, 200);

        gltf.scene.traverse(obj => {
            obj.castShadow = true;
        })        

        const mixer = new THREE.AnimationMixer(dancer);
        const clipAction = mixer.clipAction(gltf.animations[0]);
        clipAction.play();

        const clock = new THREE.Clock();
        function render() {
            const delta = clock.getDelta();
            mixer.update(delta);

            requestAnimationFrame(render);
        }

        render();
    })

    return dancer;
}


group.add(createGround());
group.add(createMirrors());
group.add(loadDancer());

export default group;
