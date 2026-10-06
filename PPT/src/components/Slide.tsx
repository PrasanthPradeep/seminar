import type { SlideMeta } from '../data/presentation'
import { useSlideFit } from '../hooks/useSlideFit'
import { AgentFlow } from './AgentFlow'
import {
  AlgorithmDiagram,
  ArchitectureDiagram,
  ExistingDiagram,
  HubDiagram,
  MxnDiagram,
  PipelineDiagram,
  SamosDiagram,
  ThreatDiagram,
  WorkflowDiagram,
} from './diagrams'
import {
  Cards,
  ChainList,
  Columns,
  CompareTable,
  FlowTabs,
  Footnote,
  Quote,
  References,
  StatChips,
  StepsFlow,
} from './blocks'

interface SlideProps {
  slide: SlideMeta
  isActive: boolean
}

function Visual({ name }: { name: NonNullable<SlideMeta['visual']> }) {
  switch (name) {
    case 'mxn':
      return <MxnDiagram />
    case 'existing':
      return <ExistingDiagram />
    case 'architecture':
      return <ArchitectureDiagram />
    case 'algorithm':
      return <AlgorithmDiagram />
    case 'workflow':
      return <WorkflowDiagram />
    case 'hub':
      return <HubDiagram />
    case 'threat':
      return <ThreatDiagram />
    case 'pipeline':
      return <PipelineDiagram />
    case 'samos':
      return <SamosDiagram />
    case 'agent-flow':
      return <AgentFlow />
  }
}

/**
 * 16:9-ish viewport slide.
 * - Slide 01 keeps its original centered title composition untouched.
 * - Content slides pin kicker + title to the top; the body stays
 *   vertically centered in the remaining space.
 */
export function Slide({ slide, isActive }: SlideProps) {
  const isTitle = slide.index === 1
  // Re-measure whenever this slide becomes the visible one.
  const fitRef = useSlideFit<HTMLElement>(isActive)
  const showSplit = slide.visual === 'agent-flow' && slide.bullets
  const showArchitectureSplit = slide.visual === 'architecture' && slide.bullets
  const showWorkflowSplit = slide.visual === 'workflow' && slide.bullets
  const showThreatSplit = slide.visual === 'threat' && slide.bullets
  const dense =
    !!slide.table ||
    !!slide.references ||
    !!slide.cards ||
    !!slide.flows ||
    (slide.columns?.length ?? 0) >= 3 ||
    (slide.bullets?.length ?? 0) > 6 ||
    (slide.steps?.length ?? 0) > 6 ||
    (slide.stats?.length ?? 0) > 4
  const split =
    showSplit || showArchitectureSplit || showWorkflowSplit || showThreatSplit

  if (isTitle) {
    return (
      <section
        id={`slide-${slide.index}`}
        ref={fitRef}
        data-index={slide.index}
        data-active={isActive}
        className="slide slide--title"
        aria-label={`Slide ${slide.index} of 22: ${slide.title}`}
      >
        <div className="slide-inner">
          {slide.logo && (
            <img
              className="slide-logo"
              src={slide.logo}
              alt="College of Engineering Karunagappally logo"
            />
          )}
          {slide.subtitle && <p className="slide-kicker">{slide.subtitle}</p>}
          <h2 className="slide-title">{slide.title}</h2>
          {slide.tagline && <p className="slide-tagline">{slide.tagline}</p>}
          {slide.presenter && (
            <p className="slide-presenter">
              {slide.presenter}
              {slide.affiliation && (
                <>
                  <br />
                  <span className="slide-affiliation">{slide.affiliation}</span>
                </>
              )}
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      id={`slide-${slide.index}`}
      ref={fitRef}
      data-index={slide.index}
      data-active={isActive}
      className={
        'slide slide--content' +
        (split ? ' slide--wide' : '') +
        (dense && !split ? ' slide--dense' : '')
      }
      aria-label={`Slide ${slide.index} of 22: ${slide.title}`}
    >
      <div className="slide-fit">
        <header className="slide-header">
          {slide.subtitle && <p className="slide-kicker">{slide.subtitle}</p>}
          <h2 className="slide-title">{slide.title}</h2>
        </header>
        <div className="slide-body">
        {showSplit ? (
          <div className="slide-split">
            <ul className="slide-bullets">
              {slide.bullets!.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <AgentFlow />
          </div>
        ) : showArchitectureSplit ? (
          <div className="slide-split slide-split--architecture">
            <ul className="slide-bullets">
              {slide.bullets!.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="slide-visual">
              <ArchitectureDiagram />
            </div>
          </div>
        ) : showWorkflowSplit ? (
          <div className="slide-split slide-split--workflow">
            <ul className="slide-bullets">
              {slide.bullets!.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="slide-visual">
              <WorkflowDiagram />
            </div>
          </div>
        ) : showThreatSplit ? (
          <div className="slide-split slide-split--threat">
            <ul className="slide-bullets">
              {slide.bullets!.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="slide-visual">
              <ThreatDiagram />
            </div>
          </div>
        ) : (
          <>
            {slide.visual && (
              <div className="slide-visual">
                <Visual name={slide.visual} />
              </div>
            )}
            {slide.bullets && (
              <ul
                className={
                  'slide-bullets' +
                  (slide.bullets.length > 8 ? ' slide-bullets--cols' : '')
                }
              >
                {slide.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {slide.steps && <StepsFlow steps={slide.steps} />}
            {slide.cards && <Cards cards={slide.cards} />}
            {slide.table && <CompareTable table={slide.table} />}
            {slide.columns && <Columns columns={slide.columns} />}
            {slide.stats && <StatChips stats={slide.stats} />}
            {slide.chains && <ChainList chains={slide.chains} />}
            {slide.flows && <FlowTabs flows={slide.flows} />}
            {slide.references && <References references={slide.references} />}
            {!slide.visual &&
              !slide.bullets &&
              !slide.steps &&
              !slide.cards &&
              !slide.table &&
              !slide.columns &&
              !slide.stats &&
              !slide.chains &&
              !slide.flows &&
              !slide.references && (
                <p className="slide-placeholder">Content will be added here.</p>
              )}
          </>
        )}
        {slide.quote && <Quote text={slide.quote} />}
        {slide.footnote && <Footnote text={slide.footnote} />}
        </div>
      </div>
    </section>
  )
}
