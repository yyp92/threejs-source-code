/**
 * * 实现真实世界的物理现象
 */
import * as THREE from 'three';
import * as CANNON from 'cannon-es'

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);

const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.y = 300;

const mesh = new THREE.Group();
mesh.add(plane);
mesh.add(box);



// * 物理世界
// 对应的物理世界
const world = new CANNON.World()
// 竖直方向的重力加速度是 -9.8
world.gravity.set(0, -200, 0)

const boxShape = new CANNON.Box(new CANNON.Vec3(25, 25, 25));
const boxCannonMaterial = new CANNON.Material();
// 首先创建一个 Box 的刚体，这里的 CANNON.BODY 叫刚体。
// 创建一个刚体，形状是 Box，材质是默认材质，质量是 1，位置在立方体的位置。
const boxBody = new CANNON.Body({
    shape: boxShape,
    mass: 1,
    material: boxCannonMaterial
});
boxBody.position.set(0, 300, 0)
world.addBody(boxBody);

// 创建一个刚体，定义形状为 Plane、默认材质、质量是 0
// 质量是 0 就是不会移动的意思，有质量的物体被碰撞可能会移动。
const planeShape = new CANNON.Plane();
const planeCannonMaterial = new CANNON.Material();
const planeBody = new CANNON.Body({
    shape: planeShape,
    mass: 0,
    material: planeCannonMaterial
});
planeBody.position.set(0, 0, 0);
// 因为 Plane 我们绕 x 轴旋转了 -Math.PI / 2，物理世界里的 Plane 同样也要旋转。
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// 定义两种材质接触时的摩擦力和弹性，添加到物理世界。
const contactMaterial = new CANNON.ContactMaterial(
    boxCannonMaterial,
    planeCannonMaterial,
    {
        // 摩擦力
        friction: 0.2,
        // 弹性 
        restitution: 0.6 
    }
);
world.addContactMaterial(contactMaterial);



function render() {
    // 每次渲染循环更新下，用固定的频率更新
    world.fixedStep();

    box.position.copy(boxBody.position);
    box.quaternion.copy(boxBody.quaternion);

    requestAnimationFrame(render);
}
render();



export default mesh;
