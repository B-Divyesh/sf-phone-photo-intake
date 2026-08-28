import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.sociobot.phonephotointake',
  appName: 'Photo Intake Receipt',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  android: { backgroundColor: '#F4F0E6' },
};

export default config;
