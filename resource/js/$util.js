const geoParser = require("./geoParser");
const constant = require('@/../resource/js/constant');
const context = require('../context');
const util = require('@/../resource/js/util');
const polyfill = require('@/../resource/js/polyfill');
const wxUtil = require('@/../resource/js/wxUtil');
import { api_getShipByCrewV2 } from '@/../resource/api/core';
import { api_coordAnalysis } from '@/../resource/api/internet'
let Vue = require('vue').default;

const SERVER = context.MSA_ROOT;

let $util = {
  constant,
  SERVER: SERVER,
  staticAccess: `${SERVER}/file/get?guid=`,//拍摄照片路径
  basePhotoUrl: `${SERVER}/weixin/crew/avatar?idNo=`,//船员证件照
  libPhotoUrl: `${SERVER}/weixin/face?idNo=`,//人脸库照片
  portrait: `${SERVER}/ui/user/portrait/get?userId=`,//用户头像
  crewPhoto: `${SERVER}/weixin/crew/photo?guid=`,
  accessPhoto (url) {
    let access_token = this.getUserInfo().access_token;
    //访问照片要加token
    if(url.indexOf('?') >= 0) {
      url += '&access_token=' + access_token;
    } else {
      url += '?access_token=' + access_token;
    }
    return url
  },
  getMiniProgramIndex: function(){
    //返回小程序首页
    wx.miniProgram.reLaunch({
      url: constant.WX_INDEX
    });
  },
  getAddress (fn) {
    let $this = this;
    Vue.$vux.loading.show('正在定位...');
    wxUtil.getLocation({
      success (location) {
        Vue.$vux.loading.hide();
        $this.getAddressByLocation(location.longitude, location.latitude, fn);
      },
      fail () {
        Vue.$vux.loading.hide();
      }
    })
  },
  getAddressByLocation (longitude, latitude, fn) {
    //根据经纬度进行逆地址解析
    Vue.$vux.loading.show('请稍候');
    api_coordAnalysis({location: `${latitude},${longitude}`, coordtype: 'wgs84ll'}).then(res => {
      Vue.$vux.loading.hide();
      let data = res.data;
      if(util.OK(data.code)) {
        fn && fn(data.item);
      } else {
        Vue.$vux.toast.text(data.msg);
      }
    }).catch(err => {
      Vue.$vux.loading.hide();
      throw err;
    })
  },
  getUserInfo () {
    //获取全局用户信息
    let userInfo = localStorage.getItem('user_info');
    let openId = localStorage.getItem('openid');
    let accessToken = localStorage.getItem('access_token');

    !userInfo && (userInfo = '{}');

    userInfo = JSON.parse(userInfo);

    userInfo.access_token = accessToken;

    if( openId ) {
      userInfo.openId = openId
    }

    return userInfo;
  },
  async getCrewShip () {
    return new Promise((resolve, reject) => {
      api_getShipByCrewV2().then(res => {
        let data = res.data, ship = null;
        if($util.OK(data.code)) {
          let item = data.item;
          /**
           * 绑定船舶逻辑声明
           * 查询船员所在船 item.source 可选值：report/binding
           * 海船船员优先取报告制在船船员，内河船船员优先取海事之眼绑定的船舶
           * 内河船船员如有报告制所在船，source=report，这种情况可以绑定船舶
           */
          if(item && ((item.source === 'report' && item.waterType === 'SEA') || item.source === 'binding')) {
            ship = {
              shipId: item.shipId,
              shipName: item.shipName,
              shipMmsi: item.mmsi,
              source: item.source,
              shipSource: item.source === 'report' ? 'SERVE_DISMISS' : 'USER_BIND',
              readOnly: item.source === 'report' && item.waterType === 'SEA'
            };
          }
          resolve(ship)
        } else {
          Vue.$toast.text.show(data.msg);
        }
      }).catch(err => {
        resolve(null);
        throw err;
      })
    })
  }
};
Object.assign($util, util, wxUtil, geoParser);

export default $util;
