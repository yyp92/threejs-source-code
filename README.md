# Three.js 通关秘籍




## 资料
[案例模型的仓库](https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0#showcase)
[tween.js 叫补间动画库](https://www.npmjs.com/package/@tweenjs/tween.js)
[网上搜一下全景图，然后用这个工具来切割成天空盒](https://jaxry.github.io/panorama-to-cubemap/)
[模型](https://sketchfab.com/)
[光泽球纹理](https://observablehq.com/d/2c53c7ee9f619740?ui=classic)
[gltf-pipeline](https://www.npmjs.com/package/gltf-pipeline)
[Draco 用于压缩和解压缩 3D 网格模型的一个库](https://github.com/google/draco)
[tweenjs 的缓动效果](https://tweenjs.github.io/tween.js/examples/03_graphs.html)
[threejs 官方编辑器](https://threejs.org/editor/)




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




## 自定义顶点颜色实现渐变
geometry.attributes.color 自定义顶点颜色。

它需要在材质开启 vertexColors 选项才会生效。

我们通过 geometry.attributes.position 定义顶点位置后，可以通过 geometry.attributes.color 来定义和他一一对应的颜色，这样顶点之间的线、三角形都会用渐变色填充。

曲线的渐变色要计算很多个点的颜色，这种可以用 color.lerp 方法，确定起始点、结束点颜色之后，根据百分比计算某个位置的颜色。

当你想实现渐变色的时候，就可以用自定义顶点颜色的方式来实现。




## 实战：颜色渐变柱状图
这节我们用自定义顶点颜色实现了颜色渐变柱状图。

根据 y 和高度的比值计算百分比，用 color.lerp 计算差值颜色，设置到 geometry.attributes.color

多种颜色渐变也是一样，分多段计算颜色最后合并就好了。

上面的数字用矩形平面 + CanvasTexture 来画。

自定义顶点颜色在特定场景下计算渐变色是非常有用的




## 如何加载外部模型
这节我们用 GLTFLoader 加载了一匹马的 gltf 模型。

一些复杂的物体用 Three.js 的几何体画不太现实，一般都是用建模软件画，然后导出 gltf 等格式的模型文件，我们在代码里用 GLTFLoader 加载进来。

scene 属性就是一个 Group，我们把它加到 Scene 里就可以了，它的 children 就是一些网格模型，可以随意修改材质等，和其他网格模型没区别。

比如可以用 traverse 遍历对象树，用 isMesh 方法判断是否是网格模型，或者用 getObjectByName 来按照名字查找等。

绝大多数 3D 场景都是要加载外部的网格模型的，不可能全部自己画，而模型文件格式里最常用的就是 gltf，后面的实战我们基本都会用到 gltf 模型。




## GLTF 的三种文件结构
这节我们学习了 .gltf 模型的三种形式：
- .gltf：所有纹理图片、顶点信息都是 base64 内联在一个文件里
- .gltf + .bin + .jpg/.png：图片单独存在文件，顶点信息放在 .bin
- .glb：也是内联所有资源，但是二进制形式体积更小

后两种是用的最多的。

不管存储结构如何，GLTFLoader 加载进来之后都是一样的网格模型，没有区别。





## gltf-pipeline：处理 gltf 模型的工具
这节我们通过 gltf-pipeline 工具实现了 gltf 模型三种格式的互转。

通过命令行做 glb 转 gltf 默认是生成内联格式，加一个 -s 就会把资源分出来。

如果你有自定义的逻辑，也可以通过 node 脚本来调用。

后面需要处理 gltf 模型的时候，都可以用 gltf-pipeline 这个包。




## Draco：压缩 gltf 模型，提升性能
这节我们学了用 draco 来压缩模型，提高 gltf 模型加载性能。

这个是 google 推出的一个工具，我们可以用 gltf-pipeline 来压缩模型，它集成了 draco，只要在转换模型的时候加一个 -d

之后压缩过的模型在 threejs 里加载的时候，需要给 GLTFLoader 设置下 DRACOLoader 的实例，这个 dracoLoader 要指定从哪里下载 decoder

decoder 可以直接用 cdn 的，也可以把 three 的 libs 下的 decoder 复制出来，设置好对应的 decoderPath 加载路径就行。

这样，我们就可以下载压缩过的模型来提升 gltf 模型的加载速度了。




## 正投影相机和三种灯光的阴影
这节我们学了下正投影相机和阴影。

透视投影相机是近大远小效果，而正投影相机是远近一样大。

正投影相机确实用的比较少，但在设置平行光阴影的时候会用到。

6 种灯光里只有点光源、聚光灯、平行光可以产生阴影，需要在 renderer 开启阴影 shadowMap.enabled，在灯光处开启阴影 castShadow，在产生阴影的物体设置阴影 castShadow，在接收阴影的物体设置 receiveShadow。

之后还要设置阴影相机的大小，平行光的阴影相机是正投影相机，点光源和聚光灯的是透视投影相机。

阴影相机的可视范围覆盖住要产生阴影的物体即可。

为了增加 3D 场景的真实感，很多时候是需要渲染阴影的。




## OrbitControls 的常用属性方法
这节我们过了一遍 OrbitControls 的常用属性方法。

可以开启 autoRotate 自动旋转，可以加上惯性 enableDamping，可以开启 rotate、zoom、pan，也可以限制 rotate 的范围 maxPolarAngle

我们经常监听 change 事件来可视化调节相机的位置和焦点，就是打印 camera.position 和 controls.target。

但是要注意 ORbitControls 默认会把焦点调回 0,0,0，调好之后要同步设置 camera.lookAt 和 controls.target.set

这些 OrbitControls 的属性方法都是经常会用到的。




## 射线与点击选中 3D 场景物体
这节我们学了射线的概念。

确定了起点 origin 和方向 direction 就可以生成一条射线 Ray，用它的 intersectTriangle 方法可以判断是否和三角形相交。

一般我们会用 Raycaster 来生成射线，用 intersectObjects 方法判断是否和网格模型相交。

点击的实现原理就是基于射线，把 offsetX、offsetY 的网页坐标转换为 -1 到 1 的标准屏幕坐标，然后用传入 camera，用 Raycaster 的 setFromCamera 方法生成一条射线。

这样就会从相机的位置到你点击位置对应的三维空间的位置生成一条射线，射线穿过的物体就是被点击的。

这就是点击选中三维场景的物体的原理。




## 后期处理与描边发光效果
这节我们学了后期处理，它可以通过一系列 Pass 添加后期效果，比如发光、描边等。

创建 EffectComposer 对象，调用 addPass 方法添加了 3 个 Pass：

RenderPass 渲染场景，OutlinePass 描边，UnrealBloomPass 发光

注意要把渲染循环里的 renderer.render 换成 composor.render

后期处理的 Pass 还有很多，下节我们来学下其他的。




## 各种后期处理效果
这节我们用了一下常用的各种后处理通道（不是全部，后面用到再讲别的）。
- RenderPass： 和 renderer.render 一样
- GlitchPass： 故障闪屏效果
- AfterimagePass：运动残影效果
- FilmPass：电影雪花效果，可设置灰度
- UnrealBloomPass：发光效果
- HalftonePass：三色圆点效果
- OutlinePass：描边效果
- SMAAPass：抗锯齿
- 伽马校正：用了后期通道后颜色异常的修复

这些是常用的后期通道 Pass，在特定场景下，使用后期通道可以达到更好的效果。




## 精灵模型 Sprite 和下雨下雪效果
这节我们学了 Sprite，它没有几何体，是一个永远面向相机的 1 * 1 的矩形平面。

我们可以用它来做一些场景中物体的标注，也可以用它来实现下雨、下雪等效果。

不同于点模型、线模型、网格模型，Sprite 精灵模型是比较特殊的，在特定场景下会用到。




## 实战：林海雪原
练习了 4 个基础知识点：
- 噪声算法 + 自定义几何体顶点坐标，生成山坡地形
- 模型加载和遍历设置材质，实现树林
- 阴影效果
- Sprite 实现下雪效果

做完这个实战之后，你会对山脉地形、模型加载、阴影、Sprite 有更深的掌握。

通过自定义顶点颜色实现了海拔高度的区分，拿到所有顶点坐标，根据高度用 color.lerp 计算颜色插值，实现了不同高度的顶点颜色不同。

之后又加上了相机的圆周动画，根据角度的 cos、sin 计算相机位置的 x、z，高度 y 保持不变。

这个实战里自定义顶点坐标、自定义顶点颜色都用到了，这些原理性的东西还是很重要的。




## 几何体材质共用和 clone、copy
`copy 是把传入的对象的值复制给当前对象，而 clone 是创建一个新的对象。`

这节我们探讨了下 mesh 的 geometry 和 material 共用的问题。

它有的时候很方便，比如可以批量修改这些 mesh 的材质颜色，可以设置 visible 批量隐藏。

但有的时候会有相互影响的问题，这时候 clone 一份新的 geometry 或者 material 就好了。

此外，当你想复制值的时候，可以直接用 copy 方法，比如 rotation.copy、position.copy，它会复制目标对象的值到当前对象。

材质共用问题是非常常见的问题，clone、copy 也是很常用的方法，后面会大量用到。




## 补间动画库 Tween.js
这节我们学了补间动画库 tween.js

它只要指定开始数值、结束数值、动画时间、缓动效果，就可以实现动画。

只要每一帧渲染的时候调用 update 传入当前时间就好了。

缓动动画是开始有段加速、结束的时候有段减速，类似这种有缓冲过程的动画，会看起来比较自然。

前面写动画效果都是自己改变数值的，以后我们都会用 tween.js 来改变数值。




## Tween.js 常用 API
这节我们过了一下 Tween.js 的常用特性。
- 用 Group 可以管理多个 tween 动画，add 添加、remove 移除，然后渲染循环里统一 update
- 多个动画串联可以用 chain，然后执行第一个动画的 start 就可以了
- 缓动函数都有不同的曲线，可以从[这里查](https://tweenjs.github.io/tween.js/examples/03_graphs.html)

后面我们做很多动画都会用到 tween.js，就会用到 Group、chain、各种缓动函数。




## 关键帧动画和模型动画播放
这节我们学了 Three.js 的关键帧动画。

它和 css 的关键帧动画一样，定义一些属性变化的关键帧 KeyframeTrack，每个属性都有 times、values 的变化数组。

然后定义这个关键帧动画 AnimationClip 的名字、持续时间等。

最后用 AnimationMixer 播放就好了，可以 play、paused、也可以控制 timeScale 播放速率。

gltf 模型上自带的 animations 关键帧动画，同样是用 AnimationMixer 来播放。

关键帧动画用的还是很多的，后面用的 gltf 模型的动画都是关键帧动画。




## 实战：丝滑入场动画
直接展示 3D 场景有些单调，我们可以在打开网页的时候加一个入场动画效果。

我们首先画了一个管道，用相机动画穿梭这个管道，最后相机到达 3D 场景的位置。

然后用 tween.js 来做场景的 ratation 和 camera.position 的缓动动画。

当然，这只是一个实现入场动画的思路，你完全可以做别的入场动画。

入场动画对于提升 3D 场景的体验，还是很有用的。




## 改变顶点的变形动画
这节我们学了变形动画，

几何体是由顶点构成的，改变顶点的位置就可以变成另一种几何体，变形动画就是这样做的。

通过 geometry.morphAttributes.position 定义一些变形目标的顶点。

然后通过 mesh.morphTargetInfluences 调整每个变形目标的影响比重，就可以实现变形效果。

然后配合关键帧动画就可以播放这个变形动画。

很多模型自带了变形动画，可以和之前一样用 AnimationMixer 来播放。

变形动画本质上就是改变顶点的动画，它可以让几何体做各种形状的改变，实现复杂的变形效果。




## 骨骼动画：关节带动顶点运动
这节我们学习了骨骼动画，它会定义一个由关节 Bone 构成的骨架 Skeleton，这些关节和物体的身体位置一一对应。

这样当骨架运动的时候，就可以带动物体周围的顶点来一起运动。

有骨架的 Mesh 叫做 SkinnedMesh 蒙皮网格模型，它的 skeletons 属性定义了骨架。

当 Bone 运动的时候，SkinnedMesh 在关节部位的顶点就会跟着运动。

一般骨骼动画都是在建模软件里设置好，我们直接用 AnimationMixer 播放就好了。




## CSS2DRenderer 实现标注：给 3D 物体加标签
这节我们学了用 CSS2DRenderer 实现信息标注。

它是通过在 canvas 元素上加一层 div，根据 3D 物体的位置来计算出屏幕坐标的位置，调整标签位置，来实现在 3D 物体上加标注的功能。

要在标注的物体上加一个 CSS2DObject，传入 dom 元素，这样就会在那里展示一个标注。

可以最开始设置标注的 visible 为 false，然后点击的时候再设置为 true，这样就是点击的时候显示标注的效果。

3D 场景的标注在开发的过程中用的很多，后面会经常用到。




## CSS3DRenderer 实现标注：公告栏内容
这节我们学了 CSS3DRenderer，它也是用 dom 给 3D 场景的物体加标注，但它是用 css3 的 3d 样式来写的，可以随场景一起旋转、放缩，有 3D 的感觉。

除了用来标注外，也可以做电视内容、公告栏内容等，在这些位置渲染网页。

CSS3DRenderer 和 CSS2DRenderer 都是非常常用的给 3D 场景添加标注的方式。




## Sprite 结合 canvas 实现各种形状的标注
这节我们学了 canvas 结合 Sprite 来做标注。

它和 CSS2DRenderer 类似，都是永远正对相机，只不过它不能渲染 dom。

但 Sprite 可以随 3D 物体放缩，CSS2DRenderer 不可以。

它做标注一般是结合 canvas 来用，canvas 画出各种内容，然后用 CanvasTexture 作为 Sprite 的纹理，这样可以画出各种标注图案。

做标注的三种方案，在特定场景下都有各自的应用，根据需求灵活选用。




## Canvas 画各种图案作为纹理
这节我们用 canvas 绘制了一些图案作为纹理。

canvas 的画布大小一般设置为平面宽高 * dpr，这样绘制出来的不模糊。

一般都是 translate 坐标原点到画布中央之后再绘制，这样是正好在画布中央，坐标也比较好计算。

可以用 moveTo、lineTo 画直线，用 arc 画圆弧曲线，drawImage 画图片、fillText 写文字等。

创建 CanvasTexture，传入 canvas 作为参数，然后设置为材质的颜色贴图 map，这样就可以用 canvas 做纹理了。

还设置 transparent 为 true，这样就是背景透明的效果。

很多时候找不到合适的图片或者纹理需要定制，都可以用 canvas 来绘制。




## 实战：3D 饼图
这节我们把饼图画了出来。

用 CurvePath 来组合曲线路径，用到了两个 LineCurve 和一个 EllipseCurve 来画形状，曲线取点构造 Shape，之后用 ExtrudeGeometry 拉伸成几何体。

CurvePath 曲线连接的顺序很重要，要从一个点开始，最后回到原点，顺序不能错。

难点在于角度的计算，需要根据当前值和 total 的比例计算角度，然后用 MathUtils.degToRad 转为弧度制，这样就确定了每个 part 的旋转角度和大小。

形状画出来了，下节我们给它加上交互。




## 实战：3D 饼图（二）
这节我们给饼图加上了点击的交互，Sprite 标签，以及 tween.js 缓动动画。

首先用 RayCaster 加上点击的处理，给点击的 part 修改 position，具体的 position 要根据角度的 cos、sin 来计算出来。

之后加上了 canvas + Sprite 画的标签，这里要注意 dpr 的问题，Sprite 的高度为 50，那 canvas 的高度就是 50 * dpr，这样正好不模糊，字体大小也要乘以 2，比如 30px * 2 = 60px。

这样，3D 饼图的实战就完成了，难点在于角度、cos、sin 的计算，以及 canvas 的尺寸设置。




## 系统掌握噪声库 simplex-noise
这节我们学了下噪声库 SimplexNoise 的更多用法。

可以用噪声生成山脉地形，但是一重噪声生成的不够崎岖，可以加更多重噪声来增加崎岖度。

可以用噪声生成随机的运动位置，比如萤火虫的运动，你还可以用 tween.js 加上缓动动画，但要做下节流处理。




## 3D 场景如何加入音频
这节我们学了 Three.js 如何播放音频。

主要是通过 AudioLoader 加载音频，之后用 Audio 来播放，通过 setBuffer 设置音频数据。

通过 volume、playbackRate、offset、detune 等来调节音频效果。

后面需要用到音频的地方，都可以通过 Audio 来实现。




## 实战：双人斗舞
主要用到了 gltf 模型的加载，骨骼动画的播放，聚光灯、阴影，后期处理这些基础知识。

加了描边的后期 Pass，点击的时候给舞者添加描边效果。

并且相机用 tween.js 来做相机缓动动画，把舞者放到视野中央。

用 Audio 的 api 实现了音频的播放。

然后用 CSS2DRenderer 的标注实现了对话功能。

这个实战我们综合用到了聚光灯、阴影、gltf 模型加载、后期处理、射线和点击、css2d 标注、tweenjs 相机缓动动画、音频播放等基础知识，是一个比较综合的实战。




## 音乐频谱可视化
这节我们实现了音乐频谱可视化的效果。

用 AudioAnalyser 拿到音频频谱数据，然后用 lodash 分组之后求和，最后得到一个 20 多个元素的数组，然后用 BoxGeometry 画立方体来可视化。

每帧修改 box 的高度和 position.y 就好了。

我们还通过自定义顶点颜色实现了根据高度来设置颜色的渐变色效果。

后面用到音频频谱的分析，就可以用 AudioAnalyser 来做。




## PBR 材质：逼真的金属、塑料、磨砂效果
这节我们学了 PBR 材质，它是基于物理渲染的材质，会做更多的计算，实现非常逼真的效果。

PBR 材质是 MeshStandardMaterial 标准网格材质，通过设置 roughness 粗糙度、metalness 金属度、envMap 环境贴图，可以实现逼真的金属、塑料、磨砂等材质效果。

此外，PBR 材质还可以实现玻璃、喷漆等效果，下节我们继续学习 PBR。




## PBR 材质：逼真的喷漆、玻璃效果
这节我们学了另一个 PBR 材质，扩展自标准网格材质 MeshStandardMaterial 的物理网格材质 MeshPysicalMaterial。

它除了可以调节金属度 metalness、粗糙度 roughness 外，还可以调节清漆度 clearcoat 和清漆层粗糙度 clearcoatRoughness 实现喷漆效果，就是车身的那种感觉，可以调节 transmission 透光度和折射率 ior 实现玻璃效果。

玻璃、宝石、喷漆等效果都可以通过 PBR 材质调出来。

下节我们来加载一个汽车模型，看下 PBR 材质可以做的多逼真。




## PBR 实战：汽车选配
这节我们练习了下 PBR 材质。

加载了车的模型，然后遍历找到车窗、车身的 mesh，修改 PBR 材质的金属度 metalness、粗糙度 roughness、清漆层 clearcoat、透光率 transmission、折射率 ior 等，就可以实现真实的车窗、车身的效果。

然后加上了 GUI 来可视化的调试，大家自己调一下看看效果，就能更好的理解 PBR 材质了。




## 模型搜索并导入 blender 编辑
这节我们学了在哪搜索模型，以及如何查找模型中的目标对象。

我们从 sketchfab.com 这个免费的 3D 模型网站来搜索和下载 glb 的模型。

这些模型里 mesh 的命名比较随意，找到目标 mesh 比较难。

我们可以把模型导入 blender，通过隐藏的方式来一个个找，找到目标对象后把名字记下来，然后在代码里就可以根据名字来修改目标对象了。

当然，你也可以找到对象后修改 name，之后导出一个新的 glb。

后面用到的模型的搜索、编辑都是这个流程。




## PBR 材质：逼真的毛绒、虹彩效果
这节我们学了 PBR 材质的毛绒和虹彩效果。

毛绒就是给物体加了一个光泽层 sheen，可以调节这个光泽层的粗糙度 sheenRoughness，光泽层的颜色 sheenColor，还可以设置光泽层颜色贴图 sheenColorMap

虹彩则是给物体加了一个虹彩层 iridescence，可以调节虹彩层折射率 iridescenceIOR，反射率 reflectivity

当然，大家知道 PBR 材质可以做啥效果就行，具体的参数可以用 GUI 可视化的调试。




## MatCap 材质：通过光照球实现伪光照效果
这节我们学了 MeshMatcapMaterial 材质。

它并不计算灯光，但可以通过提前渲染好的光泽球图片根据顶点法线来计算光照。

换上不同的光泽球图片，就可以实现各种材质的光照效果。

整体看起来还算真实，而且性能特别好。




## HDR：亮度范围更广的全景图
这节我们学了用 .hdr 文件作为全景图。

hdr 文件能够存储范围更广的亮度信息，作为全景图更加真实。

用 RGBELoader 加载之后，设置 mapping 为 EquirectangularReflectionMapping，然后作为 scene.background 就可以了。

当然，普通的 jpg 文件也不用分割成 6 张图后再用 CubeTextureLoader 加载，也可以用这种方式运行时分割。

后面做全景图的时候，尽量用 hdr 文件，会更加真实。




## CubeCamera 实现镜子效果
这节我们实现了镜子的效果。

不能用 CubeTextureLoader 加载的图片作为环境贴图 envMap 了，而是要用 CubeCamera 来在物体的位置实时拍摄 6 张图。

CubeCamera 拍摄的照片存在 WebGLCubeRenderTarget 上，size 一般是 2 的多少次方，比如 64、128、256、512 等。

并且每帧调用下 cubeCamera.update 来重新拍摄照片。

这样就能实现镜子的效果，实时映射出周围的物体。




## Reflector 实现镜子效果
这节我们分别用 CubeCamera 和 Reflector 实现了相对的两个镜子的效果。

CubeCamera 拍的 6 张照片作为 envMap 可以实现镜面效果，但它并不能照出对面镜子的环境贴图，所以对面镜子是原本的颜色。

Reflector 是专门用来做镜面效果的，它可以实现两个镜子的相互反射，比较逼真。

所以，如果是设置 envMap，可以用 CubeCamera 来拍，比如汽车车身、车窗反射的光线。但如果是专门实现镜子，还是用 Reflector 来做更好。




## 实战：练舞房
这节我们实现了练舞房的效果。

用 Reflector 创建了 4 面镜子，然后加载 gltf 人物模型，用 AnimationMixer 播放了跳舞的骨骼动画。

用 Tween.js 做了圆周的相机动画。

之后添加了矩形平面光，用它的 ReactAreaLightHelper 来做灯管效果。

最后添加了平行光的阴影。

这样，一个综合的小实战就完成了。以后用到镜子都可以用 Reflector 来做。




## 实战：3D 版音乐播放器
这节我们开始做音乐播放器的实战。

我们用 BoxGeometry 画了 2 个按钮，上面的 PlaneGeometry 用 canvas 画了播放、暂停的纹理。

用 RayCaster 处理了点击事件，点击的时候修改对应按钮的 scale 和 position.y 做按下的效果，并且让另一个按钮弹起。

之后加上 Audio 加载了音乐，点击按钮的时候让音乐播放暂停。

下一节我们继续来加上环形柱状音乐频谱的可视化。




## 实战：3D 版音乐播放器（二）
这节我们实现了音频频谱的可视化。

这次我们用的是环状的同心圆柱来展示的频谱，使用 Shape 配合 holes 实现了同心圆，然后用 ExtrudeGeometry 拉伸成几何体。

然后用 AudioAnalyser 拿到频谱数据分组求平均值后，修改同心圆柱的 scale.y

这样就实现了频谱的可视化，我们的音乐播放器体验更好了。




## 实战：3D 音乐播放器（三）
这节我们实现了歌词的同步。

首先解析 lrc 文件，从中提取歌词，用 canvas 画出来，作为 PlaneGeometry 的纹理。

这些平面在 z 轴方向依次排列，我们拿到每句歌词的时间和 position.z 的对应关系，当歌词播放的时候，定位到对应的歌词，用 Tween 做缓动动画。

这里的时间不能直接用 audio.context.currentTime，因为它在暂停后不会停止增加，我们需要自己记录一个播放的时间，暂停、播放的时候计时。

这样，我们的 3D 版音乐播放器就完成了。




## 实战：3D 音乐播放器（四）
这节我们加上了跳动的音符的效果。

首先用 canvas 绘制了音符的图案，然后用 Sprite 画了 100 个随机位置的音符，用噪声算法来计算随机连续的目标位置，之后用缓动动画来运动过去。

加上跳动的音符之后，整体节奏感好多了。




## Three.js 的各种控制器 Controls
这节我们过了一遍各种控制器：
- FlyControls：飞行控制器，通过上下左右键和鼠标来控制前进后退、方向旋转
- FirstPersonControls：类似飞行控制器，但是上下角度不能超过 90 度
- MapControls： 和 OrbitControls 一样，但是左键平移，右键旋转
- TransformControls：用来移动场景中的物体
- DragControls：用来拖动场景中的物体

不同场景下需要不同的交互方式，需要不同的控制器。




## Vue、React 项目如何集成 Three.js
这节我们实现了 react 和 three.js 的集成。

three.js 的 renderer 渲染出 canvas 元素，把它挂载到 react 应用的某个 dom 下就好了。

three.js 在这个 canvas 元素渲染，react 则是渲染整个 dom 树，互不影响。

互相调用的话就是通过参数返回值传递一些函数，在这些函数里实现调用的功能就好了。

我们只测试了 Three.js 和 React 项目的集成，但 Vue 项目也是同一个思路，没啥区别。

后面的项目如果需要写页面的部分，就可以用 Three.js 和前端框架集成来搞。




## 实战：Three.js Editor
这节我们梳理了下 Three.js Editor 的需求。

我们会做这些功能：

添加 Mesh、添加 Light、移动物体、旋转物体、缩放物体、场景对象树、编辑几何体、编辑材质这些核心功能。

目的一个是为了学习如何实现编辑器，另一个是为了练习 Three.js 和前端框架结合。

我们没必要做的特别的完善，因为这涉及到很多前端的知识，我们主要是为了学习 Three.js，实现核心功能，理清思路即可。




## 酷家乐装修编辑器：需求分析
这节我们分析了下酷家乐装修编辑器的流程。

从户型设计到导入家具、家具编辑，全景浏览，到最后渲染出图之后的全景浏览。

整个流程还是很清晰的。

我们不会做全部的功能，比如后端渲染部分我们就不会做，这个不是用 threejs 渲染的。

我们会做户型设计（支持自己绘制、户型库），3D /2D 视图切换，导入家具，家具编辑（旋转、位移），全景浏览这些功能。

