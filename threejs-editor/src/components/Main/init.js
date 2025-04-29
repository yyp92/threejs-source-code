import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { MeshTypes } from '../../store';

export function init(dom, data) {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);
    const gridHeper = new THREE.GridHelper(1000);
    scene.add(gridHeper);


    // data.meshArr.forEach(item => {
    //     if (item.type === MeshTypes.Box) {
    //         const {
    //             width,
    //             height,
    //             depth,
    //             material: {
    //                 color
    //             }
    //         } = item.props;

    //         const geometry = new THREE.BoxGeometry(width, height, depth);
    //         const material = new THREE.MeshPhongMaterial({
    //             color
    //         });

    //         const mesh = new THREE.Mesh(geometry, material);
    //         scene.add(mesh);
    //     } 
    // })




    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = 1000;
    const height = window.innerHeight - 60;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(500, 500, 500);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);


    // * 后期处理
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
    const outlinePass = new OutlinePass(v, scene, camera);
    // 设置闪烁周期是 1s
    outlinePass.pulsePeriod = 1;
    composer.addPass(outlinePass);
    
    // 伽马校正
    const gammaPass= new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaPass);    


    function render(time) {
        // renderer.render(scene, camera);
        composer.render();

        requestAnimationFrame(render);
    }

    render();

    dom.append(renderer.domElement);

    window.onresize = function () {
        const width = 1000;
        const height = window.innerHeight - 60;

        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const controls = new OrbitControls(camera, renderer.domElement);


    // * 选中删除的功能
    renderer.domElement.addEventListener('click', (e) => {
        const y = -((e.offsetY / height) * 2 - 1);
        const x = (e.offsetX / width) * 2 - 1;

        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

        const intersections = rayCaster.intersectObjects(scene.children);

        if (intersections.length) {
            const obj = intersections[0].object;
            outlinePass.selectedObjects = [obj];
        }
        else {
            outlinePass.selectedObjects = [];
        }
    });


    return {
        scene
    }
}
