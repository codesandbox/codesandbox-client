module.exports = {
  type: 'react-component',
  npm: {
    esModules: false,
    umd: false
  },
  webpack: {
    config(config) {
      config.entry = {
        demo: ['./demo/src/index.tsx']
      }
      config.resolve.extensions.push('.ts', '.tsx')
      config.module.rules.push({
        test: /\.tsx?$/,
        loader: 'ts-loader'
      })

      return config
    }
  }
}
