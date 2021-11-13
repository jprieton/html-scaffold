const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const cssnano = require("cssnano")
const autoprefixer = require("autoprefixer")
const CopyPlugin = require("copy-webpack-plugin");

const JS_DIR = path.resolve(__dirname, "src/js")
const BUILD_DIR = path.resolve(__dirname, "dist")

const entry = {
  "public": JS_DIR + "/public.js",
}
const output = {
  "path": BUILD_DIR,
  "filename": "js/[name].js"
}

const rules = [
  {
    "test": /\.js$/,
    "include": [JS_DIR],
    "exclude": /node_modules/,
    "use": "babel-loader"
  },
  {
    "test": /\.(scss|css)$/,
    "exclude": /node_modules/,
    "use": [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
        }
      },
      "postcss-loader",
      {
        loader: "sass-loader",
        options: {
          implementation: require("sass"),

          sassOptions: {
            fiber: false,
          }
        }
      },
    ],
  },
  {
    // Font files are included as assets in the build directory
    "test": /\.(woff|woff2)$/i,
    "exclude": /node_modules/,
    "type": 'asset/resource',
    "generator": {
      "filename": 'fonts/[hash][ext]'
    }
  },
  {
    // Images are optimized and included as assets in the build directory
    "test": /\.(png|jpg|jpeg|gif|svg)$/i,
    "type": 'asset/resource',
    "exclude": [
      path.resolve(__dirname, './node_modules'),
    ],
    "generator": {
      "filename": 'images/[hash][ext]'
    },
    "use": [
      {
        loader: "image-webpack-loader",
        options: {
          "mozjpeg": {
            "progressive": true,
            "quality": 65
          },
          "optipng": {
            "enabled": true,
          },
          "pngquant": {
            "quality": [0.65, 0.90],
            "speed": 4
          },
          "gifsicle": {
            "interlaced": false,
          },
          "webp": {
            "quality": 75
          }
        }
      }
    ]
  }
]

const plugins = (argv) => ([
  new CopyPlugin({
    patterns: [
      { from: "bootstrap/dist/", to: "vendor/bootstrap/", context: "node_modules" },
      { from: "owl.carousel/dist/", to: "vendor/owl.carousel/", context: "node_modules" },
      { from: "jquery/dist/", to: "vendor/jquery/", context: "node_modules" },
      { from: "popper.js/dist", to: "vendor/popper.js/", context: "node_modules/" },
      { from: "hover.css/css", to: "vendor/hover.css/", context: "node_modules/" },
      { from: "@fortawesome/fontawesome-free/css/", to: "vendor/fontawesome/css/", context: "node_modules" },
      { from: "@fortawesome/fontawesome-free/js/", to: "vendor/fontawesome/js/", context: "node_modules" },
      { from: "@fortawesome/fontawesome-free/webfonts/", to: "vendor/fontawesome/webfonts/", context: "node_modules" },
    ],
  }),
  new CleanWebpackPlugin({
    "cleanStaleWebpackAssets": ("production" === argv.mode)
  }),
  new MiniCssExtractPlugin({
    "filename": "css/[name].css"
  }),
])

module.exports = (env, argv) => ({
  "entry": entry,
  "output": output,
  "devtool": ("production" === argv.mode) ? false : "source-map",
  "module": {
    "rules": rules
  },
  "externals": {
    "jquery": 'jQuery',
  },
  "plugins": plugins(argv),
  "stats": "verbose"
})
