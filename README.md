# 实验室 BI 看板

用于 65 寸电视屏幕展示的项目组合里程碑进度与 TQC 看板。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 技术栈

- React
- Vite
- IBM Plex Sans SC

## 目录结构

```text
src/
  app/                 应用容器、全局常量、页面切换与轮播状态
  components/          可复用组件，如顶部导航、设置面板、项目时间轴卡片
  data/                看板数据与图表数据
  pages/               两个业务页面：项目总览、项目节点图
  utils/               通用工具函数
  styles.css           全局样式
```

## 常用修改位置

- 修改项目节点图数据：`src/data/dashboardData.js`
- 修改项目总览图表数据：`src/data/dashboardData.js`
- 修改页面切换、轮播、主题状态：`src/app/Dashboard.jsx`
- 修改顶部导航：`src/components/layout/Header.jsx`
- 修改项目节点卡片：`src/components/StageTimelineCard.jsx`
- 修改项目总览页面：`src/pages/OverviewPage.jsx`

## 资源说明

Logo 文件位于 `public/logotext.png`。
