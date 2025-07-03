const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Path alias resolver ekle
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
}

// Production ve preview build'lerde optimizasyon
if (process.env.NODE_ENV === 'production' && 
    (process.env.EAS_BUILD_PROFILE === 'production' || process.env.EAS_BUILD_PROFILE === 'preview')) {
  config.transformer.minifierConfig = {
    // Terser optimizasyonları
    mangle: {
      keep_fnames: true,
    },
    compress: {
      drop_console: process.env.EAS_BUILD_PROFILE === 'production', // Sadece production'da console logları kaldır
      drop_debugger: true,
      // Production'da store hydration problemleri için console.warn'ları koru
      pure_funcs: process.env.EAS_BUILD_PROFILE === 'production' 
        ? ['console.log', 'console.info', 'console.debug'] 
        : [],
    },
  }
}

module.exports = config
