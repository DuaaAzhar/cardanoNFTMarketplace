const { environment } = require('@rails/webpacker')
const webpack = require('webpack')
const path = require('path')

environment.loaders.prepend('sass', {
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader',
    {
      loader: 'sass-resources-loader',
      options: {
        resources: [
          path.resolve("app/javascript/src/sass", "styles.scss")
        ]
      }
    }
  ]
})

environment.plugins.prepend('Provide', new webpack.ProvidePlugin({
    $: 'jquery',
    JQuery: 'jquery',
    Popper: ['popper.js', 'default']
  })
)

module.exports = environment
