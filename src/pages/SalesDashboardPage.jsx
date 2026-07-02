import React, { useMemo } from 'react'
import {
  salesDashboardPageData,
} from '../data/salesDashboardData'

function SalesStatCard({ metric, value }) {
  return (
    <div className={`overview-stat sales-stat overview-stat-${metric.tone}`}>
      <span>{metric.label}</span>
      <strong>{value}</strong>
      <em>条</em>
    </div>
  )
}

function SalesPersonCard({ title, period, rows, columns }) {
  const valueColumns = columns.filter((column) => column.key !== 'person')

  return (
    <article className="overview-card sales-overview-card sales-person-card">
      <div className="overview-card-head">
        <span>{title}</span>
        <small>{period}</small>
      </div>
      <div className="sales-matrix">
        <div className="sales-matrix-head">
          {columns.map((column) => <span key={column.key}>{column.label}</span>)}
        </div>
        <div className="sales-matrix-body">
          {rows.map((row) => (
            <div className="sales-matrix-row" key={`${row.name}-${row.code}`}>
              <div className="sales-matrix-person">
                <span>{row.name}</span>
                <em>{row.code}</em>
              </div>
              {valueColumns.map((column) => <b key={column.key}>{row[column.key]}</b>)}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function SalesFollowupCard({ title, subtitle, metrics, totals }) {
  const valueOf = (key) => totals.find((item) => item.metric.key === key)?.value || 0
  const items = metrics.map((item) => {
    const max = valueOf(item.maxKey)
    const value = valueOf(item.valueKey)
    const displayValue = item.type === 'rate'
      ? (max ? Math.round((value / max) * 100) : 0)
      : Math.max(0, max - value)

    return {
      ...item,
      value: displayValue,
      max: item.type === 'rate' ? 100 : (max || 1),
    }
  })

  return (
    <article className="overview-card sales-overview-card sales-followup-card">
      <div className="overview-card-head">
        <span>{title}</span>
        <small>{subtitle}</small>
      </div>
      <div className="dept-list sales-metric-list">
        {items.map((item) => (
          <div className="dept-row sales-metric-row" key={item.label}>
            <div className="dept-row-head">
              <span>{item.label}</span>
              <b>{item.value}<em>{item.suffix}</em></b>
            </div>
            <div className="dept-track sales-metric-track" aria-hidden="true">
              <i style={{ width: `${Math.max(3, (item.value / item.max) * 100)}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function SalesDashboardPage() {
  const totals = useMemo(() => (
    salesDashboardPageData.metrics.map((metric) => ({
      metric,
      value: salesDashboardPageData.rows.reduce((sum, row) => sum + row[metric.key], 0),
    }))
  ), [])

  return (
    <section className="sales-dashboard-page">
      <div className="overview-stats sales-stats">
        {totals.map((item) => (
          <SalesStatCard metric={item.metric} value={item.value} key={item.metric.key} />
        ))}
      </div>

      <div className="sales-overview-grid">
        <SalesPersonCard
          {...salesDashboardPageData.contribution}
          period={salesDashboardPageData.period}
          rows={salesDashboardPageData.rows}
        />
        <SalesFollowupCard {...salesDashboardPageData.followup} totals={totals} />
      </div>
    </section>
  )
}
