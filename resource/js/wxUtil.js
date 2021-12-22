let util = {
  getLocation (params){
    /*
    * params.type 地理位置坐标类型
    * params.success 成功获取地理位置
    * params.fail 获取地理位置失败
    * */
    wx.ready(function(res){
      console.log('wx.ready调用成功');
      console.log(res);
      params.type = params.type || 'wgs84';
      params.success = params.success || function(){};
      params.fail = params.fail || function(){};

      wx.getLocation({
        type: params.type, // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (location) {
          console.log('地理位置调用成功');
          console.log(location);
          var latitude = location.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = location.longitude; // 经度，浮点数，范围为180 ~ -180。

          params.success(location);
        },
        fail: function(error){
          console.log('获取地理位置失败，请确认开启GPS系统定位');
          console.log(error);
          params.fail(error);
        }
      });
    });

  },
  onPageStateChange (fn) {
    /**
     * 从小程序返回webview的方法判断
     * */
    fn = fn || function () {};

    let ready = function () {
      //当前执行环境是小程序才执行
      if(window.__wxjs_environment !== 'miniprogram') return;

      WeixinJSBridge.on('onPageStateChange', function(res) {
        //res.active = "true"时，说明从从小程序中返回
        fn(res);
      });
    }

    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
      document.addEventListener('WeixinJSBridgeReady', ready, false)
    } else {
      ready();
    }
  },
  previewImage (setting) {
    /*
    setting.urls
    setting.current
     */
    wx.previewImage(setting)
  },
  // chooseImg (setting) {
  //   /* 弃用 */
  //   setting.success = setting.success || function(){};
  //
  //   let defaultSetting = {
  //     count: 1, // 默认9
  //     sizeType: setting.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: setting.sourceType ||  ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
  //       console.log(res);
  //       setting.success(res);
  //     }
  //   };
  //   wx.chooseImage(defaultSetting);
  // },
};

module.exports = util;
