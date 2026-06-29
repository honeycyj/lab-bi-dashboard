import React, { useEffect, useState } from 'react'
import { NAV_ITEMS } from '../../app/constants'

const changshaWeatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=28.2282&longitude=112.9388&current=temperature_2m,weather_code&timezone=Asia%2FShanghai'

const weatherLabelFromCode = (code) => {
  if (code === 0) return '晴'
  if ([1, 2, 3].includes(code)) return '多云'
  if ([45, 48].includes(code)) return '雾'
  if ([51, 53, 55, 56, 57].includes(code)) return '毛毛雨'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '雨'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '雪'
  if ([95, 96, 99].includes(code)) return '雷雨'
  return '天气'
}

export default function Header({ now, title, activeScreen, onSelectScreen }) {
  const [weather, setWeather] = useState(null)
  const navItems = NAV_ITEMS
  const activeNav = navItems.find((item) => item.screen === activeScreen)?.label
  const dateText = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const weekdayText = new Intl.DateTimeFormat('zh-CN', {
    weekday: 'short',
  }).format(now)
  const timeText = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const loadWeather = async () => {
      try {
        const response = await fetch(changshaWeatherUrl, { signal: controller.signal })
        if (!response.ok) throw new Error('weather request failed')
        const data = await response.json()
        const temperature = Math.round(Number(data?.current?.temperature_2m))
        const weatherCode = Number(data?.current?.weather_code)

        if (!cancelled && Number.isFinite(temperature)) {
          setWeather({
            temperature,
            label: weatherLabelFromCode(weatherCode),
          })
        }
      } catch {
        if (!cancelled) setWeather(null)
      }
    }

    loadWeather()
    const timer = window.setInterval(loadWeather, 30 * 60 * 1000)

    return () => {
      cancelled = true
      controller.abort()
      window.clearInterval(timer)
    }
  }, [])

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
          <span className="live-weather">
            长沙
            {weather ? (
              <>
                <b>{weather.temperature}°</b>
                <small>{weather.label}</small>
              </>
            ) : (
              <small>天气 --</small>
            )}
          </span>
          <span className="live-date">
            <em>{dateText}</em>
            <small>{weekdayText}</small>
          </span>
          <strong>{timeText}</strong>
        </div>
      </div>
    </header>
  )
}
