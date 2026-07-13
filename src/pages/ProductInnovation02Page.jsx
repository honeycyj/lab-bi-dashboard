import React, { useMemo } from 'react'
import {
  innovation02ClosureRates,
  innovation02OverdueByDeveloper,
  innovation02OverdueProjects,
  innovation02PendingByDeveloper,
  innovation02SeverityStatuses,
  innovation02SolutionRates,
} from '../data/productInnovation02Data'

const totalOf = (item) => innovation02SeverityStatuses.reduce(
  (sum, status) => sum + (item[status.key] || 0),
  0,
)

function CardHead({ title, subtitle }) {
  return (
    <div className="overview-card-head innovation02-card-head">
      <span>{title}</span>
      <small>{subtitle}</small>
    </div>
  )
}

function SeverityLegend() {
  return (
    <div className="innovation02-legend">
      {innovation02SeverityStatuses.map((status) => (
        <span key={status.key}><i style={{ background: status.color }} />{status.label}</span>
      ))}
    </div>
  )
}

function RateCard({ title, subtitle, data, color }) {
  return (
    <article className="overview-card innovation02-card innovation02-rate-card">
      <CardHead title={title} subtitle={subtitle} />
      <div className="innovation02-rate-list">
        {data.map((item) => (
          <div className="innovation02-rate-row" key={item.name}>
            <b title={item.name}>{item.shortName}</b>
            <div className="innovation02-rate-track">
              <i style={{ width: `${item.value}%`, background: color }} />
            </div>
            <strong>{Number(item.value.toFixed(2))}%</strong>
          </div>
        ))}
      </div>
      <div className="innovation02-rate-axis"><span>0</span><span>50%</span><span>100%</span></div>
    </article>
  )
}

function RateProjectCards({ title, subtitle, data, color }) {
  return (
    <article className="overview-card innovation02-card innovation02-rate-project-card">
      <CardHead title={title} subtitle={subtitle} />
      <div className="innovation02-rate-project-grid">
        {data.map((item) => (
          <div className="innovation02-rate-project-item" key={item.name}>
            <b title={item.name}>{item.shortName}</b>
            <strong>{Number(item.value.toFixed(2))}%</strong>
            <div className="innovation02-rate-track">
              <i style={{ width: `${item.value}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function ProjectOverdueCard() {
  const maxValue = Math.max(...innovation02OverdueProjects.map(totalOf), 1)

  return (
    <article className="overview-card innovation02-card innovation02-project-card">
      <CardHead title="逾期未关闭缺陷项目分布" subtitle="停留时间 > 21.001 天 · 不含轻微" />
      <div className="innovation02-project-list">
        {innovation02OverdueProjects.map((item) => {
          const total = totalOf(item)
          return (
            <div className="innovation02-project-row" key={item.name}>
              <b title={item.name}>{item.shortName}</b>
              <div className="innovation02-project-track" style={{ '--innovation02-total-width': `${(total / maxValue) * 100}%` }}>
                <div>
                  {innovation02SeverityStatuses.map((status) => {
                    const value = item[status.key] || 0
                    if (!value) return null
                    return <i key={status.key} title={`${status.label} ${value}`} style={{ width: `${(value / total) * 100}%`, background: status.color }}><span>{value}</span></i>
                  })}
                </div>
              </div>
              <strong>{total}</strong>
            </div>
          )
        })}
      </div>
      <SeverityLegend />
    </article>
  )
}

function PendingDeveloperCard() {
  const sortedData = useMemo(
    () => [...innovation02PendingByDeveloper].sort((a, b) => totalOf(b) - totalOf(a)),
    [],
  )
  const maxValue = Math.max(...sortedData.map(totalOf), 1)

  return (
    <article className="overview-card innovation02-card innovation02-developer-card">
      <CardHead title="待解决缺陷按开发人员分布" subtitle="打开 / 修复中 · 不含轻微" />
      <div className="innovation02-developer-list">
        {sortedData.map((item) => {
          const total = totalOf(item)
          return (
            <div className="innovation02-developer-row" key={`${item.name}-${item.code}`}>
              <b title={`${item.name} ${item.code}`}>{item.name}<small>{item.code}</small></b>
              <div className="innovation02-developer-track">
                <div style={{ width: `${(total / maxValue) * 100}%` }}>
                  {innovation02SeverityStatuses.map((status) => {
                    const value = item[status.key] || 0
                    if (!value) return null
                    return <i key={status.key} title={`${status.label} ${value}`} style={{ width: `${(value / total) * 100}%`, background: status.color }} />
                  })}
                </div>
              </div>
              <strong>{total}</strong>
            </div>
          )
        })}
      </div>
      <SeverityLegend />
    </article>
  )
}

function OverdueDeveloperCard() {
  const maxValue = Math.max(...innovation02OverdueByDeveloper.map((item) => item.value), 1)

  return (
    <article className="overview-card innovation02-card innovation02-developer-card">
      <CardHead title="逾期未解决缺陷按开发人员分布" subtitle="停留时间 > 21.001 天 · 不含轻微" />
      <div className="innovation02-developer-list">
        {innovation02OverdueByDeveloper.map((item) => (
          <div className="innovation02-developer-row" key={`${item.name}-${item.code}`}>
            <b title={`${item.name} ${item.code}`}>{item.name}<small>{item.code}</small></b>
            <div className="innovation02-developer-track">
              <div style={{ width: `${(item.value / maxValue) * 100}%`, background: '#ffbd2e' }} />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="innovation02-single-legend"><i />逾期问题数</div>
    </article>
  )
}

export default function ProductInnovation02Page() {
  return (
    <section className="product-innovation02-page product-innovation02-page-split">
      <div className="innovation02-rate-grid innovation02-rate-grid-single">
        <RateProjectCards title="缺陷解决率" subtitle="缺陷口径 · 排除最近三周新增" data={innovation02SolutionRates} color="#7c2cf4" />
      </div>
      <div className="innovation02-risk-grid innovation02-risk-grid-single">
        <PendingDeveloperCard />
      </div>
    </section>
  )
}

export function ProductInnovation03Page() {
  return (
    <section className="product-innovation02-page product-innovation03-page">
      <div className="innovation02-rate-grid innovation02-rate-grid-single">
        <RateCard title="项目缺陷关闭率" subtitle="任务口径 · 默认分组" data={innovation02ClosureRates} color="#42be65" />
      </div>
      <div className="innovation02-risk-grid innovation03-risk-grid">
        <ProjectOverdueCard />
        <OverdueDeveloperCard />
      </div>
    </section>
  )
}
