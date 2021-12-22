const settings = require('../config/settings');

const env = settings.ENV; // 体验接口

const version = settings.VERSION;
//正式版微信域名
const WX_DOMAIN = 'https://wx.gd.msa.gov.cn';
//客渡之眼域名
// const AI_FERRY = 'https://aiferry.kinthtech.com';
const AI_FERRY = 'https://haiwang.kinthtech.com.cn';
//正式版授权码
const PROD_TOKEN = '4xRxMI1lh9AJIkF5VNsVZ2';
//体验版授权吗
const DEV_TOKEN = 'AUU19cNYhFUtYBRMkQcBs0';
//正式版公众号GUID
const PROD_WX_MA = 'a2278b003d6d3f13e053290a12c6f80e';
//体验版公众号GUID
const DEV_WX_MA = 'a1444c07018b5ca9e0532a0a12c6f7cf';

const context = {
  prod_wx_config: {
    version: version,
    DOMAIN: WX_DOMAIN,
    WA: 'https://www.wanandroid.com',
    AI_FERRY,
    AI_ROOT: `${AI_FERRY}/ferryEye`,
    AI_MAIN: `${AI_FERRY}/main`,
    MSA_ROOT: `${WX_DOMAIN}/msa-checkin`,//接口地址
    UI_ROOT: `${WX_DOMAIN}/msa-checkin/ui`,//框架接口地址
    H5_ROOT: `${WX_DOMAIN}/msa-checkin`,//H5根路径地址
    KINTH_ROOT: `https://haishi.miniapp.kinthtech.com/msa`,
    ACCESS_TOKEN: PROD_TOKEN, //授权token
    SERVICE_ROOT: `${WX_DOMAIN}/service`,
    WX_MA: PROD_WX_MA
  },
  dev_wx_config: {
    version: version,
    DOMAIN: WX_DOMAIN,
    WA: 'https://www.wanandroid.com',
    AI_FERRY,
    AI_ROOT: `${AI_FERRY}/ferryEyeTest`,
    AI_MAIN: `${AI_FERRY}/mainTest`,
    MSA_ROOT: `${WX_DOMAIN}/msa-checkin-debug`,
    UI_ROOT: `${WX_DOMAIN}/msa-checkin-debug/ui`,
    H5_ROOT: `${WX_DOMAIN}/msa-checkin-debug`,
    KINTH_ROOT: `https://haishi.miniapp.kinthtech.com/test/msa`,
    ACCESS_TOKEN: DEV_TOKEN,
    SERVICE_ROOT: `${WX_DOMAIN}/service/dev`,
    WX_MA: DEV_WX_MA
  }
};

let using_context;

switch ( env.toString() ) {
  case 'production':
    using_context = context.prod_wx_config;
    break;
  case 'development':
    using_context = context.dev_wx_config;
    break;
  default: break;
}

module.exports = using_context;
