import React, { useMemo } from 'react'
import {
  dataTypeData,
  defectLevelData,
  defectProcessData,
  defectStateData,
  trendData,
} from '../data/dashboardData'
import { defectStatusPalette } from '../data/defectStatusPalette'
import { dashboardProjects } from '../data/realProjectData'
import { departmentBreakdownFromProjects, overviewStatsFromProjects } from '../data/projectMetrics'

const defectLevelPalette = ['#8e96a3', '#36a9f4', '#ffbd2e', '#ff6678']

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
  const max = 50
  const ticks = [50, 40, 30, 20, 10, 0]
  const visibleTrendData = trendData.slice(-8)
  const rangeLabel = `${visibleTrendData[0]?.[0] ?? ''} - ${visibleTrendData[visibleTrendData.length - 1]?.[0] ?? ''}`
  const barHeight = (value) => `${Math.max(2, (value / max) * 100)}%`

  return (
    <article className="overview-card trend-card">
      <div className="overview-card-head">
        <span>项目数趋势</span>
        <small>最近8个月 · {rangeLabel}</small>
      </div>
      <div className="trend-chart">
        <div className="trend-y-axis">
          {ticks.map((tick) => <span key={tick}>{tick}</span>)}
        </div>
        <div className="trend-plot">
          <div className="trend-grid">
            {ticks.map((tick) => <i key={tick} />)}
          </div>
          {visibleTrendData.map(([month, total, running, closed]) => (
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
    ? defectStatusPalette
    : variant === 'level'
      ? defectLevelPalette
      : ['#7c2cf4', '#b479f0', '#a77bf3', '#ffbd2e', '#28c840', '#ff6678']
  const gradient = data.map((item, index) => {
    const start = cursor
    cursor += (item[1] / total) * 100
    return `${colors[index % colors.length]} ${start}% ${cursor}%`
  }).join(', ')

  return (
    <article className={`overview-card donut-card donut-card-${variant}`}>
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


function DepartmentCard({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <article className="overview-card department-card">
      <div className="overview-card-head">
        <span>TQC 项目数</span>
        <small>按责任部门</small>
      </div>
      <div className="dept-list">
        {data.map(({ label, value }) => (
          <div className="dept-row" key={label}>
            <div className="dept-row-head">
              <span>{label}</span>
              <b>{value}</b>
            </div>
            <div className="dept-track" aria-hidden="true">
              <i style={{ width: `${(value / max) * 100}%` }} />
            </div>
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
              style={{ '--ring-value': `${value}%`, '--ring-index': index }}
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


export default function OverviewPage() {
  const overviewStats = useMemo(() => overviewStatsFromProjects(dashboardProjects), [])
  const departmentData = useMemo(() => departmentBreakdownFromProjects(dashboardProjects), [])

  return (
    <section className="overview-page">
      <div className="overview-stats">
        {overviewStats.map((item) => <OverviewStatCard item={item} key={item.label} />)}
      </div>

      <div className="overview-main">
        <DonutCard title="TQC 项目结构" data={defectLevelData} variant="level" />
        <TrendChart />
      </div>

      <div className="overview-grid">
        <DepartmentCard data={departmentData} />
        <DonutCard title="缺陷处理分布" data={defectProcessData} />
        <DonutCard title="缺陷状态分布" data={defectStateData} variant="status" />
        <RingGridCard />
      </div>
    </section>
  )
}
