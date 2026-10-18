import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./packages/react/tests/browser',workers:1,use:{baseURL:'http://127.0.0.1:4180',launchOptions:{executablePath:process.env.OWLA11Y_BROWSER_EXECUTABLE}},webServer:{command:'npm run dev -- --port 4180 --strictPort --force',url:'http://127.0.0.1:4180',reuseExistingServer:false},reporter:'list'});
