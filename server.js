/**
 * Created by sirpale on 17/3/1.
 */
let webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config.dev');


// 代理服务器
let proxy = {
    path : '/*/*',
    target : 'http://dev.fe.ptdev.cn',
    host : 'dev.fe.ptdev.cn',
    secure : false
};

// config.entry.app.unshift('webpack-dev-server/client?http://localhost:3000/');

let server = new WebpackDevServer(webpack(config),{
    publicPath : config.output.publicPath,
    stats : {
        colors : true
    }
});

// 将其它路由，全部返回index.html
server.app.get('*',function(req, res){
    res.sendFile(__dirname+'/dist/views/index.html')
}).listen(3000,function(){
  console.log('正常打开3000端口！')
});
