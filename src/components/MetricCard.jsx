import React from 'react'

export default function MetricCard({ item }) {
  return (
    <div className={`metric-card metric-${item.tone}`}>
      <div className="metric-heading">
        <div>
          <span className="metric-label">{item.label}</span>
          {item.subtitle && <small>{item.subtitle}</small>}
        </div>
        <i className="metric-state" aria-hidden="true" />
      </div>
      <div className="metric-value-row">
        <strong>{item.value}</strong>
        <span>{item.unit}</span>
      </div>
      {item.breakdown && (
        <div className="metric-breakdown">
          {item.breakdown.map((entry) => (
            <span key={entry.label}>
              <em>{entry.value}</em>
              <b>{entry.label}</b>
            </span>
          ))}
        </div>
      )}
      {!item.breakdown && (
        <div className="metric-foot">
          {typeof item.red === 'number' || typeof item.amber === 'number' ? (
          <>
            <span><i className="risk-dot risk-dot-red" />红灯 {item.red ?? 0}</span>
            <span><i className="risk-dot risk-dot-amber" />黄灯 {item.amber ?? 0}</span>
          </>
          ) : (
            <span>{item.helper ?? 'PROJECT PORTFOLIO'}</span>
          )}
        </div>
      )}
    </div>
  )
}
