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

- 修改真实项目清单：`src/data/realProjectData.js`
- 修改项目总览静态图表数据：`src/data/dashboardData.js`
- 修改页面切换、轮播、主题状态：`src/app/Dashboard.jsx`
- 修改顶部导航：`src/components/layout/Header.jsx`
- 修改项目节点卡片：`src/components/StageTimelineCard.jsx`
- 修改项目总览页面：`src/pages/OverviewPage.jsx`

## 资源说明

Logo 文件位于 `public/logotext.png`。

## 项目节点图数据字段

第一页「项目节点图」由项目数据驱动，后端接口建议返回项目本身的信息，页面显示规则、分页、轮播、颜色、动画和是否隐藏 0 值由前端配置控制。

完整接口说明见 [`docs/backend-api.md`](docs/backend-api.md)。

### 项目主信息

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string / number | 是 | 项目唯一 ID |
| `name` | string | 是 | 项目名称 |
| `sub` | string | 否 | 项目副标题或需求范围 |
| `owner` | string | 是 | 负责人 |
| `dept` | string | 是 | 责任部门，用于项目数统计 |
| `statuses` | string[] | 是 | T/Q/C 状态，顺序为 `[进度, 质量, 成本]` |
| `current` | string | 否 | 当前节点名称 |
| `currentIndex` | number | 否 | 当前节点下标，优先级高于 `current` |
| `nodes` | MilestoneNode[] | 是 | 项目里程碑节点，按日期升序 |
| `summary` | TqcSummary[] | 是 | 右侧 T/Q/C 状态说明 |

### 里程碑节点

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `label` | string | 是 | 节点名称 |
| `date` | string | 是 | 真实日期，用于时间轴定位 |
| `displayDate` | string | 是 | 页面显示日期 |
| `state` | string | 否 | `done`、`active`、`pending` |
| `phase` | string | 否 | `concept`、`plan`、`develop`、`verify`、`release` |
| `risk` | string | 否 | 节点风险：`red`、`amber` |
| `persistRisk` | boolean | 否 | 风险是否持续影响后续时间轴 |

### T/Q/C 状态说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `label` | string | 是 | `进度`、`质量`、`成本` |
| `text` | string | 是 | 状态说明文本 |
| `status` | string | 是 | `green`、`amber`、`red` |
