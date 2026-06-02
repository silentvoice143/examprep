import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.examedge.app',
  appName: 'ExamEdge',
  webDir: 'out',
  server: {
    url: 'http://localhost:3000',
    cleartext: false,
  },
};

export default config;
