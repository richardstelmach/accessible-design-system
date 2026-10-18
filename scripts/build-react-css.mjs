import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const tree=JSON.parse(readFileSync('tokens/compiled/tokens.raw.json','utf8'));
const leaves=new Map();
function walk(node,path=[]){if(node && typeof node==='object'){if('$value' in node)leaves.set(path.join('.'),node);else for(const [k,v] of Object.entries(node))if(!k.startsWith('$'))walk(v,[...path,k]);}}
walk(tree);
const slug=p=>p.replaceAll('.','-');
const names=new Map(),used=new Map();
for(const [path,node] of leaves){const syntax=node.$extensions?.['com.figma.codeSyntax']?.Web;const name=syntax?.match(/^var\((--[\w-]+)\)$/)?.[1] ?? `--${slug(path)}`;if(used.has(name)&&used.get(name)!==path)throw Error(`CSS collision: ${path} and ${used.get(name)}`);names.set(path,name);used.set(name,path);}
function resolve(path,seen=[]){if(seen.includes(path))throw Error(`Token cycle: ${path}`);const n=leaves.get(path);if(!n)throw Error(`Missing token ${path}`);const v=n.$value;const m=typeof v==='string'&&v.match(/^\{([^}]+)\}$/);return m?resolve(m[1],[...seen,path]):v;}
function scalar(value){if(typeof value==='string')return value.replace(/\{([^}]+)\}/g,(_,p)=>{if(!names.has(p))throw Error(`Missing alias ${p}`);return `var(${names.get(p)})`;});return String(value);}
const rules={base:[],md:[],lg:[]};
for(const [path,node] of leaves){const parts=path.split('.');const mode=['base','md','lg'].includes(parts.at(-1))?parts.at(-1):'base';const name=names.get(path);const value=resolve(path);let declarations=[];
 if(value && typeof value==='object'&&!Array.isArray(value)){if(node.$type!=='typography')continue;const raw=node.$value;for(const [key,v] of Object.entries(value)){const rawValue=typeof raw==='object'?raw[key]:v;declarations.push([`${name}-${key}`,key==='fontFamily' ? (typeof rawValue==='string' && /^\{[^}]+\}$/.test(rawValue) ? scalar(rawValue) : `"${rawValue}", system-ui, sans-serif`) : scalar(rawValue)]);}}
 else declarations.push([name,node.$type==='fontFamily'?`"${value}", system-ui, sans-serif`:scalar(node.$value)]);
 for(const [key,v] of declarations){rules.base.push(`${key}: ${v};`);if(parts.at(-1)===mode&&['base','md','lg'].includes(mode)){const responsiveName=key.replace(`-${mode}`, '');rules[mode].push(`${responsiveName}: var(${key});`);}}
}
const block=(lines)=>`:root, .owla11y-theme {\n${lines.map(l=>'  '+l).join('\n')}\n}`;
const get=p=>resolve(p);
const css='/* Generated from canonical tokens. Do not edit. */\n'+block(rules.base)+'\n'+['md','lg'].map(m=>`@media (min-width: ${get('breakpoint.'+m)}) {\n${block(rules[m])}\n}`).join('\n');
mkdirSync('packages/react/generated',{recursive:true});writeFileSync('packages/react/generated/tokens.css',css);
console.log(`Generated browser CSS from ${leaves.size} canonical tokens.`);
