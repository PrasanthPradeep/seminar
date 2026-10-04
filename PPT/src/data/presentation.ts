export interface SlideMeta {
  id: string
  index: number // 1-based
  title: string
  subtitle: string
  // Title-slide only: prominent tagline under the title, replacing the
  // "Content will be added here." placeholder.
  tagline?: string
  presenter?: string
  affiliation?: string
  // Title-slide only: logo image (path relative to the served root).
  logo?: string
}

// Milestone 1 skeleton: titles only, no real content yet.
// Content mapping happens in Milestone 4.
export const TOTAL_SLIDES = 22

export const SLIDES: SlideMeta[] = [
  {
    id: 'slide-01',
    index: 1,
    title: 'Model Context Protocol (MCP)',
    subtitle: 'Technical Seminar',
    tagline: 'Architecture and Contextual Interoperability for AI Systems',
    presenter: 'Prasanth P · KNP23CS086',
    affiliation: 'S7 CSB · Roll No. 26',
    logo: 'logo/college-logo.png',
  },
  { id: 'slide-02', index: 2, title: 'Introduction', subtitle: '02 — Introduction' },
  { id: 'slide-03', index: 3, title: 'Core Concepts', subtitle: '03 — Core Concepts' },
  { id: 'slide-04', index: 4, title: 'Problem Statement', subtitle: '04 — Problem Statement' },
  { id: 'slide-05', index: 5, title: 'Objectives', subtitle: '05 — Objectives' },
  { id: 'slide-06', index: 6, title: 'Existing System', subtitle: '06 — Existing System' },
  { id: 'slide-07', index: 7, title: 'Existing System — Advantages & Limitations', subtitle: '07 — Advantages & Limitations' },
  { id: 'slide-08', index: 8, title: 'Proposed System', subtitle: '08 — Proposed System' },
  { id: 'slide-09', index: 9, title: 'Proposed Architecture', subtitle: '09 — Proposed Architecture' },
  { id: 'slide-10', index: 10, title: 'Methodology — Overview', subtitle: '10 — Methodology Overview' },
  { id: 'slide-11', index: 11, title: 'Methodology — Component 1', subtitle: '11 — Component 1' },
  { id: 'slide-12', index: 12, title: 'Methodology — Component 2', subtitle: '12 — Component 2' },
  { id: 'slide-13', index: 13, title: 'Methodology — Component 3', subtitle: '13 — Component 3' },
  { id: 'slide-14', index: 14, title: 'System Workflow', subtitle: '14 — System Workflow' },
  { id: 'slide-15', index: 15, title: 'Implementation / Experimental Setup', subtitle: '15 — Implementation' },
  { id: 'slide-16', index: 16, title: 'Results', subtitle: '16 — Results' },
  { id: 'slide-17', index: 17, title: 'Discussion', subtitle: '17 — Discussion' },
  { id: 'slide-18', index: 18, title: 'Applications', subtitle: '18 — Applications' },
  { id: 'slide-19', index: 19, title: 'Advantages & Limitations', subtitle: '19 — Advantages & Limitations' },
  { id: 'slide-20', index: 20, title: 'Future Scope', subtitle: '20 — Future Scope' },
  { id: 'slide-21', index: 21, title: 'Conclusion', subtitle: '21 — Conclusion' },
  { id: 'slide-22', index: 22, title: 'References', subtitle: '22 — References' },
]
