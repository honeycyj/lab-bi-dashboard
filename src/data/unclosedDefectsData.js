import { defectStatusColors } from './defectStatusPalette'

export const defectStatusMeta = {
  open: { label: '打开', color: defectStatusColors.open },
  suspended: { label: '挂起', color: defectStatusColors.suspended },
  failed: { label: '未通过', color: defectStatusColors.failed },
  resolved: { label: '已解决', color: defectStatusColors.resolved },
  passed: { label: '已通过', color: defectStatusColors.passed },
  rejected: { label: '驳回', color: defectStatusColors.failed },
}

export const developerDefects = [
  { name: '王飞扬', code: '000050', open: 6, suspended: 0, failed: 0 },
  { name: '袁璇', code: '000145', open: 5, suspended: 0, failed: 0 },
  { name: '杨欣文', code: '000103', open: 0, suspended: 5, failed: 0 },
  { name: '曹子轩', code: '000147', open: 3, suspended: 2, failed: 0 },
  { name: '吕楠', code: '000043', open: 4, suspended: 0, failed: 0 },
  { name: '章广', code: 'WX0002', open: 3, suspended: 1, failed: 0 },
  { name: '王鑫', code: '000012', open: 3, suspended: 0, failed: 0 },
  { name: '彭万里', code: '000108', open: 0, suspended: 2, failed: 0 },
  { name: '黄静', code: '000061', open: 0, suspended: 2, failed: 0 },
  { name: '侯明', code: '000111', open: 2, suspended: 0, failed: 0 },
  { name: '刘正浩', code: 'WX0030', open: 1, suspended: 1, failed: 0 },
  { name: '郭姣', code: '600015', open: 0, suspended: 1, failed: 0 },
  { name: '刘璇', code: 'WX0040', open: 0, suspended: 1, failed: 0 },
  { name: '孙然', code: '000165', open: 1, suspended: 0, failed: 0 },
  { name: '李乔', code: '000136', open: 0, suspended: 1, failed: 0 },
  { name: '李建', code: '000117', open: 0, suspended: 1, failed: 0 },
  { name: '王大杰', code: '000060', open: 0, suspended: 1, failed: 0 },
  { name: '陈嘉雨', code: '000107', open: 0, suspended: 0, failed: 1 },
  { name: '周祥', code: 'WX0031', open: 0, suspended: 1, failed: 0 },
  { name: '胡明', code: '000075', open: 0, suspended: 1, failed: 0 },
]

export const testerDefects = [
  { name: '余德怀', code: '000077', resolved: 23, passed: 0, rejected: 1 },
  { name: '梅雪玲', code: 'WX0008', resolved: 11, passed: 0, rejected: 0 },
  { name: '陆水芳', code: 'WX0025', resolved: 2, passed: 0, rejected: 0 },
  { name: '向衡礼', code: '000030', resolved: 0, passed: 1, rejected: 0 },
]

export const developerStatusKeys = ['open', 'suspended', 'failed']
export const testerStatusKeys = ['resolved', 'passed', 'rejected']

const totalOf = (item, keys) => keys.reduce((sum, key) => sum + (item[key] || 0), 0)

const developerTotal = developerDefects.reduce((sum, item) => sum + totalOf(item, developerStatusKeys), 0)
const testerTotal = testerDefects.reduce((sum, item) => sum + totalOf(item, testerStatusKeys), 0)

export const unclosedDefectsPageData = {
  stats: [
    { label: '未关闭缺陷总数', value: developerTotal + testerTotal, tone: 'purple', note: '按截图口径汇总' },
    { label: '研发人员视角', value: developerTotal, tone: 'green', note: `${developerDefects.length} 位执行者` },
    { label: '测试人员视角', value: testerTotal, tone: 'amber', note: `${testerDefects.length} 位执行者` },
    {
      label: '状态类型数',
      value: developerStatusKeys.length + testerStatusKeys.length,
      tone: 'red',
      note: '两张图例合计',
    },
  ],
  rankings: [
    {
      title: '未关闭缺陷分布（按研发人员）',
      subtitle: '打开 / 挂起 / 未通过',
      data: developerDefects,
      statusKeys: developerStatusKeys,
      limit: 20,
      columns: 2,
    },
    {
      title: '未关闭缺陷分布（按测试人员）',
      subtitle: '已解决 / 已通过 / 驳回',
      data: testerDefects,
      statusKeys: testerStatusKeys,
      limit: 8,
      columns: 1,
    },
  ],
}
