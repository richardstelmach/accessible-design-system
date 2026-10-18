import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import {Parity} from './parity';
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button,IconButton,Link,TextInput} from '@owla11y/react';
import '@owla11y/react/styles.css';
function App(){const [value,setValue]=useState(''); return <main style={{maxWidth:'40rem',margin:'2rem auto',padding:'1rem',fontFamily:'system-ui'}}><h1>OwlA11y core components</h1><p>Local development preview. These four components are implemented; the complete library is still in development.</p><form onReset={()=>setValue('')} onSubmit={e=>{e.preventDefault();alert('Submitted')}}><TextInput label="Email address" name="email" type="email" autoComplete="email" helperText="Use an address you can access." value={value} onChange={e=>setValue(e.target.value)}/><p><Button type="submit" variant="primary">Continue</Button> <Button type="reset">Reset</Button></p></form><p><IconButton aria-label="Add item" icon={<svg viewBox="0 0 24 24" focusable="false"><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2"/></svg>}/></p><p><Link href="https://github.com/richardstelmach/accessible-design-system">OwlA11y repository</Link></p><TextInput label="Reference" name="reference" requirement="optional" error={{message:'Enter a valid reference.'}}/><p><Button disabled>Unavailable</Button></p></main>};
createRoot(document.getElementById('root')!).render(location.search.includes('parity') ? <Parity/> : <App/>);
