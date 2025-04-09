import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./gltf1/CesiumMan.gltf", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);

    gltf.scene.scale.set(50, 50, 50);

    gltf.scene.traverse(obj => {
        if (obj.isMesh) {
            console.log(obj.name, obj);

            // 展示线框
            obj.material.wireframe = true;
            obj.material.color.set('orange');
            // 把颜色贴图去掉
            obj.material.map = null;
        }
    })
})

loader.load("./gltf2/CesiumMan.gltf", function (gltf) {
    mesh.add(gltf.scene);

    gltf.scene.scale.set(50, 50, 50);
    gltf.scene.translateX(-50);

    gltf.scene.traverse(obj => {
        if (obj.isMesh) {
            obj.material.wireframe = true;
            obj.material.color.set('lightblue');
            obj.material.map = null;
        }
    })
});

loader.load("./gltf3/CesiumMan.glb", function (gltf) {
    mesh.add(gltf.scene);

    gltf.scene.scale.set(50, 50, 50);
    gltf.scene.translateX(50);

    gltf.scene.traverse(obj => {
        if (obj.isMesh) {
            obj.material.wireframe = true;
            obj.material.color.set('lightgreen');
            obj.material.map = null;
        }
    })
});


export default mesh;
