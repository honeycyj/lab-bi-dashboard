import React, { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Settings } from 'lucide-react'
import {
  NAV_ITEMS,
  PAGE_INTERVAL,
  RISK_CARD_INTERVAL,
  PAGE_SIZE,
  SCREEN_INTERVAL,
  TIMER_TICK,
} from './constants'
import Header from '../components/layout/Header'
import SettingsPanel from '../components/settings/SettingsPanel'
import { dashboardProjects } from '../data/realProjectData'
import { createProjectNodePageModel } from '../data/projectModel'
import OverviewPage from '../pages/OverviewPage'
import ProjectNodesPage from '../pages/ProjectNodesPage'
import UnclosedDefectsPage from '../pages/UnclosedDefectsPage'
import DefectDistributionPage, { SevereDefectDistributionPage } from '../pages/DefectDistributionPage'
import ProductInnovationPage from '../pages/ProductInnovationPage'
import ProductInnovation02Page, { ProductInnovation03Page } from '../pages/ProductInnovation02Page'
import SalesDashboardPage from '../pages/SalesDashboardPage'
import { prefersReducedMotion, secondsUntil } from '../utils/time'

gsap.registerPlugin(useGSAP)

const pageQueryMap = {
  sales: 8,
  'product-innovation-03': 7,
  'product-innovation-02': 6,
  'product-innovation': 5,
  'severe-distribution': 4,
  distribution: 3,
  defects: 2,
  overview: 1,
}

const defaultVisibleScreens = NAV_ITEMS.map((item) => item.screen)

const parseVisibleScreens = () => {
  if (typeof window === 'undefined') return defaultVisibleScreens

  const currentStored = window.localStorage.getItem('visibleScreensV3')
  const previousStored = window.localStorage.getItem('visibleScreensV2')
  const legacyStored = window.localStorage.getItem('visibleScreens')
  const stored = currentStored || previousStored || legacyStored
  if (!stored) return defaultVisibleScreens

  const knownScreens = new Set(defaultVisibleScreens)
  const storedScreens = stored
    .split(',')
    .map((item) => Number(item))
  const migratedScreens = currentStored
    ? storedScreens
    : previousStored
      ? storedScreens.flatMap((screen) => (screen === 7 ? [7, 8] : [screen]))
      : storedScreens.flatMap((screen) => (screen === 6 ? [6, 7, 8] : [screen]))
  const parsed = [...new Set(migratedScreens)].filter((item) => knownScreens.has(item))

  return parsed.length ? parsed : defaultVisibleScreens
}

const nextVisibleScreen = (currentScreen, visibleScreens) => {
  const currentIndex = visibleScreens.indexOf(currentScreen)
  if (currentIndex < 0) return visibleScreens[0]
  return visibleScreens[(currentIndex + 1) % visibleScreens.length]
}

export default function Dashboard() {
  const dashboardRef = useRef(null)
  const hasAnimatedProjectPageRef = useRef(false)
  const [now, setNow] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(0)
  const [screenPage, setScreenPage] = useState(() => {
    if (typeof window === 'undefined') return 0
    const page = new URLSearchParams(window.location.search).get('page')
    return pageQueryMap[page] ?? 0
  })
  const [visibleScreens, setVisibleScreens] = useState(parseVisibleScreens)
  const [autoPlay, setAutoPlay] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [projectIntervalSec, setProjectIntervalSec] = useState(PAGE_INTERVAL / 1000)
  const [screenIntervalSec, setScreenIntervalSec] = useState(SCREEN_INTERVAL / 1000)
  const [riskCardIntervalSec, setRiskCardIntervalSec] = useState(RISK_CARD_INTERVAL / 1000)
  const [themeMode, setThemeMode] = useState(() => (
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('theme') === 'light'
      ? 'light'
      : 'dark'
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
  const visibleNavItems = useMemo(
    () => NAV_ITEMS.filter((item) => visibleScreens.includes(item.screen)),
    [visibleScreens],
  )
  const visibleScreenIndex = Math.max(0, visibleScreens.indexOf(screenPage))

  useEffect(() => {
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(clockTimer)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('visibleScreensV3', visibleScreens.join(','))
  }, [visibleScreens])

  useEffect(() => {
    if (visibleScreens.includes(screenPage)) return
    setCurrentPage(0)
    setScreenPage(visibleScreens[0] ?? 0)
  }, [screenPage, visibleScreens])

  useEffect(() => {
    if (!autoPlay || settingsOpen || screenPage === 0) return undefined
    const intervalMs = screenIntervalSec * 1000
    let deadline = Date.now() + intervalMs

    setScreenCountdownSec(secondsUntil(deadline))
    const screenTimer = window.setInterval(() => {
      const remaining = secondsUntil(deadline)
      setScreenCountdownSec(remaining)
      if (remaining <= 0) {
        setCurrentPage(0)
        setScreenPage((page) => nextVisibleScreen(page, visibleScreens))
        deadline = Date.now() + intervalMs
        setScreenCountdownSec(secondsUntil(deadline))
      }
    }, TIMER_TICK)

    return () => window.clearInterval(screenTimer)
  }, [autoPlay, screenIntervalSec, screenPage, settingsOpen, visibleScreens])

  useEffect(() => {
    if (!autoPlay || settingsOpen || screenPage !== 0) return undefined
    const intervalMs = projectIntervalSec * 1000
    let deadline = Date.now() + intervalMs

    setProjectCountdownSec(secondsUntil(deadline))
    const pageTimer = window.setInterval(() => {
      const remaining = secondsUntil(deadline)
      setProjectCountdownSec(remaining)
      if (remaining <= 0) {
        setCurrentPage((page) => {
          if (page >= totalPages - 1) {
            setScreenPage(nextVisibleScreen(0, visibleScreens))
            return 0
          }

          return page + 1
        })
        deadline = Date.now() + intervalMs
        setProjectCountdownSec(secondsUntil(deadline))
      }
    }, TIMER_TICK)

    return () => window.clearInterval(pageTimer)
  }, [autoPlay, projectIntervalSec, screenPage, settingsOpen, totalPages, visibleScreens])

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

    const sectionTargets = screenPage === 0
      ? ['.metrics', '.project-board']
      : [screenPage === 1 ? '.overview-page' : screenPage === 2 ? '.unclosed-defects-page' : screenPage === 6 || screenPage === 7 ? '.product-innovation02-page' : screenPage === 8 ? '.sales-dashboard-page' : '.defect-distribution-page']
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
    if (![1, 2, 3, 4, 5, 6, 7, 8].includes(screenPage) || prefersReducedMotion()) return

    const tl = gsap.timeline({ delay: 0.08, defaults: { ease: 'power3.out' } })
    if (screenPage === 1) {
      tl.fromTo('.trend-grid i', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.46, stagger: 0.025, clearProps: 'transform' }, 0)
      tl.fromTo('.trend-bars i', { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.72, stagger: { each: 0.012, from: 'start' }, clearProps: 'transform' }, 0.08)
      tl.fromTo('.trend-bars b', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.01, clearProps: 'opacity,visibility,transform' }, 0.38)
      tl.fromTo('.donut', { autoAlpha: 0, scale: 0.88, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.52, stagger: 0.06, clearProps: 'opacity,visibility,transform' }, 0.14)
      tl.fromTo('.donut-list span', { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.022, clearProps: 'opacity,visibility,transform' }, 0.28)
      tl.fromTo('.dept-row', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04, clearProps: 'opacity,visibility,transform' }, 0.18)
      tl.fromTo('.dept-track i', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.64, stagger: 0.04, clearProps: 'transform' }, 0.34)
      tl.fromTo('.mini-ring', { autoAlpha: 0, scale: 0.86, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.42, stagger: 0.04, clearProps: 'opacity,visibility,transform' }, 0.22)
      tl.fromTo('.ring-item span', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04, clearProps: 'opacity,visibility,transform' }, 0.36)
      return
    }

    if (screenPage === 2) {
      tl.fromTo('.defect-bar', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.72, stagger: 0.035, clearProps: 'transform' }, 0.04)
      tl.fromTo('.defect-rank-row strong', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.025, clearProps: 'opacity,visibility,transform' }, 0.26)
      return
    }

    if (screenPage === 4) {
      tl.fromTo('.severe-person-card', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.035, clearProps: 'opacity,visibility,transform' }, 0.02)
      tl.fromTo('.severe-person-card-track i', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.56, stagger: 0.035, clearProps: 'transform' }, 0.18)
      return
    }

    if (screenPage === 6 || screenPage === 7) {
      tl.fromTo('.innovation02-rate-track i, .innovation02-project-track > div, .innovation02-developer-track > div', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.62, stagger: 0.012, clearProps: 'transform' }, 0.04)
      tl.fromTo('.innovation02-rate-row strong, .innovation02-project-row strong, .innovation02-developer-row strong', { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.008, clearProps: 'opacity,visibility,transform' }, 0.24)
      return
    }

    if (screenPage === 8) {
      tl.fromTo('.sales-metric-track i', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.64, stagger: 0.035, clearProps: 'transform' }, 0.04)
      tl.fromTo('.sales-matrix-row, .sales-metric-row .dept-row-head b', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.018, clearProps: 'opacity,visibility,transform' }, 0.22)
      return
    }

    tl.fromTo('.defect-chart-stack', { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.72, stagger: 0.025, clearProps: 'transform' }, 0.04)
    tl.fromTo('.defect-chart-stack span', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.01, clearProps: 'opacity,visibility,transform' }, 0.28)
  }, { scope: dashboardRef, dependencies: [screenPage] })

  const screenTitle = ['项目组合里程碑进度与 TQC 看板', '项目信息概览', '未关闭缺陷', '缺陷分布', '严重缺陷分布', '产品创新部', '产品创新部02', '产品创新部03', '销售大屏'][screenPage]

  return (
    <main ref={dashboardRef} className={`dashboard theme-${themeMode} ${screenPage === 1 ? 'dashboard-overview' : ''} ${screenPage === 2 ? 'dashboard-defects' : ''} ${screenPage === 3 || screenPage === 4 || screenPage === 5 || screenPage === 6 || screenPage === 7 ? 'dashboard-defect-distribution' : ''} ${screenPage === 8 ? 'dashboard-sales' : ''}`}>
      <Header
        now={now}
        title={screenTitle}
        activeScreen={screenPage}
        onSelectScreen={setScreenPage}
        navItems={visibleNavItems}
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
      ) : screenPage === 1 ? (
        <OverviewPage />
      ) : screenPage === 2 ? (
        <UnclosedDefectsPage />
      ) : screenPage === 3 ? (
        <DefectDistributionPage />
      ) : screenPage === 4 ? (
        <SevereDefectDistributionPage />
      ) : screenPage === 5 ? (
        <ProductInnovationPage />
      ) : screenPage === 6 ? (
        <ProductInnovation02Page />
      ) : screenPage === 7 ? (
        <ProductInnovation03Page />
      ) : (
        <SalesDashboardPage />
      )}

      <nav className="pagination" aria-label="看板分页">
        <span className="page-count">
          第 {screenPage === 0 ? currentPage + 1 : visibleScreenIndex + 1} / {screenPage === 0 ? totalPages : visibleScreens.length} 页
        </span>
        <div className="page-dots">
          {visibleScreens.map((screen, index) => (
            <button
              type="button"
              className={screen === screenPage ? 'active' : ''}
              aria-label={`切换到看板第 ${index + 1} 页`}
              aria-current={screen === screenPage ? 'page' : undefined}
              onClick={() => setScreenPage(screen)}
              key={screen}
            />
          ))}
        </div>
        <span className="page-timer">
          {settingsOpen
            ? '设置中暂停轮播'
            : autoPlay
              ? (screenPage === 0
                ? `${projectCountdownSec} 秒后${currentPage >= totalPages - 1 ? '切到总览' : '项目翻页'}`
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
        navItems={NAV_ITEMS}
        visibleScreens={visibleScreens}
        setVisibleScreens={setVisibleScreens}
      />
    </main>
  )
}
