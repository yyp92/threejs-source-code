import { create } from "zustand";

function createBox() {
    const newId = Math.random().toString().slice(2, 8);

    return {
        id: newId,
        type: 'Box',
        name: 'Box' + newId,
        props: {
            width: 200,
            height: 200,
            depth: 200,
            material: {
                color: 'orange',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
}

function createCylinder() {
    const newId = Math.random().toString().slice(2, 8);
    
    return {
        id: newId,
        type: 'Cylinder',
        name: 'Cylinder' + newId,
        props: {
            radiusTop: 200,
            radiusBottom: 200,
            height: 300,
            material: {
                color: 'orange',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
}


const useThreeStore = create((set, get) => {
    return {
        data: {
            // 保存着所有的 mesh
            meshArr: [
                // {
                //     id: 1,
                //     type: 'Box',
                //     name: 'Box1',
                //     props: {
                //         width: 200,
                //         height: 200,
                //         depth: 200,
                //         material: {
                //             color: 'orange',
                //         },
                //         position: {
                //             x: 0,
                //             y: 0,
                //             z: 0
                //         }
                //     }
                // }
            ]
        },

        // 往这个 mesh 数组里添加 Mesh
        addMesh(type) {
            function addItem(creator) {
                set(state => {
                    return {
                        data: {
                            ...state.data,
                            meshArr: [
                                ...state.data.meshArr,
                                creator()
                            ]
                        }
                    }
                })
            }
        
            if (type === 'Box') {
                addItem(createBox);
            }
            else if(type === 'Cylinder') {
                addItem(createCylinder);
            }
        }
    }
});

const MeshTypes = {
    Box: 'Box',
    Cylinder: 'Cylinder'
}

export {
    useThreeStore,
    MeshTypes
}
