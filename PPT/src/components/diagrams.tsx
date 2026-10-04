import { useState } from 'react'

/**
 * CSS-only diagrams for the content slides (03, 06, 09, 12, 14, 15, 18, 19).
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

/**
 * Slide 03 — M×N mesh vs M+N through one protocol.
 * Interactive: drag the M / N sliders and watch custom-link count explode
 * next to the flat MCP count. Formulas pin to the panel bottoms so M×N
 * and M+N always sit level, whatever the content above does.
 */
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

/** Slide 06 — traditional point-to-point connectors. */
export function ExistingDiagram() {
  return (
    <div className="diagram" role="img" aria-label="An LLM connects to an API, a database, a file system, and an application through four separate custom connectors.">
      <div className="d-node d-node--accent">LLM</div>
      <VArrow />
      <ul className="d-branches">
        <li><i>custom</i> API</li>
        <li><i>custom</i> Database</li>
        <li><i>custom</i> File system</li>
        <li><i>custom</i> Application</li>
      </ul>
    </div>
  )
}

/** Slide 09 — host / client / server architecture. */
export function ArchitectureDiagram() {
  return (
    <div className="diagram" role="img" aria-label="MCP host containing the AI application, language model, and two clients, each client connected to an MCP server exposing tools and resources.">
      <div className="d-host">
        <p className="d-host-title">MCP Host — AI Application + LLM</p>
        <div className="d-row">
          <div className="d-col">
            <div className="d-node">Client</div>
            <div className="d-link" aria-hidden="true">→</div>
            <div className="d-node d-node--server">Server 1
              <span className="d-sub">Tools · Resources</span>
            </div>
          </div>
          <div className="d-col">
            <div className="d-node">Client</div>
            <div className="d-link" aria-hidden="true">→</div>
            <div className="d-node d-node--server">Server 2
              <span className="d-sub">Tools · Resources</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Slide 12 — standardized message exchange sequence. */
export function WorkflowDiagram() {
  const rows: Array<[string, string]> = [
    ['Host → Client', 'Initialize'],
    ['Client → Server', 'Initialize'],
    ['Server → Client', 'Capabilities'],
    ['Client → Server', 'Tool discovery'],
    ['Server → Client', 'Tool list'],
    ['Client → Server', 'Tool call'],
    ['Server → Client', 'Tool result'],
  ]
  return (
    <div className="diagram" role="img" aria-label="Message sequence from host initialization through capability exchange, tool discovery, tool call, and tool result.">
      <ol className="d-sequence">
        {rows.map(([who, what]) => (
          <li key={`${who}-${what}`}>
            <span className="d-seq-who">{who}</span>
            <span className="d-seq-arrow" aria-hidden="true">→</span>
            <span className="d-seq-what">{what}</span>
          </li>
        ))}
      </ol>
      <p className="d-note">JSON-RPC underneath every exchange</p>
    </div>
  )
}

/** Slide 14 — MCP hub fanning out to actions, context, workflows. */
export function HubDiagram() {
  return (
    <div className="diagram" role="img" aria-label="MCP at the center, branching to tools for actions, resources for context, and prompts for workflows.">
      <div className="d-node d-node--accent d-node--lg">MCP</div>
      <div className="d-row d-row--spread">
        <div className="d-col">
          <div className="d-node">Tools</div>
          <span className="d-sub">Actions</span>
        </div>
        <div className="d-col">
          <div className="d-node">Resources</div>
          <span className="d-sub">Context</span>
        </div>
        <div className="d-col">
          <div className="d-node">Prompts</div>
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
