import React, { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Settings } from 'lucide-react'
import {
  PAGE_INTERVAL,
  RISK_CARD_INTERVAL,
  PAGE_SIZE,
  SCREEN_COUNT,
  SCREEN_INTERVAL,
  TIMER_TICK,
} from './constants'
import Header from '../components/layout/Header'
import SettingsPanel from '../components/settings/SettingsPanel'
import { dashboardProjects } from '../data/dashboardData'
import { createProjectNodePageModel } from '../data/projectModel'
import OverviewPage from '../pages/OverviewPage'
import ProjectNodesPage from '../pages/ProjectNodesPage'
import { prefersReducedMotion, secondsUntil } from '../utils/time'

gsap.registerPlugin(useGSAP)

export default function Dashboard() {
  const dashboardRef = useRef(null)
  const hasAnimatedProjectPageRef = useRef(false)
  const [now, setNow] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(0)
  const [screenPage, setScreenPage] = useState(() => {
    if (typeof window === 'undefined') return 0
    const page = new URLSearchParams(window.location.search).get('page')
    return page === 'overview' ? 1 : 0
  })
  const [autoPlay, setAutoPlay] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [projectIntervalSec, setProjectIntervalSec] = useState(PAGE_INTERVAL / 1000)
  const [screenIntervalSec, setScreenIntervalSec] = useState(SCREEN_INTERVAL / 1000)
  const [riskCardIntervalSec, setRiskCardIntervalSec] = useState(RISK_CARD_INTERVAL / 1000)
  const [themeMode, setThemeMode] = useState(() => (
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('theme') === 'dark'
      ? 'dark'
      : 'light'
  ))
  const [timelineMode, setTimelineMode] = useState(() => (
    (() => {
      if (typeof window === 'undefined') return 'linear'

      const queryMode = new URLSearchParams(window.location.search).get('timeline')
      if (queryMode === 'milestone') return 'milestone'
      if (queryMode === 'linear') return 'linear'

      return window.localStorage.getItem('timelineMode') === 'milestone' ? 'milestone' : 'linear'
    })()
  ))
  const [projectCountdownSec, setProjectCountdownSec] = useState(PAGE_INTERVAL / 1000)
  const [screenCountdownSec, setScreenCountdownSec] = useState(SCREEN_INTERVAL / 1000)
  const nodePageModel = useMemo(
    () => createProjectNodePageModel(dashboardProjects, currentPage, PAGE_SIZE),
    [currentPage],
  )
  const totalPages = nodePageModel.totalPages

  useEffect(() => {
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(clockTimer)
  }, [])

  useEffect(() => {
    if (!autoPlay || settingsOpen) return undefined
    const intervalMs = screenIntervalSec * 1000
    let deadline = Date.now() + intervalMs

    setScreenCountdownSec(secondsUntil(deadline))
    const screenTimer = window.setInterval(() => {
      const remaining = secondsUntil(deadline)
      setScreenCountdownSec(remaining)
      if (remaining <= 0) {
        setScreenPage((page) => (page + 1) % SCREEN_COUNT)
        deadline = Date.now() + intervalMs
        setScreenCountdownSec(secondsUntil(deadline))
      }
    }, TIMER_TICK)

    return () => window.clearInterval(screenTimer)
  }, [autoPlay, screenIntervalSec, settingsOpen])

  useEffect(() => {
    if (!autoPlay || settingsOpen || totalPages <= 1 || screenPage !== 0) return undefined
    const intervalMs = projectIntervalSec * 1000
    let deadline = Date.now() + intervalMs

    setProjectCountdownSec(secondsUntil(deadline))
    const pageTimer = window.setInterval(() => {
      const remaining = secondsUntil(deadline)
      setProjectCountdownSec(remaining)
      if (remaining <= 0) {
        setCurrentPage((page) => (page + 1) % totalPages)
        deadline = Date.now() + intervalMs
        setProjectCountdownSec(secondsUntil(deadline))
      }
    }, TIMER_TICK)

    return () => window.clearInterval(pageTimer)
  }, [autoPlay, projectIntervalSec, screenPage, settingsOpen, totalPages])

  useEffect(() => {
    if (!autoPlay || settingsOpen) return
    setProjectCountdownSec(projectIntervalSec)
    setScreenCountdownSec(screenIntervalSec)
  }, [autoPlay, projectIntervalSec, screenIntervalSec, screenPage, settingsOpen, totalPages])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('timelineMode', timelineMode)
  }, [timelineMode])

  useGSAP(() => {
    if (prefersReducedMotion()) return

    const sectionTargets = screenPage === 0 ? ['.metrics', '.project-board'] : ['.overview-page']
    const itemTargets = screenPage === 0 ? '.metric-card, .project-row' : '.overview-stat, .overview-card'
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(
      sectionTargets,
      { autoAlpha: 0, y: 18, scale: 0.992 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.48,
        stagger: 0.06,
        clearProps: 'opacity,visibility,transform',
      },
    )
    tl.fromTo(
      itemTargets,
      screenPage === 0
        ? {
          autoAlpha: 0,
          rotationY: -42,
          transformPerspective: 1000,
          transformOrigin: 'center center',
        }
        : { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        rotationY: 0,
        duration: screenPage === 0 ? 0.58 : 0.36,
        stagger: { each: screenPage === 0 ? 0.045 : 0.025, from: 'start' },
        ease: screenPage === 0 ? 'power3.out' : 'power3.out',
        clearProps: 'opacity,visibility,transform',
      },
      '-=0.26',
    )
  }, { scope: dashboardRef, dependencies: [screenPage] })

  useGSAP(() => {
    if (screenPage !== 0 || prefersReducedMotion()) return
    if (!hasAnimatedProjectPageRef.current) {
      hasAnimatedProjectPageRef.current = true
      return
    }

    gsap.fromTo(
      '.project-row',
      {
        autoAlpha: 0,
        rotationY: -72,
        scaleX: 0.96,
        transformPerspective: 1000,
        transformOrigin: 'center center',
      },
      {
        autoAlpha: 1,
        rotationY: 0,
        scaleX: 1,
        duration: 0.72,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
      },
    )
  }, { scope: dashboardRef, dependencies: [currentPage] })

  useGSAP(() => {
    if (screenPage !== 1 || prefersReducedMotion()) return

    const tl = gsap.timeline({ delay: 0.08, defaults: { ease: 'power3.out' } })
    tl.fromTo('.trend-grid i', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.46, stagger: 0.025, clearProps: 'transform' }, 0)
    tl.fromTo('.trend-bars i', { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.72, stagger: { each: 0.012, from: 'start' }, clearProps: 'transform' }, 0.08)
    tl.fromTo('.trend-bars b', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.01, clearProps: 'opacity,visibility,transform' }, 0.38)
    tl.fromTo('.donut', { autoAlpha: 0, scale: 0.88, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.52, stagger: 0.06, clearProps: 'opacity,visibility,transform' }, 0.14)
    tl.fromTo('.donut-list span', { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.022, clearProps: 'opacity,visibility,transform' }, 0.28)
    tl.fromTo('.dept-row', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04, clearProps: 'opacity,visibility,transform' }, 0.18)
    tl.fromTo('.dept-track i', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.64, stagger: 0.04, clearProps: 'transform' }, 0.34)
    tl.fromTo('.mini-ring', { autoAlpha: 0, scale: 0.86, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.42, stagger: 0.04, clearProps: 'opacity,visibility,transform' }, 0.22)
    tl.fromTo('.ring-item span', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04, clearProps: 'opacity,visibility,transform' }, 0.36)
  }, { scope: dashboardRef, dependencies: [screenPage] })

  return (
    <main ref={dashboardRef} className={`dashboard theme-${themeMode} ${screenPage === 1 ? 'dashboard-overview' : ''}`}>
      <Header
        now={now}
        title={screenPage === 0 ? '项目组合里程碑进度与 TQC 看板' : '项目信息概览'}
        onSelectScreen={setScreenPage}
      />

      {screenPage === 0 ? (
        <ProjectNodesPage
          metrics={nodePageModel.metrics}
          visibleProjects={nodePageModel.visibleProjects}
          currentPage={nodePageModel.currentPage}
          rowsPerPage={nodePageModel.rowsPerPage}
          timelineMode={timelineMode}
          riskCardIntervalSec={riskCardIntervalSec}
        />
      ) : (
        <OverviewPage />
      )}

      <nav className="pagination" aria-label="看板分页">
        <span className="page-count">
          第 {screenPage === 0 ? currentPage + 1 : screenPage + 1} / {screenPage === 0 ? totalPages : SCREEN_COUNT} 页
        </span>
        <div className="page-dots">
          {Array.from({ length: SCREEN_COUNT }, (_, index) => (
            <button
              type="button"
              className={index === screenPage ? 'active' : ''}
              aria-label={`切换到看板第 ${index + 1} 页`}
              aria-current={index === screenPage ? 'page' : undefined}
              onClick={() => setScreenPage(index)}
              key={index}
            />
          ))}
        </div>
        <span className="page-timer">
          {settingsOpen
            ? '设置中暂停轮播'
            : autoPlay
              ? (screenPage === 0 && totalPages > 1
                ? `${projectCountdownSec} 秒后项目翻页`
                : `${screenCountdownSec} 秒后看板翻页`)
              : '已暂停自动轮播'}
        </span>
      </nav>

      <button
        type="button"
        className="settings-button"
        aria-label="打开看板设置"
        onClick={() => setSettingsOpen(true)}
      >
        <Settings size={18} strokeWidth={1.7} />
      </button>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        projectIntervalSec={projectIntervalSec}
        setProjectIntervalSec={setProjectIntervalSec}
        screenIntervalSec={screenIntervalSec}
        setScreenIntervalSec={setScreenIntervalSec}
        riskCardIntervalSec={riskCardIntervalSec}
        setRiskCardIntervalSec={setRiskCardIntervalSec}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        timelineMode={timelineMode}
        setTimelineMode={setTimelineMode}
      />
    </main>
  )
}
