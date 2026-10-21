import { rmSync } from 'node:fs';
// Dist is generated output. Remove stale modules before compiling renamed sources.
rmSync('packages/react/dist', { recursive: true, force: true });
