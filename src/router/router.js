/**
 * 请不要改动此文件，否则更新配置会造成你的改动被覆盖
 **/
import Vue from 'vue'
import Router from 'vue-router'
import routes from "./index";
let setting = require('@/../config/settings');
import { api_getAccessToken, api_getUserInfo } from '@/../resource/api/user';
import { api_signature } from '@/../resource/api/common'
let project = require('@/../project');

Vue.use(Router);

let router = new Router({
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      /**
       * 从vuex取页面的滚动状态，返回页面设置容器的滚动高度
       * */
      let $store = this.app.$root.$store;
      let scrollPositions = $store.state.app.scrollPositions;
      let scrollElId = this.app.$root.$el.id;

      for(let key in scrollPositions) {
        let scrollEl = document.querySelector(`#${scrollElId} .${key}`);
        let scrollPosition = scrollPositions[key];
        scrollEl.scrollLeft = scrollPosition.x;
        scrollEl.scrollTop = scrollPosition.y;
      }
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

function getSignature() {
  /**
   * 获取微信签名
   * */
  let url = location.href.split("#")[0];

  api_signature({ url: url, wxId: $util.constant.WX_MA }).then(function(response) {
    let data = response.data;
    if (data.code == $util.constant.OK) {
      const item = data.entity;
      let debug = false;
      console.log('签名调用成功');
      console.log(data);

      wx.config({
        debug : debug,
        appId : item.appId,
        timestamp : item.timestamp,
        nonceStr : item.nonceStr,
        signature : item.signature,
        jsApiList : [
          'getLocation',
          'chooseImage',
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareAppMessage',  //旧的接口，即将废弃
          'onMenuShareTimeline' //旧的接口，即将废弃
        ]
      });
    } else {
      console.log('签名调用失败');
      console.log(data);
    }
  });
}

async function getUserInfo (access_token, callback) {
  //获取用户openId和access_token
  await api_getUserInfo(access_token).then(({ data }) => {
    Vue.$vux.loading.hide();
    if ($util.OK(data.code)) {
      localStorage.setItem('user_info', JSON.stringify(data.userInfo));
      callback();
    } else {
      callback();
    }
  });
}
/*
*  配置路由钩子
* */
router.beforeEach(async (to, from, next) => {
  //路由跳转前结束掉上一个页面掉loading
  Vue.$vux.loading.hide();
  /*
  * 设置路由参数的统一加密
  * 放弃给参数加密了，因为加密之后小程序要点3次才能返回主界面
  * */
  let code = to.query.code;
  let access_token = to.query.access_token;
  let appId = setting.appId;
  let oldCode = localStorage.getItem('auth_code');

  /*
  * 用户授权管理
  * */
  if (access_token) {
    localStorage.setItem('access_token', access_token);
    getSignature();

    next()
  } else {
    //未查询到code值
    next();
  }

  let defaultTitle = project.SYSTEM_NAME;

  /*
  * 设置指定的页面标题
  * */
  if (to.meta.title) {
    defaultTitle = to.meta.title;
  }

  document.title = defaultTitle;
});

export default router
