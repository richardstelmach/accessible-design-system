import React, {useState} from 'react';
import {CodeBlock, Checkbox, Select, Button} from '@owla11y/react';
export function CodeBlockPreview() {
  const [copyable,setCopyable]=useState(true), [sample,setSample]=useState('short');
  const [copies,setCopies]=useState(0);
  const examples: Record<string,string> = {
    short:"import '@owla11y/react/styles.css';",
    long:'const components = [' + Array.from({length:18},(_,i)=>`"Component${i}"`).join(', ') + '];',
    multiline:'\nimport { Button } from "@owla11y/react";\n\nexport function Save() {\n  return <Button>Save changes</Button>;\n}\n',
    empty:'',
  };
  return <main className="owla11y-preview" style={{maxWidth:'60rem',margin:'2rem auto',padding:'1rem'}}>
    <h1>CodeBlock comparison</h1>
    <p>Plain selectable code, visible feedback and measured keyboard overflow. Screen-reader release acceptance is pending.</p>
    <Select label="Example" name="example" value={sample} onChange={e=>setSample(e.target.value)}>
      <option value="">Choose an example</option><option value="short">Short</option><option value="long">Long line</option><option value="multiline">Multiple lines</option><option value="empty">Empty code</option>
    </Select>
    <Checkbox label="Offer copy" name="copyable" value="yes" checked={copyable} onChange={e=>setCopyable(e.target.checked)}/>
    <p><Button onClick={()=>setSample('long')}>Show long code</Button></p>
    <section aria-label="Interactive example" id="code-example"><CodeBlock label="React" code={examples[sample] ?? ''} copyable={copyable} onCopy={()=>setCopies(n=>n+1)}/></section>
    <p>Successful copies observed by the consumer: {copies}</p>
    <h2>Without copy</h2><CodeBlock label="CSS" code=".theme { color: inherit; }" copyable={false}/>
    <h2>Long label and text</h2><CodeBlock label="An unusually long localised language and context label for this installation example" code={examples.long!}/>
    <p><Button>After code</Button></p>
  </main>;
}
