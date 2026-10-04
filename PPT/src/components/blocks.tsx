import { useState } from 'react'
import type { SlideCard, SlideColumn, SlideFlow, SlideStat, SlideTable } from '../data/presentation'

/** Takeaway callout — Crail voice of the slide. */
export function Quote({ text }: { text: string }) {
  return <blockquote className="slide-quote">{text}</blockquote>
}

/** Tiny source line for defensible numbers. */
export function Footnote({ text }: { text: string }) {
  return <p className="slide-footnote">{text}</p>
}

/** Vertical numbered algorithm flow (slide 11). */
export function StepsFlow({ steps }: { steps: string[] }) {
  return (
    <ol className="steps-flow">
      {steps.map((step, i) => (
        <li key={step}>
          <span className="steps-num" aria-hidden="true">{i + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}

/** Feature comparison table (slide 13). */
export function CompareTable({ table }: { table: SlideTable }) {
  return (
    <table className="compare-table">
      <thead>
        <tr>
          {table.head.map((h) => (
            <th key={h} scope="col">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr key={row[0]}>
            <th scope="row">{row[0]}</th>
            {row.slice(1).map((cell) => (
              <td key={cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** 2- or 3-way comparison columns (slides 07, 20). */
export function Columns({ columns }: { columns: SlideColumn[] }) {
  return (
    <div className={`slide-columns slide-columns--${columns.length}`}>
      {columns.map((col) => (
        <div className="slide-column" key={col.heading}>
          <h3>{col.heading}</h3>
          <ul>
            {col.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** Stat chips for defensible numbers (slides 17, 18). */
export function StatChips({ stats }: { stats: SlideStat[] }) {
  return (
    <ul className="stat-chips">
      {stats.map((stat) => (
        <li key={stat.label}>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </li>
      ))}
    </ul>
  )
}

/** Primitive / feature cards (slide 10). */
export function Cards({ cards }: { cards: SlideCard[] }) {
  return (
    <ul className="primitive-cards">
      {cards.map((card) => (
        <li key={card.title}>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          {card.items && (
            <ul>
              {card.items.map((item) => (
                <li key={item}><code>{item}</code></li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

/** Tabbed parallel mini-flows — one mechanism at a time (slide 16). */
export function FlowTabs({ flows }: { flows: SlideFlow[] }) {
  const [tab, setTab] = useState(0)
  const current = flows[tab]
  return (
    <div className="flow-tabs">
      <div className="flow-tablist" role="tablist" aria-label="Attack mechanisms">
        {flows.map((flow, i) => (
          <button
            key={flow.title}
            type="button"
            role="tab"
            aria-selected={i === tab}
            className={i === tab ? 'is-active' : ''}
            onClick={() => setTab(i)}
          >
            {flow.title}
          </button>
        ))}
      </div>
      <ol className="flow-tabpanel" role="tabpanel" key={current.title}>
        {current.steps.map((step, i) => (
          <li key={step}>
            <span className="steps-num" aria-hidden="true">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Static labelled chains side by side — mitigations (slide 17). */
export function ChainList({ chains }: { chains: SlideFlow[] }) {
  return (
    <div className="chain-list">
      {chains.map((chain) => (
        <div className="chain" key={chain.title}>
          <h3>{chain.title}</h3>
          <ol>
            {chain.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

/** Numbered two-column reference list (slide 22). */
export function References({ references }: { references: string[] }) {
  return (
    <ol className="references">
      {references.map((ref) => (
        <li key={ref}>{ref}</li>
      ))}
    </ol>
  )
}
