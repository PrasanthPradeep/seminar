import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Agentic AI flow visual (slide 02): User → LLM/Agent → Reasoning +
 * Planning → External Tools (APIs, Databases, Files, Services).
 *
 * Live and interactive: the highlight auto-plays down the flow in a loop,
 * arrows carry a travelling pulse, and any node can be clicked (or
 * Enter/Space-focused) to spotlight that step — auto-play resumes after
 * a few seconds. Pure CSS + timers, so it stays crisp offline.
 */
const STEPS = ['User', 'LLM / Agent', 'Reasoning + Planning', 'External Tools'] as const
const LEAVES = ['APIs', 'Databases', 'Files', 'Services'] as const

const STEP_MS = 1500
const RESUME_MS = 8000

export function AgentFlow() {
  const [active, setActive] = useState(1) // rest on the agent, the hero
  const [paused, setPaused] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const resumeTimer = useRef<number | null>(null)

  const clearResume = useCallback(() => {
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
  }, [])

  // Auto-play the highlight down the flow in a loop.
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % (STEPS.length + 1))
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [paused])

  useEffect(() => clearResume, [clearResume])

  const select = useCallback(
    (index: number) => {
      setActive(index)
      setPaused(true)
      clearResume()
      resumeTimer.current = window.setTimeout(() => setPaused(false), RESUME_MS)
    },
    [clearResume],
  )

  const onNodeKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Keep Space from also triggering the global next-slide shortcut.
        e.preventDefault()
        e.stopPropagation()
        select(index)
      }
    },
    [select],
  )

  const leavesLit = active === STEPS.length

  return (
    <div
      className="agent-flow"
      role="group"
      aria-label="Interactive diagram: agentic AI flow. Activate a step to spotlight it."
    >
      {STEPS.map((step, i) => (
        <div className="flow-step" key={step}>
          <button
            type="button"
            className={
              `flow-node${i === 1 ? ' flow-node--accent' : ''}` +
              (i === active ? ' is-active' : '')
            }
            onClick={() => select(i)}
            onKeyDown={(e) => onNodeKeyDown(e, i)}
            aria-pressed={i === active}
            aria-label={`Flow step ${i + 1} of ${STEPS.length}: ${step}`}
          >
            {step}
          </button>
          {i < STEPS.length - 1 && (
            <div
              className={`flow-arrow${active > i ? ' is-lit' : ''}`}
              style={{ animationDelay: `${i * 0.25}s` }}
              aria-hidden="true"
            >
              ↓
            </div>
          )}
        </div>
      ))}
      <div
        className={`flow-arrow${leavesLit ? ' is-lit' : ''}`}
        style={{ animationDelay: `${(STEPS.length - 1) * 0.25}s` }}
        aria-hidden="true"
      >
        ↓
      </div>
      <ul className={`flow-leaves${leavesLit ? ' is-lit' : ''}`}>
        {LEAVES.map((leaf) => (
          <li key={leaf}>{leaf}</li>
        ))}
      </ul>
    </div>
  )
}
