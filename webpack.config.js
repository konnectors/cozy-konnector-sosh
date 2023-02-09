const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: 'main.js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'manifest.konnector' }, { from: 'assets' }]
    })
  ]
}
