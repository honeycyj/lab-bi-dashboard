export const salesDashboardRows = [
  { name: '余臻雄', code: 'WX0038', newCustomers: 3, customerFollowups: 0, newLeads: 4, leadFollowups: 0 },
  { name: '周智强', code: '600014', newCustomers: 3, customerFollowups: 2, newLeads: 2, leadFollowups: 2 },
  { name: '曾旭', code: 'WX0079', newCustomers: 20, customerFollowups: 1, newLeads: 3, leadFollowups: 0 },
  { name: '鲁兆征', code: 'WX0027', newCustomers: 5, customerFollowups: 1, newLeads: 0, leadFollowups: 0 },
  { name: '洪亮', code: '000041', newCustomers: 2, customerFollowups: 1, newLeads: 5, leadFollowups: 5 },
  { name: '刘楚楚', code: '000133', newCustomers: 0, customerFollowups: 0, newLeads: 0, leadFollowups: 0 },
  { name: '卢威', code: '000154', newCustomers: 0, customerFollowups: 0, newLeads: 0, leadFollowups: 0 },
]

export const salesDashboardPeriod = '2026/5/1~2026/5/28 18:00（按录入时间）'

export const salesDashboardMetrics = [
  { key: 'newCustomers', label: '新增客户', tone: 'green', color: '#28c840' },
  { key: 'customerFollowups', label: '客户跟进记录', tone: 'purple', color: '#7c2cf4' },
  { key: 'newLeads', label: '新增线索', tone: 'amber', color: '#ffbd2e' },
  { key: 'leadFollowups', label: '线索跟进记录', tone: 'red', color: '#ff6678' },
]

export const salesFollowupMetrics = [
  {
    label: '客户跟进率',
    valueKey: 'customerFollowups',
    maxKey: 'newCustomers',
    suffix: '%',
    type: 'rate',
    color: '#7c2cf4',
  },
  {
    label: '线索跟进率',
    valueKey: 'leadFollowups',
    maxKey: 'newLeads',
    suffix: '%',
    type: 'rate',
    color: '#ff6678',
  },
  {
    label: '客户未跟进',
    valueKey: 'customerFollowups',
    maxKey: 'newCustomers',
    suffix: '条',
    type: 'remaining',
    color: '#ffbd2e',
  },
  {
    label: '线索未跟进',
    valueKey: 'leadFollowups',
    maxKey: 'newLeads',
    suffix: '条',
    type: 'remaining',
    color: '#28c840',
  },
]

export const salesDashboardPageData = {
  period: salesDashboardPeriod,
  rows: salesDashboardRows,
  metrics: salesDashboardMetrics,
  contribution: {
    title: '销售人员贡献',
    columns: [
      { key: 'person', label: '人员' },
      { key: 'newCustomers', label: '新增客户' },
      { key: 'customerFollowups', label: '客户跟进' },
      { key: 'newLeads', label: '新增线索' },
      { key: 'leadFollowups', label: '线索跟进' },
    ],
  },
  followup: {
    title: '跟进转化率',
    subtitle: '与新增客户 / 线索对比',
    metrics: salesFollowupMetrics,
  },
}
