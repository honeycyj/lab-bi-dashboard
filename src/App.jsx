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

const PAGE_SIZE = 6
const PAGE_INTERVAL = 12000

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

function Summary({ items }) {
  return (
    <div className="summary">
      {items.map((line, index) => {
        if (line.length === 1) return <p key={index}>{line[0]}</p>
        return (
          <p key={index}>
            <b className={line[2]}>{line[0]}：</b>
            <span className={index === 0 ? `summary-pill ${line[2]}` : ''}>{line[1]}</span>
          </p>
        )
      })}
    </div>
  )
}

function Dashboard() {
  const [now, setNow] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(0)
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
    if (totalPages <= 1) return undefined
    const pageTimer = window.setInterval(
      () => setCurrentPage((page) => (page + 1) % totalPages),
      PAGE_INTERVAL,
    )
    return () => window.clearInterval(pageTimer)
  }, [totalPages])

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
    <main className="dashboard">
      <header className="topbar">
        <div className="brand">
          <img src="/logotext.png" alt="马栏山音视频实验室" />
        </div>
        <div className="header-title">
          <h1>项目组合里程碑进度与 TQC 看板</h1>
        </div>
        <div className="header-meta">
          <div className="live-time">
            <span>{dateText}</span>
            <b>{timeText}</b>
          </div>
        </div>
      </header>

      <section className="metrics">
        {metrics.map((item) => <MetricCard item={item} key={item.label} />)}
      </section>

      <section className="project-board">
        <div className="board-header">
          <div>序号</div>
          <div>项目信息</div>
          <div className="timeline-title">
            <span>项目里程碑 & 关键节点（时间轴）</span>
            <small>
              <i className="line-sample gray" />计划线
              <i className="line-sample blue" />已完成进度
              <i className="line-sample green" />进行中节点
              <i className="line-sample red" />延期区间
            </small>
          </div>
          <div className="tqc-header">
            <span>当前状态</span>
            <small><b>T</b><b>Q</b><b>C</b></small>
          </div>
          <div>项目 TQC 整体评价</div>
        </div>

        <div
          className="board-body"
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
              <div className="cell timeline-cell"><MilestoneChart project={project} /></div>
              <div className="cell status-cell">
                {project.statuses.map((status, i) => <i className={`status-light ${status}`} key={i} />)}
              </div>
              <div className="cell summary-cell"><Summary items={project.summary} /></div>
            </div>
          ))}
        </div>

        <nav className="pagination" aria-label="项目分页">
          <span className="page-count">第 {currentPage + 1} / {totalPages} 页</span>
          <div className="page-dots">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                type="button"
                className={index === currentPage ? 'active' : ''}
                aria-label={`切换到第 ${index + 1} 页`}
                aria-current={index === currentPage ? 'page' : undefined}
                onClick={() => setCurrentPage(index)}
                key={index}
              />
            ))}
          </div>
          <span className="page-timer">{PAGE_INTERVAL / 1000} 秒自动翻页</span>
        </nav>
      </section>
    </main>
  )
}

export default function App() {
  return <Dashboard />
}
