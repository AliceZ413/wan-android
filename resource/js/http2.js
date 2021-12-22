/*
* 对axios的封装
*
* */
import Vue from 'vue'
import axios from 'axios'
import qs from "qs";
import $util from '@/../resource/js/$util'

let httpHelper = {
  reg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  reg2: /(\d{15})|(\d{18})|(\d{17}(\d|X|x))/,

  dataFilter  (url, data, extend) {
    if(extend && extend.checkIdNo === false) return;
    let warning = false;
    //安全校验，入参中包含身份证的接口需要警告

    if(data) {
      for (let key in data) {
        this.reg.test(data[key]) && (warning = true);
      }
    }

    if(url && url.match(this.reg2)) { warning = true; }

    if(warning) {
      console.warn('安全警告：接口入参中包含身份证！');
      console.warn('去掉此参数警告可在接口请求配置中增加checkIdNo配置项：http.post(url, data, {checkIdNo: false})');
      console.warn('调用接口：' + url);
      console.log(data);
    }
  },
  responseFilter (url, data) {
    let $this = this;
    let phoneNum = 0, idcardNum = 0;
    let warning = false;

    if(!data) return ;
    for(let key in data) {
      let item = data[key];

      if(typeof item === 'string' && $this.reg.test(item)) {console.log(item);warning = true};
      if(typeof item === 'object') {$this.responseFilter(url, item)}

      if(item instanceof Array) {
        item.forEach(obj => {
          for(let k in obj) {
            $util.isPhone(obj[k]) && phoneNum++;
            $util.isIdNo(obj[k]) && idcardNum++;
          }
        })
      }
    }

    if(phoneNum >= 2 || idcardNum >= 2) warning = true;

    if(warning) {
      if(phoneNum >= 2) {
        console.warn('安全警告：接口返回电话号码列表，请检查！');
        console.warn('调用接口：' + url);
      } else if(idcardNum >= 2) {
        console.warn('安全警告：接口返回身份证列表，请检查！');
        console.warn('调用接口：' + url);
      } else {
        console.warn('安全警告：接口返回的参数中包含身份证！');
        console.warn('调用接口：' + url);
      }
    }
  },
  onResponse (response) {
    this.responseFilter(response.config.url, response.data)
  }
}

let request = axios.create({
  timeout: 30000
});

request.interceptors.request.use(config => {
  try {
    let userInfo = $util.getUserInfo();
    let accessToken = userInfo.access_token;

    config.url = config.url.concat(config.url.indexOf('?') >= 0 ? (!!accessToken ? '&' : '') : '?')
    .concat(!!accessToken ? `access_token=${accessToken}`: '');

    if (config.method.toLowerCase() === 'post' && !(config.data instanceof FormData)) {
      config.data = qs.stringify(config.data);
    }
    return config;
  } catch (err){
    console.log('捕获异常');
    console.log(err);
  }
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  httpHelper.onResponse(response);
  console.log('接口访问结果：');
  console.log(response);
  let code = response.data.code || '';

  switch ( code.toString() ){
    case '600003':
      Vue.$vux.toast.text('未授权', 'top');break;
    case '600002':
      Vue.$vux.toast.text('缺少openId', 'top');break;
    case '600001':
      Vue.$vux.toast.text('缺少accessToken', 'top');break;
  }

  return response;
}, function (error) {
  // 请求错误则向store commit这个状态变化
  console.log(error);
  let statusText = '';
  if(error.message === 'Network Error') {
    statusText = $util.constant.NETWORK_ERROR;
  } else {
    if(error.response){
      statusText = error.response.statusText;
    }
  }

  return Promise.reject(error);
});


let http = {
  get (url, data, extend) {
    let params = data;
    if(data && data.params) { params = data.params }

    httpHelper.dataFilter(url, data ? data.params : null, extend);

    return params ? request.get(url, {params}) : request.get(url);
  },
  post (url, data, extend) {
    httpHelper.dataFilter(url, data, extend);
    request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

    return request.post(url, data);
  }
}

export default http;
