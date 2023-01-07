import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibeviewer.app',
  appName: 'Vibe Viewer',
  webDir: 'dist/vibeViewer',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_logo_text_on_dark",
      iconColor: "#F43F5E",
      sound: "beep.wav"
    }
  }
};

export default config;
