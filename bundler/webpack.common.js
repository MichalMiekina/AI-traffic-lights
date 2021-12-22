const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry:{
        script: path.resolve(__dirname, '../src/script.js'),
        home: path.resolve(__dirname, '../src/home.js'),
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
                chunks: ['home']

            }),
            new HtmlWebpackPlugin({
                filename: 'three.html',
                template: path.resolve(__dirname, '../src/three.html'),
                minify: true,
                chunks: ['script']

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
                    use:
                        [
                            'babel-loader'
                        ]
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
