import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { FloatButton } from "antd";
import { ArrowsAltOutlined, DragOutlined, RetweetOutlined } from "@ant-design/icons";
import { MeshTypes, useThreeStore } from '../../store';
import { init } from "./init";


function Main() {
    const {
        data,
        addMesh,
        selectedObj,
        setSelectedObj,
        removeMesh,
        updateMeshInfo,
        setScene,
        selectedObjName
    } = useThreeStore();
    const sceneRef = useRef();
    const transformControlsModeRef = useRef();
    const transformControlsAttachObjRef = useRef();

    function onSelected(obj) {
        setSelectedObj(obj)
    }

    useEffect(() => {
        const dom = document.getElementById('threejs-container');
        const {
            scene,
            setTransformControlsMode,
            transformControlsAttachObj
        } = init(dom, data, onSelected, updateMeshInfo);

        sceneRef.current = scene;
        transformControlsModeRef.current = setTransformControlsMode;
        transformControlsAttachObjRef.current = transformControlsAttachObj

        setScene(scene)

        return () => {
            dom.innerHTML = '';
        }
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;

        // 遍历 data.meshArr，根据类型来渲染 mesh。
        data.meshArr.forEach(item => {
            if (item.type === MeshTypes.Box) {
                const {
                    width,
                    height,
                    depth,
                    material: {
                        color
                    },
                    position,
                    scale,
                    rotation
                } = item.props;
                let mesh = scene.getObjectByName(item.name)

                if (!mesh) {
                    const geometry = new THREE.BoxGeometry(width, height, depth);
                    const material = new THREE.MeshPhongMaterial({
                        color
                    });

                    mesh = new THREE.Mesh(geometry, material);
                }

                mesh.name = item.name
                mesh.position.copy(position)
                mesh.scale.copy(scale)
                mesh.rotation.x = rotation.x;
                mesh.rotation.y = rotation.y;
                mesh.rotation.z = rotation.z;

                scene.add(mesh);
            }
            else if (item.type === MeshTypes.Cylinder) {
                const {
                    radiusTop,
                    radiusBottom,
                    height,
                    material: {
                        color
                    },
                    position,
                    scale,
                    rotation
                } = item.props;

                let mesh = scene.getObjectByName(item.name)

                if (!mesh) {
                    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
                    const material = new THREE.MeshPhongMaterial({
                        color
                    });

                    mesh = new THREE.Mesh(geometry, material);
                }

                mesh.name = item.name
                mesh.position.copy(position)
                mesh.scale.copy(scale)
                mesh.rotation.x = rotation.x;
                mesh.rotation.y = rotation.y;
                mesh.rotation.z = rotation.z;

                scene.add(mesh);
            }
        })

        // react 会浅层对比 scene 有没有变化，这里 clone 一下来触发更新。
        setScene(scene.clone())
    }, [data]);

    // 按下 delete 键的时候，如果有选中的物体，就要把它删除
    useEffect(() => {
        function handleKeydown(e) {
            if (e.key === 'Backspace') {
                if (selectedObj) {
                    // 在删除物体之前，先 detach 一下
                    transformControlsAttachObjRef.current(null);

                    sceneRef.current.remove(selectedObj)
                    removeMesh(selectedObj.name)
                }
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        }
    }, [selectedObj]);

    // 右边区域点击物体name，左边编辑器选中物体 
    useEffect(() => {
        if (selectedObjName) {
            const obj = sceneRef.current.getObjectByName(selectedObjName)
            setSelectedObj(obj)
            transformControlsAttachObjRef.current(obj)
        }
    }, [selectedObjName])


    const setMode = (mode) => {
        transformControlsModeRef.current(mode);
    }


    return (
        <div
            className="Main"
            id="threejs-container"
        >
            <div id="threejs-container"></div>

            <FloatButton.Group className="btn-group">
                <FloatButton
                    icon={<DragOutlined />}
                    onClick={() => setMode('translate')}
                />

                <FloatButton
                    icon={<RetweetOutlined />}
                    onClick={() => setMode('rotate')}
                />

                <FloatButton
                    icon={<ArrowsAltOutlined />}
                    onClick={() => setMode('scale')}
                />
            </FloatButton.Group>
        </div>
    )
}

export default Main;
