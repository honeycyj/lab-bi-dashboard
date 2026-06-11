import { projectNodeMetricsFromProjects } from './projectMetrics'
import { normalizeStatus } from './status'

const phaseKeys = ['concept', 'plan', 'develop', 'verify', 'release']

const isPlainObject = (item) => item && typeof item === 'object' && !Array.isArray(item)

export const normalizeProjectNode = (node = {}) => {
  if (!Array.isArray(node)) {
    return {
      label: node.label ?? '',
      displayDate: node.displayDate ?? node.dateLabel ?? node.date ?? '',
      state: node.state ?? 'active',
      phase: phaseKeys.includes(node.phase) ? node.phase : null,
      date: node.date ?? node.isoDate ?? '',
      risk: node.risk ?? null,
      persistRisk: node.persistRisk,
    }
  }

  const [label, displayDate, state, fourth, fifth] = node
  const meta = node.find(isPlainObject) ?? {}
  const phase = phaseKeys.includes(fourth) ? fourth : phaseKeys.includes(meta.phase) ? meta.phase : null

  return {
    label,
    displayDate,
    state,
    phase,
    date: phase ? fifth : fourth,
    risk: meta.risk ?? null,
    persistRisk: meta.persistRisk,
  }
}

export const normalizeProjectSummary = (item = [], index = 0) => {
  if (!Array.isArray(item)) {
    return {
      label: item.label ?? ['进度', '质量', '成本'][index] ?? '',
      text: item.text ?? '',
      status: normalizeStatus(item.status),
    }
  }

  return {
    label: item[0] ?? ['进度', '质量', '成本'][index] ?? '',
    text: item[1] ?? '',
    status: normalizeStatus(item[2]),
  }
}

export const normalizeProject = (project = {}) => {
  const nodes = (project.nodes ?? []).map(normalizeProjectNode)
  const currentIndex = Number.isFinite(project.currentIndex)
    ? project.currentIndex
    : nodes.findIndex((node) => node.label === project.current)

  return {
    ...project,
    currentIndex,
    statuses: (project.statuses ?? []).map(normalizeStatus),
    nodes,
    summary: (project.summary ?? []).map(normalizeProjectSummary),
  }
}

export const normalizeProjects = (projects = []) => projects.map(normalizeProject)

export const createProjectNodePageModel = (projects = [], currentPage = 0, rowsPerPage = 5) => {
  const normalizedProjects = normalizeProjects(projects)
  const totalPages = Math.max(1, Math.ceil(normalizedProjects.length / rowsPerPage))
  const safePage = Math.min(Math.max(currentPage, 0), totalPages - 1)
  const start = safePage * rowsPerPage

  return {
    projects: normalizedProjects,
    metrics: projectNodeMetricsFromProjects(normalizedProjects),
    visibleProjects: normalizedProjects.slice(start, start + rowsPerPage),
    currentPage: safePage,
    totalPages,
    rowsPerPage,
  }
}
