import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./model.glb", function (gltf) {
    console.log(gltf);

    // scale.setScalar(5) 就是 scale.set(5, 5, 5)
    gltf.scene.scale.setScalar(5);
    mesh.add(gltf.scene);
})

export default mesh;
