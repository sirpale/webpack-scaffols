/**
 * Created by sirpale on 17/3/1.
 */

const path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');


const ROOT_PATH = path.resolve(__dirname),
    SRC_PATH = path.resolve(ROOT_PATH,'src'),
    SRC_FILE = path.resolve(SRC_PATH,'public'),
    DIST_PATH = path.resolve(ROOT_PATH,'dist');


const config = {
    devtool : 'cheap-module-eval-source-map',
    entry : {
        index : SRC_FILE + '/js/common/index.js',
        games : SRC_FILE + '/js/common/games.js'
    },
    output : {
        // 编译好的文件，在服务器的路径，这是静态资源地址
        // publicPath : DIST_PATH,
        // 编译到当前目录
        path : __dirname,
        // 编译后的文件名
        filename : 'js/[name].js',
        chunkFilename : 'js/[name].[chunkhash:5].min.js'
    },
    module : {
       loaders : [
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
    plugins : [
        // new webpack.DefinePlugin({
        //    'process.env' : {
        //        NODE_ENV : JSON.stringify('development')     // 定义编译环境
        //    }
        // }),
        new ExtractTextPlugin('css/[name].css')
    ],
    resolve : {
        extensions : ['.js','.jsx','.less','.scss','.css']
    },
    devServer : {
        // contentBase : DIST_PATH + '/views/',
        compress : true,
        host : '0.0.0.0',
        // hot : true,
        port : 3000,
        inline : true
        // historyApiFallback : true

    }
};


let pages = config.entry,
    pagesLen = 0;


for(let chunkName in pages) {
    pagesLen++;
    let conf = {
        title : chunkName,
        filename : DIST_PATH +'/views/'+chunkName+'.html',
        template : SRC_PATH + '/views/'+chunkName+'.tpl.html',
        inject : true,
        minify : {
            removeComments : true,
            collapseWhitespace : false
        },
        chunks : [chunkName],
        hash : true
    };

    config.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = config;


