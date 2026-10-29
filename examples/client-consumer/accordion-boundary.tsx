/// <reference types="vite/client" />
// Package-backed review of optional item outlines, gapless stacks and Card composition.
import {useState} from 'react';
import {Accordion, Badge, Button, Card, Checkbox, Link} from '@owla11y/react';
import './accordion-boundary-review.css';

const views = [
  {key: 'all', name: 'All examples'},
  {key: 'page', name: 'On the page'},
  {key: 'card-heading', name: 'Card with a heading'},
  {key: 'card-content', name: 'Content-only Card'},
] as const;
type View = typeof views[number]['key'];
const questions = [
  {id: 'install', title: 'How do I add the library to my project?', content: <><p>Install the reviewed package, import its stylesheet and use the existing components in your page.</p><p><Link href="https://github.com/richardstelmach/accessible-design-system/blob/main/packages/react/README.md">Read the installation guide</Link></p></>},
  {id: 'keyboard', title: 'What should I check with a keyboard?', content: <p>Use Tab to reach each heading button. Press Enter or Space to open or close it. Opening one item leaves the others as you chose them.</p>},
  {id: 'content', title: 'Can a longer question wrap onto more than one line without hiding the complete title?', content: <p>Yes. The title wraps, the caret keeps its size, and the item grows with its content. Links inside open content remain in the ordinary keyboard order.</p>},
];

function Stack({id, headingLevel, outlined}: {id: string; headingLevel: 3 | 4; outlined: boolean}) {
  return <Accordion id={id} headingLevel={headingLevel} titleStyle="h5"
    outlined={outlined}
    defaultExpandedIds={['install']} items={questions}/>;
}

export function PageExample({outlined}: {outlined: boolean}) {
  return <div className="accordion-boundary-review__page-example">
    <h3>Common questions</h3>
    <p>Find the installation and testing information relevant to your project.</p>
    <Stack id="boundary-page" headingLevel={4} outlined={outlined}/>
  </div>;
}
export function CardHeadingExample({outlined}: {outlined: boolean}) {
  return <Card title="Common questions" headingLevel={3} titleStyle="compact">
    <p>Find the installation and testing information relevant to your project.</p>
    <Stack id="boundary-card-heading" headingLevel={4} outlined={outlined}/>
  </Card>;
}
export function CardContentExample({outlined}: {outlined: boolean}) {
  return <div>
    <h3>Common questions</h3>
    <p>The heading can also sit outside the container.</p>
    <Card><Stack id="boundary-card-content" headingLevel={4} outlined={outlined}/></Card>
  </div>;
}

export function AccordionBoundaryPreview() {
  const params = new URLSearchParams(location.search);
  const initial = params.get('variant');
  const [view, setView] = useState<View>(views.some(v => v.key === initial) ? initial as View : 'all');
  const [standaloneOutline, setStandaloneOutline] = useState(true);
  const [stackOutline, setStackOutline] = useState(false);
  const [standaloneOpen, setStandaloneOpen] = useState<readonly string[]>([]);
  const choose = (next: View) => {
    setView(next);
    const url = new URL(location.href); url.searchParams.set('variant', next);
    history.replaceState(null, '', url);
  };
  const cycle = (direction: number) => choose(views[(views.findIndex(v => v.key === view) + direction + views.length) % views.length].key);
  const show = (key: View) => view === 'all' || view === key;
  return <main className="owla11y-preview accordion-boundary-review">
    <header className="accordion-boundary-review__intro">
      <Badge label="Accordion update for review"/>
      <h1>Accordion boundaries</h1>
      <p className="accordion-boundary-review__lead">A clear outline for a standalone disclosure. A continuous set of dividers for related questions.</p>
      <p>These examples use the real Accordion, Card, Link and controls. The borders and gapless stacks now come from the package. Card remains an optional containing composition.</p>
    </header>

    <div className="accordion-boundary-review__controls">
      <Checkbox name="standalone-outline" value="outlined" label="Outline the standalone item" checked={standaloneOutline} onChange={e => setStandaloneOutline(e.target.checked)}/>
      <Checkbox name="stack-outline" value="outlined" label="Compare outlines on every stacked item" checked={stackOutline} onChange={e => setStackOutline(e.target.checked)}/>
      <p>Stacked items always touch. The second option is a comparison; dividers alone are the proposed stacked treatment.</p>
    </div>

    <section className="accordion-boundary-review__standalone">
      <h2 id="standalone-heading">1. Standalone disclosure</h2>
      <p>A single item between other page content. Switch its outline off to compare how easy it is to find.</p>
      <div className="accordion-boundary-review__document">
        <h3>Getting started</h3>
        <p>Bring the library into your project, then build with familiar components.</p>
        <Accordion id="boundary-standalone" headingLevel={4} titleStyle="h5"
          expandedIds={standaloneOpen} onExpandedChange={setStandaloneOpen}
          outlined={standaloneOutline}
          items={[{id: 'contents', title: 'On this page', content: <ul className="accordion-boundary-review__contents"><li><Link href="?accordion-boundary-review&variant=page#page-composition">Questions on the page</Link></li><li><Link href="?accordion-boundary-review&variant=card-heading#card-heading-composition">Questions in a Card with a heading</Link></li><li><Link href="?accordion-boundary-review&variant=card-content#card-content-composition">Questions in a content-only Card</Link></li></ul>}]}/>
        <p className="accordion-boundary-review__after">Use existing components and tokens to keep your interface consistent as it grows.</p>
      </div>
    </section>

    <section className="accordion-boundary-review__compositions">
      <h2 id="compositions-heading">2. Stacked items and their container</h2>
      <p>The same three items in each example, with the first open. Try opening several at once. A shared boundary is one line, and there is no space between neighbouring items.</p>
      <div className="accordion-boundary-review__grid" data-comparison={view === 'all'}>
        {show('page') && <section id="page-composition" className="accordion-boundary-review__example"><div className="accordion-boundary-review__label">A · Directly on the page</div><PageExample outlined={stackOutline}/></section>}
        {show('card-heading') && <section id="card-heading-composition" className="accordion-boundary-review__example"><div className="accordion-boundary-review__label">B · Existing Card with its heading</div><CardHeadingExample outlined={stackOutline}/></section>}
        {show('card-content') && <section id="card-content-composition" className="accordion-boundary-review__example"><div className="accordion-boundary-review__label">C · Existing Card without a title or image</div><CardContentExample outlined={stackOutline}/></section>}
      </div>
    </section>

    <section className="accordion-boundary-review__notes">
      <h2>What this would mean for the system</h2>
      <ul>
        <li>The item outline is optional. Standalone items are its recommended main use case; consumers can also use it in other compositions.</li>
        <li>A stacked set has no gaps and uses top, shared and bottom dividers. Opening an item keeps its content inside that item’s boundary.</li>
        <li>Card already provides a non-interactive content shell with optional title, image and actions. Its existing content padding remains.</li>
        <li>The container does not add a Tab stop or landmark. The heading structure comes from the page; disclosure buttons keep their existing names, states and keyboard behaviour.</li>
        <li>Side menu Accordion groups retain their reviewed appearance through the existing navigation composition.</li>
      </ul>
      <p>No new tokens were added. The existing item-gap alias now maps to spacing.0; the outline reuses default border, thin border width, large radius, surface and focus roles. The optional outlined boolean defaults to false.</p>
    </section>

    {import.meta.env.DEV && <nav className="accordion-boundary-review__switcher" aria-label="Comparison views"
      onKeyDown={e => {if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault();cycle(e.key === 'ArrowRight' ? 1 : -1);}}}>
      <Button onClick={() => cycle(-1)} aria-label="Previous comparison view">←</Button>
      <span aria-live="polite">{views.find(v => v.key === view)!.name}</span>
      <Button onClick={() => cycle(1)} aria-label="Next comparison view">→</Button>
      <Link href="?accordion-boundary-review&variant=all">Show all</Link>
    </nav>}
  </main>;
}
