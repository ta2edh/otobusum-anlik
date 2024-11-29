import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'Otobüsüm Anlık',
  slug: 'otobusum-anlik',
  version: '1.0.3',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'otobusum-anlik',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#0a0a0a',
  },
  extra: {
    eas: {
      projectId: '2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    },
  },
  ios: {
    supportsTablet: true,
  },
  updates: {
    url: 'https://u.expo.dev/2c43cbc3-221c-4ca7-ac8c-ebfcc102426c',
    requestHeaders: {
      'expo-channel-name': 'production',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  androidStatusBar: {
    barStyle: 'light-content',
    translucent: true,
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_MAP_API,
      },
    },
    softwareKeyboardLayoutMode: 'pan',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0a0a',
    },
    package: 'com.anonymous.otobusumanlik',
  },
  plugins: ['expo-router', 'expo-localization', 'expo-location'],
  experiments: {
    typedRoutes: true,
  },
}

export default config
