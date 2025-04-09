# Three.js 通关秘籍




## uv 坐标和 uv 动画
纹理贴图如何映射到网格模型上是通过 uv 坐标决定的，也就是 geometry.attributes.uv，它和顶点一一对应。

可以修改不同顶点的 uv 坐标来实现纹理贴图的裁剪、旋转等效果。

texture.offset 可以让纹理贴图偏移一段距离，相当于改变了 uv 坐标，所以修改 texture.offset 的动画也叫做 uv 动画。

texture.offset 的偏移需要结合 texture.wrapT、textrue.wrapS 来设置，实现纹理贴图无限滚动的效果。

各种几何体都有默认的顶点 uv 坐标，当你需要对纹理贴图做一些处理的时候，可以自定义 uv 坐标。




## 如何画各种曲线
很多时候都要画曲线，比如行星的轨道、地图的飞线。

学了下曲线的 API。
- 椭圆曲线 EllipseCurve：画椭圆、圆曲线
- 样式曲线 SplineCurve：画经过一些点的曲线
- 二次贝塞尔曲线 QuadraticBezierCurve：可以通过控制点调节曲率，有一个控制点
- 三次贝塞尔曲线 CubicBezierCurve3：可以画三维曲线，通过控制点调节曲率，有两个控制点
- 直线 LineCurve：直线是曲线的一种特殊情况，传入两个端点
- 曲线路径 CurvePath：可以传入多条曲线，组合起来

很多 3D 场景中，需要画一些曲线，到时候就会用到这些曲线 API。




## 按照规律生成各种几何体
几何体是由一堆顶点构成的三角形构成的，但直接写顶点数据太麻烦，Three.js 提供了一些 API 可以按照一些规律来生成几何体。

LatheGeometry 可以由曲线绕 y 轴旋转生成几何体

TubeGeometry 可以由曲线生成一定半径的空心管道

ShapeGeometry 可以通过 Shape 来生成多边形，Shape 可以传入一堆点构成，也可以通过 lineTo、moveTo 等 api 来画。shape.holes 可以定义内孔。

ExtrudeGeometry 可以通过 Shape 拉伸形成几何体。

按照这些规律，可以生成很多有用的几何体。




## 实战：隧道穿梭
这节我们做了一个穿梭隧道的实战，核心目的还是练习曲线 Curve、生成几何体（比如 TubeGeometry）的 API。

我们用三维样条曲线画了穿过 n 个点的三维曲线，然后用 TubeGeometry 生成管道。

给它设置了纹理贴图，调整颜色空间，设置 map、aoMap 之后，真实感就很强了。

然后通过改变 camera 的 position 和 lookAt 实现了镜头穿梭隧道的感觉。

相机的位置是通过 curve.getSpacedPoints 取的一堆均匀的点。

经过这个实战之后，相信你对曲线、生成几何体、相机运动等就有更深的理解了。




## uv 动画实战：无限时空隧道
这节我们用 uv 动画实现了无限隧道的效果。

首先画了一个圆柱体，内部空心，设置反面的透明度贴图 alphaMap。

透明度贴图是用贴图的颜色来设置透明度的，需要同时设置材质的 transparent 为 true。

通过改变 texture.offset.y 来实现 uv 动画，用 clock.getDelata 来计算每次 offset.y 改变的数值。

然后通过 hsl 标识颜色，并且改变色相 h 的方式来实现了颜色的改变。

这算是一个比较综合的小实战，用到了 alphaMap + HSL + uv 动画。




## 实战：盖房子
这节我们给房子贴上了纹理贴图、加上了草地、设置了天空和雾，又做了相机动画。

纹理贴图要注意的是 ExtrudeGeometry 这种生成的几何体，uv 坐标会很大，要设置 texture.repeat 为很小的值，比如 0.0005 这种，原则就是和 uv 坐标相乘等于 1

草地用的 PlaneGeometry，天空是直接用 renderer.setClearColor，雾是设置在 scene.fog 的，可以用 dat.gui 可视化调试。

相机动画这次我们做了圆周运动，确定一个半径，然后用 sin、cos 求 x、z 坐标就可以了，y 坐标固定，这样就是一个旋转的相机动画。

这个盖房子的实战，我们练习了很多东西：
- 曲线和生成几何体
- 纹理贴图
- 相机动画
- dat.gui 可视化调试

还处理了模型闪烁也就是深度冲突问题，可以让物体有一点微小的偏移，也可以开启 renderer 的 logarithmicDepthBuffer 深度缓冲区选项。




## 场景遍历和世界坐标
Scene 中保存的是一个对象树，包含 Mesh、Group、Light 等各种对象。

Mesh 如果添加到 Group 中，那它的 position 就是相对于 Group 的，叫做局部坐标，而它相对于坐标原点的，叫做世界坐标，可以通过 obj.getWorldPosition 来拿到。

遍历这颗对象树，用 traverse 的 API，还可以通过 isMesh、isPoints 等来区分具体的类型，或者通过 getObjectByName、getObjectById 来查找特定对象。

复杂的场景基本都是一个很大的对象树，后面会经常需要遍历 scene、查找某个具体的对象。




## 各种灯光和常用 Helper
常用的灯光 Light：
- DirectionalLight：平行光，光线都是平行的，一般用来实现太阳光
- PointLight：点光源，从一个点发散的光源，类似灯泡
- AmbientLight：环境光，均匀照射所有物体的光源，用来调亮整个场景
- SpotLight：聚光灯，比较聚拢的光源，类似手电筒的效果，可以设置 angle 和 distance
- HemisphereLight：半球光，天空到地面两种颜色的灯光
- RectAreaLight：矩形平面光，从一个矩形平面发出的光，比如灯管、窗户透过的光

我们结合 dat.gui 来可视化调节了下这些 Light 的参数，并且用各自的 Helper 来可视化展示了光源的位置，光线传播方向。

这节我们过了剩下的两种灯光还有一些 Helper：
- GridHelper：坐标格辅助对象，可以用来标识地面
- CameraHelper：相机辅助对象，用来可视化视椎体
- ArrowHelper：箭头辅助对象，画个箭头来标识方向
- PolarGridHelper：极坐标格辅助对象，用来标识角度

当然，Helper 还有一些，那些需要一些前置知识，比如骨骼动画的 Helper




## 顶点法线和反射原理
这节我们深入了下光线反射的原理。

每个顶点都有一个法线方向，光线的入射角就是光和法线形成的夹角，入射角和出射角一致。

每三个顶点构成一个三角形，漫反射材质和镜面反射材质会在这个三角形上用凹凸不平或者是镜面的方式来计算光线反射的角度。

MeshPhongMaterial 可以通过 shininess 来调节反光度。

geomety.attributes.positon 记录了顶点坐标，而 geometry.attributes.normal 记录了和顶点一一对应的法线方向。

我们通过 BufferGeometry 自定义的几何体就要定义和顶点坐标一一对应的法线方向，这样就可以用漫反射或者镜面反射材质来计算反光效果了。

各种材质对光线的反射都是基于法线算出来的，法线是一个需要掌握的底层概念。


