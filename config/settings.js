module.exports = {
  ENV: 'production',       //打包发布正式版
  //ENV: 'development',         //打包发布体验版
  packageName: 'hw-no1',    //打包的包名
  useWxDomain: true,          //切换到使用微信域名
  VERSION: '1.0.0',           //每次发布新版本需要修改版本号
  dev: {
    //本地开发运行配置
    host: '0.0.0.0',
    port: '8080'
  },
  appId: 'HW_NO1'
};
