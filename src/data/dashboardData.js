export const projects = [
  {
    id: 2,
    name: '音视频转码项目',
    sub: '（UWA 视频需求部分）',
    category: '技术项目',
    owner: '黄志伟',
    dept: '技术研究部',
    statuses: ['green', 'amber', 'green'],
    current: 'PC/平板播放软件',
    currentIndex: 7,
    health: 'normal',
    nodes: [
      ['立项', '2024.11.22', 'done', 'concept', '2024/11/22'],
      ['需求冻结', '12.6', 'done', 'concept', '2024/12/06'],
      ['第一阶段交付', '12.31', 'done', 'plan', '2024/12/31'],
      ['Hdrvivid sdk', '2025.3.31', 'done', 'develop', '2025/03/31'],
      ['第二阶段交付', '3.31', 'done', 'develop', '2025/03/31'],
      ['APP二期(安卓)', '6.30', 'done', 'develop', '2025/06/30'],
      ['APP二期(iOS)', '7.31', 'done', 'develop', '2025/07/31'],
      ['PC/平板播放软件', '9.30', 'active', 'verify', '2025/09/30'],
      ['Hdrvivid sdk二期', '12.31', 'active', 'release', '2025/12/31'],
    ],
    summary: [
      ['进度', '里程碑正常', 'green'],
      ['质量', '总遗留DI=46.1，PC端SDR2HDR:6，Linux端SDR2HDR:22.1，HDR vivid SDK项目(PC端):16，HDR vivid SDK项目(非PC端):2，截止9.17 12:00，待规划处理。', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
  {
    id: 3,
    name: 'AI视频修复与增强项目',
    sub: '',
    category: '技术项目',
    owner: '朱理',
    dept: '媒体应用使能部',
    statuses: ['amber', 'amber', 'green'],
    current: '客户验收结项',
    currentIndex: 5,
    health: 'risk',
    nodes: [
      ['立项', '11/22', 'done', '2024/11/22'],
      ['技术可行性研究', '12/27', 'active', '2024/12/27'],
      ['算法V1交付', '2025/01/27', 'active', '2025/01/27'],
      ['算法V2交付&系统上线', '05/07', 'active', '2025/05/07'],
      ['专利&i论文输出', '06/07(延)', 'active', '2025/06/07'],
      ['客户验收结项', '06/27->7.31', 'active', '2025/07/31'],
    ],
    summary: [
      ['进度', '截止9.17里程碑偏差19.2%（PCR后），主要V0.0.4版本提测通过，测试结论未发出项目未能闭环；', 'amber'],
      ['质量', '9月10日V0.0.4版本提测通过，但测试报告未发出；当前含挂起(效果问题)总遗留DI=43(截止9.17 12:00)，具体以测试报告为准。', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
  {
    id: 4,
    name: '2D转3D工具项目',
    sub: '（UWA 音频需求部分）',
    category: '技术项目',
    owner: '王智',
    dept: '技术研究部',
    statuses: ['green', 'amber', 'green'],
    current: '百事通版本2',
    currentIndex: 5,
    health: 'normal',
    nodes: [
      ['立项', '12/02', 'done', '2024/12/02'],
      ['需求冻结', '12/06', 'done', '2024/12/06'],
      ['第一期交付', '12/31', 'done', '2024/12/31'],
      ['第二期交付', '2025/03/31', 'done', '2025/03/31'],
      ['百事通版本1', '07/25', 'done', '2025/07/25'],
      ['百事通版本2', '9月5日', 'active', '2025/09/05'],
      ['待汇报', '10/31', 'active', '2025/10/31'],
      ['第三期交付（客户）', '2025/12/31', 'active', '2025/12/31'],
    ],
    summary: [
      ['进度', '里程碑正常，9月5日版本已提测，待规划9月下旬版本。', 'green'],
      ['质量', '1）9.5百事通版本首轮测试不通过，待二轮回归；2）历史遗留DI=66.1，具体：linux端2D转3D工具:29.1+13，PC端2D转3D工具:24，截止9.17 12:00，待规划处理；', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
]

export const dashboardProjects = [
  ...projects,
  {
    ...projects[0],
    id: 5,
    name: '音视频转码项目（二期）',
    sub: '（SDK 扩展部分）',
    statuses: ['green', 'green', 'green'],
    current: 'Hdrvivid sdk二期',
    currentIndex: 8,
    health: 'normal',
    summary: [
      ['进度', '里程碑正常，二期SDK开发按计划推进。', 'green'],
      ['质量', '遗留问题已完成分级，待联调回归。', 'green'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
  {
    ...projects[1],
    id: 6,
    name: 'AI视频修复算法优化项目',
    owner: '朱理',
    statuses: ['amber', 'green', 'green'],
    current: '专利&i论文输出',
    currentIndex: 4,
    health: 'risk',
    summary: [
      ['进度', '论文输出节点存在轻微偏差，需本周闭环。', 'amber'],
      ['质量', 'V0.0.4版本提测通过，报告待补齐。', 'green'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
  {
    ...projects[2],
    id: 7,
    name: '2D转3D工具回归项目',
    owner: '王智',
    statuses: ['green', 'amber', 'green'],
    current: '待汇报',
    currentIndex: 6,
    health: 'risk',
    summary: [
      ['进度', '里程碑正常，待完成阶段汇报。', 'green'],
      ['质量', '首轮回归仍有历史遗留项，待二轮验证。', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
  {
    ...projects[0],
    id: 8,
    name: '视频播放适配项目',
    sub: '（PC/平板部分）',
    owner: '黄志伟',
    statuses: ['green', 'amber', 'green'],
    current: 'PC/平板播放软件',
    currentIndex: 7,
    health: 'normal',
    summary: [
      ['进度', '里程碑正常，播放软件适配推进中。', 'green'],
      ['质量', '部分机型待补充验证，风险可控。', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
  {
    ...projects[1],
    id: 9,
    name: '客户验收闭环项目',
    owner: '朱理',
    statuses: ['red', 'amber', 'green'],
    current: '客户验收结项',
    currentIndex: 5,
    health: 'danger',
    summary: [
      ['进度', '客户验收闭环延期，需重点关注。', 'red'],
      ['质量', '测试报告仍待客户确认，存在输出风险。', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
]

export const overviewStats = [
  { label: '在研项目', value: 45, unit: '个', tone: 'purple' },
  { label: '运行项目', value: 29, unit: '个', tone: 'green' },
  { label: '本月关闭', value: 16, unit: '个', tone: 'amber' },
  { label: 'TQC风险项', value: 11, unit: '项', tone: 'red' },
]

export const trendData = [
  ['2月', 10, 10, 0],
  ['3月', 11, 11, 0],
  ['4月', 12, 12, 0],
  ['5月', 14, 14, 0],
  ['6月', 17, 17, 0],
  ['7月', 17, 17, 0],
  ['8月', 23, 20, 3],
  ['9月', 28, 25, 3],
  ['10月', 29, 26, 3],
  ['11月', 31, 26, 5],
  ['12月', 34, 28, 6],
  ['1月', 40, 30, 10],
  ['1月加场', 45, 29, 16],
]

export const tqcDepartmentData = [
  ['产品创新部', 12],
  ['技术研究部', 18],
  ['媒体应用使能部', 9],
  ['生态发展部', 6],
]

export const defectProcessData = [
  ['研发', 37],
  ['测试', 63],
]

export const defectLevelData = [
  ['提示级', 30],
  ['一般级', 19],
  ['严重级', 19],
  ['致命级', 32],
]

export const defectStateData = [
  ['已关闭', 18],
  ['已解决', 23],
  ['已通过', 14],
  ['未通过', 8],
  ['修复中', 21],
  ['打开', 10],
  ['挂起', 6],
]

export const dataTypeData = [
  ['数据类型一', 40],
  ['数据类型二', 30],
  ['数据类型三', 15],
  ['数据类型四', 8],
  ['数据类型五', 4],
  ['数据类型六', 3],
]
