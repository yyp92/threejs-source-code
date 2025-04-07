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
