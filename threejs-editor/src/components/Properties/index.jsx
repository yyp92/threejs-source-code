import {useState, useEffect} from 'react'
import { Tree, Segmented } from "antd";
import MonacoEditor from '@monaco-editor/react'
import { useThreeStore } from "../../store";
import Info from './Info'

function Properties() {
    const {
        data,
        selectedObj,
        scene,
        setSelectedObjName
    } = useThreeStore();

    const [treeData, setTreeData] = useState();
     const [key, setKey] = useState('属性');

    useEffect(() => {
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
            <Segmented
                value={key}
                onChange={setKey}
                block
                options={['属性', 'json']} 
            />

            {
                key === '属性'
                    ? (
                        <div>
                            <Tree
                                treeData={treeData}
                                expandedKeys={['root']}
                                onSelect={handleSelect}
                            />

                            <Info />
                        </div>
                    )
                    : null
            }

            {
                key === 'json'
                    ? (
                        // <pre>
                        //     {JSON.stringify(data, null, 2)}
                        // </pre>

                        <MonacoEditor
                            height={'90%'}
                            path='code.json'
                            language='json'
                            value={JSON.stringify(data, null, 2)}
                        />
                    )
                    : null
            }
        </div>
    )
}

export default Properties;
