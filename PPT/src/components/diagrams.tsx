import type { CSSProperties } from 'react'
import { useState } from 'react'

/**
 * CSS-only diagrams for the content slides (03, 06, 09, 11, 12, 14, 15, 18, 19).
 * Shared primitives live in presentation.css (.diagram, .d-node, ...).
 * Everything is static markup — crisp on projectors, zero assets, offline-safe.
 */
function VArrow({ label }: { label?: string }) {
  return (
    <div className="d-arrow-v" aria-hidden="true">
      {label && <span className="d-arrow-label">{label}</span>}
      <span>↓</span>
    </div>
  )
}

/** Slide 03 — M×N mesh vs M+N through one protocol. */
export function MxnDiagram() {
  const [agents, setAgents] = useState(5)
  const [tools, setTools] = useState(8)

  return (
    <div
      className="diagram"
      role="group"
      aria-label="M by N integration problem versus M plus N with MCP, with an interactive calculator"
    >
      <div className="diagram--row" aria-hidden="true">
        <div className="d-panel">
          <p className="d-panel-title">Without MCP</p>
          <div className="d-mesh d-mesh--live" aria-hidden="true">
            <span>Agent A</span><i>→</i><em>custom API</em><i>→</i><span>Tool 1</span>
            <span>Agent A</span><i>→</i><em>custom API</em><i>→</i><span>Tool 2</span>
            <span>Agent B</span><i>→</i><em>custom API</em><i>→</i><span>Tool 1</span>
            <span>Agent B</span><i>→</i><em>custom API</em><i>→</i><span>Tool 2</span>
          </div>
          <p className="d-formula d-formula--bad">M × N</p>
        </div>
        <div className="d-panel d-panel--accent">
          <p className="d-panel-title">With MCP</p>
          <div className="d-mesh d-mesh--clean" aria-hidden="true">
            <span>Agents</span><i>→</i><em>MCP</em><i>→</i><span>Tools</span>
            <span>MCP</span><i>→</i><em>protocol</em><i>→</i><span>Tools</span>
          </div>
          <p className="d-formula">M + N</p>
        </div>
      </div>
      <div className="d-calc">
        <div className="d-calc-controls">
          <label className="d-calc-slider">
            <span className="d-calc-name">Agents (M) <b>{agents}</b></span>
            <input
              type="range" min={2} max={12} value={agents}
              onChange={(e) => setAgents(Number(e.target.value))}
              aria-label="Number of agents"
              style={{ ['--fill' as string]: `${((agents - 2) / 10) * 100}%` }}
            />
          </label>
          <label className="d-calc-slider">
            <span className="d-calc-name">Tools (N) <b>{tools}</b></span>
            <input
              type="range" min={2} max={12} value={tools}
              onChange={(e) => setTools(Number(e.target.value))}
              aria-label="Number of tools"
              style={{ ['--fill' as string]: `${((tools - 2) / 10) * 100}%` }}
            />
          </label>
        </div>
        <div className="d-calc-results">
          <p className="d-calc-result d-calc-bad" aria-live="polite">
            <span className="d-calc-caption">Without MCP</span>
            <span className="d-calc-math">{agents} × {tools} = <b>{agents * tools}</b></span>
            <span className="d-calc-unit">custom links to build</span>
          </p>
          <span className="d-calc-vs" aria-hidden="true">vs</span>
          <p className="d-calc-result d-calc-good" aria-live="polite">
            <span className="d-calc-caption">With MCP</span>
            <span className="d-calc-math">{agents} + {tools} = <b>{agents + tools}</b></span>
            <span className="d-calc-unit">connections total</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/** Slide 06 — traditional point-to-point connectors: LLM at top center,
 *  four arrows down to Custom Connectors, each connecting to its target. */
export function ExistingDiagram() {
  const targets = [
    { connector: 'Custom Connector', target: 'API' },
    { connector: 'Custom Connector', target: 'Database' },
    { connector: 'Custom Connector', target: 'File System' },
    { connector: 'Custom Connector', target: 'Application' },
  ]
  return (
    <div className="diagram diagram--hub" role="img" aria-label="LLM at center top connects to four custom connectors, each connecting down to its target: API, Database, File System, Application.">
      <div className="d-hub-center">
        <div className="d-node d-node--accent">LLM</div>
      </div>
      <div className="d-hub-spokes-horizontal">
        {targets.map(({ connector, target }) => (
          <div key={target} className="d-hub-spoke-vertical">
            <div className="d-spoke-line" aria-hidden="true">
              <span className="d-spoke-arrow" aria-hidden="true">↓</span>
            </div>
            <div className="d-node d-node--connector">{connector}</div>
            <div className="d-spoke-line" aria-hidden="true">
              <span className="d-spoke-arrow" aria-hidden="true">↓</span>
            </div>
            <div className="d-node d-node--target">{target}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Slide 09 — host / client / server architecture. */
export function ArchitectureDiagram() {
  const [activeLane, setActiveLane] = useState(0)
  const lanes = [
    {
      server: 'MCP Server 1',
      tools: 'Search / Execute',
      resources: 'Files / Data',
      external: 'APIs · Files · DB',
    },
    {
      server: 'MCP Server 2',
      tools: 'Query / Analyse',
      resources: 'DB / Documents',
      external: 'Services · Data',
    },
  ]

  return (
    <div className="diagram diagram--architecture" role="group" aria-label="MCP architecture showing a host with AI application and LLM, two clients on left and right, protocol arrows down to MCP servers, tools, resources, and external systems.">
      <p className="d-architecture-title">Model Context Protocol Architecture</p>
      <div className="d-architecture-host">
        <div className="d-architecture-host-header">
          <p className="d-host-title">MCP Host</p>
          <p className="d-architecture-app">AI Application + LLM</p>
        </div>
        <div className="d-architecture-clients-row">
          <div className="d-architecture-client-wrapper">
            <div className="d-architecture-client-header">
              <strong>MCP Client 1</strong>
              <span>Connection Manager</span>
            </div>
            <div className="d-architecture-protocol-arrow" aria-hidden="true" />
          </div>
          <div className="d-architecture-client-wrapper">
            <div className="d-architecture-client-header">
              <strong>MCP Client 2</strong>
              <span>Connection Manager</span>
            </div>
            <div className="d-architecture-protocol-arrow" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="d-architecture-lanes">
        {lanes.map((lane, index) => {
          const isActive = activeLane === index
          return (
            <div
              key={lane.server}
              className={`d-architecture-lane${isActive ? ' is-active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveLane(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActiveLane(index)
                }
              }}
              aria-pressed={isActive}
              aria-label={`Select ${lane.server} connection`}
            >
              <div className="d-architecture-server">
                <strong>{lane.server}</strong>
                <div className="d-architecture-capability">
                  <b>Tools</b>
                  <span>{lane.tools}</span>
                </div>
                <div className="d-architecture-capability">
                  <b>Resources</b>
                  <span>{lane.resources}</span>
                </div>
              </div>
              <div className="d-architecture-external">
                <span>↓</span>
                <strong>External Systems</strong>
                <small>{lane.external}</small>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Slide 11 — MCP tool-invocation algorithm.
 *  Ten steps on one rail, grouped by the actor that owns them. */
const ALGORITHM_PHASES = [
  {
    label: 'Client',
    color: 'crail',
    steps: [
      'Receive the user request',
      'Identify the required capability',
      'Discover available MCP tools',
      'Select the appropriate tool',
      'Construct the MCP request',
    ],
  },
  {
    label: 'Protocol',
    color: 'peach',
    steps: ['Send it through the MCP client'],
  },
  {
    label: 'Server',
    color: 'crail',
    steps: ['Server executes the tool', 'Return the result'],
  },
  {
    label: 'Response',
    color: 'peach',
    steps: ['LLM processes the result', 'Generate the final response'],
  },
]

export function AlgorithmDiagram() {
  let stepNumber = 0

  return (
    <div className="diagram diagram--algorithm">
      <ol className="d-algorithm-flow" role="list">
        {ALGORITHM_PHASES.map((phase, phaseIndex) => {
          const next = ALGORITHM_PHASES[phaseIndex + 1]

          return (
            <li
              key={phase.label}
              className={`d-algorithm-phase d-algorithm-phase--${phase.color}`}
            >
              <div className="d-algorithm-phase-label">{phase.label}</div>
              <div className="d-algorithm-phase-steps">
                {phase.steps.map((step) => {
                  stepNumber += 1

                  return (
                    <div key={step} className="d-algorithm-step">
                      <span className="d-algorithm-step-num">{stepNumber}</span>
                      <span className="d-algorithm-step-text">{step}</span>
                    </div>
                  )
                })}
                {next && (
                  <div className="d-algorithm-jump" aria-hidden="true">
                    <span className={`d-algorithm-arrow d-algorithm-arrow--${next.color}`}>
                      ↓
                    </span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Slide 14 — MCP hub fanning out to actions, context, workflows. */
export function HubDiagram() {
  return (
    <div className="diagram" role="img" aria-label="MCP at the center, branching to Tools (Actions), Resources (Context), and Prompts (Workflows).">
      <div className="d-node d-node--accent d-node--lg">MCP</div>
      <div className="d-branch-arrow" aria-hidden="true">
        <span className="d-branch-stem" />
        <div className="d-branch-bar">
          <span className="d-branch-tick" />
          <span className="d-branch-tick" />
          <span className="d-branch-tick" />
        </div>
      </div>
      <div className="d-row d-row--spread">
        <div className="d-col">
          <div className="d-node">Tools</div>
          <div className="d-arrow-down" aria-hidden="true" />
          <span className="d-sub">Actions</span>
        </div>
        <div className="d-col">
          <div className="d-node">Resources</div>
          <div className="d-arrow-down" aria-hidden="true" />
          <span className="d-sub">Context</span>
        </div>
        <div className="d-col">
          <div className="d-node">Prompts</div>
          <div className="d-arrow-down" aria-hidden="true" />
          <span className="d-sub">Workflows</span>
        </div>
      </div>
    </div>
  )
}

/** Slide 15 — trust chain with a boundary marker at every hop. */
export function ThreatDiagram() {
  const hops = ['User', 'AI Agent', 'MCP Client', 'MCP Server', 'Tool / Resource']
  return (
    <div className="diagram" role="img" aria-label="Trust chain from user to AI agent to MCP client to MCP server to tool or resource, with a trust boundary at every hop.">
      {hops.map((hop, i) => (
        <div className="d-hop" key={hop}>
          <div className={`d-node${i === 0 ? ' d-node--accent' : ''}`}>{hop}</div>
          {i < hops.length - 1 && (
            <div className="d-trust" aria-hidden="true">
              <span>↓</span>
              <em>trust boundary</em>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/** Slide 18 — air-quality monitoring pipeline. */
export function PipelineDiagram() {
  const stages = [
    'Air Quality Sensors',
    'Django Backend',
    'MCP Server',
    'LLM',
    'Conversational Interface',
    'User',
  ]
  return (
    <div className="diagram" role="img" aria-label="Pipeline from air quality sensors through a Django backend and MCP server to the language model, conversational interface, and user.">
      {stages.map((stage, i) => (
        <div className="d-hop" key={stage}>
          <div className={`d-node${i === 2 ? ' d-node--accent' : ''}`}>{stage}</div>
          {i < stages.length - 1 && <VArrow />}
        </div>
      ))}
    </div>
  )
}

/** Slide 19 — SAMOS policy gate with allow/block decision. */
export function SamosDiagram() {
  return (
    <div className="diagram" role="img" aria-label="AI agent to MCP client to SAMOS policy enforcement, deciding yes to execute or no to block.">
      <div className="d-node">AI Agent</div>
      <VArrow />
      <div className="d-node">MCP Client</div>
      <VArrow />
      <div className="d-node d-node--accent">SAMOS Policy Enforcement</div>
      <VArrow label="flow permitted?" />
      <div className="d-row">
        <div className="d-col">
          <span className="d-verdict d-verdict--yes">Yes</span>
          <div className="d-node">Execute</div>
        </div>
        <div className="d-col">
          <span className="d-verdict d-verdict--no">No</span>
          <div className="d-node">Block</div>
        </div>
      </div>
    </div>
  )
}

/** Slide 12 — MCP tool invocation workflow.
 *  Two-party sequence diagram: Host/Client on the left, MCP Server on the
 *  right, numbered messages 1-6 walking left/right across the lifelines. */
const WORKFLOW_MESSAGES = [
  { step: 1, label: 'Initialize', dir: 'right' },
  { step: 2, label: 'Capabilities', dir: 'left' },
  { step: 3, label: 'Discover Tools', dir: 'right' },
  { step: 4, label: 'Available Tool List', dir: 'left' },
  { step: 5, label: 'Tool Call', dir: 'right' },
  { step: 6, label: 'Tool Result', dir: 'left' },
] as const

function WorkflowMessage({
  step,
  label,
  dir,
  at,
}: {
  step: number
  label: string
  dir: 'left' | 'right'
  at: number
}) {
  return (
    <div
      className={`d-wf-msg d-wf-msg--${dir}`}
      style={{ '--i': at } as CSSProperties}
    >
      <span className="d-wf-msg-label">
        <span className="d-wf-msg-num">{step}</span>
        {label}
        <span className="sr-only">
          {dir === 'right' ? ' — sent to the MCP server' : ' — returned by the MCP server'}
        </span>
      </span>
      <span className="d-wf-msg-line" aria-hidden="true">
        <span className="d-wf-msg-head" />
      </span>
    </div>
  )
}

export function WorkflowDiagram() {
  return (
    <div className="diagram diagram--workflow">
      <div className="d-wf">
        <div className="d-wf-participant">
          <span className="d-wf-role">Host / Client</span>
          <span className="d-wf-box">AI App + LLM</span>
        </div>
        <div className="d-wf-participant">
          <span className="d-wf-role">MCP Server</span>
          <span className="d-wf-box">Tools / Data</span>
        </div>

        <div className="d-wf-track">
          <div className="d-wf-exchange">
            <span className="d-wf-lifeline d-wf-lifeline--left" aria-hidden="true" />
            <span className="d-wf-lifeline d-wf-lifeline--right" aria-hidden="true" />

            {WORKFLOW_MESSAGES.slice(0, 5).map((message, index) => (
              <WorkflowMessage key={message.step} {...message} at={index} />
            ))}

            <div className="d-wf-annot-row" style={{ '--i': 5 } as CSSProperties}>
              <span className="d-wf-annot">Execute Tool</span>
            </div>

            <WorkflowMessage {...WORKFLOW_MESSAGES[5]} at={6} />
          </div>

          <div className="d-wf-llm-row" style={{ '--i': 7 } as CSSProperties}>
            <span className="d-wf-down" aria-hidden="true">
              ▼
            </span>
            <div className="d-wf-llm">
              <span className="d-wf-llm-title">LLM</span>
              <span className="d-wf-llm-text">Interpret result &amp; continue reasoning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}