import { useEffect } from "react";
import { MeshTypes, useThreeStore } from '../../store';
import { init } from "./init";


function Main() {
    const { data, addMesh } = useThreeStore();

    useEffect(() => {
        const dom = document.getElementById('threejs-container');
        const { scene } = init(dom, data);

        return () => {
            dom.innerHTML = '';
        }
    }, []);

    return <div
        className="Main"
        id="threejs-container"
    ></div>
}

export default Main;
