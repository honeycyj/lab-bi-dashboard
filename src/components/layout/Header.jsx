import React from 'react'
import { NAV_ITEMS } from '../../app/constants'

export default function Header({ now, title, onSelectScreen }) {
  const navItems = NAV_ITEMS
  const activeNav = title.includes('概览') ? '项目总览' : '项目节点图'
  const dateText = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(now)
  const timeText = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <header className="topbar">
      <div className="brand">
        <img src="/logotext.png" alt="马栏山音视频实验室" />
        <h1>BI 项目数据看板</h1>
      </div>
      <nav className="header-tabs" aria-label="看板栏目">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.label}
            className={item.label === activeNav ? 'active' : undefined}
            aria-current={item.label === activeNav ? 'page' : undefined}
            onClick={() => onSelectScreen(item.screen)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="header-meta">
        <div className="live-time">
          <span>{dateText}</span>
          <b>{timeText}</b>
        </div>
      </div>
    </header>
  )
}
