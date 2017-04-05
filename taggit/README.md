### TODO
### 新资源管理系统
## 部署到测试环境流程
1. 测试环境机器为 172.17.254.124  用户名root 密码:MTcyLjE2LjI0NS4xMTQK
1. taggit/deploy 目录为预留的部署文件夹
1. 测试域名http://resourcenew.roobo.net/new-res/ 的虚拟目录path: /home/upload/new-res >(最好先清空此目录)
1. **config.js 15行 config.ajaxUrl切为//resourcenew.roobo.net**  
1. 保险起见先删除 taggit/dist.运行以下命令  
> `npm run init`  
> `npm run build`  

6. 将dist/ , index_prod.html,favicon.png,复制到taggit/deploy
1. 将此目录内容发到 172.17.254.124/home/upload/new-res
1. 配置host 172.17.254.124 resourcenew.roobo.net 后访问  [http://resourcenew.roobo.net/new-res/index_prod.html#!/](http://resourcenew.roobo.net/new-res/index_prod.html#!/)


## 部署到生产环境流程
1. **config.js 15行 config.ajaxUrl切为//resourcenew-inner.roo.bo**
1. 保险起见先删除 taggit/dist.运行 npm run init ,然后 npm run build
1. git项目切到release,推送到最新版本后打tag,然后推送tag
1. 在deploy.roobo.net部署tag版本
1. 删除host 172.17.254.124 resourcenew.roobo.net 后访问
[http://resourcenew.roobo.net/new-res/index_prod.html#!/](http://resourcenew.roobo.net/new-res/index_prod.html#!/)


****  

## 新部署
- webpack可以做文件目录处理，为了不修改webpack配置，所以使用了gulp
- dist和dest文件夹不建议上传，每个机器编辑代码都不一样，很容易冲突
- 安装gulp和gulp-ssh

> `git push orgin master`  
> `npm install`  


### 测试环境
> `gulp clean-dist`      //清楚dist  
> `npm run test`          //测试环境代码编译处理  
> `gulp copy`             //copy部署代码到dest目录  
> `gulp res-deploy`       //部署代码到测试环境  


[测试环境预览](http://resourcenew.roobo.net/new-res/index_prod.html#!)

### 正式环境
> `gulp clean-dist`       //清楚dist   
> `npm run build`         //代码编译处理
