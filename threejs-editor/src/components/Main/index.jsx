import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { MeshTypes, useThreeStore } from '../../store';
import { init } from "./init";


function Main() {
    const { data, addMesh } = useThreeStore();
    const sceneRef = useRef();


    useEffect(() => {
        const dom = document.getElementById('threejs-container');
        const { scene } = init(dom, data);

        sceneRef.current = scene;

        return () => {
            dom.innerHTML = '';
        }
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;

        if (scene) {
            // 遍历 scene，删掉所有的 mesh
            scene.traverse(obj => {
                if (obj.isMesh) {
                    // 删掉 mesh 之前要把 mesh.geometry 占用的 cpu 资源 dispose 掉。
                    obj.geometry.dispose();
                    obj.parent.remove(obj);
                }
            });
        }
    
        // 遍历 data.meshArr，根据类型来渲染 mesh。
        data.meshArr.forEach(item => {
            if (item.type === MeshTypes.Box) {
                const {
                    width,
                    height,
                    depth,
                    material: {
                        color
                    }
                } = item.props;

                const geometry = new THREE.BoxGeometry(width, height, depth);
                const material = new THREE.MeshPhongMaterial({
                    color
                });
                const mesh = new THREE.Mesh(geometry, material);

                scene.add(mesh);
            }
            else if(item.type === MeshTypes.Cylinder) {
                const {
                    radiusTop,
                    radiusBottom,
                    height,
                    material: {
                        color
                    }
                } = item.props;

                const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
                const material = new THREE.MeshPhongMaterial({
                    color
                });
                const mesh = new THREE.Mesh(geometry, material);

                scene.add(mesh);
            }
        })
    }, [data]);
    

    return <div
        className="Main"
        id="threejs-container"
    ></div>
}

export default Main;
