const config = require('../context');

module.exports = {
  //接口调用成功
  "OK": 100001,
  //授权码重复使用
  "INVALID_CODE": 600005,

  // 海事之眼微信小程序首页
  "WX_INDEX": "/pages/index/index",
  // 网络异常提示
  "NETWORK_ERROR": "网络似乎不太顺畅",
  // 人脸识别失败提示
  "MATCH_FAIL": "识别不通过",
  // 人脸识别识别阈值
  "MATCH_SCORE": 0.9,
  // 人脸识别最低识别阈值
  "MIN_MATCH_SCORE": 0.8,
  // 广东海事局机构代码
  "GD_CODE": "09",
  // 部海事局
  "CHINA_CODE": '00',
  //百度地图AK
  "baiduAK": '3NbO6dRYpjaviqimY09X48zm0CCddxNB',
  //测试公众号的appId映射
  "WX_MA": config.WX_MA
};
