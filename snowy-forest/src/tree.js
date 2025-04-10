import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const tree = new THREE.Group();

// 用 GLTFLoader 加载 gltf 模型。
const loader = new GLTFLoader();

// 这个模块导出一个 loadTree 方法，回调函数里是加载好的模型
function loadTree(callback) {
    loader.load('./tree/tree.gltf', gltf => {
        gltf.scene.scale.set(10, 10, 10);
    
        tree.add(gltf.scene);

        gltf.scene.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                
                if( obj.name === "leaves001") {
                    obj.material.color.set('green');
                }
                else {
                    obj.material.color.set('brown');
                }
            }
        });    

        callback(tree);
    });
}

export default loadTree;
