import React, { useMemo } from 'react'
import {
  salesDashboardPeriod,
  salesDashboardRows,
} from '../data/salesDashboardData'

const metricItems = [
  { key: 'newCustomers', label: '新增客户', tone: 'green', color: '#28c840' },
  { key: 'customerFollowups', label: '客户跟进记录', tone: 'purple', color: '#7c2cf4' },
  { key: 'newLeads', label: '新增线索', tone: 'amber', color: '#ffbd2e' },
  { key: 'leadFollowups', label: '线索跟进记录', tone: 'red', color: '#ff6678' },
]

function SalesStatCard({ metric, value }) {
  return (
    <div className={`overview-stat sales-stat overview-stat-${metric.tone}`}>
      <span>{metric.label}</span>
      <strong>{value}</strong>
      <em>条</em>
    </div>
  )
}

function SalesPersonCard({ rows }) {
  return (
    <article className="overview-card sales-overview-card sales-person-card">
      <div className="overview-card-head">
        <span>销售人员贡献</span>
        <small>{salesDashboardPeriod}</small>
      </div>
      <div className="sales-matrix">
        <div className="sales-matrix-head">
          <span>人员</span>
          <span>新增客户</span>
          <span>客户跟进</span>
          <span>新增线索</span>
          <span>线索跟进</span>
        </div>
        <div className="sales-matrix-body">
          {rows.map((row) => (
            <div className="sales-matrix-row" key={`${row.name}-${row.code}`}>
              <div className="sales-matrix-person">
                <span>{row.name}</span>
                <em>{row.code}</em>
              </div>
              <b>{row.newCustomers}</b>
              <b>{row.customerFollowups}</b>
              <b>{row.newLeads}</b>
              <b>{row.leadFollowups}</b>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function SalesFollowupCard({ totals }) {
  const newCustomers = totals.find((item) => item.metric.key === 'newCustomers')?.value || 0
  const customerFollowups = totals.find((item) => item.metric.key === 'customerFollowups')?.value || 0
  const newLeads = totals.find((item) => item.metric.key === 'newLeads')?.value || 0
  const leadFollowups = totals.find((item) => item.metric.key === 'leadFollowups')?.value || 0
  const customerRate = newCustomers ? Math.round((customerFollowups / newCustomers) * 100) : 0
  const leadRate = newLeads ? Math.round((leadFollowups / newLeads) * 100) : 0
  const items = [
    { label: '客户跟进率', value: customerRate, suffix: '%', max: 100, color: '#7c2cf4' },
    { label: '线索跟进率', value: leadRate, suffix: '%', max: 100, color: '#ff6678' },
    { label: '客户未跟进', value: Math.max(0, newCustomers - customerFollowups), suffix: '条', max: newCustomers || 1, color: '#ffbd2e' },
    { label: '线索未跟进', value: Math.max(0, newLeads - leadFollowups), suffix: '条', max: newLeads || 1, color: '#28c840' },
  ]

  return (
    <article className="overview-card sales-overview-card sales-followup-card">
      <div className="overview-card-head">
        <span>跟进转化率</span>
        <small>与新增客户 / 线索对比</small>
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
    metricItems.map((metric) => ({
      metric,
      value: salesDashboardRows.reduce((sum, row) => sum + row[metric.key], 0),
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
        <SalesPersonCard rows={salesDashboardRows} />
        <SalesFollowupCard totals={totals} />
      </div>
    </section>
  )
}
