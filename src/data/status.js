export const normalizeStatus = (status) => {
  if (status === 'red') return 'red'
  if (status === 'amber' || status === 'orange') return 'amber'
  return 'green'
}

export const worstStatus = (statuses = []) => {
  const normalizedStatuses = statuses.map(normalizeStatus)
  if (normalizedStatuses.includes('red')) return 'red'
  if (normalizedStatuses.includes('amber')) return 'amber'
  return 'green'
}
