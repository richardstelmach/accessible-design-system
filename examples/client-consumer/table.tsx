import React, {useState} from 'react';
import {Badge, Button, Checkbox, Link, Select, Table} from '@owla11y/react';
import './table.css';
const columns = ['Plan','Members','Projects','Storage','History','Support','Exports','Audit log'];
export function TablePreview() {
  const [wide,setWide]=useState(false),[hidden,setHidden]=useState(false),[rtl,setRtl]=useState(false),[long,setLong]=useState(false);
  const [example,setExample]=useState('reference');
  return <main className="owla11y-preview table-review">
    <header><p>OwlA11y · local component candidate</p><h1>Table</h1><p>Compare related information with native row and column headers. One neutral treatment, using existing tokens.</p></header>
    <div className="table-review__controls">
      <Select label="Example" name="table-example" value={example} onChange={e=>setExample(e.target.value||'reference')}><option value="">Choose an example</option><option value="reference">Component reference</option><option value="comparison">Plan comparison</option></Select>
      <Checkbox name="table-wide" value="yes" label="Wide content" checked={wide} onChange={e=>setWide(e.target.checked)}/>
      <Checkbox name="table-caption" value="yes" label="Visually hidden caption" checked={hidden} onChange={e=>setHidden(e.target.checked)}/>
      <Checkbox name="table-long" value="yes" label="Long content" checked={long} onChange={e=>setLong(e.target.checked)}/>
      <Checkbox name="table-rtl" value="yes" label="Right-to-left layout" checked={rtl} onChange={e=>setRtl(e.target.checked)}/>
    </div>
    <section aria-labelledby="table-example-title" dir={rtl?'rtl':'ltr'}>
      <h2 id="table-example-title">{example==='reference'?'Component reference':'Plan comparison'}</h2>
      <p>Cells wrap naturally. When the table needs more room, its viewport can scroll horizontally. Tab directly to an overflowing table and use the arrow keys; links and controls keep their normal keyboard behaviour.</p>
      <Button id="table-before">Before the table</Button>
      <div className="table-review__sample">
      {example==='reference'?<Table id="reference-table" caption={long?'Component properties, defaults and responsibilities for authors integrating this component in a translated application':'Button props and defaults'} captionVisibility={hidden?'visually-hidden':'visible'} style={wide?{minWidth:'64rem'}:undefined}>
        <thead><tr><th scope="col">Property</th><th scope="col">Default</th><th scope="col">Description</th><th scope="col">Reference</th></tr></thead>
        <tbody><tr><th scope="row"><code>variant</code></th><td>default</td><td>{long?'Averylongunbrokenidentifierthatmustremainreadableandwrapwithoutlosingitsheaderassociation':'Choose the visual emphasis for the action.'}</td><td><Link href="#table-guidance">Usage guidance</Link></td></tr>
          <tr><th scope="row"><code>disabled</code></th><td>false</td><td>Prevents activation and native form submission.</td><td><Badge label="Optional" tone="neutral"/></td></tr>
          <tr><th scope="row"><code>children</code></th><td>Required</td><td>Supply a concise visible label describing the action.</td><td>Plain text or supported content</td></tr></tbody>
      </Table>:<Table id="comparison-table" caption="Workspace plan comparison" captionVisibility={hidden?'visually-hidden':'visible'} style={wide?{minWidth:'72rem'}:undefined}>
        <thead><tr>{columns.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{['Starter','Team','Organisation'].map((name,i)=><tr key={name}><th scope="row">{name}</th><td>{[3,20,'Unlimited'][i]}</td><td>{[5,50,'Unlimited'][i]}</td><td>{[10,100,500][i]} GB</td><td>{[30,90,365][i]} days</td><td>{i?'Priority':'Community'}</td><td>Included</td><td>{i?'Included':'Not included'}</td></tr>)}</tbody>
      </Table>}
      </div>
      <Button id="table-after">After the table</Button>
    </section>
    <section id="table-guidance"><h2>Usage and boundaries</h2><p>Use tables for meaningful relationships across rows and columns. Use a list or description list when a grid does not help comparison. Static cells are not controls.</p><p>This candidate supports column and row headers, visible or visually hidden captions, and ordinary existing components inside cells. It does not provide sorting, selection, editing, sticky columns or data-grid keyboard navigation.</p><p>Table owns the caption and scroll viewport. The native table is the keyboard scroll target; its wrapper adds no group or landmark. Authors own cell content, accurate header scopes, surrounding headings and data. A hidden caption still names the native table; provide equivalent visible context nearby.</p><h2>Accessibility review</h2><p>Check table discovery and header announcements with your screen reader, narrow layouts, keyboard scroll entry and exit, zoom, and native cell links. Automated checks do not establish spoken delivery.</p></section>
  </main>;
}
