const compressImg = require('./compressImage');
const constant = require('./constant');

let util = {
  getURLBase64: function (url) {
    /*
    * 通过URL将图片转为base64
    * */
    return new Promise((resolve, reject) => {
      !url && resolve('');

      let xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let fileReader = new FileReader();
          fileReader.onloadend = function(e) {
            let result = e.target.result;
            resolve(result)
          }
          fileReader.readAsDataURL(blob)
        }
      }
      xhr.onerror = function(e) {
        resolve(null);
        throw e;
      }
      xhr.send()
    })
  },
  isReachBottom (el) {
    /**
     * 默认判断document是否滚动到底部，传了el则查询该元素是否滚动到底部
     * @el  .class-selector | #id-selector
     * */
    if(!el) {
      el = document.documentElement || document.body;
    } else {
      el = document.querySelectorAll(el)[0];
    }
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    let scrollTop = el.scrollTop;
    //变量windowHeight是可视区的高度
    let windowHeight = el.clientHeight;
    //变量scrollHeight是滚动条的总高度
    let scrollHeight = el.scrollHeight;
    //滚动条到底部的条件
    scrollTop = Math.floor(scrollTop);
    // console.log(scrollTop, parseInt(scrollTop), windowHeight, scrollHeight);
    if (scrollTop + windowHeight + 1 >= scrollHeight) {
      return true;
    }
    return false;
  },
  OK (code) {
    return code == constant.OK;
  },
  parseNo (no) {
    /*
    * 身份证打码
    * 440122193200002222 -> 4401221932****2222
    * 440122320000222 -> 44012232****222
    * */
    let length = no.length;

    if (length === 18)
      return no.slice(0, 10).concat('****').concat(no.slice(length - 4, length));
    return no.slice(0, 8).concat('****').concat(no.slice(length - 3, length));
  },
  parsePhone (no) {
    /*
    * 手机号打码 13400000002 -> 134****0002
    * */
    let length = no.length;
    return no.slice(0, 3).concat('****').concat(no.slice(length - 4, length));
  },
  encode: function(str) {
    /*
    * 敏感字符串加密
    * */
    if(!str){return ''}
    str = str + '';
    let newArr = [];
    for(let i = 0, length = str.length; i<length;i++){
      newArr.push(str.charCodeAt(i).toString(16));
    }
    return newArr.join('.');
  },
  decode: function(str) {
    /*
    * 敏感字符串解密
    * */
    if(!str){return ''}
    let newArr = str.split('.');
    let newStr = '';
    for (let i = 0, length = newArr.length; i < length; i++) {
      newStr += String.fromCharCode(parseInt(newArr[i], 16));
    }
    return newStr;
  },
  getMonthEnd(year, month){
    /*
    * 返回某年某月最后一天是几号
    * */
    year = parseInt(year);
    month = parseInt(month);
    if(month === 12){
      let expect = 1;
      year ++;
      return new Date(new Date(`${year}/${expect}/1`).getTime() - 24 * 60 * 60 * 100).getDate()
    }else{
      return new Date(new Date(`${year}/${(month + 1)}/1`).getTime() - 24 * 60 * 60 * 100).getDate()
    }
  },
  getId15: function (idCardNo) {
    /*
    * 18位身份证转15位身份证
    * */
    return idCardNo.length === 15 ? idCardNo :
      idCardNo.length === 18 ? idCardNo.substring(0, 6) + idCardNo.substring(8, 17) :
        idCardNo;
  },

  fix: function(num){
    return (num >= 10 ? num : '0' + num);
  },
  isPhone: function (phoneNo) {
    //手机号码校验
    const phoneReg = /^[1][0-9]{10}$/;
    return phoneReg.test(phoneNo)
  },
  isIdNo: function (idNo) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(idNo);
  }
}

Object.assign(util, compressImg);
module.exports = util;
