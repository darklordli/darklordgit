import Env from './env';

let config = {
    env: Env
};

//接口地址
if (config.env === "development") {
    config.ajaxUrl = "http://xyzdev.resourcebr.roobo.com";
    config.loginurl = "http://172.17.254.124:8888/accountLogin/";
    config.appId = "resources";
    config.access_token = "acd626b0dacdfb17bb214e33eb75e172";

} else if (config.env === "production") {
    config.ajaxUrl = "//resourcenew-inner.roo.bo";
    config.loginurl = "http://ecp.roobo.net/";
    config.appId = "resources";
    config.access_token = "acd626b0dacdfb17bb214e33eb75e172";

} else if(config.env == 'test'){
    config.ajaxUrl = "//resourcenew.roobo.net";
    config.loginurl = "http://ecp.roobo.net/";
    config.appId = "resources";
    config.access_token = "acd626b0dacdfb17bb214e33eb75e172";
}

export default config;
