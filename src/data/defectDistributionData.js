export const projectDeveloperStatuses = [
  { key: 'failed', label: '未通过', color: '#ff9f2f' },
  { key: 'suspended', label: '挂起', color: '#ffd43b' },
  { key: 'open', label: '打开', color: '#17a773' },
]

export const projectTesterStatuses = [
  { key: 'passed', label: '已通过', color: '#ffd43b' },
  { key: 'resolved', label: '已解决', color: '#17a773' },
]

export const severeStatuses = [
  { key: 'severe', label: '严重', color: '#36a9f4' },
]

export const projectDeveloperDefects = [
  { name: 'AI视频翻译项目', open: 0, suspended: 16, failed: 0 },
  { name: 'UWA-A项目', open: 8, suspended: 0, failed: 0 },
  { name: '双vivid播放器', open: 7, suspended: 0, failed: 0 },
  { name: '车载空间音频项目', open: 4, suspended: 1, failed: 1 },
  { name: '暨马漫影项目', open: 3, suspended: 1, failed: 0 },
  { name: '音视频转制项目', open: 1, suspended: 3, failed: 0 },
  { name: '技术研究部视频维护项目', open: 3, suspended: 0, failed: 0 },
  { name: '青彩声家庭解决方案项目', open: 1, suspended: 0, failed: 0 },
  { name: '技术研究部音频维护项目', open: 1, suspended: 0, failed: 0 },
]

export const projectTesterDefects = [
  { name: '双vivid播放器', resolved: 25, passed: 0 },
  { name: '音视频转制解决方案项目', resolved: 8, passed: 0 },
  { name: 'UWA视频项目（2026）', resolved: 2, passed: 0 },
  { name: '技术研究部视频维护项目', resolved: 1, passed: 0 },
  { name: 'AI视频翻译项目', resolved: 0, passed: 1 },
]

export const severePersonDefects = [
  { name: '袁璇 000145', severe: 4 },
  { name: '王鑫 000012', severe: 2 },
  { name: '白金 000043', severe: 2 },
  { name: '黄广 WX0002', severe: 1 },
]

export const severeProjectDefects = [
  { name: 'UWA-A项目', severe: 6 },
  { name: '技术研究部视频维护项目', severe: 1 },
  { name: '青彩声家庭解决方案项目', severe: 1 },
  { name: '技术研究部音频维护项目', severe: 1 },
]
