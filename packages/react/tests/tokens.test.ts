import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
it('ships complete CSS references and responsive font aliases',()=>{const css=readFileSync('packages/react/dist/styles.css','utf8');const refs=[...css.matchAll(/var\((--[\w-]+)/g)].map(m=>m[1]);const definitions=new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));expect(refs.filter(ref=>!definitions.has(ref))).toEqual([]);expect(css).toContain('--component-button-typography-default-base-fontFamily: var(--typography-family-sans)');expect(css).toContain('@media (min-width: 48rem)');expect(css).toContain('@media (min-width: 64rem)');expect(css).not.toMatch(/"\{[^}]+\}"/);});

it('preserves the monospace stack as a CSS family list',()=>{const css=readFileSync('packages/react/dist/styles.css','utf8');expect(css).toContain('--typography-family-mono: ui-monospace, SFMono-Regular, Consolas, monospace;');expect(css).not.toContain('"ui-monospace,');expect(css).toContain('--typography-code-fontFamily: var(--typography-family-mono)');});

import {projectFigmaFontFamilies} from '../../../scripts/figma-font-families.mjs';
const fontMapping = JSON.parse(readFileSync('tokens/figma/font-family-mapping.json','utf8'));
const rawTokens = () => JSON.parse(readFileSync('tokens/compiled/tokens.raw.json','utf8'));
it('projects only the Studio font family while preserving raw values, aliases and metadata',()=>{
  const raw=rawTokens(), projected=structuredClone(raw), original=structuredClone(raw.typography.family.mono);
  expect(projectFigmaFontFamilies(projected,fontMapping)).toBe(1);
  expect(raw.typography.family.mono).toEqual(original);
  expect(projected.typography.family.mono).toEqual({...original,$value:'Roboto Mono'});
  expect(projected.typography.code.$value.fontFamily).toBe('{typography.family.mono}');
  const studio=JSON.parse(readFileSync('tokens/compiled/tokens.studio.json','utf8')).global;
  expect(studio.typography.family.mono.$value).toBe('Roboto Mono');
  expect(raw.typography.family.mono.$value).toBe(fontMapping.families[0].expectedWebValue);
});
it('fails before changing any token when a stack is unmapped, duplicated, stale or points at a missing family',()=>{
  const badMappings=[{schemaVersion:1,families:[]}, {...fontMapping,families:[...fontMapping.families,...fontMapping.families]},
    {...fontMapping,families:[{...fontMapping.families[0],expectedWebValue:'different'}]},
    {...fontMapping,families:[{...fontMapping.families[0],source:'missing.font'}]},
    {...fontMapping,families:[{...fontMapping.families[0],figmaValue:'Roboto Mono, monospace'}]},
    {...fontMapping,families:[{...fontMapping.families[0],reason:''}]}];
  for(const mapping of badMappings){const raw=rawTokens(),before=structuredClone(raw);expect(()=>projectFigmaFontFamilies(raw,mapping)).toThrow();expect(raw).toEqual(before);}
});
