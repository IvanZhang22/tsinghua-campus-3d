# 清华园境 · 3D 校园漫游

[在线漫游清华园](https://tsinghua-campus-3d.vercel.app) · [GitHub 仓库](https://github.com/IvanZhang22/tsinghua-campus-3d)

以简体中文为主的清华大学海淀校区程序化三维沙盘，包含附中本部、附小清华园校区与校内家属区。浏览 24 处重点地点，实时调节季节、光照、花量、植被和校园活动，体验四条建筑导览与四个历史阶段。

## 本地运行

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:5175 。Windows PowerShell 若限制脚本执行，使用 `npm.cmd`。生产检查：

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

## 操作

- 鼠标拖动旋转，滚轮缩放，右键拖动平移；触屏单指旋转，双指缩放与平移。
- 点击地点或搜索建筑，查看介绍并飞至建筑机位；导览可以暂停、跳站或退出，手动操作镜头会暂停自动导览。
- 参数面板调整四季、时刻、植被丰茂度、丁香／紫荆花量、人流与自行车活动、曝光和画质。“重新布景”仅改变装饰，不移动建筑与道路。
- “分享”复制包含参数与机位的链接；“明信片”下载当前画面。损坏或不支持版本的分享状态回到默认设置。
- 历史模式只显示有依据的地标年代变化，淡化普通建筑作为当代参照，并附时期说明。

## 模型与资料

采用清华官方资料核对建筑名称、风格和空间关系；模型为程序化校园示意沙盘，普通楼宇与住宅使用概化体块，未声称达到测绘精度。没有逐户住宅信息。当前版没有取得完整 OSM 建筑足迹，在线体验不依赖地图 API。

- [清华校园地图（2025 年 12 月更新）](https://www.tsinghua.edu.cn/zjqh/xyfg/xydt.htm)
- [清华大学章程：校色与校花](https://www.tsinghua.edu.cn/__local/7/C1/9D/EDEBE103A9F77575927C44D5BD7_7BBDBA09_AD58A.pdf)：标准紫 RGB(102,8,116)，紫荆及紫、白丁香。
- [校园建筑与规划的历史](https://xsg.tsinghua.edu.cn/info/1003/1156.htm)
- [能源与动力工程系当前联系地址](https://www.te.tsinghua.edu.cn/lxwm/lxwm.htm)：李兆基科技大楼。
- [胡宝星法律图书馆现状](https://www.tsinghua.edu.cn/info/1360/81965.htm)：与明理楼的历史馆址分别介绍。
- 各地点的出处可在应用详情面板与 `src/data/campus.ts` 查看。
- 交互参考 [OpenAI Procedural City Generator](https://developers.openai.com/showcase/procedural-city-generator)，本项目独立实现。

## 工程

Vite / React / TypeScript / Three.js / React Three Fiber / Drei。米制坐标 x 向东、z 向南、y 为高度。静态几何合并绘制，树木和活动对象采用实例化；光照和装饰参数独立于建筑生成。

- `src/data/campus.ts`：校园几何、建筑内容、历史与导览。
- `src/scene/`：地标模型、静态几何、实例化景观、相机。
- `src/state.ts`：可分享场景状态、输入范围校验、确定性随机数。
- `src/ui/Editor.tsx`：中文编辑器与移动端抽屉。

无需后端、访客登录或 API 密钥。Vercel 使用 Vite 框架预设，构建输出为 `dist`。GitHub Actions 运行类型检查、测试与生产构建。源代码采用 MIT 许可证；外链资料的权利归各来源所有。

## 验收与版本

请查看 [验收记录](docs/验收记录.md) 与 [版本记录](CHANGELOG.md)。包含完整截图、实测性能和已知简化。
