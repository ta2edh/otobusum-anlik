module.exports = function (api) {
  api.cache(true)
  
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ]
  
  // Console removal artık metro.config.js'de terser ile yapılıyor
  // Babel plugin'i kaldırıldı - daha güvenilir çözüm için metro.config.js'e bakın
  
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }]],
    plugins,
  }
}
