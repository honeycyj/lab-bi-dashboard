# 项目节点图后端接口说明

本文档用于后端按照项目数据表提供「项目节点图」第一页的数据接口。接口只返回项目本身的事实数据，前端负责展示配置、分页、轮播、统计卡片、时间轴布局和是否显示某些模块。

前后端边界原则：

- 后端提供项目、节点、T/Q/C 状态、责任人、责任部门等业务数据。
- 前端配置页面展示规则，例如每页显示几个项目、哪些卡片显示、0 值是否隐藏、动画间隔、时间轴模式。
- 后端不返回颜色、卡片布局、动画、分页位置等纯展示字段。

## 接口概览

### 获取项目里程碑列表

`GET /api/milestone/list`

建议返回当前看板需要展示的完整项目列表。前端本地负责分页、轮播、统计派生和展示策略。

查询参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `projectStatus` | string | 否 | 项目业务状态筛选，例如 `active`、`closed`。不传默认返回看板业务范围内项目。 |
| `department` | string | 否 | 责任部门筛选。 |
| `updatedAfter` | string | 否 | ISO 日期，用于增量刷新。 |

响应结构：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "updatedAt": "2026-06-11T10:00:00+08:00",
    "projects": []
  }
}
```

## 项目字段

`data.projects[]` 中每个项目建议使用对象结构，不要再使用数组下标表达字段含义。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string / number | 是 | 项目唯一 ID。 |
| `name` | string | 是 | 项目名称。 |
| `sub` | string | 否 | 项目副标题，例如需求范围、项目部分。 |
| `category` | string | 否 | 项目类型。 |
| `owner` | string | 是 | 负责人。 |
| `dept` | string | 是 | 责任部门。左侧 TQC 项目数会按此字段统计。 |
| `statuses` | string[] | 是 | T/Q/C 三项状态，顺序固定为 `[进度, 质量, 成本]`。 |
| `health` | string | 否 | 项目整体健康度：`normal`、`risk`、`danger`。可由 `statuses` 派生。 |
| `current` | string | 否 | 当前节点名称。 |
| `currentIndex` | number | 否 | 当前节点在 `nodes` 中的下标。优先使用该字段。 |
| `nodes` | MilestoneNode[] | 是 | 项目里程碑节点列表，按时间升序。 |
| `summary` | TqcSummary[] | 是 | 右侧 T/Q/C 文字说明，顺序固定为进度、质量、成本。 |
| `closed` | boolean | 否 | 是否关闭，用于总览页运行项目统计。 |
| `closedThisMonth` | boolean | 否 | 是否本月关闭，用于总览页统计。 |

不建议后端返回的字段：

| 字段类型 | 原因 |
| --- | --- |
| 卡片颜色、背景色、字号、布局位置 | 属于前端视觉规范。 |
| 是否显示某张统计卡片 | 属于前端页面配置。 |
| 是否隐藏 0 值 | 属于前端展示策略。 |
| 每页显示数量、当前页码、轮播间隔 | 属于前端大屏播放配置。 |
| 时间轴节点坐标 | 前端会根据真实日期计算。 |
| 动画类型、动画速度 | 属于前端交互配置。 |

## 状态枚举

### T/Q/C 状态

| 值 | 含义 |
| --- | --- |
| `green` | 正常 / 绿灯 |
| `amber` | 风险 / 黄灯 |
| `red` | 异常 / 红灯 |

说明：

- `statuses[0]` 是进度。
- `statuses[1]` 是质量。
- `statuses[2]` 是成本。
- 如后端使用 `orange`，前端会兼容为 `amber`，但建议统一返回 `amber`。

### 项目整体健康度

| 值 | 含义 |
| --- | --- |
| `normal` | 整体正常 |
| `risk` | 存在黄灯风险 |
| `danger` | 存在红灯异常 |

推荐派生规则：

- 任一 T/Q/C 为 `red` 时，`health = danger`。
- 无红灯但任一项为 `amber` 时，`health = risk`。
- 全部为 `green` 时，`health = normal`。

## 里程碑节点字段

`nodes[]` 建议结构：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `label` | string | 是 | 节点名称，例如 `立项`、`需求冻结`、`客户验收结项`。 |
| `displayDate` | string | 是 | 页面显示日期，例如 `12.31`、`06/27->7.31`。 |
| `date` | string | 是 | 真实日期，用于时间轴定位，建议 ISO 日期或 `YYYY/MM/DD`。 |
| `state` | string | 否 | 节点状态：`done`、`active`、`pending`。 |
| `phase` | string | 否 | 阶段：`concept`、`plan`、`develop`、`verify`、`release`。 |
| `risk` | string | 否 | 节点风险色：`red`、`amber`。没有风险可不传。 |
| `persistRisk` | boolean | 否 | 风险是否持续影响后续时间轴。默认由前端按节点状态判断；明确持续风险时传 `true`。 |

阶段枚举：

| 值 | 含义 |
| --- | --- |
| `concept` | 概念 / 立项 / 需求阶段 |
| `plan` | 计划 / 第一阶段 |
| `develop` | 开发阶段 |
| `verify` | 验证 / 测试 / 客户验收阶段 |
| `release` | 发布 / 商用 / 结项阶段 |

## T/Q/C 摘要字段

`summary[]` 建议固定 3 条，顺序为进度、质量、成本。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `label` | string | 是 | `进度`、`质量`、`成本`。 |
| `text` | string | 是 | 右侧说明文本。 |
| `status` | string | 是 | `green`、`amber`、`red`。 |

注意：

- `summary[].status` 应与 `statuses` 保持一致。
- 如果某个节点存在持续红色风险，例如 `persistRisk=true` 且 `risk=red`，对应的进度状态也应返回 `red`，避免时间轴和右侧 T/Q/C 状态不一致。

## 示例响应

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "updatedAt": "2026-06-11T10:00:00+08:00",
    "projects": [
      {
        "id": 3,
        "name": "AI视频修复与增强项目",
        "sub": "",
        "category": "技术项目",
        "owner": "朱理",
        "dept": "媒体应用使能部",
        "statuses": ["red", "amber", "green"],
        "health": "danger",
        "current": "客户验收结项",
        "currentIndex": 5,
        "nodes": [
          {
            "label": "立项",
            "displayDate": "11/22",
            "date": "2024/11/22",
            "state": "done",
            "phase": "concept"
          },
          {
            "label": "技术可行性研究",
            "displayDate": "12/27",
            "date": "2024/12/27",
            "state": "done",
            "phase": "concept"
          },
          {
            "label": "算法V1交付",
            "displayDate": "2025/01/27",
            "date": "2025/01/27",
            "state": "done",
            "phase": "plan"
          },
          {
            "label": "算法V2交付&系统上线",
            "displayDate": "05/07",
            "date": "2025/05/07",
            "state": "done",
            "phase": "develop"
          },
          {
            "label": "专利&i论文输出",
            "displayDate": "06/07(延)",
            "date": "2025/06/07",
            "state": "active",
            "phase": "verify",
            "risk": "red",
            "persistRisk": true
          },
          {
            "label": "客户验收结项",
            "displayDate": "06/27->7.31",
            "date": "2025/07/31",
            "state": "active",
            "phase": "verify",
            "risk": "amber"
          }
        ],
        "summary": [
          {
            "label": "进度",
            "text": "截止9.17里程碑偏差19.2%，客户验收闭环延期，需重点关注。",
            "status": "red"
          },
          {
            "label": "质量",
            "text": "9月10日版本提测通过，但测试报告未发出。",
            "status": "amber"
          },
          {
            "label": "成本",
            "text": "预算执行正常。",
            "status": "green"
          }
        ]
      }
    ]
  }
}
```

## 后端数据表建议

如果后端按关系表拆分，建议至少分为 3 张表。

### 项目主表 `project`

| 字段 | 说明 |
| --- | --- |
| `id` | 项目 ID |
| `name` | 项目名称 |
| `sub_title` | 项目副标题 |
| `category` | 项目类型 |
| `owner` | 负责人 |
| `department` | 责任部门 |
| `progress_status` | 进度灯：`green` / `amber` / `red` |
| `quality_status` | 质量灯：`green` / `amber` / `red` |
| `cost_status` | 成本灯：`green` / `amber` / `red` |
| `health` | 整体健康度 |
| `current_node_id` | 当前节点 ID |
| `closed` | 是否关闭 |
| `closed_this_month` | 是否本月关闭 |

### 里程碑表 `project_milestone`

| 字段 | 说明 |
| --- | --- |
| `id` | 节点 ID |
| `project_id` | 项目 ID |
| `label` | 节点名称 |
| `display_date` | 页面显示日期 |
| `node_date` | 真实日期 |
| `state` | 节点状态 |
| `phase` | 所属阶段 |
| `risk` | 节点风险 |
| `persist_risk` | 风险是否持续 |
| `sort_order` | 节点排序 |

### TQC 摘要表 `project_tqc_summary`

| 字段 | 说明 |
| --- | --- |
| `id` | 摘要 ID |
| `project_id` | 项目 ID |
| `type` | `progress` / `quality` / `cost` |
| `label` | 页面显示名称 |
| `text` | 说明文本 |
| `status` | 状态 |
| `sort_order` | 排序 |

## 前端自动计算规则

接口只要返回项目列表，前端会自动计算：

- `TQC 项目数`：项目总数。
- `按责任部门分布`：按 `dept` 聚合。
- `正常推进项目数`：`statuses` 三项全部为 `green` 的项目数。
- `进度风险灯`：`statuses[0]` 为 `red` 或 `amber` 的项目数。
- `质量风险灯`：`statuses[1]` 为 `red` 或 `amber` 的项目数。
- `成本风险灯`：`statuses[2]` 为 `red` 或 `amber` 的项目数。
- 风险卡片右侧轮播项目：从对应风险项的项目名称自动生成。
- 时间轴节点位置：按 `nodes[].date` 的真实时间比例计算。

## 前端展示配置建议

这些配置建议放在前端本地配置、环境配置或独立的前端配置接口中，不建议混入项目数据接口。

```json
{
  "projectNodePage": {
    "rowsPerPage": 5,
    "showMetrics": {
      "total": true,
      "normal": true,
      "progressRisk": true,
      "qualityRisk": true,
      "costRisk": true
    },
    "zeroValueDisplay": {
      "showMainValue": true,
      "showRiskCounts": false,
      "showFocusCard": false
    },
    "timeline": {
      "mode": "linear",
      "showPhaseModeToggle": true
    },
    "animation": {
      "autoPlayDefault": true,
      "screenIntervalSec": 30,
      "projectPageIntervalSec": 12,
      "riskCardFlipIntervalSec": 3
    }
  }
}
```

配置说明：

| 配置 | 说明 |
| --- | --- |
| `rowsPerPage` | 第一页每屏展示项目数量。 |
| `showMetrics` | 控制左侧统计卡片是否显示。 |
| `zeroValueDisplay.showMainValue` | 风险数为 0 时是否仍显示主数字，例如成本风险灯显示 `0`。 |
| `zeroValueDisplay.showRiskCounts` | 红灯/黄灯两个小数字为 0 时是否隐藏。 |
| `zeroValueDisplay.showFocusCard` | 没有风险项目时是否隐藏右侧翻转项目卡片。 |
| `timeline.mode` | `linear` 为真实时间轴，`milestone` 为阶段里程碑模式。 |
| `animation.*` | 大屏轮播和翻转动画相关配置。 |

## 对接注意事项

- `nodes` 必须按真实时间升序返回。
- `date` 不要只传 `12/31`，需要带年份；`displayDate` 可以按大屏展示写短日期。
- `currentIndex` 和 `current` 二选一即可，建议传 `currentIndex`，避免同名节点匹配错误。
- T/Q/C 状态、节点风险和右侧说明状态需要保持一致。
- 前端当前默认每页展示 5 个项目，该数量由前端配置控制；后端不需要为了大屏分页拆分数据。如果未来项目量很大，可再增加服务端分页接口。
- 后端接口不要为了当前大屏样式返回展示开关；展示开关由前端配置维护。
