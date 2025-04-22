# gltf-pipeline：处理 gltf 模型的工具

## 命令行
```bash
# glb 模型转为 gltf + bin 
# 用的是资源内联的方式
npx gltf-pipeline -i Michelle.glb -o Michelle.gltf

# 如果是想把资源单独摘出来
npx gltf-pipeline -i Michelle.glb -o ./model/Michelle2.gltf -s


# gltf 转 glb
npx gltf-pipeline -i ./model/Michelle2.gltf -o ./Michelle2.glb
```
