import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CircleDollarSign,
  FolderKanban,
  ShieldAlert,
} from 'lucide-react'
import MilestoneChart from './MilestoneChart'

const PAGE_SIZE = 7
const PAGE_INTERVAL = 12000
const SCREEN_INTERVAL = 36000

const projects = [
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
      ['立项', '2024.11.22', 'done'],
      ['需求冻结', '12.6', 'done'],
      ['第一阶段交付', '12.31', 'done'],
      ['Hdrvivid sdk', '2025.3.31', 'done'],
      ['第二阶段交付', '3.31', 'done'],
      ['APP二期(安卓)', '6.30', 'done'],
      ['APP二期(iOS)', '7.31', 'done'],
      ['PC/平板播放软件', '9.30', 'active'],
      ['Hdrvivid sdk二期', '12.31', 'active'],
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
      ['立项', '11/22', 'done'],
      ['技术可行性研究', '12/27', 'active'],
      ['算法V1交付', '2025/01/27', 'active'],
      ['算法V2交付&系统上线', '05/07', 'active'],
      ['专利&i论文输出', '06/07(延)', 'active'],
      ['客户验收结项', '06/27->7.31', 'active'],
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
      ['立项', '12/02', 'done'],
      ['需求冻结', '12/06', 'done'],
      ['第一期交付', '12/31', 'done'],
      ['第二期交付', '2025/03/31', 'done'],
      ['百事通版本1', '07/25', 'done'],
      ['百事通版本2', '9月5日', 'active'],
      ['待汇报', 'XXX', 'active'],
      ['第三期交付（客户）', '2025/12/31', 'active'],
    ],
    summary: [
      ['进度', '里程碑正常，9月5日版本已提测，待规划9月下旬版本。', 'green'],
      ['质量', '1）9.5百事通版本首轮测试不通过，待二轮回归；2）历史遗留DI=66.1，具体：linux端2D转3D工具:29.1+13，PC端2D转3D工具:24，截止9.17 12:00，待规划处理；', 'amber'],
      ['成本', '预算执行正常。', 'green'],
    ],
  },
]

const dashboardProjects = [
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

const overviewStats = [
  { label: '在研项目', value: 45, unit: '个', tone: 'purple' },
  { label: '运行项目', value: 29, unit: '个', tone: 'green' },
  { label: '本月关闭', value: 16, unit: '个', tone: 'amber' },
  { label: 'TQC风险项', value: 11, unit: '项', tone: 'red' },
]

const trendData = [
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

const tqcDepartmentData = [
  ['产品创新部', 12],
  ['技术研究部', 18],
  ['媒体应用使能部', 9],
  ['生态发展部', 6],
]

const defectProcessData = [
  ['研发', 37],
  ['测试', 63],
]

const defectLevelData = [
  ['提示级', 30],
  ['一般级', 19],
  ['严重级', 19],
  ['致命级', 32],
]

const defectStateData = [
  ['已关闭', 18],
  ['已解决', 23],
  ['已通过', 14],
  ['未通过', 8],
  ['修复中', 21],
  ['打开', 10],
  ['挂起', 6],
]

const dataTypeData = [
  ['数据类型一', 40],
  ['数据类型二', 30],
  ['数据类型三', 15],
  ['数据类型四', 8],
  ['数据类型五', 4],
  ['数据类型六', 3],
]

function MetricCard({ item }) {
  const Icon = item.icon
  return (
    <div className={`metric-card metric-${item.tone}`}>
      <div className="metric-heading">
        <span className="metric-label">{item.label}</span>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="metric-value-row">
        <strong>{item.value}</strong>
        <span>{item.unit}</span>
      </div>
      <div className="metric-foot">
        <span>PROJECT INDEX</span>
        {item.extra && <b>↑ {item.extra}</b>}
      </div>
    </div>
  )
}

function Header({ now, title }) {
  const dateText = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(now)
  const timeText = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <header className="topbar">
      <div className="brand">
        <img src="/logotext.png" alt="马栏山音视频实验室" />
      </div>
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      <div className="header-meta">
        <div className="live-time">
          <span>{dateText}</span>
          <b>{timeText}</b>
        </div>
      </div>
    </header>
  )
}

function Summary({ items }) {
  const primary = items[0]
  const secondary = items.slice(1)

  return (
    <div className="summary">
      {primary && (
        <div className="summary-main">
          <b className={primary[2]}>{primary[0]}</b>
          <span>{primary[1]}</span>
        </div>
      )}
      <div className="summary-secondary">
        {secondary.map((line) => (
          <span key={line[0]}>
            <b className={line[2]}>{line[0]}</b>
            {line[1]}
          </span>
        ))}
      </div>
    </div>
  )
}

function OverviewStatCard({ item }) {
  return (
    <div className={`overview-stat overview-stat-${item.tone}`}>
      <span>{item.label}</span>
      <strong>{item.value}</strong>
      <em>{item.unit}</em>
    </div>
  )
}

function TrendChart() {
  const max = Math.max(...trendData.flatMap((item) => item.slice(1)))
  const barHeight = (value) => `${Math.max(2, (value / max) * 100)}%`

  return (
    <article className="overview-card trend-card">
      <div className="overview-card-head">
        <span>项目数趋势</span>
        <small>25年2月 - 26年1月</small>
      </div>
      <div className="trend-chart">
        <div className="trend-grid" />
        {trendData.map(([month, total, running, closed]) => (
          <div className="trend-group" key={month}>
            <div className="trend-bars">
              <i className="total" style={{ height: barHeight(total) }}><b>{total}</b></i>
              <i className="running" style={{ height: barHeight(running) }}><b>{running}</b></i>
              <i className="closed" style={{ height: barHeight(closed) }}><b>{closed}</b></i>
            </div>
            <span>{month}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span><i className="total" />项目总数</span>
        <span><i className="running" />运行数</span>
        <span><i className="closed" />关闭数</span>
      </div>
    </article>
  )
}

function DonutCard({ title, data, variant = 'default' }) {
  const total = data.reduce((sum, item) => sum + item[1], 0)
  let cursor = 0
  const colors = variant === 'status'
    ? ['#b479f0', '#7c2cf4', '#ffbd2e', '#ff6678', '#a77bf3', '#28c840', '#0e0e1e']
    : ['#7c2cf4', '#b479f0', '#a77bf3', '#ffbd2e', '#28c840', '#ff6678']
  const gradient = data.map((item, index) => {
    const start = cursor
    cursor += (item[1] / total) * 100
    return `${colors[index % colors.length]} ${start}% ${cursor}%`
  }).join(', ')

  return (
    <article className="overview-card donut-card">
      <div className="overview-card-head">
        <span>{title}</span>
        <small>分布占比</small>
      </div>
      <div className="donut-layout">
        <div className="donut" style={{ background: `conic-gradient(${gradient})` }}>
          <span>{total}</span>
          <small>总量</small>
        </div>
        <div className="donut-list">
          {data.map((item, index) => (
            <span key={item[0]}>
              <i style={{ background: colors[index % colors.length] }} />
              <b>{item[0]}</b>
              <em>{Math.round((item[1] / total) * 100)}%</em>
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function DepartmentCard() {
  const max = Math.max(...tqcDepartmentData.map((item) => item[1]))
  return (
    <article className="overview-card department-card">
      <div className="overview-card-head">
        <span>TQC 项目数</span>
        <small>按责任部门</small>
      </div>
      <div className="dept-list">
        {tqcDepartmentData.map(([name, value]) => (
          <div className="dept-row" key={name}>
            <span>{name}</span>
            <div><i style={{ width: `${(value / max) * 100}%` }} /></div>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </article>
  )
}

function RingGridCard() {
  return (
    <article className="overview-card ring-grid-card">
      <div className="overview-card-head">
        <span>数据类型分布</span>
        <small>类型占比</small>
      </div>
      <div className="ring-grid">
        {dataTypeData.map(([name, value], index) => (
          <div className="ring-item" key={name}>
            <div
              className="mini-ring"
              style={{ background: `conic-gradient(${index < 3 ? '#7c2cf4' : '#b479f0'} 0 ${value}%, #e1e3e8 ${value}% 100%)` }}
            >
              <b>{value}%</b>
            </div>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

function OverviewPage() {
  return (
    <section className="overview-page">
      <div className="overview-stats">
        {overviewStats.map((item) => <OverviewStatCard item={item} key={item.label} />)}
      </div>

      <div className="overview-main">
        <DonutCard title="TQC 项目结构" data={defectLevelData} />
        <TrendChart />
      </div>

      <div className="overview-grid">
        <DepartmentCard />
        <DonutCard title="缺陷处理分布" data={defectProcessData} />
        <DonutCard title="缺陷状态分布" data={defectStateData} variant="status" />
        <RingGridCard />
      </div>
    </section>
  )
}

function TqcStatus({ statuses }) {
  const labels = ['T', 'Q', 'C']
  return (
    <div className="tqc-inline" aria-label="TQC 状态">
      {statuses.map((status, index) => (
        <span className="tqc-chip" key={labels[index]}>
          <b>{labels[index]}</b>
          <i className={`status-light ${status}`} />
        </span>
      ))}
    </div>
  )
}

function TqcSummary({ project }) {
  return (
    <div className="tqc-summary">
      <Summary items={project.summary} />
    </div>
  )
}

function Dashboard() {
  const [now, setNow] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(0)
  const [screenPage, setScreenPage] = useState(0)
  const screenCount = 2
  const totalPages = Math.max(1, Math.ceil(dashboardProjects.length / PAGE_SIZE))
  const metrics = useMemo(() => {
    const total = dashboardProjects.length
    const percent = (count) => (total > 0 ? `${Math.round((count / total) * 100)}%` : '0%')
    const normal = dashboardProjects.filter((project) => project.health === 'normal').length
    const progressRisk = dashboardProjects.filter((project) => project.statuses[0] !== 'green').length
    const qualityRisk = dashboardProjects.filter((project) => project.statuses[1] !== 'green').length
    const costRisk = dashboardProjects.filter((project) => project.statuses[2] !== 'green').length
    const attention = dashboardProjects.filter((project) => project.statuses.some((status) => status !== 'green')).length

    return [
      { label: '项目总数', value: total, unit: '个', icon: FolderKanban, tone: 'blue' },
      { label: '正常推进', value: normal, unit: '个', extra: percent(normal), icon: Check, tone: 'green' },
      { label: '进度风险', value: progressRisk, unit: '个', extra: percent(progressRisk), icon: AlertTriangle, tone: 'amber' },
      { label: '质量风险', value: qualityRisk, unit: '个', extra: percent(qualityRisk), icon: ShieldAlert, tone: 'red' },
      { label: '成本风险', value: costRisk, unit: '个', extra: percent(costRisk), icon: CircleDollarSign, tone: 'blue' },
      { label: '本周需关注', value: attention, unit: '项', icon: CalendarDays, tone: 'indigo' },
    ]
  }, [])
  const visibleProjects = useMemo(
    () => dashboardProjects.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [currentPage],
  )

  useEffect(() => {
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(clockTimer)
  }, [])

  useEffect(() => {
    const screenTimer = window.setInterval(
      () => setScreenPage((page) => (page + 1) % screenCount),
      SCREEN_INTERVAL,
    )
    return () => window.clearInterval(screenTimer)
  }, [screenCount])

  useEffect(() => {
    if (totalPages <= 1 || screenPage !== 0) return undefined
    const pageTimer = window.setInterval(
      () => setCurrentPage((page) => (page + 1) % totalPages),
      PAGE_INTERVAL,
    )
    return () => window.clearInterval(pageTimer)
  }, [screenPage, totalPages])

  return (
    <main className={`dashboard ${screenPage === 1 ? 'dashboard-overview' : ''}`}>
      <Header
        now={now}
        title={screenPage === 0 ? '项目组合里程碑进度与 TQC 看板' : '项目信息概览'}
      />

      {screenPage === 0 ? (
        <>
          <section className="metrics">
            {metrics.map((item) => <MetricCard item={item} key={item.label} />)}
          </section>

          <section className="project-board">
            <div className="board-title">
              <span>TQC 看板</span>
            </div>

            <div
              className="board-body"
              style={{ '--rows-per-page': PAGE_SIZE }}
              key={currentPage}
            >
              {visibleProjects.map((project, slotIndex) => (
                <div className="project-row" key={project.id}>
                  <div className="cell index-cell">{currentPage * PAGE_SIZE + slotIndex + 1}</div>
                  <div className="cell project-info">
                    <div className="project-title">
                      <b>{project.name}</b>
                      {project.sub && <span>{project.sub}</span>}
                    </div>
                    <div className="project-meta-line">
                      <span>{project.owner}</span>
                      <i />
                      <span>{project.dept}</span>
                    </div>
                  </div>
                  <div className="cell tqc-status-cell"><TqcStatus statuses={project.statuses} /></div>
                  <div className="cell timeline-cell"><MilestoneChart project={project} /></div>
                  <div className="cell summary-cell"><TqcSummary project={project} /></div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <OverviewPage />
      )}

      <nav className="pagination" aria-label="看板分页">
        <span className="page-count">
          第 {screenPage === 0 ? currentPage + 1 : screenPage + 1} / {screenPage === 0 ? totalPages : screenCount} 页
        </span>
        <div className="page-dots">
          {Array.from({ length: screenCount }, (_, index) => (
            <button
              type="button"
              className={index === screenPage ? 'active' : ''}
              aria-label={`切换到看板第 ${index + 1} 页`}
              aria-current={index === screenPage ? 'page' : undefined}
              onClick={() => setScreenPage(index)}
              key={index}
            />
          ))}
        </div>
        <span className="page-timer">{screenPage === 0 ? `${PAGE_INTERVAL / 1000} 秒项目翻页` : `${SCREEN_INTERVAL / 1000} 秒看板翻页`}</span>
      </nav>
    </main>
  )
}

export default function App() {
  return <Dashboard />
}
