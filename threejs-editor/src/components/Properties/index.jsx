import {useState, useEffect} from 'react'
import { Tree } from "antd";
import { useThreeStore } from "../../store";

function Properties() {
    const {
        data,
        selectedObj,
        scene,
        setSelectedObjName
    } = useThreeStore();

    const [treeData, setTreeData] = useState();

    useEffect(() => {
        // if (scene?.traverse) {
        //     scene.traverse((obj) => {
        //         console.log('=====obj', obj)
        //     })
        // }

        if (scene?.children) {
            const tree = scene.children
                .map((item) => {
                    const {
                        isMesh,
                        geometry,
                        type,
                        name,
                        id,
                        isTransformControlsRoot
                    } = item ?? {}

                    if (isTransformControlsRoot) {
                        return null
                    }

                    return {
                        title: isMesh ? geometry?.type : type,
                        key: type + name + id,
                        name: name
                    }
                })
                .filter((item) => item !== null)

            setTreeData([
                {
                    title: 'Scene',
                    key: 'root',
                    children: tree
                }
            ])
        }
    }, [scene])


    const handleSelect = (selectKeys, info) => {
        const name = info?.node?.name
        setSelectedObjName(name)
    }


    return (
        <div className="Properties">
            {/* <div>selectedObj: {selectedObj?.name}</div>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre> */}

            <Tree
                treeData={treeData}
                expandedKeys={['root']}
                onSelect={handleSelect}
            />
        </div>
    )
}

export default Properties;
