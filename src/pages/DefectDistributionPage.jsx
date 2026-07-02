import React, { useMemo } from 'react'
import {
  defectDistributionPageCharts,
  severeDefectDistributionPageCharts,
} from '../data/defectDistributionData'

const totalOf = (item, statuses) => statuses.reduce((sum, status) => sum + (item[status.key] || 0), 0)

function ChartLegend({ statuses }) {
  return (
    <div className="defect-chart-legend">
      {statuses.map((status) => (
        <span key={status.key}>
          <i style={{ background: status.color }} />
          {status.label}
        </span>
      ))}
    </div>
  )
}

function StackedColumnChart({ title, subtitle, data, statuses, maxTicks = 5 }) {
  const sortedData = useMemo(() => (
    [...data].sort((left, right) => totalOf(right, statuses) - totalOf(left, statuses))
  ), [data, statuses])
  const maxValue = Math.max(...sortedData.map((item) => totalOf(item, statuses)), 1)
  const tickStep = Math.max(1, Math.ceil(maxValue / maxTicks))
  const axisMax = tickStep * maxTicks
  const ticks = Array.from({ length: maxTicks + 1 }, (_, index) => axisMax - index * tickStep)

  return (
    <article className="overview-card defect-chart-card">
      <div className="overview-card-head">
        <span>{title}</span>
        <small>{subtitle}</small>
      </div>
      <div className="defect-column-chart">
        <div className="defect-chart-axis">
          {ticks.map((tick) => <span key={tick}>{tick}</span>)}
        </div>
        <div className="defect-chart-plot">
          <div className="defect-chart-grid">
            {ticks.map((tick) => <i key={tick} />)}
          </div>
          <div className="defect-chart-bars" style={{ '--defect-chart-count': sortedData.length }}>
            {sortedData.map((item) => {
              const total = totalOf(item, statuses)
              return (
                <div className="defect-chart-item" key={item.name}>
                  <div className="defect-chart-stack" style={{ height: `${Math.max(2, (total / axisMax) * 100)}%` }}>
                    {statuses.map((status) => {
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
      <ChartLegend statuses={statuses} />
    </article>
  )
}

function SevereRankingChart({ title, subtitle, data, statuses }) {
  const sortedData = useMemo(() => (
    [...data].sort((left, right) => totalOf(right, statuses) - totalOf(left, statuses))
  ), [data, statuses])
  const maxValue = Math.max(...sortedData.map((item) => totalOf(item, statuses)), 1)

  return (
    <article className="overview-card defect-chart-card severe-ranking-card">
      <div className="overview-card-head">
        <span>{title}</span>
        <small>{subtitle}</small>
      </div>
      <div className="severe-card-grid">
        {sortedData.map((item, index) => {
          const total = totalOf(item, statuses)
          return (
            <div
              className="severe-person-card"
              key={item.name}
              style={{
                '--severe-bar-width': `${Math.max(3, (total / maxValue) * 100)}%`,
              }}
            >
              <b title={item.name}>{item.name}</b>
              <strong>{total}</strong>
              <div className="severe-person-card-track">
                <i />
                <span />
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default function DefectDistributionPage() {
  return (
    <section className="defect-distribution-page defect-distribution-page-open">
      {defectDistributionPageCharts.map((chart) => (
        <StackedColumnChart {...chart} key={chart.title} />
      ))}
    </section>
  )
}

export function SevereDefectDistributionPage() {
  return (
    <section className="defect-distribution-page defect-distribution-page-severe">
      {severeDefectDistributionPageCharts.map((chart) => (
        <SevereRankingChart {...chart} key={chart.title} />
      ))}
    </section>
  )
}
