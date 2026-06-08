import React from 'react'

const colors = {
  done: '#7c2cf4',
  completed: 'rgb(180, 121, 240)',
  todo: '#b7bdc7',
  risk: '#ffbd2e',
  danger: '#ff6678',
}

const positionFor = (index, count) => {
  if (count <= 1) return 50
  return 5 + (index / (count - 1)) * 90
}

const DEFAULT_MARKER_DATE = new Date(2025, 8, 17)

const parseNodeDate = (value, previousDate) => {
  const matches = String(value).match(/\d{2,4}[./]\d{1,2}(?:[./]\d{1,2})?|\d{1,2}[./]\d{1,2}/g)
  if (!matches?.length) return null

  const raw = matches[matches.length - 1].replace(/\//g, '.')
  const parts = raw.split('.').map(Number)
  let year
  let month
  let day

  if (parts.length === 3) {
    ;[year, month, day] = parts
  } else {
    ;[month, day] = parts
    year = previousDate?.getFullYear() ?? (month >= 10 ? 2024 : 2025)
  }

  if (year < 100) year += 2000
  let date = new Date(year, month - 1, day)
  while (previousDate && date < previousDate) {
    date = new Date(date.getFullYear() + 1, month - 1, day)
  }
  return date
}

const currentDatePositionFor = (nodes, markerDate = DEFAULT_MARKER_DATE) => {
  const datedNodes = []
  let previousDate = null

  nodes.forEach(([, date], index) => {
    const parsedDate = parseNodeDate(date, previousDate)
    if (!parsedDate) return
    previousDate = parsedDate
    datedNodes.push({ date: parsedDate, index })
  })

  if (!datedNodes.length) return null
  const markerTime = markerDate.getTime()

  if (markerTime <= datedNodes[0].date.getTime()) {
    return positionFor(datedNodes[0].index, nodes.length)
  }

  for (let index = 1; index < datedNodes.length; index += 1) {
    const previous = datedNodes[index - 1]
    const next = datedNodes[index]
    const previousTime = previous.date.getTime()
    const nextTime = next.date.getTime()

    if (markerTime <= nextTime) {
      const ratio = (markerTime - previousTime) / (nextTime - previousTime || 1)
      const previousPosition = positionFor(previous.index, nodes.length)
      const nextPosition = positionFor(next.index, nodes.length)
      return previousPosition + (nextPosition - previousPosition) * Math.min(Math.max(ratio, 0), 1)
    }
  }

  return positionFor(datedNodes[datedNodes.length - 1].index, nodes.length)
}

function NodeIcon({ state }) {
  if (state === 'todo') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <rect x="0.9" y="0.9" width="18.2" height="18.2" rx="2" fill="#fff" stroke="#b8b8b8" strokeWidth="1.4" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="0" y="0" width="20" height="20" rx="2.2" fill="var(--node-color)" />
      <path
        d="M6.2 10.2 8.65 12.65 14.1 7.35"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export default function MilestoneChart({ project }) {
  const nodeCount = project.nodes.length
  const currentPosition = positionFor(project.currentIndex, nodeCount)
  const currentDatePosition = currentDatePositionFor(project.nodes)
  const statusColor =
    project.health === 'danger' ? colors.danger : project.health === 'risk' ? colors.risk : colors.done
  const tagPlacement =
    currentPosition < 14 ? 'left' : currentPosition > 86 ? 'right' : 'center'

  return (
    <div
      className="milestone-chart"
      role="img"
      aria-label={`${project.name}里程碑时间轴`}
      style={{ '--current-position': `${currentPosition}%` }}
    >
      <div className="chart-base-line" />
      <div
        className="chart-progress-line"
        style={{
          width: `${currentPosition - 5}%`,
          background: 'linear-gradient(90deg, rgba(183,154,245,.5), #b79af5)',
        }}
      />
      {(project.health === 'danger' || project.health === 'risk') && (
        <div
          className="chart-risk-line"
          style={{ left: `${currentPosition}%`, right: '5%' }}
        />
      )}

      {currentDatePosition !== null && (
        <i
          className="chart-date-marker"
          aria-label="当前日期位置"
          style={{ left: `${currentDatePosition}%` }}
        />
      )}

      {project.nodes.map(([label, date, state], index) => {
        const position = positionFor(index, nodeCount)
        const isCurrent = index === project.currentIndex
        const displayState = index > project.currentIndex ? 'todo' : 'done'
        const progressClass = index > project.currentIndex ? 'future' : 'reached'
        const tone =
          displayState === 'todo' ? colors.todo : isCurrent ? statusColor : colors.completed
        const edgeClass = index === 0 ? 'first' : index === nodeCount - 1 ? 'last' : ''

        return (
          <div
            className={`chart-node ${displayState} ${progressClass} ${isCurrent ? 'current' : ''} ${edgeClass}`}
            style={{ left: `${position}%`, '--node-color': tone }}
            key={`${project.id}-${label}`}
          >
            <span className="chart-node-label" title={label}>{label}</span>
            {isCurrent && <i className="chart-current-marker" />}
            <i className="chart-node-circle"><NodeIcon state={displayState} /></i>
            <span className="chart-node-date">{date}</span>
          </div>
        )
      })}

      <div
        className={`chart-current-tag ${tagPlacement} ${project.health === 'danger' ? 'danger' : project.health === 'risk' ? 'risk' : ''}`}
        style={{ left: `${currentPosition}%` }}
      >
        CURRENT / {project.current}
      </div>
    </div>
  )
}
