import $http from '../js/http2';
import config from '../context'

/* 发送验证码 */
export const api_sendCode = function(data){ return $http.post(`${config.MSA_ROOT}/support/verifycode/send`,data)}

/* 验证验证码 */
export const api_checkCode = function(data){ return $http.post(`${config.MSA_ROOT}/support/verifycode/check`,data)}

/* 微信数据签名 */
export const api_signature = function(data){ return $http.post(`${config.MSA_ROOT}/ui/weixin/signature`,data)}

/* 上传文件 */
export const api_save_file = data => $http.post(`${config.MSA_ROOT}/file/save`, data)

/* 根据accessToken换取用户信息 */
export const api_getUserInfo = (openid, access_token) =>
  $http.get(`${config.UI_ROOT}/oauth/api/user?openId=${openid}&access_token=${access_token}`)

/* 图片识别 */
export const api_scanImage = data => $http.post(`${config.MSA_ROOT}/identity/ocr`, data)

/* 识别身份证 */
export const api_idcardOCR = function(data){return $http.post(`${config.MSA_ROOT}/weixin/user/idcard`,data)}

