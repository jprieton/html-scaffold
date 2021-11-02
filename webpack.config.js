const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const cssnano = require("cssnano")
const autoprefixer = require("autoprefixer")
const CopyPlugin = require("copy-webpack-plugin");

const JS_DIR = path.resolve(__dirname, "src/js")
const BUILD_DIR = path.resolve(__dirname, "dist")

const entry = {
	"main": JS_DIR + "/index.js",
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
	// Copy the package files to the build directory when is 
	// required to use the package files separately from the build
	// new CopyPlugin({
	// 	patterns: [
	// 		// Example
	// 		{ from: "node_package/dist/", to: "vendor/node_package/", context: "node_modules" },
	// 	],
	// }),
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
