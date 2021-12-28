const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    resolve: {
        modules: ['node_modules'],
        fallback: {
            "http": false,
            "https": false,
        }
    },
    entry:{
        animation: path.resolve(__dirname, '../src/js/animation.js'),
        index: path.resolve(__dirname, '../src/js/index.js'),
        plots: path.resolve(__dirname, '../src/js/plots.js'),
    },
    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../static') }
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                minify: true,
                chunks: ['index']

            }),
            new HtmlWebpackPlugin({
                filename: 'three',
                template: path.resolve(__dirname, '../src/three.html'),
                minify: true,
                chunks: ['animation']

            }),
            new HtmlWebpackPlugin({
                filename: 'plots',
                template: path.resolve(__dirname, '../src/plots.html'),
                minify: true,
                chunks: ['plots']
            }),
            new MiniCSSExtractPlugin()
        ],
    module:
    {
        rules:
            [
                // HTML
                {
                    test: /\.(html)$/,
                    use: ['html-loader']
                },

                // JS
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'ify-loader',

                },

                // CSS
                {
                    test: /\.css$/,
                    use:
                        [
                            MiniCSSExtractPlugin.loader,
                            'css-loader'
                        ]
                },

                // Images
                {
                    test: /\.(jpg|png|gif|svg)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options:
                                {
                                    name: '[name].[ext]',
                                    outputPath: 'img/',
                                    publicPath: 'img/'
                                }
                            }
                        ]
                },

                // Fonts
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options:
                                {

                                    outputPath: 'assets/fonts/'
                                }
                            }
                        ]
                }
            ]
    }
}
