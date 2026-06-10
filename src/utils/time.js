export const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

export const secondsUntil = (deadline) => Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
