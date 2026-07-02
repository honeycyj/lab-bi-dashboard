import React, { useMemo } from 'react'
import {
  defectStatusMeta,
  unclosedDefectsPageData,
} from '../data/unclosedDefectsData'

const totalOf = (item, keys) => keys.reduce((sum, key) => sum + (item[key] || 0), 0)

function DefectStatCard({ label, value, unit = '个', tone = 'purple', note }) {
  return (
    <div className={`overview-stat defect-stat overview-stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{unit}</em>
      {note ? <small>{note}</small> : null}
    </div>
  )
}

function StatusLegend({ statusKeys }) {
  return (
    <div className="defect-legend">
      {statusKeys.map((key) => (
        <span key={key}>
          <i style={{ background: defectStatusMeta[key].color }} />
          {defectStatusMeta[key].label}
        </span>
      ))}
    </div>
  )
}

function StackedRankingCard({ title, subtitle, data, statusKeys, limit, columns = 1 }) {
  const visibleData = useMemo(() => (
    [...data]
      .slice(0, limit)
  ), [data, limit])
  const columnSize = Math.ceil(visibleData.length / columns)
  const cardMax = Math.max(...visibleData.map((item) => totalOf(item, statusKeys)), 1)
  const columnItems = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => visibleData.slice(index * columnSize, (index + 1) * columnSize))
  }, [columnSize, columns, visibleData])

  return (
    <article className={`overview-card defect-card defect-ranking-card defect-ranking-card-${columns}col defect-ranking-card-no-order`}>
      <div className="overview-card-head">
        <span>{title}</span>
        <small>{subtitle}</small>
      </div>
      <div className="defect-rank-columns" style={{ '--defect-rank-columns': columns }}>
        {columnItems.map((items, columnIndex) => {
          return (
            <div className="defect-rank-list" key={columnIndex}>
              {items.map((item, itemIndex) => {
                const total = totalOf(item, statusKeys)
                const activeStatusCount = statusKeys.filter((key) => item[key]).length
                return (
                  <div className="defect-rank-row" key={`${item.name}-${item.code}`}>
                    <div className="defect-person">
                      <span>{item.name}</span>
                      <em>{item.code}</em>
                    </div>
                    <div className="defect-bar-shell">
                      <div className="defect-bar" style={{ width: `${Math.max(8, (total / cardMax) * 100)}%` }}>
                        {statusKeys.map((key) => {
                          const value = item[key] || 0
                          if (!value) return null
                          return (
                            <i
                              key={key}
                              title={`${defectStatusMeta[key].label} ${value}`}
                              style={{
                                width: `${(value / total) * 100}%`,
                                background: defectStatusMeta[key].color,
                              }}
                            >
                              {activeStatusCount > 1 && value >= 2 ? <span>{value}</span> : null}
                            </i>
                          )
                        })}
                      </div>
                    </div>
                    <strong>{total}</strong>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <StatusLegend statusKeys={statusKeys} />
    </article>
  )
}

export default function UnclosedDefectsPage() {
  return (
    <section className="unclosed-defects-page">
      <div className="overview-stats defect-stats">
        {unclosedDefectsPageData.stats.map((item) => (
          <DefectStatCard {...item} key={item.label} />
        ))}
      </div>

      <div className="defect-main-grid">
        {unclosedDefectsPageData.rankings.map((card) => (
          <StackedRankingCard {...card} key={card.title} />
        ))}
      </div>
    </section>
  )
}
