/**
 * Created by sirpale on 17/2/28.
 */
const webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');


const ROOT_PATH = path.resolve(__dirname),
    SRC_PATH = path.resolve(ROOT_PATH,'src'),
    SRC_FILE = path.resolve(SRC_PATH,'public'),
    DIST_PATH = path.resolve(ROOT_PATH,'dist');

console.log('开始编译');

let config = {
    // devtool : 'cheap-module-eval-source-map',
    entry: {
        common : [
            SRC_FILE + '/js/common/core.js',
            SRC_FILE + '/js/common/control.js'
        ],

        index: SRC_FILE + '/js/modules/index.js',
        home :SRC_FILE + '/js/modules/home.js',
        games: SRC_FILE + '/js/modules/games.js'
    },
    output: {
        path: DIST_PATH,            // 发布文件地址
        filename: 'js/[name].js',  // 编译后的文件名字
        publicPath: '../',          // 编译好的文件，在服务器的路径，这里是静态资源
        chunkFilename: '[name].[chunkhash:5].min.js'
    },
    module: {
        loaders: [
            {
                test : /\.html$/,
                exclude : /^node_modules/,
                include : [SRC_PATH],
                loader : 'raw-loader'
            },
            {
                test : /\.js$/,
                exclude : /^node_modules/,
                include : [SRC_PATH],
                loader : 'babel-loader'
            },
            {
                test : /\.css$/,
                exclude : /^node_modules/,
                include : [SRC_PATH],
                loader : ExtractTextPlugin.extract({fallback:'style-loader',use:'css-loader!autoprefixer-loader'})
            },
            {
                test : /\.less$/,
                exclude : /^node_modules/,
                include : [SRC_PATH],
                loader : ExtractTextPlugin.extract({fallback:'style-loader',use:'css-loader!autoprefixer-loader!less-loader'})
            },
            {
                test : /\.scss$/,
                exclude : /^node_modules/,
                include : [SRC_PATH],
                loader : ExtractTextPlugin.extract({fallback:'style-loader',use:'css-loader!autoprefixer-loader!node-sass'})
            },
            {
                test : /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                exclude : /^node_modules/,
                include : [SRC_PATH],
                loader : 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test : /\.(png|jpg)$/,
                exclude : /^node_modules$/,
                include : [SRC_PATH],
                loader : 'url-loader?limit=8192&name=/dist/images/[name].[ext]'
            },
            {
                test : /\.jsx$/,
                exclude : /^node_modules/,
                include :[SRC_PATH],
                loaders : ['jsx-loader','babel-loader']
            }
        ]
    },
    plugins: [
        /*
         * css 单独打包
         * 不指定[name]
         * 则a.css,c.css每个单独创建一个入口
         * */
        new ExtractTextPlugin('css/[name].css'),

        // 引入jquery
        new webpack.ProvidePlugin({
            $: 'jquery',
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
        new webpack.optimize.CommonsChunkPlugin({name:'control',filename:'control.js'})

    ],
    resolve : {
        extensions : ['.js','.jsx','.less','.scss','.css']
    }
    // devServer : {
    //     contentBase : DIST_DIR + '/views/',
    //     compress : true,
    //     historyApiFallback : true,
    //     port : 8080
    // }
};


let pages = config.entry,
    pagesLen = 0;


for(let chunkName in pages) {
    pagesLen++;

    if(chunkName !== 'common') {
        let conf = {
            title : chunkName,
            filename : DIST_PATH +'/views/'+chunkName+'.html',
            template : SRC_PATH + '/views/'+chunkName+'.tpl.html',
            inject : true,
            minify : {
                removeComments : true,
                collapseWhitespace : false
            },
            chunks : [chunkName,'core','control'],
            hash : true
        };

        config.plugins.push(new HtmlWebpackPlugin(conf));
    }
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