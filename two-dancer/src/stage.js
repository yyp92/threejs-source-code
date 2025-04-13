import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();

const stage = new THREE.Group();

loader.load("./stage.glb", function (gltf) {
    console.log(gltf);
    stage.add(gltf.scene);
    gltf.scene.scale.set(50, 50, 50);

    // 开启舞台的接收阴影属性
    // 因为它们都有很多子对象，所以要遍历设置。
    gltf.scene.traverse(obj => {
        obj.receiveShadow = true;
    });    
});


// 我们再加载一个放对面，因为骨骼动画适合模型绑定的，不能直接 clone，我们重新加载一次
// 加载两次模型，传入 z、旋转角度：
loadDancer((dancer)=> {
    dancer.name = 'dancer1';
    dancer.traverse((obj) => {
        obj.target = dancer;
    })

    const ele = document.getElementById('dialog');
    const obj = new CSS2DObject(ele);
    dancer.add(obj);
    obj.position.set(1, 0, 0);
    ele.style.display = 'block';
    setTimeout(() => {
        ele.textContent = '谁叫你还搞不清楚我跟你的差别';
    }, 5000);
}, 200, Math.PI);

loadDancer(
    (dancer) => {
        dancer.name = 'dancer2';
        dancer.traverse((obj) => {
            obj.target = dancer;
        })

        // 遍历找到 mesh，先复制一份材质，不然共用材质会相互影响，然后改下颜色
        dancer.traverse(obj => {
            if (obj.isMesh) {
                obj.material = obj.material.clone();
                obj.material.color.set('orange');
            }
        })

        const ele = document.getElementById('dialog2');
        const obj = new CSS2DObject(ele);
        ele.style.display = 'block';
        dancer.add(obj);
        obj.position.set(1, 0, 0);
        setTimeout(() => {
            ele.textContent = '超人没空给你给你安慰';
        }, 8000);

    },
    -200,
    0
);

function loadDancer(callback, z, angle) {
    loader.load("./Michelle.glb", function (gltf) {
        callback(gltf.scene);

        // 开启舞者的投射阴影属性
        gltf.scene.traverse(obj => {
            obj.castShadow = true;
        });        

        stage.add(gltf.scene);
        gltf.scene.scale.set(300, 300, 300);
        gltf.scene.position.z = z;
        gltf.scene.rotateY(angle);
    
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const clipAction = mixer.clipAction(gltf.animations[0]);
        clipAction.play();

        const clock = new THREE.Clock();
        function render() {
            const delta = clock.getDelta();
            mixer.update(delta);
    
            requestAnimationFrame(render);
        }
    
        render();
    });
}



export default stage;
