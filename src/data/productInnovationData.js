import { defectStatusColors } from './defectStatusPalette'

export const productSeverityStatuses = [
  { key: 'critical', label: '致命', color: '#ff6678' },
  { key: 'severe', label: '严重', color: '#ffbd2e' },
]

export const productSeverityProjects = [
  { name: 'S项目-IPD项目', critical: 2, severe: 11 },
  { name: '海思320+soundbar项目', critical: 0, severe: 8 },
  { name: 'M项目-IPD项目', critical: 0, severe: 3 },
  { name: 'V项目', critical: 0, severe: 1 },
]

export const productStatusStatuses = [
  { key: 'testing', label: '测试中', color: '#a896ff' },
  { key: 'open', label: '打开', color: defectStatusColors.open },
  { key: 'resolved', label: '已解决', color: defectStatusColors.resolved },
  { key: 'fixing', label: '修复中', color: defectStatusColors.fixing },
]

export const productStatusProjects = [
  { name: 'S项目-IPD项目', testing: 1, open: 7, resolved: 4, fixing: 1 },
  { name: 'M项目-IPD项目', testing: 0, open: 2, resolved: 1, fixing: 0 },
  { name: '海思320+soundbar项目', testing: 0, open: 0, resolved: 4, fixing: 4 },
  { name: 'V项目', testing: 0, open: 0, resolved: 1, fixing: 0 },
]

export const productNewSevereDefects = [
  { project: 'M项目-IPD项目', critical: 0, severe: 1 },
]

export const productInnovationPageData = {
  charts: [
    {
      title: '致命/严重缺陷遗留数量（未关闭）',
      department: '产品创新部',
      data: productSeverityProjects,
      statuses: productSeverityStatuses,
    },
    {
      title: '致命/严重缺陷遗留状态分布',
      department: '产品创新部',
      data: productStatusProjects,
      statuses: productStatusStatuses,
    },
  ],
  newSevere: {
    title: '上周新增致命/严重缺陷',
    subtitle: '新增明细',
    rows: productNewSevereDefects,
  },
}
