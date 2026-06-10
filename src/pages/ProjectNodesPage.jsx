import React from 'react'
import MetricCard from '../components/MetricCard'
import StageTimelineCard from '../components/StageTimelineCard'
import { PAGE_SIZE } from '../app/constants'

export default function ProjectNodesPage({
  metrics,
  visibleProjects,
  currentPage,
  timelineMode,
  riskCardIntervalSec,
}) {
  return (
    <section className="project-nodes-layout">
      <section className="metrics">
        {metrics.map((item) => (
          <MetricCard
            item={item}
            riskCardIntervalSec={riskCardIntervalSec}
            key={item.label}
          />
        ))}
      </section>

      <section className="project-board">
        <div
          className="board-body"
          style={{ '--rows-per-page': PAGE_SIZE }}
          key={currentPage}
        >
          {visibleProjects.map((project) => (
            <StageTimelineCard
              project={project}
              timelineMode={timelineMode}
              key={project.id}
            />
          ))}
        </div>
      </section>
    </section>
  )
}
