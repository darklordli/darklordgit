npm install -g nodemon

{
  "restartable":"rs",//重启的命令，默认是 rs
  "ignore":[""],//忽略的文件后缀名或者文件夹，文件路径的书写用相对于 nodemon.json 所在位置的相对路径
  "verbose": true, //表示输出详细启动与重启信息
  "execMap":{
      "":"node",
      "test": "gulp test"
  },
  "events":{
    "start":"gulp", //子进程（即监控的应用）启动
    "crash":"",  //子进程崩溃，不会触发 exit
    "exit":"", //子进程完全退出，不是非正常的崩溃
    //"restart":"gulp", //子进程重启
    "restart": "osascript -e 'display notification \"app restarted\" with title \"nodemon\"'"
  },
  "ext": "js json",//监控指定后缀名的文件，用空格间隔。默认监控的后缀文件：.js, .coffee, .litcoffee, .json。但是对于没有文件后缀的文件，比如 www 文件，我暂时找不到怎么用 nodemon 去监控，就算在 watch 中包含了，nodemon 也会忽略掉
  "watch":[
    "./src/**"
  ],
  "env":{
    "NODE_ENV":"env", //  env： 是开发环境; 运行环境 development; production 是生产环境
    "PORT":"3000"
  },
  "legacy-watch":false //nodemon 使用 Chokidar 作为底层监控系统，但是如果监控失效，或者提示没有需要监控的文件时，就需要使用轮询模式（polling mode），即设置 legacy-watch 为 true，也可以在命令行中指定

}
