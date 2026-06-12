const snapshotDate = Date.UTC(2026, 5, 12)

const normalizeDate = (date) => String(date ?? '').replaceAll('.', '/').replaceAll('-', '/')

const displayDate = (date) => {
  const normalized = normalizeDate(date)
  const match = normalized.match(/^(20\d{2})\/(\d{1,2})\/(\d{1,2})$/)
  if (!match) return date || 'TBD'

  return `${Number(match[2])}/${Number(match[3])}`
}

const dateValue = (date) => {
  const match = normalizeDate(date).match(/^(20\d{2})\/(\d{1,2})\/(\d{1,2})$/)
  if (!match) return Number.POSITIVE_INFINITY

  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

const healthFromStatuses = (statuses) => {
  if (statuses.includes('red')) return 'danger'
  if (statuses.includes('amber')) return 'risk'
  return 'normal'
}

const currentIndexFromNodes = (nodes, current) => {
  if (current) {
    const matchedIndex = nodes.findIndex((node) => node.label.includes(current))
    if (matchedIndex >= 0) return matchedIndex
  }

  const pastIndex = nodes.reduce((lastIndex, node, index) => (
    dateValue(node.date) <= snapshotDate ? index : lastIndex
  ), -1)

  return Math.max(0, pastIndex)
}

const nodeFromRow = ([label, date, meta = {}]) => ({
  label,
  displayDate: displayDate(date),
  date: normalizeDate(date),
  ...meta,
})

const summaryText = (status, normalText, riskText) => (status === 'green' ? normalText : riskText)

const projectFromRow = (row) => {
  const nodes = row.nodes.map(nodeFromRow)
  const currentIndex = currentIndexFromNodes(nodes, row.current)
  const statuses = row.statuses ?? ['green', 'green', 'green']

  return {
    id: row.id,
    name: row.name,
    sub: row.sub ?? '',
    category: row.category ?? '项目',
    owner: row.owner ?? '待确认',
    dept: row.dept,
    statuses,
    current: nodes[currentIndex]?.label ?? nodes[0]?.label ?? '',
    currentIndex,
    health: healthFromStatuses(statuses),
    nodes: nodes.map((node, index) => ({
      ...node,
      state: index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending',
    })),
    summary: [
      [
        '进度',
        row.progressText ?? summaryText(statuses[0], '里程碑正常。', '里程碑存在延期或待决策事项，需持续跟踪。'),
        statuses[0],
      ],
      [
        '质量',
        row.qualityText ?? summaryText(statuses[1], '质量风险可控。', '质量项存在黄灯风险，需关注遗留问题闭环。'),
        statuses[1],
      ],
      [
        '成本',
        row.costText ?? summaryText(statuses[2], '预算执行正常。', '成本项存在风险，需关注资源与预算执行。'),
        statuses[2],
      ],
    ],
  }
}

const realProjectRows = [
  {
    "id": 1,
    "name": "S项目",
    "dept": "产品创新部",
    "owner": "肖署钢",
    "statuses": [
      "amber",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/10/23"
      ],
      [
        "TR3",
        "2025/12/25"
      ],
      [
        "PCR1",
        "2026/01/15"
      ],
      [
        "PCR2",
        "2026/05/11"
      ],
      [
        "PDCP",
        "2026/06/30",
        {
          "risk": "amber",
          "persistRisk": true
        }
      ],
      [
        "TR4/TR4A",
        ""
      ],
      [
        "TR5",
        ""
      ],
      [
        "ADCP",
        ""
      ]
    ],
    "current": "PDCP",
    "progressText": "1、客户项目计划未输出，PDCP节点暂无输入，待客户确认后另行组织技委会汇报；；2、总DI值163.2（较上周下降35.2），待回归问题数106。"
  },
  {
    "id": 2,
    "name": "车载空间音频技术项目",
    "dept": "技术研究部",
    "owner": "袁明山",
    "statuses": [
      "amber",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/01/06"
      ],
      [
        "Audio vivid解码SDK落地一款车型",
        "2025/12/31"
      ],
      [
        "完成第二版调音DSP软件",
        "2026/03/31"
      ],
      [
        "新实车展示DEMO",
        "2026/05/30",
        {
          "risk": "amber",
          "persistRisk": true
        }
      ],
      [
        "SIMO生成校准",
        "2026/07/30"
      ],
      [
        "第三版调音方案",
        "2026/08/30"
      ],
      [
        "半自动调音工具",
        "2026/10/30"
      ],
      [
        "车企POC项目",
        "2026/12/30"
      ]
    ],
    "current": "新实车展示DEMO",
    "progressText": "6月17号协同销售(胡广/余)到东风奕派展示实验室车载方案demo，同时推进实车到实验室的进展。"
  },
  {
    "id": 3,
    "name": "车载实时转3D项目",
    "dept": "技术研究部",
    "owner": "袁明山",
    "statuses": [
      "amber",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/09/18"
      ],
      [
        "目标车型Benchmark评测",
        "2025/09/30"
      ],
      [
        "4分类+初版空间渲染混音主观评测",
        "2025/10/30"
      ],
      [
        "PCR1",
        "2026/02/27"
      ],
      [
        "车载智能混音开发",
        "2026/03/31"
      ],
      [
        "实时6分类+智能混音实车评测",
        "2026/04/15"
      ],
      [
        "非AI分离的实时2D转3D方案",
        "2026/04/30"
      ],
      [
        "AI与非AI方案对比评测",
        "2026/05/30",
        {
          "risk": "amber",
          "persistRisk": true
        }
      ]
    ],
    "current": "AI与非AI方案对比评测",
    "progressText": "本次里程碑结论未发出，里程碑延期，黄灯。"
  },
  {
    "id": 4,
    "name": "V项目",
    "dept": "产品创新部",
    "owner": "潘松岳",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/04/29"
      ],
      [
        "TR3",
        "2026/05/11"
      ],
      [
        "PDCP",
        "2026/05/30"
      ],
      [
        "TR4",
        "2026/06/05"
      ],
      [
        "TR4A",
        "2026/07/10"
      ],
      [
        "TR5",
        "2026/08/17"
      ],
      [
        "TR6",
        "2026/09/15"
      ],
      [
        "结项",
        "2026/10/30"
      ]
    ],
    "progressText": "PDCP计划技委会汇报，待决策；新增客户质量合同风险，与客户评估中；"
  },
  {
    "id": 5,
    "name": "家庭场景实时2D转3D工程化开发项目",
    "dept": "技术研究部",
    "owner": "袁明山",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/04/23"
      ],
      [
        "主观听音对比测试，ASD效果优于原始调音",
        "2026/05/15"
      ],
      [
        "影音室评测ASD效果",
        "2026/05/30"
      ],
      [
        "市场需求反馈搜集",
        "2026/06/30"
      ]
    ],
    "progressText": "已组织多功能团队进行主观评价，整体效果平均："
  },
  {
    "id": 6,
    "name": "基于音效多分类的影视立体声转制三维声SDK",
    "dept": "技术研究部",
    "owner": "夏宇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/12/18"
      ],
      [
        "PCR1",
        "2026/03/19"
      ],
      [
        "电影6分类模型训练及优化 空间渲染混音6分类",
        "2026/04/15"
      ],
      [
        "电影8分类模型训练及优化",
        "2026/04/30"
      ]
    ],
    "progressText": "6分类、8分类里程碑测试效果如，满足PCR既定目标，项目整体考虑结项。[图片]"
  },
  {
    "id": 7,
    "name": "菁彩声家庭解决方案项目",
    "dept": "技术研究部",
    "owner": "夏宇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2024/12/02"
      ],
      [
        "定位定距渲染算法集成到RK平台",
        "2025/08/15"
      ],
      [
        "自适应声场渲染方案交付件输出",
        "2025/12/15"
      ],
      [
        "场校准混响估计和补偿技术方案",
        "2025/12/31"
      ],
      [
        "验证平台完成搭建",
        "2026/01/31"
      ],
      [
        "完成全量UWA需求交付",
        "2026/02/28"
      ],
      [
        "对标Flex Connect：定位、校准功能完善，实现完整算法功能Demo",
        "2026/04/15"
      ]
    ],
    "progressText": "商业化（工程化&落地）依赖320 Soundbar项目，对应需求已经确认拆分落入320项目分配到人。当前已经申请暂停。进度上属于延期完成，黄灯。"
  },
  {
    "id": 8,
    "name": "AI双目智能跟拍运动相机预研项目",
    "dept": "技术研究部",
    "owner": "夏宇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/02/28"
      ],
      [
        "完成样机制作",
        "2026/04/25"
      ],
      [
        "跟踪功能在样机部署演示",
        "2026/05/29"
      ],
      [
        "语音控制功能在样机收敛 & 结项",
        "2026/06/19"
      ]
    ],
    "progressText": "6.3产品创新部TMG会组织集体审视里程碑符合预期里程碑效果。"
  },
  {
    "id": 9,
    "name": "M项目",
    "dept": "产品创新部",
    "owner": "黄炎莹",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/12/11"
      ],
      [
        "样机演示",
        "2026/01/30"
      ],
      [
        "TR1/TR2/TR3",
        "2026/03/27"
      ],
      [
        "PDCP",
        "2026/04/15"
      ],
      [
        "TR4",
        ""
      ],
      [
        "TR4A",
        ""
      ],
      [
        "客户验收",
        ""
      ]
    ],
    "progressText": "1、PDCP重新刷新里程碑节点；；2、总DI值56.3（较上月增加10），待回归问题数31；"
  },
  {
    "id": 10,
    "name": "海思320一体式Soundbar",
    "dept": "产品创新部",
    "owner": "潘松岳",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/01/15"
      ],
      [
        "DRB评审",
        "2026/03/02"
      ],
      [
        "TR3",
        "2026/03/20"
      ],
      [
        "PDCP",
        "2026/04/20"
      ],
      [
        "TR4",
        "2026/05/30"
      ],
      [
        "TR4A",
        "2026/08/20"
      ],
      [
        "结项",
        "2026/10/20"
      ]
    ],
    "progressText": "TR4自检通过，其余质量、成本正常跟踪"
  },
  {
    "id": 11,
    "name": "中国移动audio vivid音箱",
    "dept": "产品创新部",
    "owner": "潘松岳",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/10/23"
      ],
      [
        "材料提交入库",
        "2025/10/30"
      ],
      [
        "首版样机装配完成",
        "2025/11/30"
      ],
      [
        "TR3",
        "2025/12/20"
      ],
      [
        "PDCP",
        "2026/01/29"
      ],
      [
        "TR4&TR4A",
        "2026/04/10"
      ],
      [
        "PCR1",
        "2026/05/25"
      ],
      [
        "ADCP",
        "2026/07/30"
      ]
    ],
    "progressText": "因客户自身原因，导致杭研入库没有完成，已走PCR里程碑变更流程，结项节点由05/25调整至07/30；；其余质量、成本正常跟踪"
  },
  {
    "id": 12,
    "name": "二轴云台相机项目",
    "dept": "产品创新部",
    "owner": "肖署钢",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/12/18"
      ],
      [
        "TR1/TR2/TR3",
        "2026/01/25"
      ],
      [
        "PDCP",
        "2026/02/10"
      ],
      [
        "PCR1",
        "2026/06/01"
      ],
      [
        "TR4A",
        "2026/07/30"
      ]
    ],
    "progressText": "因外部因素导致整体进度延迟，已走PCR变更，结项节点由05/30调整至07/30；其余质量、成本正常跟踪；"
  },
  {
    "id": 13,
    "name": "UWA自动化测试工具",
    "dept": "产业生态发展部",
    "owner": "陈声武",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2024/12/09"
      ],
      [
        "测试工具（设备显示端）",
        "2025/03/31"
      ],
      [
        "测试工具（播放设备端&内容生成端）",
        "2025/06/30"
      ],
      [
        "确定方案&确定Y,K合作方式",
        "2025/08/31"
      ],
      [
        "测试工具（其他场景）",
        "2025/12/31"
      ],
      [
        "结项",
        "2026/02/28"
      ]
    ],
    "progressText": "已结项"
  },
  {
    "id": 14,
    "name": "GTM项目",
    "dept": "产业生态发展部",
    "owner": "张益",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/02/05"
      ],
      [
        "PCR1",
        "2026/06/05"
      ],
      [
        "卖点拉齐",
        "2026/05/31"
      ],
      [
        "宣发准备",
        "2026/06/28"
      ],
      [
        "集中宣发",
        "2026/07/12"
      ],
      [
        "总结复盘",
        "2026/07/19"
      ],
      [
        "日常运维",
        "2026/07/26"
      ]
    ],
    "progressText": "项目完成里程碑&项目目标变更，已完成项目启动期节点自检，完成项目卖点确定；"
  },
  {
    "id": 15,
    "name": "Audio Vivid内容质量检测",
    "dept": "产业生态发展部",
    "owner": "于婧",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/09/11"
      ],
      [
        "Audio Vivid MetaData检测",
        "2025/09/30"
      ],
      [
        "PCR1",
        "2026/03/19"
      ],
      [
        "Audio Vivid内容异常检测版本发布",
        "2026/06/30"
      ],
      [
        "UWA验收",
        "2026/11/30"
      ],
      [
        "结项",
        "2027/06/30"
      ]
    ],
    "progressText": "里程碑正常。"
  },
  {
    "id": 16,
    "name": "视频内容质量检测项目",
    "dept": "产业生态发展部",
    "owner": "于婧",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/04/23"
      ],
      [
        "KCP1",
        "2026/07/30"
      ],
      [
        "KCP2",
        "2026/09/30"
      ],
      [
        "KCP3",
        "2026/10/15"
      ],
      [
        "结项",
        "2026/11/30"
      ]
    ],
    "progressText": "里程碑正常。"
  },
  {
    "id": 17,
    "name": "星闪示范系统开发",
    "dept": "产品创新部",
    "owner": "黄炎莹",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/10/09"
      ],
      [
        "PCR1",
        "2026/03/02"
      ],
      [
        "TR1/TR2/TR3",
        "2026/03/15"
      ],
      [
        "TR4",
        "2026/05/25"
      ],
      [
        "结项",
        "2026/07/30"
      ]
    ],
    "progressText": "TR4A已完成自检通过，样机待客户验收；其余质量、成本正常跟踪"
  },
  {
    "id": 18,
    "name": "A动漫剧制作工具项目",
    "dept": "媒体应用使能部",
    "owner": "陈佳昊",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "current": "V2.0ReelClaw + 无限画布",
    "nodes": [
      [
        "立项",
        "2025/12/18"
      ],
      [
        "V0.5 MVP版本发布",
        "2026/02/28"
      ],
      [
        "V1.0版本发布",
        "2026/04/07"
      ],
      [
        "PCR1",
        "2026/05/21"
      ],
      [
        "V2.0ReelClaw + 无限画布",
        "2026/06/30"
      ],
      [
        "Toc版本发布",
        "2026/09/30"
      ],
      [
        "全年闭环",
        "2026/12/31"
      ]
    ],
    "progressText": "5月21日技委会进行PCR通过，发布计划调整。；当前里程碑正常进行。6.30发布ReelClaw + 无限画布。"
  },
  {
    "id": 19,
    "name": "AI视频翻译（三期）",
    "dept": "媒体应用使能部",
    "owner": "余意",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/01/22"
      ],
      [
        "产品V2.0.0_beta1版本发布",
        "2026/02/10"
      ],
      [
        "产品V2.5.0正式版上线",
        "2026/02/05"
      ],
      [
        "多语言互译&高光剪辑",
        "2026/04/30"
      ],
      [
        "拓展使用场景，实现原子能力入口，API开放",
        "2026/06/30"
      ],
      [
        "结项",
        "2026/09/20"
      ]
    ],
    "progressText": "里程碑正常，需关注原始规划里程碑6.30的变更。"
  },
  {
    "id": 20,
    "name": "AI针尖技术预研项目",
    "dept": "媒体应用使能部",
    "owner": "朱理",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/03/19"
      ],
      [
        "技术预研与方案设计",
        "2026/04/30"
      ],
      [
        "算法攻关与原型验证",
        "2026/06/30"
      ],
      [
        "模型性能优化与工程实现",
        "2026/07/31"
      ],
      [
        "系统集成与方案闭环",
        "2026/09/30"
      ],
      [
        "结项：成果固化与应用布局",
        "2026/12/31"
      ]
    ],
    "progressText": "里程碑正常，六月底需完成推理加速模型上线验收，七月底前推进TTS配音、智能构图等Demo提报。"
  },
  {
    "id": 21,
    "name": "数字人与3DGS重建预研",
    "dept": "媒体应用使能部",
    "owner": "邱戴飞",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/04/16"
      ],
      [
        "3D数字人",
        "2026/05/31"
      ],
      [
        "3DGS数字人",
        "2026/07/31"
      ],
      [
        "3DGS体积视频",
        "2026/10/31"
      ],
      [
        "PCR1",
        "2026/03/19"
      ],
      [
        "渲染器插件V1.1",
        "2026/01/01"
      ],
      [
        "单帧重建2min",
        "2026/05/31"
      ],
      [
        "渲染器插件V1.2",
        "2026/01/02"
      ]
    ],
    "progressText": "里程碑正常，4.30里程碑于4.22测试通过。"
  },
  {
    "id": 22,
    "name": "语音指令识别",
    "dept": "媒体应用使能部",
    "owner": "金绍港",
    "statuses": [
      "amber",
      "green",
      "amber"
    ],
    "nodes": [
      [
        "立项",
        "2025/10/23"
      ],
      [
        "完成技术方案的选型与数据采集",
        "2025/12/15"
      ],
      [
        "终端芯片上实现语音指令识别演示",
        "2026/01/15"
      ],
      [
        "结项-完成技术专利、软著等资料",
        "2026/01/31"
      ]
    ],
    "progressText": "内部CT会完成结项，结项时间较计划有延期。财务：人工费用预算执行率为138%."
  },
  {
    "id": 24,
    "name": "音视频转制解决方案",
    "dept": "技术研究部",
    "owner": "黄志伟",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/06/12"
      ],
      [
        "云转码V1.1.0",
        "2026/01/01"
      ],
      [
        "制作域转码V1.2.0",
        "2026/01/02"
      ],
      [
        "制作域转码V1.2.2",
        "2026/01/02"
      ],
      [
        "PCR1",
        "2026/03/27"
      ],
      [
        "转码引擎数字水印算法V1.0",
        "2026/04/20"
      ],
      [
        "超高清转制工具V1.0版本",
        "2026/04/28"
      ],
      [
        "超高清转制发布v1.1/1.2版本",
        "2026/01/01"
      ]
    ],
    "progressText": "6月5日内部PCR2，按市场推广策略，新增需求，里程碑5.31->6月30日发布。；6月4日V1.1.5版本测试他通过。"
  },
  {
    "id": 25,
    "name": "UWA-UWA-A项目",
    "dept": "技术研究部",
    "owner": "白金",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/08/14"
      ],
      [
        "UWA荷兰IBC参展版本",
        "2025/08/22"
      ],
      [
        "英夫美迪初版",
        "2025/09/15"
      ],
      [
        "UWA交付版本v1.0",
        "2025/11/28"
      ],
      [
        "PCR1",
        "2026/01/22"
      ],
      [
        "ProTools正式版本发布",
        "2026/03/30"
      ],
      [
        "ProTools Windows版本 支持完成",
        "2026/04/15"
      ],
      [
        "结项",
        "2026/06/30"
      ]
    ],
    "progressText": "待审视结项。"
  },
  {
    "id": 30,
    "name": "菁彩空间商业化项目",
    "dept": "产业生态发展部",
    "owner": "张雯",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/12/11"
      ],
      [
        "原型样机（展示可用）",
        "2026/03/30"
      ],
      [
        "空间音效的内容整合",
        "2026/06/30"
      ],
      [
        "工程样机（含授权内容）",
        "2026/09/30"
      ],
      [
        "样机订单签订日期 TBD",
        ""
      ]
    ],
    "progressText": "1、计划6/15完成样机的功能集成，并进行公司级演示；；2、根据演示效果，决策项目后续投入变更&目标规划；"
  },
  {
    "id": 31,
    "name": "2026音视频标准",
    "dept": "技术研究部",
    "owner": "马学睿",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/01/15"
      ],
      [
        "半年度里程碑",
        "2026/06/30"
      ],
      [
        "结项",
        "2026/12/31"
      ]
    ],
    "progressText": "里程碑正常，7月上进行半年汇报。"
  },
  {
    "id": 32,
    "name": "端到端图像&视频编解码预研",
    "dept": "技术研究部",
    "owner": "邹仁杰",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/11/13"
      ],
      [
        "高效合作",
        "2026/02/28"
      ],
      [
        "RGB/YUV域上超过VTM",
        "2026/03/31"
      ],
      [
        "RGB域上BD-Rate超过VTM20%",
        "2026/06/30"
      ],
      [
        "参加比赛(Top20%)&中期成果验收",
        "2026/07/31"
      ],
      [
        "YUV域上BD-Rate超过VTM15%",
        "2026/09/30"
      ],
      [
        "成果验收&输出顶会论文",
        "2026/12/27"
      ]
    ],
    "progressText": "里程碑正常"
  },
  {
    "id": 33,
    "name": "星闪协议开发",
    "dept": "产品创新部",
    "owner": "应冬文",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/11/13"
      ],
      [
        "PDCP",
        "2026/03/30"
      ],
      [
        "音频链路修改与梳理",
        "2026/09/30"
      ],
      [
        "整机系统调试",
        "2026/10/30"
      ],
      [
        "项目验收结项",
        "2026/12/30"
      ]
    ],
    "progressText": "里程碑正常，节奏可控。"
  },
  {
    "id": 34,
    "name": "双Vivid播放器",
    "dept": "技术研究部",
    "owner": "王飞龙",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "CT立项",
        "2025/03/09"
      ],
      [
        "mac端播放器测试完成",
        "2026/04/15"
      ],
      [
        "openharmony端播放器完成双vivid功能开发",
        "2026/04/30"
      ],
      [
        "harmonyOS移动端UI初步完成",
        "2026/05/31"
      ],
      [
        "harmonyOS移动端测试完成并上线",
        "2026/06/30"
      ]
    ],
    "progressText": "5.30里程碑完成：5.21测试报告结论通过。"
  },
  {
    "id": 35,
    "name": "星闪扩声项目",
    "dept": "产品创新部",
    "owner": "应冬文",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/02/28"
      ],
      [
        "需求评审",
        "2026/03/20"
      ],
      [
        "领夹麦克风扩声方案一期发布",
        "2026/06/30"
      ],
      [
        "无感扩声方案发布",
        "2026/07/30"
      ],
      [
        "项目结项",
        "2026/08/30"
      ]
    ],
    "progressText": "项目整体状况审视，待汇报审视结论；"
  },
  {
    "id": 36,
    "name": "UWA视频项目（2026）",
    "dept": "技术研究部",
    "owner": "姜潇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/02/28"
      ],
      [
        "PCR1",
        "2026/06/08"
      ],
      [
        "直通方案第二版",
        "2026/05/31"
      ],
      [
        "直通方案第三版&结项",
        "2026/09/30"
      ]
    ],
    "progressText": "6月8日内部里程碑PCR调整通过，下个里程碑6.26审视。"
  },
  {
    "id": 37,
    "name": "智马云管理中台与产品商业化平台研发项目",
    "dept": "媒体应用使能部",
    "owner": "彭啸枫",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/04/02"
      ],
      [
        "一期需求冻结",
        "2026/05/15"
      ],
      [
        "一期产品上线、二期需求冻结",
        "2026/07/30"
      ],
      [
        "二期产品上线",
        "2026/10/30"
      ]
    ],
    "progressText": "里程碑正常，模型设计文档已归档。"
  },
  {
    "id": 38,
    "name": "2026测试解决方案项目",
    "dept": "产业生态发展部",
    "owner": "陈浩",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/03/19"
      ],
      [
        "测试产品集成1",
        "2026/05/15"
      ],
      [
        "测试产品集成2",
        "2026/06/15"
      ],
      [
        "测试产品集成3",
        "2026/12/15"
      ],
      [
        "测试服务状态审视",
        "2026/12/31"
      ]
    ],
    "progressText": "已完成CT会汇报，KCP1&KCP2结论通过"
  },
  {
    "id": 39,
    "name": "技术部视频维护项目",
    "dept": "技术研究部",
    "owner": "黄志伟",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/01/22"
      ],
      [
        "结束",
        "2026/12/31"
      ]
    ],
    "progressText": "截止6.10录入跟踪两个客户反馈问题。"
  },
  {
    "id": 40,
    "name": "技术研究部音频维护项目",
    "dept": "技术研究部",
    "owner": "夏宇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/02/27"
      ],
      [
        "结束",
        "2026/12/31"
      ]
    ],
    "progressText": "截止6.10录入跟踪两个客户反馈问题（咪咕）。"
  },
  {
    "id": 41,
    "name": "双耳渲染2.0技术预研项目",
    "dept": "技术研究部",
    "owner": "白金",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/03/27"
      ],
      [
        "技术预研与方案设计，对标A16的通用HRTF效果优化",
        "2026/04/30"
      ],
      [
        "对标A16的个性化HRTF测量算法和软件实现",
        "2026/06/30"
      ],
      [
        "双耳渲染框架重构，双声道音源渲染流程搭建与效果优化",
        "2026/08/31"
      ],
      [
        "结项：后处理及总体效果优化",
        "2026/09/30"
      ]
    ],
    "progressText": "4.30里程碑按时通过，测试报告结论：[图片]"
  },
  {
    "id": 42,
    "name": "智能乐队项目",
    "dept": "技术研究部",
    "owner": "夏宇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/05/20"
      ],
      [
        "迭代1，MVP",
        "2026/07/15"
      ],
      [
        "迭代2，Web发布",
        "2026/09/15"
      ],
      [
        "迭代3，APP发布",
        "2026/11/15"
      ],
      [
        "结项，",
        "2026/12/15"
      ]
    ],
    "progressText": "里程碑正常。"
  },
  {
    "id": 43,
    "name": "UWA影院项目",
    "dept": "技术研究部",
    "owner": "夏宇",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/05/21"
      ],
      [
        "实验室内部714环境进行测试验收",
        "2026/05/30"
      ],
      [
        "主观评测评分达到杜比80%效果",
        "2026/06/30"
      ],
      [
        "结项",
        "2026/06/30"
      ]
    ],
    "progressText": "交付件输出待补充归档。"
  },
  {
    "id": 44,
    "name": "演示场景断点解决方案项目",
    "dept": "产品创新部",
    "owner": "潘松岳",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2025/12/18"
      ],
      [
        "TR3",
        "2025/12/26"
      ],
      [
        "PCR1",
        "2026/03/02"
      ],
      [
        "TR4&TR4A",
        "2026/04/15"
      ],
      [
        "PCR2",
        "2026/05/11"
      ],
      [
        "ADCP",
        "2026/06/08"
      ]
    ],
    "progressText": "CT会已完成结项汇报，遗留客户交付（客户需求）问题跟踪；"
  },
  {
    "id": 45,
    "name": "产品创新部影音维护项目",
    "dept": "产品创新部",
    "owner": "黄炎莹",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/03/02"
      ],
      [
        "结束",
        "2026/12/31"
      ]
    ],
    "progressText": "维护项目，主要跟踪预算执行、问题单及需求闭环。"
  },
  {
    "id": 46,
    "name": "便携式电视宝商业项目",
    "dept": "产品创新部",
    "owner": "张奎",
    "statuses": [
      "green",
      "green",
      "green"
    ],
    "nodes": [
      [
        "立项",
        "2026/02/28"
      ],
      [
        "决策：确定推广样机是否可市场推广",
        "2026/04/20"
      ],
      [
        "整机订单触发",
        ""
      ],
      [
        "定制周期结束",
        "2026/12/30"
      ]
    ],
    "progressText": "已与韵舞确认PCBA消耗方案，待完成订单交付；"
  }
]

export const dashboardProjects = realProjectRows.map(projectFromRow)
export const projects = dashboardProjects.slice(0, 3)
