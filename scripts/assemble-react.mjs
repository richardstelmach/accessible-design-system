import { copyFileSync } from 'node:fs';
copyFileSync('packages/react/generated/tokens.css','packages/react/dist/tokens.css');
const {readFileSync,writeFileSync}=await import('node:fs');
const tokens=JSON.parse(readFileSync('tokens/compiled/tokens.raw.json','utf8'));
const cardThreshold=tokens.component.card.layout.horizontalMinWidth.$value;
if(typeof cardThreshold!=='string'||!/^\d+(?:\.\d+)?(?:rem|px|em)$/.test(cardThreshold))throw Error('Invalid canonical Card container threshold');
writeFileSync('packages/react/dist/styles.css',readFileSync('packages/react/generated/tokens.css','utf8')+'\n'+readFileSync('packages/react/src/styles/components.css','utf8').replaceAll('__OWLA11Y_CARD_HORIZONTAL_MIN_WIDTH__',cardThreshold));
copyFileSync('LICENSE','packages/react/LICENSE');
