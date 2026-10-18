import { copyFileSync } from 'node:fs';
copyFileSync('packages/react/generated/tokens.css','packages/react/dist/tokens.css');
const {readFileSync,writeFileSync}=await import('node:fs');
writeFileSync('packages/react/dist/styles.css',readFileSync('packages/react/generated/tokens.css','utf8')+'\n'+readFileSync('packages/react/src/styles/components.css','utf8'));
copyFileSync('LICENSE','packages/react/LICENSE');
