/*
* 日期处理
* */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S": this.getMilliseconds()
    // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/*
* 自适应处理
* */
let adaption = function(){
  let width = document.documentElement.clientWidth || document.body.clientWidth;

  if( width > 1080 ){ width = 1080; }

  // let fontSize = width/320 * 62.5;
  let fontSize = width / 375 * 62.5 * 16 / 100;
  document.getElementsByTagName("html")[0].style.fontSize = `${fontSize}px`;
}

adaption();


