# Three.js 通关秘籍




## uv 坐标和 uv 动画
纹理贴图如何映射到网格模型上是通过 uv 坐标决定的，也就是 geometry.attributes.uv，它和顶点一一对应。

可以修改不同顶点的 uv 坐标来实现纹理贴图的裁剪、旋转等效果。

texture.offset 可以让纹理贴图偏移一段距离，相当于改变了 uv 坐标，所以修改 texture.offset 的动画也叫做 uv 动画。

texture.offset 的偏移需要结合 texture.wrapT、textrue.wrapS 来设置，实现纹理贴图无限滚动的效果。

各种几何体都有默认的顶点 uv 坐标，当你需要对纹理贴图做一些处理的时候，可以自定义 uv 坐标。
