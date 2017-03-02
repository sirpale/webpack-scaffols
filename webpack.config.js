/**
 * Created by sirpale on 17/2/28.
 */
const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');


const DIST_DIR = path.resolve(__dirname, 'dist'),
    SRC_DIR = path.resolve(__dirname, 'src');

console.log('开始编译');

let config = {
    // devtool : 'cheap-module-eval-source-map',
    entry: {
        index: SRC_DIR + '/public/js/common/index.js',
        games: SRC_DIR + '/public/js/common/games.js'
    },
    output: {
        path: DIST_DIR,            // 发布文件地址
        filename: 'js/[name].js',  // 编译后的文件名字
        publicPath: '../',          // 编译好的文件，在服务器的路径，这里是静态资源
        chunkFilename: '[name].[chunkhash:5].min.js'
    },
    module: {
        loaders: [
            // css 加载
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader?module'})
            },
            // {
            //     test : /\.css$/,
            //     loader : 'style-loader!css-loader',
            // },
            // 字体加载
            {
                test: /\.(eot|ttf|woff|woff2|svg|gif|appcache)(\?|$)/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            // 图片加载
            {
                test: /.(png|jpg)$/,
                loader: 'url-loader?limit=20000&name=images/[name].[ext]'
            },
            // js加载
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-2']
                }

            }
        ]
    },
    plugins: [
        /*
         * css 单独打包
         * 不指定[name]
         * 则a.css,c.css每个单独创建一个入口
         * */
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),

        // 引入jquery
        new webpack.ProvidePlugin({
            $: 'jqeury',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        // 压缩
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false  // 移除comment
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('common')

    ],
    // resolve : {
    //     extensions : ['','.js','.jsx']  // 后缀自动补全
    // }
    // devServer : {
    //     contentBase : DIST_DIR + '/views/',
    //     compress : true,
    //     historyApiFallback : true,
    //     port : 8080
    // }
};


let pages = config.entry,
    pagesLen = 0;

// 根据模板插入CSS、js等生成最终HTML
for (let chunkName in pages) {
    pagesLen++;
    let conf = {
        title: chunkName,
        // 生成的html存放路径，相对于path
        filename: DIST_DIR + '/views/' + chunkName + '.html',
        // html模板路径
        template: SRC_DIR + '/views/' + chunkName + '.tpl.html',
        // 指定位置
        inject: true,
        // 删除多余信息
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        // 指定模块
        chunks: [chunkName, 'common.js'],
        // 为静态资源生成hash值
        hash: true
    };

    config.plugins.push(new HtmlWebpackPlugin(conf));
}


// 生产环境
// if(process.argv.indexOf('-p') > -1) {
//     config.plugins.push(new webpack.DefinePlugin({
//      // 编译生产版本
//         'process.env' : {
//             NODE_ENV : JSON.stringify('production')
//         }
//     }));
// }


module.exports = config;