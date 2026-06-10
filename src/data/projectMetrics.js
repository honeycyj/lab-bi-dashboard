const statusLabels = [
  { label: '进度风险灯', index: 0 },
  { label: '质量风险灯', index: 1 },
  { label: '成本风险灯', index: 2 },
]

const normalizeStatus = (status) => (
  status === 'red' ? 'red' : status === 'amber' ? 'amber' : 'green'
)

export const departmentBreakdownFromProjects = (projects = []) => {
  const counts = new Map()

  projects.forEach((project) => {
    const department = project.dept || '未分配部门'
    counts.set(department, (counts.get(department) ?? 0) + 1)
  })

  return Array.from(counts, ([label, value]) => ({ label, value }))
}

export const riskSummaryFromProjects = (projects = [], index = 0) => {
  const redProjects = projects.filter((project) => normalizeStatus(project.statuses?.[index]) === 'red')
  const amberProjects = projects.filter((project) => normalizeStatus(project.statuses?.[index]) === 'amber')
  const focusItems = [
    ...redProjects.map((project) => ({ label: project.name, tone: 'red' })),
    ...amberProjects.map((project) => ({ label: project.name, tone: 'amber' })),
  ]
  const focusProject = focusItems[0] ?? null

  return {
    value: redProjects.length + amberProjects.length,
    red: redProjects.length,
    amber: amberProjects.length,
    focusLabel: focusProject?.label,
    focusTone: focusProject?.tone ?? 'green',
    focusItems,
  }
}

export const projectNodeMetricsFromProjects = (projects = []) => {
  const departmentBreakdown = departmentBreakdownFromProjects(projects)
  const normalProjects = projects.filter((project) => (
    project.statuses?.every((status) => normalizeStatus(status) === 'green')
  ))

  return [
    {
      label: 'TQC 项目数',
      value: projects.length,
      unit: '个',
      tone: 'neutral',
      breakdown: departmentBreakdown,
    },
    {
      label: '正常推进项目数',
      value: normalProjects.length,
      unit: '个',
      tone: 'green',
      helper: '正常项目',
      focusTone: 'green',
      focusItems: normalProjects.map((project) => ({ label: project.name, tone: 'green' })),
    },
    ...statusLabels.map(({ label, index }) => {
      const summary = riskSummaryFromProjects(projects, index)
      return {
        label,
        value: summary.value,
        unit: '个',
        tone: summary.red > 0 ? 'red' : summary.amber > 0 ? 'amber' : 'green',
        red: summary.red,
        amber: summary.amber,
        focusLabel: summary.focusLabel,
        focusTone: summary.focusTone,
        focusItems: summary.focusItems,
      }
    }),
  ]
}

export const overviewStatsFromProjects = (projects = []) => {
  const running = projects.filter((project) => project.closed !== true).length
  const closedThisMonth = projects.filter((project) => project.closedThisMonth === true).length
  const riskItems = projects.reduce((count, project) => (
    count + (project.statuses ?? []).filter((status) => normalizeStatus(status) !== 'green').length
  ), 0)

  return [
    { label: '在研项目', value: projects.length, unit: '个', tone: 'purple' },
    { label: '运行项目', value: running, unit: '个', tone: 'green' },
    { label: '本月关闭', value: closedThisMonth, unit: '个', tone: 'amber' },
    { label: 'TQC风险项', value: riskItems, unit: '项', tone: 'red' },
  ]
}
