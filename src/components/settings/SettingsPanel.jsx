import React from 'react'
import { X } from 'lucide-react'

export default function SettingsPanel({
  open,
  onClose,
  autoPlay,
  setAutoPlay,
  projectIntervalSec,
  setProjectIntervalSec,
  screenIntervalSec,
  setScreenIntervalSec,
  riskCardIntervalSec,
  setRiskCardIntervalSec,
  themeMode,
  setThemeMode,
  timelineMode,
  setTimelineMode,
  navItems,
  visibleScreens,
  setVisibleScreens,
}) {
  if (!open) return null

  const visibleSet = new Set(visibleScreens)
  const toggleScreen = (screen) => {
    if (visibleSet.has(screen) && visibleScreens.length <= 1) return
    setVisibleScreens(
      visibleSet.has(screen)
        ? visibleScreens.filter((item) => item !== screen)
        : [...visibleScreens, screen].sort((left, right) => left - right),
    )
  }

  return (
    <div className="settings-layer" role="dialog" aria-modal="true" aria-label="看板设置">
      <button type="button" className="settings-backdrop" aria-label="关闭设置" onClick={() => onClose()} />
      <section className="settings-panel">
        <div className="settings-head">
          <div>
            <span>看板设置</span>
            <small>调试时打开面板会临时暂停轮播</small>
          </div>
          <button type="button" aria-label="关闭设置" onClick={() => onClose()}>
            <X size={18} strokeWidth={1.7} />
          </button>
        </div>

        <div className="settings-row">
          <div>
            <b>自动轮播</b>
            <small>控制看板页和项目页自动切换</small>
          </div>
          <label className="settings-switch">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(event) => setAutoPlay(event.target.checked)}
            />
            <span aria-hidden="true" />
          </label>
        </div>

        <div className="settings-grid">
          <label>
            <span>项目翻页时间</span>
            <input
              type="number"
              min="5"
              max="120"
              step="1"
              value={projectIntervalSec}
              onChange={(event) => setProjectIntervalSec(Math.max(5, Math.min(120, Number(event.target.value) || 5)))}
            />
            <em>秒</em>
          </label>
          <label>
            <span>看板轮播时间</span>
            <input
              type="number"
              min="10"
              max="180"
              step="1"
              value={screenIntervalSec}
              onChange={(event) => setScreenIntervalSec(Math.max(10, Math.min(180, Number(event.target.value) || 10)))}
            />
            <em>秒</em>
          </label>
          <label>
            <span>风险卡翻转时间</span>
            <input
              type="number"
              min="2"
              max="30"
              step="1"
              value={riskCardIntervalSec}
              onChange={(event) => setRiskCardIntervalSec(Math.max(2, Math.min(30, Number(event.target.value) || 2)))}
            />
            <em>秒</em>
          </label>
        </div>

        <div className="settings-theme">
          <span>显示模式</span>
          <div>
            <button
              type="button"
              className={themeMode === 'light' ? 'active' : ''}
              onClick={() => setThemeMode('light')}
            >
              浅色
            </button>
            <button
              type="button"
              className={themeMode === 'dark' ? 'active' : ''}
              onClick={() => setThemeMode('dark')}
            >
              暗色
            </button>
          </div>
        </div>

        <div className="settings-segment">
          <span>时间轴样式</span>
          <div>
            <button
              type="button"
              className={timelineMode === 'linear' ? 'active' : ''}
              onClick={() => setTimelineMode('linear')}
            >
              连续时间轴
            </button>
            <button
              type="button"
              className={timelineMode === 'milestone' ? 'active' : ''}
              onClick={() => setTimelineMode('milestone')}
            >
              阶段里程碑
            </button>
          </div>
        </div>

        <div className="settings-filter">
          <div>
            <span>显示栏目</span>
            <small>控制顶部标签、底部分页和自动轮播范围</small>
          </div>
          <div className="settings-filter-grid">
            {navItems.map((item) => (
              <label key={item.screen} className="settings-check">
                <input
                  type="checkbox"
                  checked={visibleSet.has(item.screen)}
                  disabled={visibleSet.has(item.screen) && visibleScreens.length <= 1}
                  onChange={() => toggleScreen(item.screen)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}
