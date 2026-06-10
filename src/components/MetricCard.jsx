import React, { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

export default function MetricCard({ item, riskCardIntervalSec = 3 }) {
  const hasRiskCounts = typeof item.red === 'number' || typeof item.amber === 'number'
  const focusItems = useMemo(() => {
    if (Array.isArray(item.focusItems) && item.focusItems.length > 0) return item.focusItems
    if (item.focusLabel) return [{ label: item.focusLabel, tone: item.focusTone ?? item.tone }]
    return []
  }, [item.focusItems, item.focusLabel, item.focusTone, item.tone])
  const panelRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)
  const hasFocusPanel = focusItems.length > 0
  const hasSplitLayout = hasRiskCounts || hasFocusPanel
  const currentFocus = hasFocusPanel ? focusItems[focusIndex % focusItems.length] : null
  const intervalMs = Math.max(2000, riskCardIntervalSec * 1000)
  const staggerMs = Math.min(1100, intervalMs / 2.8)
  const staggerOrder = {
    正常推进项目数: 0,
    进度风险灯: 2,
    质量风险灯: 1,
    成本风险灯: 3,
  }[item.label] ?? 0
  const randomDelay = () => {
    const jitter = intervalMs * 0.18
    return Math.max(1200, intervalMs + (Math.random() * jitter * 2 - jitter))
  }

  useEffect(() => {
    setFocusIndex(0)
  }, [item.label, focusItems.length])

  useEffect(() => {
    if (focusItems.length < 2) return undefined
    let timer
    const rotate = () => {
      const panel = panelRef.current

      if (!panel) {
        setFocusIndex((index) => (index + 1) % focusItems.length)
        return
      }

      gsap.killTweensOf(panel)
      gsap.set(panel, {
        transformPerspective: 1000,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'visible',
      })

      let contentUpdated = false
      gsap.timeline()
        .to(panel, {
          rotationY: 82,
          scaleX: 0.94,
          duration: 0.36,
          ease: 'power2.in',
          onUpdate() {
            if (this.progress() >= 0.82 && !contentUpdated) {
              contentUpdated = true
              setFocusIndex((index) => (index + 1) % focusItems.length)
            }
          },
        })
        .to(panel, {
          rotationY: 0,
          scaleX: 1,
          duration: 0.52,
          ease: 'power3.out',
          onStart() {
            if (!contentUpdated) {
              contentUpdated = true
              setFocusIndex((index) => (index + 1) % focusItems.length)
            }
          },
          onComplete() {
            gsap.set(panel, { clearProps: 'transform' })
          },
        })
        .eventCallback('onInterrupt', () => {
          if (!contentUpdated) {
            contentUpdated = true
            setFocusIndex((index) => (index + 1) % focusItems.length)
          }
          gsap.set(panel, { clearProps: 'transform' })
        })
    }
    const scheduleNext = () => {
      timer = window.setTimeout(() => {
        rotate()
        scheduleNext()
      }, randomDelay())
    }
    const starter = window.setTimeout(() => {
      rotate()
      scheduleNext()
    }, staggerOrder * staggerMs + Math.random() * Math.min(500, intervalMs * 0.16))

    return () => {
      window.clearTimeout(starter)
      if (timer) window.clearTimeout(timer)
      if (panelRef.current) gsap.killTweensOf(panelRef.current)
    }
  }, [focusItems.length, intervalMs, staggerMs, staggerOrder])

  const cardClassName = [
    'metric-card',
    `metric-${item.tone}`,
    hasSplitLayout ? 'metric-risk-card' : '',
    hasFocusPanel ? 'metric-risk-focus' : '',
    currentFocus?.tone === 'green' ? 'metric-focus-green' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClassName}>
      <div className="metric-heading">
        <div>
          <span className="metric-label">{item.label}</span>
          {item.subtitle && <small>{item.subtitle}</small>}
        </div>
        <i className="metric-state" aria-hidden="true" />
      </div>
      <div className="metric-value-row">
        <strong>{item.value}</strong>
        <span>{item.unit}</span>
      </div>
      {item.breakdown && (
        <div className="metric-breakdown">
          {item.breakdown.map((entry) => (
            <span key={entry.label}>
              <em>{entry.value}</em>
              <b>{entry.label}</b>
            </span>
          ))}
        </div>
      )}
      {!item.breakdown && (
        <div className="metric-foot">
          {hasRiskCounts ? (
            <>
              {Number(item.red) > 0 && <span className="risk-count risk-count-red">{item.red}</span>}
              {Number(item.amber) > 0 && <span className="risk-count risk-count-amber">{item.amber}</span>}
            </>
          ) : (
            <span>{item.helper ?? 'PROJECT PORTFOLIO'}</span>
          )}
        </div>
      )}
      {hasFocusPanel && (
        <div
          className="metric-focus-panel"
          ref={panelRef}
        >
          <span>{currentFocus?.label}</span>
        </div>
      )}
    </div>
  )
}
