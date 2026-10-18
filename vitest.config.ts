import { defineConfig } from 'vitest/config';
export default defineConfig({test:{environment:'jsdom',include:['packages/react/tests/**/*.test.tsx','packages/react/tests/**/*.test.ts'],setupFiles:['./packages/react/tests/setup.ts']}});
