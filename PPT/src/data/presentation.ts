export interface SlideColumn {
  heading: string
  items: string[]
}

export interface SlideStat {
  value: string
  label: string
}

export interface SlideCard {
  title: string
  text: string
  items?: string[]
}

export interface SlideFlow {
  title: string
  steps: string[]
}

export interface SlideTable {
  head: string[]
  rows: string[][]
}

export type SlideVisual =
  | 'agent-flow'
  | 'mxn'
  | 'existing'
  | 'architecture'
  | 'workflow'
  | 'hub'
  | 'threat'
  | 'pipeline'
  | 'samos'

export interface SlideMeta {
  id: string
  index: number // 1-based
  title: string
  subtitle: string
  // Content slides: short bullets replace the placeholder.
  // Keep to 5 max, one idea each — slides support the speaker.
  // Lists longer than 6 render in two columns automatically.
  bullets?: string[]
  // Takeaway callout rendered under the body.
  quote?: string
  // Tiny source line for defensible numbers.
  footnote?: string
  // Vertical numbered algorithm flow.
  steps?: string[]
  // 2- or 3-way comparison columns.
  columns?: SlideColumn[]
  // Stat chips.
  stats?: SlideStat[]
  // Primitive / feature cards.
  cards?: SlideCard[]
  // Tabbed parallel mini-flows (e.g. attack mechanisms).
  flows?: SlideFlow[]
  // Static labelled chains rendered side by side (e.g. mitigations).
  chains?: SlideFlow[]
  // Comparison table.
  table?: SlideTable
  // Numbered reference list, two columns.
  references?: string[]
  // Optional CSS-only visual (seed of the future DiagramSlide).
  visual?: SlideVisual
  // Title-slide only fields.
  tagline?: string
  presenter?: string
  affiliation?: string
  logo?: string
}

// Milestone 4 content: mapped from the abstract + 10-paper research set.
// Numbers carry per-slide sources so claims survive faculty questions.
export const TOTAL_SLIDES = 22

export const SLIDES: SlideMeta[] = [
  {
    id: 'slide-01',
    index: 1,
    title: 'Model Context Protocol (MCP)',
    subtitle: '', // No kicker on the title slide — the topbar already says it.
    tagline: 'Architecture, Interoperability, and Security in Agentic AI',
    presenter: 'Prasanth P · KNP23CS086',
    affiliation: 'S7 CSB · Roll No. 26',
    logo: 'logo/college-logo.png',
  },
  {
    id: 'slide-02',
    index: 2,
    title: 'What is Agentic AI?',
    subtitle: '02 — Introduction',
    visual: 'agent-flow',
    bullets: [
      'Large Language Models understand and generate natural language',
      'Agentic AI extends LLMs with planning, reasoning, memory, and tool use',
      'Agents reach external systems: APIs, databases, files, web services, applications',
      'This lets AI act autonomously across multi-step tasks',
      'So agents need standardized access to external capabilities',
    ],
  },
  {
    id: 'slide-03',
    index: 3,
    title: 'Why MCP is Needed',
    subtitle: '03 — The Integration Problem',
    visual: 'mxn',
    bullets: [
      'Custom integrations grow as M × N — every agent hand-wired to every tool',
      'MCP turns the mesh into M + N connections through one shared protocol',
    ],
    quote: 'MCP provides a standardized interoperability layer',
  },
  {
    id: 'slide-04',
    index: 4,
    title: 'Problem Statement',
    subtitle: '04 — Problem',
    bullets: [
      'Agentic AI must reach external tools, APIs, databases, files, and services — but every integration uses different interfaces and custom mechanisms',
      'Fragmented tool integrations — each tool needs its own connector',
      'Framework-specific interfaces — locked to a particular AI platform',
      'Repeated development effort — same integrations rebuilt every time',
      'No standardized capability discovery — agents cannot find tools automatically',
      'Difficult context sharing — data passed manually between systems',
      'Growing security risks — external tools add new trust boundaries and attack surfaces',
    ],
    quote:
      'How can AI agents interact with diverse external tools and data through a standardized, contextual, and secure interface?',
  },
  {
    id: 'slide-05',
    index: 5,
    title: 'Objectives',
    subtitle: '05 — Objectives',
    bullets: [
      'Understand the architecture of MCP',
      'Explain its host–client–server communication model',
      'Study the tools, resources, prompts, and sampling primitives',
      'Explain the MCP tool invocation process',
      'Compare MCP with traditional API-based integration',
      'Analyze security threats in MCP ecosystems',
      'Examine security mitigation approaches',
      'Study real-world MCP applications',
    ],
  },
  {
    id: 'slide-06',
    index: 6,
    title: 'Existing System — Traditional Tool Integration',
    subtitle: '06 — Existing System',
    visual: 'existing',
    bullets: [
      'Custom tool definitions per application',
      'Application-specific connectors',
      'Predefined, rigid interfaces',
      'Context handled mainly by the application',
      'Integration logic rewritten for every tool',
    ],
  },
  {
    id: 'slide-07',
    index: 7,
    title: 'Existing System — Advantages & Limitations',
    subtitle: '07 — Where It Falls Short',
    columns: [
      {
        heading: 'Advantages',
        items: [
          'Mature, well-established APIs',
          'Large developer ecosystem',
          'Familiar development model',
          'Existing security mechanisms',
        ],
      },
      {
        heading: 'Limitations',
        items: [
          'Repeated integration effort',
          'Poor cross-platform interoperability',
          'No standardized tool discovery',
          'Application-specific context handling',
          'Cannot scale to large tool ecosystems',
        ],
      },
    ],
    quote: 'MCP addresses this interoperability gap',
  },
  {
    id: 'slide-08',
    index: 8,
    title: 'Model Context Protocol (MCP)',
    subtitle: '08 — Proposed System',
    bullets: [
      'An open protocol connecting AI applications with external capabilities',
      'Standardized communication between AI apps and MCP servers',
      'Supports tools, resources, prompts, and sampling',
      'Enables dynamic capability discovery',
      'Designed for agentic AI workflows',
    ],
    quote:
      'Standardize how AI applications discover, understand, and interact with external capabilities',
  },
  {
    id: 'slide-09',
    index: 9,
    title: 'MCP Architecture',
    subtitle: '09 — Host · Client · Server',
    visual: 'architecture',
    bullets: [
      'Host runs the AI application and its language models',
      'Each client holds one dedicated connection to a server',
      'Servers expose tools, resources, and prompts as capabilities',
    ],
  },
  {
    id: 'slide-10',
    index: 10,
    title: 'MCP Primitives',
    subtitle: '10 — Building Blocks',
    cards: [
      {
        title: 'Tools',
        text: 'Actions the model can execute',
        items: ['search_web()', 'query_database()', 'send_email()'],
      },
      {
        title: 'Resources',
        text: 'Context the model can read',
        items: ['files', 'database records', 'documents'],
      },
      {
        title: 'Prompts',
        text: 'Reusable templates for standard workflows',
      },
      {
        title: 'Sampling',
        text: 'Servers request model completions through the host',
      },
    ],
  },
  {
    id: 'slide-11',
    index: 11,
    title: 'Algorithm — MCP-Based Tool Invocation',
    subtitle: '11 — Core Process',
    steps: [
      'Receive the user request',
      'Identify the required capability',
      'Discover available MCP tools',
      'Select the appropriate tool',
      'Construct the MCP request',
      'Send it through the MCP client',
      'Server executes the tool',
      'Return the result',
      'LLM processes the result',
      'Generate the final response',
    ],
  },
  {
    id: 'slide-12',
    index: 12,
    title: 'MCP Communication Workflow',
    subtitle: '12 — Message Exchange',
    visual: 'workflow',
    bullets: [
      'Every exchange follows the JSON-RPC message format',
      'Capabilities, discovery, calls, and results share one model',
    ],
  },
  {
    id: 'slide-13',
    index: 13,
    title: 'MCP vs Traditional APIs',
    subtitle: '13 — Comparison',
    table: {
      head: ['Feature', 'Traditional API', 'MCP'],
      rows: [
        ['Primary purpose', 'Application communication', 'AI-agent interaction'],
        ['Tool discovery', 'Usually predefined', 'Standardized discovery'],
        ['Context', 'Application-managed', 'Protocol-aware'],
        ['AI primitives', 'None', 'Tools, resources, prompts'],
        ['Invocation', 'API-specific', 'Standardized'],
        ['Agent workflows', 'External orchestration', 'Designed for agents'],
        ['Integration', 'Custom connectors', 'Common protocol'],
      ],
    },
    quote: 'MCP does not replace APIs — it adds a standard AI layer over them',
  },
  {
    id: 'slide-14',
    index: 14,
    title: 'Advantages of MCP',
    subtitle: '14 — Why It Wins',
    visual: 'hub',
    bullets: [
      'Standardized AI–tool communication',
      'Reduced integration complexity',
      'Dynamic capability discovery',
      'Context-aware interaction',
      'Reusable tool ecosystem',
      'Better cross-platform interoperability',
      'Supports complex agent workflows',
      'Works across different AI applications',
    ],
  },
  {
    id: 'slide-15',
    index: 15,
    title: 'MCP Security Threat Model',
    subtitle: '15 — Attack Surface',
    visual: 'threat',
    bullets: [
      'Malicious MCP servers',
      'Prompt injection via tool content',
      'Tool poisoning',
      'Rug-pull attacks',
      'Puppet attacks',
      'Malicious external resources',
      'Data exfiltration',
      'Excessive tool permissions',
    ],
    quote: 'Interoperability grows capability — and the attack surface with it',
  },
  {
    id: 'slide-16',
    index: 16,
    title: 'Major MCP Attack Workflows',
    subtitle: '16 — How Attacks Run',
    flows: [
      {
        title: 'Tool Poisoning',
        steps: [
          'Attacker hides instructions in a tool description',
          'Agent discovers the poisoned tool',
          'LLM reads hidden instructions as guidance',
          'Agent performs an unintended action',
        ],
      },
      {
        title: 'Rug Pull',
        steps: [
          'User installs a trusted, benign tool',
          'Tool earns acceptance and permissions',
          'Provider silently changes tool behavior',
          'Agent executes the new malicious action',
        ],
      },
      {
        title: 'Malicious Resource',
        steps: [
          'Agent pulls content from an untrusted resource',
          'Content carries injected instructions',
          'Agent treats data as direction',
          'Prompts and plans get manipulated',
        ],
      },
      {
        title: 'Puppet Attack',
        steps: [
          'Attacker plants a malicious tool',
          'Tool output steers agent reasoning',
          'Agent follows attacker-shaped behavior',
          'Attacker-intended action gets performed',
        ],
      },
    ],
  },
  {
    id: 'slide-17',
    index: 17,
    title: 'Security Findings & Mitigation',
    subtitle: '17 — Evidence & Defense',
    stats: [
      { value: '12,230', label: 'tools analysed' },
      { value: '1,360', label: 'MCP servers studied' },
      { value: '1,899', label: 'open-source servers audited' },
      { value: '7.2%', label: 'with general vulnerabilities' },
      { value: '5.5%', label: 'with tool poisoning' },
      { value: '66%', label: 'showing code smells' },
      { value: '14.4%', label: 'with bug patterns' },
    ],
    chains: [
      {
        title: 'MCPSafetyScanner',
        steps: ['Adversarial testing', 'Vulnerability detection', 'Remediation analysis', 'Security report'],
      },
      {
        title: 'SAMOS',
        steps: ['Intercept tool calls', 'Check information flow', 'Enforce policy', 'Execute or block'],
      },
    ],
    footnote: 'Nayam et al. (IEEE S&P ’26) · First-glance audit (ACM ’26) · Burns et al. (SPIE ’26)',
  },
  {
    id: 'slide-18',
    index: 18,
    title: 'Real-World Example 1 — Air Quality Monitoring',
    subtitle: '18 — Application',
    visual: 'pipeline',
    bullets: [
      'Sensors stream readings through a Django backend',
      'The MCP server exposes live environmental data',
      'Users ask in plain language — the LLM answers in conversation',
    ],
    stats: [
      { value: '4.78', label: 'factual accuracy / 5' },
      { value: '4.82', label: 'completeness / 5' },
      { value: '4.84', label: 'no hallucination / 5' },
    ],
    footnote: 'Adhikari et al. (IEEE ISAECT ’25)',
  },
  {
    id: 'slide-19',
    index: 19,
    title: 'Real-World Example 2 — Secure Agent Workflows',
    subtitle: '19 — Application',
    visual: 'samos',
    bullets: [
      'Enterprise agents touch sensitive HR and finance data',
      'SAMOS intercepts every tool call at the client gateway',
      'It tracks information flow between servers',
      'It enforces policy before anything executes',
      'Legitimate access continues — leaks are blocked',
    ],
    footnote: 'Han et al. (PACMI ’25)',
  },
  {
    id: 'slide-20',
    index: 20,
    title: 'Advantages, Limitations & Future Scope',
    subtitle: '20 — Assessment',
    columns: [
      {
        heading: 'Advantages',
        items: [
          'Interoperability',
          'Less integration effort',
          'Dynamic tool discovery',
          'Context-aware interaction',
          'Reusable ecosystem',
        ],
      },
      {
        heading: 'Limitations',
        items: [
          'Expanding attack surface',
          'Third-party tool trust',
          'Tool poisoning',
          'Prompt injection',
          'Ecosystem maintainability',
          'Governance challenges',
        ],
      },
      {
        heading: 'Future Scope',
        items: [
          'Stronger sandboxing',
          'Automated security auditing',
          'Least-privilege tool access',
          'Trust verification',
          'Secure MCP registries',
          'Formal verification',
          'Standard security policies',
        ],
      },
    ],
  },
  {
    id: 'slide-21',
    index: 21,
    title: 'Conclusion',
    subtitle: '21 — Takeaways',
    bullets: [
      'MCP standardizes how AI apps reach external capabilities',
      'Host–client–server design enables modular interoperability',
      'Tools, resources, and prompts structure agent interaction',
      'Connection complexity across services drops sharply',
      'External tool access brings significant security risks',
      'Auditing and information-flow control are therefore essential',
    ],
    quote:
      'MCP can become the foundational layer for agentic AI — if security, trust, and governance grow with it',
  },
  {
    id: 'slide-22',
    index: 22,
    title: 'References',
    subtitle: '22 — Sources',
    references: [
      'Ayyagari — MCP for Agentic AI: Enabling Contextual Interoperability (IJCESEN ’25)',
      'Nayam, Khan et al. — Parasites in the Toolchain (IEEE S&P ’26)',
      'Kapoor et al. — Beyond the Protocol: Attack Vectors in the MCP Ecosystem (TSE ’26)',
      'Burns et al. — MCP Safety Audit (SPIE ’26)',
      'Venkiteela — The New Interoperability Paradigm (Elsevier ’25)',
      'Adhikari et al. — LLM-enhanced Air Quality Monitoring via MCP (IEEE ISAECT ’25)',
      'Han et al. — Securing MCP-based Agent Workflows (PACMI ’25)',
      'First-glance study — Security & Maintainability of MCP Servers (ACM ’26)',
      'NSA AI Security Center — Security Design Considerations for AI Automation (’26)',
      'Anthropic — Model Context Protocol Specification (’24)',
    ],
  },
]
