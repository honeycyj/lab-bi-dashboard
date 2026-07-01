import React, { useMemo } from 'react'
import {
  productNewSevereDefects,
  productSeverityProjects,
  productSeverityStatuses,
  productStatusProjects,
  productStatusStatuses,
} from '../data/productInnovationData'

const totalOf = (item, statuses) => statuses.reduce((sum, status) => sum + (item[status.key] || 0), 0)

function ProductChartLegend({ statuses }) {
  return (
    <div className="product-chart-legend">
      {statuses.map((status) => (
        <span key={status.key}>
          <i style={{ background: status.color }} />
          {status.label}
        </span>
      ))}
    </div>
  )
}

function ProductStackedColumnChart({ title, data, statuses, maxTicks = 5 }) {
  const maxValue = Math.max(...data.map((item) => totalOf(item, statuses)), 1)
  const tickStep = Math.max(1, Math.ceil(maxValue / maxTicks))
  const axisMax = tickStep * maxTicks
  const ticks = Array.from({ length: maxTicks + 1 }, (_, index) => axisMax - index * tickStep)
  const sortedStatuses = useMemo(() => statuses, [statuses])

  return (
    <article className="overview-card product-innovation-card">
      <div className="overview-card-head">
        <span>{title}</span>
        <small>产品创新部</small>
      </div>
      <div className="product-column-chart">
        <div className="product-chart-y-label">任务数</div>
        <div className="product-chart-axis">
          {ticks.map((tick) => <span key={tick}>{tick}</span>)}
        </div>
        <div className="product-chart-plot">
          <div className="product-chart-grid">
            {ticks.map((tick) => <i key={tick} />)}
          </div>
          <div className="product-chart-bars" style={{ '--product-chart-count': data.length }}>
            {data.map((item) => {
              const total = totalOf(item, statuses)
              return (
                <div className="product-chart-item" key={item.name}>
                  <div className="defect-chart-stack product-chart-stack" style={{ height: `${Math.max(2, (total / axisMax) * 100)}%` }}>
                    {sortedStatuses.map((status) => {
                      const value = item[status.key] || 0
                      if (!value) return null
                      return (
                        <i
                          key={status.key}
                          title={`${status.label} ${value}`}
                          style={{
                            height: `${(value / total) * 100}%`,
                            background: status.color,
                          }}
                        >
                          <span>{value}</span>
                        </i>
                      )
                    })}
                  </div>
                  <b title={item.name}>{item.name}</b>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <ProductChartLegend statuses={statuses} />
    </article>
  )
}

function ProductNewSevereTable({ rows }) {
  return (
    <article className="overview-card product-innovation-card product-new-severe-card">
      <div className="overview-card-head">
        <span>上周新增致命/严重缺陷</span>
        <small>新增明细</small>
      </div>
      <div className="product-new-severe-grid">
        {rows.map((row) => {
          const total = row.critical + row.severe
          return (
            <div className="product-new-severe-mini-card" key={row.project}>
              <span title={row.project}>{row.project}</span>
              <strong>{total}</strong>
              <div>
                <em>致命</em>
                <b>{row.critical || 0}</b>
              </div>
              <div>
                <em>严重</em>
                <b>{row.severe || 0}</b>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default function ProductInnovationPage() {
  return (
    <section className="defect-distribution-page product-innovation-page">
      <div className="product-innovation-chart-grid">
        <ProductStackedColumnChart
          title="致命/严重缺陷遗留数量（未关闭）"
          data={productSeverityProjects}
          statuses={productSeverityStatuses}
        />
        <ProductStackedColumnChart
          title="致命/严重缺陷遗留状态分布"
          data={productStatusProjects}
          statuses={productStatusStatuses}
        />
      </div>
      <ProductNewSevereTable rows={productNewSevereDefects} />
    </section>
  )
}
