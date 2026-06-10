import React from 'react'

const normalizeStatus = (status) => (status === 'red' ? 'red' : status === 'amber' ? 'amber' : 'green')

const worstStatus = (statuses = []) => {
  if (statuses.includes('red')) return 'red'
  if (statuses.includes('amber')) return 'amber'
  return 'green'
}

const fixedStageRanges = [
  { key: 'concept', label: '概念阶段', start: 0, end: 10 },
  { key: 'plan', label: '计划阶段', start: 10, end: 32 },
  { key: 'develop', label: '开发阶段', start: 32, end: 58 },
  { key: 'verify', label: '验证阶段', start: 58, end: 82 },
  { key: 'release', label: '发布阶段', start: 82, end: 100 },
]

const phaseIndex = fixedStageRanges.reduce((result, stage, index) => {
  result[stage.key] = index
  return result
}, {})

const inferPhaseKey = (label, index, nodeCount) => {
  const text = String(label)

  if (/立项|charter|可行性|需求冻结/.test(text)) return 'concept'
  if (/发布|结项|客户|第三期|Hdrvivid sdk二期|交付（客户）/.test(text)) return 'release'
  if (/计划|第一阶段|第一期|算法V1|需求/.test(text)) return 'plan'
  if (/开发|sdk|SDK|APP|安卓|iOS|算法V2|系统上线|版本1|版本2|第二阶段|第二期|百事通版本/.test(text)) return 'develop'
  if (/测试|验证|待汇报|专利|论文|PC\/平板|播放软件/.test(text)) return 'verify'

  return fixedStageRanges[Math.min(fixedStageRanges.length - 1, Math.floor((index / Math.max(nodeCount, 1)) * fixedStageRanges.length))].key
}

const nodePhaseKey = (node, index, nodeCount) => {
  const [label, , , explicitPhase] = node ?? []
  return explicitPhase ?? inferPhaseKey(label, index, nodeCount)
}

const stageIndexForNode = (index, nodes) => {
  const key = nodePhaseKey(nodes[index], index, nodes.length)
  return phaseIndex[key] ?? fixedStageRanges.length - 1
}

const stageNodeIndexesFor = (stageIndex, nodes) => {
  const indexes = nodes
    .map((_, index) => index)
    .filter((index) => stageIndexForNode(index, nodes) === stageIndex)

  return indexes
}

const markerPositionInStage = (index, nodes) => {
  const stageIndex = stageIndexForNode(index, nodes)
  const stage = fixedStageRanges[stageIndex]
  const indexes = stageNodeIndexesFor(stageIndex, nodes)
  const count = indexes.length
  const order = indexes.indexOf(index)
  const innerStart = stage.start + 2.2
  const innerEnd = stage.end - 2.2

  if (count <= 1) return (stage.start + stage.end) / 2

  const ratio = order / (count - 1)
  return innerStart + (innerEnd - innerStart) * ratio
}

const stagesFromProject = (project) => {
  if (!project?.nodes?.length) return []

  const nodeCount = project.nodes.length
  const currentIndex = Math.min(Math.max(project.currentIndex ?? 0, 0), nodeCount - 1)
  const currentMarkerStatus = project.health === 'danger' ? 'red' : project.health === 'risk' ? 'amber' : worstStatus(project.statuses)
  const currentStageIndex = stageIndexForNode(currentIndex, project.nodes)

  return fixedStageRanges.map((stage, index) => {
    const indexes = stageNodeIndexesFor(index, project.nodes)
    const total = indexes.length
    const done = indexes.filter((nodeIndex) => nodeIndex <= currentIndex).length
    const tone = done === 0 ? 'future' : index === currentStageIndex ? 'current' : done >= total ? 'done' : 'current'

    return {
      label: stage.label,
      done,
      total,
      start: stage.start,
      end: stage.end,
      tone,
      status: tone === 'current' ? currentMarkerStatus : 'green',
    }
  })
}

const markersFromProject = (project) => {
  if (!project?.nodes?.length) return []
  const currentStatus = project.health === 'danger' ? 'red' : project.health === 'risk' ? 'amber' : worstStatus(project.statuses)

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
      x: markerPositionInStage(index, project.nodes),
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

function StageTimeline({ stages, markers }) {
  return (
    <div className="stage-timeline" aria-label="阶段时间轴样式预览">
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

      <div className="stage-timeline-row">
        {stages.map((stage) => {
          const percent = stage.total ? Math.round((stage.done / stage.total) * 100) : 0

          return (
            <div
              className={`stage-timeline-block stage-timeline-block-${stage.tone} stage-status-${stage.status ?? 'green'} ${percent >= 100 ? 'is-complete' : 'is-partial'}`}
              style={{
                left: `${stage.start}%`,
                width: `calc(${stage.end - stage.start}% - var(--stage-block-gap, 2px))`,
                '--stage-fill': `${Math.min(Math.max(percent, 0), 100)}%`,
                '--stage-fill-color': stage.tone === 'current' && stage.status === 'amber'
                  ? '#ffbd2e'
                  : stage.tone === 'current' && stage.status === 'red'
                    ? '#ff6678'
                    : '#2aa7f4',
              }}
              key={stage.label}
            >
              <span>{stage.label}</span>
              <em>
                {stage.done}<i>/</i>{stage.total}
              </em>
              <b>
                {percent}<i>%</i>
              </b>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StageTimelineCard({
  project,
  index = 1,
}) {
  const cardTitle = project?.name ?? ''
  const cardSubtitle = project?.sub ?? ''
  const cardOwner = project?.owner ?? ''
  const cardDepartment = project?.dept ?? ''
  const cardStages = stagesFromProject(project)
  const cardMarkers = markersFromProject(project)
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
        <StageTimeline stages={cardStages} markers={cardMarkers} />
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
