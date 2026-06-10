import React from 'react'

const normalizeStatus = (status) => (status === 'red' ? 'red' : status === 'amber' ? 'amber' : 'green')

const worstStatus = (statuses = []) => {
  if (statuses.includes('red')) return 'red'
  if (statuses.includes('amber')) return 'amber'
  return 'green'
}

const timelineEdge = 4
const dayMs = 24 * 60 * 60 * 1000
const stageRanges = [
  { key: 'concept', label: '概念阶段', left: 0, width: 16 },
  { key: 'plan', label: '计划阶段', left: 16, width: 18 },
  { key: 'develop', label: '开发阶段', left: 34, width: 30 },
  { key: 'verify', label: '验证阶段', left: 64, width: 20 },
  { key: 'release', label: '发布阶段', left: 84, width: 16 },
]
const stageKeys = stageRanges.map((stage) => stage.key)

const markerPositionOnTimeline = (index, nodeCount) => {
  if (nodeCount <= 1) return 50
  return timelineEdge + (index / (nodeCount - 1)) * (100 - timelineEdge * 2)
}

const explicitPhaseFromNode = (node) => {
  const phase = node?.[3]
  return stageKeys.includes(phase) ? phase : null
}

const inferPhaseKey = (label, index, nodeCount) => {
  const text = String(label ?? '')

  if (/立项|需求|可行/.test(text)) return 'concept'
  if (/第一|一期|V1/.test(text)) return 'plan'
  if (/第二|二期|V2|开发|算法|sdk|SDK|APP|版本1/.test(text)) return 'develop'
  if (/测试|验收|客户|PC|平板|专利|论文|版本2|提测/.test(text)) return 'verify'
  if (/发布|商用|上线|汇报|结项|第三|最终/.test(text)) return 'release'

  if (nodeCount <= 1) return 'develop'
  const ratio = index / (nodeCount - 1)
  if (ratio < .18) return 'concept'
  if (ratio < .36) return 'plan'
  if (ratio < .64) return 'develop'
  if (ratio < .84) return 'verify'
  return 'release'
}

const phaseKeyForNode = (node, index, nodes) => (
  explicitPhaseFromNode(node) ?? inferPhaseKey(node?.[0], index, nodes.length)
)

const stageNodeIndexesFor = (nodes, key) => (
  nodes.reduce((indexes, node, index) => {
    if (phaseKeyForNode(node, index, nodes) === key) indexes.push(index)
    return indexes
  }, [])
)

const markerPositionInStage = (index, nodes) => {
  const key = phaseKeyForNode(nodes[index], index, nodes)
  const stage = stageRanges.find((item) => item.key === key) ?? stageRanges[2]
  const indexes = stageNodeIndexesFor(nodes, stage.key)
  const positionInStage = indexes.indexOf(index)

  if (indexes.length <= 1 || positionInStage === -1) return stage.left + stage.width / 2

  const innerEdge = Math.min(18, Math.max(8, 44 / stage.width))
  const ratio = positionInStage / (indexes.length - 1)
  return stage.left + stage.width * (innerEdge / 100 + ratio * (1 - innerEdge * 2 / 100))
}

const stagesFromProject = (project) => {
  const nodes = project?.nodes ?? []
  const currentIndex = project?.currentIndex ?? -1
  const currentStatus = project?.health === 'danger' ? 'red' : project?.health === 'risk' ? 'amber' : worstStatus(project?.statuses)

  return stageRanges.map((stage) => {
    const indexes = stageNodeIndexesFor(nodes, stage.key)
    const total = indexes.length
    const done = indexes.filter((index) => index <= currentIndex).length
    const isCurrent = indexes.includes(currentIndex)
    const percent = total ? Math.round((done / total) * 100) : 0
    const state = total === 0
      ? 'empty'
      : done >= total
        ? 'complete'
        : done > 0 || isCurrent
          ? 'partial'
          : 'future'

    return {
      ...stage,
      total,
      done,
      percent,
      isCurrent,
      status: isCurrent ? currentStatus : 'green',
      fill: state === 'complete' ? 100 : state === 'partial' ? percent : 0,
      state,
    }
  })
}

const parseDateParts = (rawDate) => {
  const text = String(rawDate ?? '')
    .split('->')
    .pop()
    .replace(/[()（）延]/g, '')
    .replace(/年|月/g, '/')
    .replace(/日/g, '')
    .trim()

  const full = text.match(/(20\d{2})[./-](\d{1,2})[./-](\d{1,2})/)
  if (full) return { year: Number(full[1]), month: Number(full[2]), day: Number(full[3]), explicitYear: true }

  const partial = text.match(/(\d{1,2})[./-](\d{1,2})/)
  if (partial) return { month: Number(partial[1]), day: Number(partial[2]), explicitYear: false }

  return null
}

const timelineDatePartFromNode = (node) => (
  parseDateParts(node?.[4])
  ?? parseDateParts(node?.[3])
  ?? parseDateParts(node?.[1])
)

const timelineDatesFromNodes = (nodes) => {
  const parsedParts = nodes.map(timelineDatePartFromNode)
  const firstExplicitIndex = parsedParts.findIndex((part) => part?.explicitYear)
  const result = Array(parsedParts.length).fill(null)

  if (firstExplicitIndex === -1) {
    let inferredYear = 2024
    let previousMonth = null

    return parsedParts.map((part) => {
      if (!part) return null
      if (previousMonth !== null && part.month < previousMonth) inferredYear += 1
      previousMonth = part.month

      return Date.UTC(inferredYear, part.month - 1, part.day)
    })
  }

  const anchor = parsedParts[firstExplicitIndex]
  result[firstExplicitIndex] = Date.UTC(anchor.year, anchor.month - 1, anchor.day)

  let backwardYear = anchor.year
  let nextMonth = anchor.month

  for (let index = firstExplicitIndex - 1; index >= 0; index -= 1) {
    const part = parsedParts[index]
    if (!part) continue

    if (part.explicitYear) {
      backwardYear = part.year
    } else if (part.month > nextMonth) {
      backwardYear -= 1
    }

    result[index] = Date.UTC(backwardYear, part.month - 1, part.day)
    nextMonth = part.month
  }

  let forwardYear = anchor.year
  let previousMonth = anchor.month

  for (let index = firstExplicitIndex + 1; index < parsedParts.length; index += 1) {
    const part = parsedParts[index]
    if (!part) continue
    if (part.explicitYear) {
      forwardYear = part.year
    } else if (previousMonth !== null && part.month < previousMonth) {
      forwardYear += 1
    }

    result[index] = Date.UTC(forwardYear, part.month - 1, part.day)
    previousMonth = part.month
  }

  return result
}

const interpolateMissingDates = (dates) => {
  const result = [...dates]

  for (let index = 0; index < result.length; index += 1) {
    if (result[index] !== null) continue

    let previousIndex = index - 1
    while (previousIndex >= 0 && result[previousIndex] === null) previousIndex -= 1

    let nextIndex = index + 1
    while (nextIndex < result.length && result[nextIndex] === null) nextIndex += 1

    if (previousIndex >= 0 && nextIndex < result.length) {
      const ratio = (index - previousIndex) / (nextIndex - previousIndex)
      result[index] = result[previousIndex] + (result[nextIndex] - result[previousIndex]) * ratio
    } else if (previousIndex >= 0) {
      result[index] = result[previousIndex] + (index - previousIndex) * 30 * dayMs
    } else if (nextIndex < result.length) {
      result[index] = result[nextIndex] - (nextIndex - index) * 30 * dayMs
    }
  }

  return result
}

const timelinePositionsFromNodes = (nodes) => {
  const dates = interpolateMissingDates(timelineDatesFromNodes(nodes))
  const validDates = dates.filter((date) => Number.isFinite(date))
  if (validDates.length <= 1) return nodes.map((_, index) => markerPositionOnTimeline(index, nodes.length))

  const minDate = Math.min(...validDates)
  const maxDate = Math.max(...validDates)
  const span = maxDate - minDate || 1

  return dates.map((date, index) => {
    if (!Number.isFinite(date)) return markerPositionOnTimeline(index, nodes.length)
    return timelineEdge + ((date - minDate) / span) * (100 - timelineEdge * 2)
  })
}

const markersFromProject = (project, timelineMode = 'linear') => {
  if (!project?.nodes?.length) return []
  const currentStatus = project.health === 'danger' ? 'red' : project.health === 'risk' ? 'amber' : worstStatus(project.statuses)
  const positions = timelineMode === 'milestone'
    ? project.nodes.map((_, index) => markerPositionInStage(index, project.nodes))
    : timelinePositionsFromNodes(project.nodes)

  return project.nodes.map(([label, date], index) => {
    const side = index % 2 === 0 ? 'top' : 'bottom'
    const align = index === 0 ? 'left' : index === project.nodes.length - 1 ? 'right' : side === 'top' ? 'left' : 'right'
    const isCurrent = index === project.currentIndex
    const isFuture = index > project.currentIndex
    const isPast = index < project.currentIndex
    const isKeyFuture = index === project.nodes.length - 1 || /交付|验收|结项|发布|汇报|客户|版本|二期/.test(String(label))

    return {
      date,
      label: isFuture && !isKeyFuture ? '' : label,
      x: positions[index],
      side,
      align,
      tone: isFuture ? 'muted' : isCurrent && currentStatus === 'red' ? 'red' : isCurrent && currentStatus === 'amber' ? 'orange' : 'purple',
      current: isCurrent,
      past: isPast,
      compact: isFuture && !isKeyFuture,
      wide: String(label).length > 7,
    }
  })
}

const compactStatusText = (text) => {
  const normalized = String(text ?? '').replace(/\s+/g, '')
  const firstClause = normalized.split(/[；;。]/)[0] || normalized

  return firstClause.length > 44 ? `${firstClause.slice(0, 44)}…` : firstClause
}

const statusFromProject = (project) => {
  if (!project?.summary?.length) return []
  const codes = ['T', 'Q', 'C']

  return project.summary.slice(0, 3).map(([label, text, status], index) => ({
    code: codes[index] ?? label.slice(0, 1),
    label,
    text: compactStatusText(text),
    status: normalizeStatus(status),
  }))
}

function StageTimeline({ markers, progress = 0, stages = [], timelineMode = 'linear' }) {
  const isMilestone = timelineMode === 'milestone'
  const currentIndex = markers.findIndex((marker) => marker.current)
  const currentMarker = currentIndex >= 0 ? markers[currentIndex] : null
  const alertTone = currentMarker?.tone === 'red' || currentMarker?.tone === 'orange' ? currentMarker.tone : null
  const previousMarker = currentIndex > 0 ? markers[currentIndex - 1] : null
  const nextMarker = currentIndex === 0 ? markers[1] : null
  const alertStart = previousMarker?.x ?? currentMarker?.x ?? 0
  const alertEnd = previousMarker ? currentMarker?.x : nextMarker?.x
  const alertLeft = Math.min(alertStart, alertEnd ?? alertStart)
  const alertWidth = Math.abs((alertEnd ?? alertStart) - alertStart)

  return (
    <div className={`stage-timeline stage-timeline-${isMilestone ? 'milestone' : 'linear'}`} aria-label="项目节点时间轴">
      {isMilestone ? (
        <div className="stage-timeline-row" aria-hidden="true">
          {stages.map((stage) => (
            <div
              className={`stage-timeline-block stage-timeline-block-${stage.state} ${stage.state === 'complete' ? 'is-complete' : ''} ${stage.state === 'partial' ? 'is-partial' : ''} ${stage.isCurrent ? `stage-timeline-block-current stage-status-${stage.status}` : ''}`}
              style={{
                left: `${stage.left}%`,
                width: `calc(${stage.width}% - var(--stage-block-gap))`,
                '--stage-fill': `${stage.fill}%`,
              }}
              key={stage.key}
            >
              <span>{stage.label}</span>
              <em>{stage.done}<i>/</i>{stage.total}</em>
              <b>{stage.percent}<i>%</i></b>
            </div>
          ))}
        </div>
      ) : (
        <div className="stage-timeline-track" aria-hidden="true">
          <span className="stage-timeline-track-base" />
          <span
            className="stage-timeline-track-fill"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
          {alertTone && alertWidth > 0 && (
            <span
              className={`stage-timeline-track-alert stage-timeline-track-alert-${alertTone}`}
              style={{ left: `${alertLeft}%`, width: `${alertWidth}%` }}
            />
          )}
        </div>
      )}

      {markers.map((marker) => (
        <div
          className={`stage-timeline-marker stage-timeline-marker-${marker.tone} side-${marker.side} align-${marker.align} ${marker.wide ? 'wide' : ''} ${marker.current ? 'current' : ''} ${marker.past ? 'past' : ''} ${marker.compact ? 'compact' : ''}`}
          style={{ left: `${marker.x}%` }}
          key={`${marker.date}-${marker.label || 'node'}-${marker.x}`}
        >
          <span className="stage-timeline-stem" />
          <span className="stage-timeline-pin" />
          <span className="stage-timeline-callout">
            <span className="stage-timeline-date">{marker.date}</span>
            {marker.label && <span className="stage-timeline-flag">{marker.label}</span>}
          </span>
        </div>
      ))}

    </div>
  )
}

export default function StageTimelineCard({
  project,
  index = 1,
  timelineMode = 'linear',
}) {
  const cardTitle = project?.name ?? ''
  const cardSubtitle = project?.sub ?? ''
  const cardOwner = project?.owner ?? ''
  const cardDepartment = project?.dept ?? ''
  const cardMarkers = markersFromProject(project, timelineMode)
  const currentMarker = cardMarkers.find((marker) => marker.current)
  const timelineProgress = currentMarker?.x ?? 0
  const cardStages = stagesFromProject(project)
  const cardStatuses = statusFromProject(project)

  return (
    <div className="project-row stage-timeline-card">
      <div className="cell project-info">
        <span className="project-index">{index}</span>
        <div className="project-copy">
          <div className="project-title">
            <b>{cardTitle}</b>
            {cardSubtitle && <span>{cardSubtitle}</span>}
          </div>
          <div className="project-meta-line">
            <span>{cardOwner}</span>
            <i />
            <span>{cardDepartment}</span>
          </div>
        </div>
      </div>
      <div className="cell timeline-cell">
        <StageTimeline
          markers={cardMarkers}
          progress={timelineProgress}
          stages={cardStages}
          timelineMode={timelineMode}
        />
      </div>
      <div className="cell summary-cell">
        <div className="demo-status-panel" aria-label="TQC 亮灯状态">
          {cardStatuses.map((item) => (
            <div className="demo-status-row" key={item.code}>
              <span className="demo-status-code">{item.code}</span>
              <i className={`status-light ${item.status}`} />
              <b>{item.label}</b>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
