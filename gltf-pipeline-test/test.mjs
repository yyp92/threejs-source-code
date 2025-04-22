import gltfPipeline from "gltf-pipeline";
import fs from 'fs';


const { gltfToGlb } = gltfPipeline;

const content = fs.readFileSync("./model/Michelle2.gltf", 'utf8');
const gltfJson = JSON.parse(content);

// 引入 gltf-pipeline 调用它的 gltfToGlb 方法，指定资源目录。
// 回调函数里把生成的模型写入文件
gltfToGlb(gltfJson, {
    resourceDirectory: "./model/"
}).then(function (results) {
    fs.writeFileSync("model.glb", results.glb);
});
