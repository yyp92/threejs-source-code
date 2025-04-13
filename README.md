# Three.js 通关秘籍




## 资料
[案例模型的仓库](https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0#showcase)
[tween.js 叫补间动画库](https://www.npmjs.com/package/@tweenjs/tween.js)




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




## 正投影相机和三种灯光的阴影
这节我们学了下正投影相机和阴影。

透视投影相机是近大远小效果，而正投影相机是远近一样大。

正投影相机确实用的比较少，但在设置平行光阴影的时候会用到。

6 种灯光里只有点光源、聚光灯、平行光可以产生阴影，需要在 renderer 开启阴影 shadowMap.enabled，在灯光处开启阴影 castShadow，在产生阴影的物体设置阴影 castShadow，在接收阴影的物体设置 receiveShadow。

之后还要设置阴影相机的大小，平行光的阴影相机是正投影相机，点光源和聚光灯的是透视投影相机。

阴影相机的可视范围覆盖住要产生阴影的物体即可。

为了增加 3D 场景的真实感，很多时候是需要渲染阴影的。




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

