import React from 'react'
import MetricCard from '../components/MetricCard'
import StageTimelineCard from '../components/StageTimelineCard'

export default function ProjectNodesPage({
  metrics,
  visibleProjects,
  currentPage,
  rowsPerPage,
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
          style={{ '--rows-per-page': rowsPerPage }}
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
