import {mkdtempSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd();const run=(cmd,args,cwd)=>execFileSync(cmd,args,{cwd,stdio:'pipe',encoding:'utf8'});
const temp=mkdtempSync(join(tmpdir(),'owla11y-consumer-'));
try {
 const packed=JSON.parse(run('npm',['pack','./packages/react','--json','--pack-destination',temp],root))[0];
 const files=packed.files.map(f=>f.path);for(const expected of ['dist/index.js','dist/index.d.ts','dist/styles.css','LICENSE'])if(!files.includes(expected))throw Error(`Package missing ${expected}`);
 if(files.some(f=>f.includes('tests/')||f.includes('contracts/')||f.includes('node_modules')))throw Error('Private implementation files packed');
 for(const major of ['18','19']) {
  const {mkdirSync}=await import('node:fs');const dir=join(temp,'react'+major);mkdirSync(dir);
  writeFileSync(join(dir,'package.json'),JSON.stringify({private:true,type:'module'}));
  const version=major==='18'?'18.3.1':'19';
  run('npm',['install','--ignore-scripts','--legacy-peer-deps','--no-audit','--no-fund',join(temp,packed.filename),`react@${version}`,`react-dom@${version}`,`@types/react@${major}`,`@types/react-dom@${major}`,'jsdom@26'],dir);
  // Same compile-checked positive and negative examples, through package declarations.
  writeFileSync(join(dir,'types.tsx'),readFileSync('packages/react/tests/types.tsx','utf8').replace("'../src/index.js'","'@owla11y/react'"));
  writeFileSync(join(dir,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',jsx:'react-jsx',strict:true,noEmit:true,skipLibCheck:false},include:['types.tsx']}));
  run('node',[resolve('node_modules/typescript/bin/tsc'),'-p',join(dir,'tsconfig.json')],dir);
  writeFileSync(join(dir,'verify.mjs'),`
import React from 'react';import {renderToString} from 'react-dom/server';import {hydrateRoot} from 'react-dom/client';import {JSDOM} from 'jsdom';import assert from 'node:assert/strict';import {Button,IconButton,Link,TextInput} from '@owla11y/react';
const h=React.createElement;const app=h('form',null,h(TextInput,{label:'Name',name:'name',defaultValue:'Ada'}),h(Button,null,'Save'),h(IconButton,{'aria-label':'Add',icon:h('svg')}),h(Link,{href:'/help'},'Help'));
const html=renderToString(app);const dom=new JSDOM('<div id="root">'+html+'</div>',{url:'https://example.test/'});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.HTMLElement=dom.window.HTMLElement;const root=document.getElementById('root');const id=root.querySelector('input').id;const errors=[];const hydrated=hydrateRoot(root,app,{onRecoverableError:e=>errors.push(e)});await new Promise(r=>setTimeout(r,60));assert.equal(root.querySelector('input').id,id);assert.deepEqual(errors,[]);assert.equal(root.querySelector('button').type,'button');const input=root.querySelector('input');input.value='Changed';root.querySelector('form').reset();assert.equal(input.value,'Ada');assert.equal(root.querySelector('label').htmlFor,id);assert.equal(root.querySelector('a').getAttribute('href'),'/help');hydrated.unmount();console.log('Packed package: React '+React.version+' types, SSR, hydration, IDs and native reset passed');
`);
  console.log(run('node',['verify.mjs'],dir).trim());
  const css=readFileSync(join(dir,'node_modules/@owla11y/react/dist/styles.css'),'utf8');if(!css.includes('--form-control-background'))throw Error('Styles missing');
 }
 console.log(`Package contents verified: ${files.length} files. No publication performed.`);
} catch(error){console.error(error.stdout?.toString()||'',error.stderr?.toString()||'');throw error;}finally{rmSync(temp,{recursive:true,force:true});}
