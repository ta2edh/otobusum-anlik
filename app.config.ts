import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'Otobüsüm Anlık',
  slug: 'otobusum-anlik',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  scheme: 'otobusum-anlik',
  userInterfaceStyle: 'automatic',
  newArchEnabled: false,
  extra: {
    eas: {
      projectId: '13cc0847-9f39-4aab-90d9-375e12df5087',
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.otobusum.anlik',
    buildNumber: '1',
    icon: './src/assets/icon.png',
    requireFullScreen: false,
    userInterfaceStyle: 'automatic',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'Bu uygulama konumunuzu otobüs duraklarını ve rotalarını göstermek için kullanır.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'Bu uygulama konumunuzu otobüs duraklarını ve rotalarını göstermek için kullanır.',
      CFBundleDisplayName: 'Otobüsüm Anlık',
      LSApplicationQueriesSchemes: ['maps', 'http', 'https'],
      ITSAppUsesNonExemptEncryption: false,
      UILaunchStoryboardName: 'SplashScreen',
      UIRequiredDeviceCapabilities: ['arm64'],
      UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
      UISupportedInterfaceOrientations_iPad: [
        'UIInterfaceOrientationPortrait',
        'UIInterfaceOrientationPortraitUpsideDown',
        'UIInterfaceOrientationLandscapeLeft',
        'UIInterfaceOrientationLandscapeRight'
      ],
      UIViewControllerBasedStatusBarAppearance: false,
      UIStatusBarStyle: 'UIStatusBarStyleDefault'
    },
    associatedDomains: ['applinks:otobusum-anlik.app'],
    splash: {
      image: './src/assets/splash.png',
      backgroundColor: '#0a0a0a',
      resizeMode: 'contain',
      hideOnLaunch: false
    },
    usesAppleSignIn: false
  },
  updates: {
    url: '',
    requestHeaders: {
      'expo-channel-name': 'production',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: [
    'expo-dev-client',
    'expo-router',
    'expo-localization',
    'expo-location',
    [
      'expo-splash-screen',
      {
        image: './src/assets/splash.png',
        backgroundColor: '#d8d8d8',
        resizeMode: 'contain'
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
}

export default config
