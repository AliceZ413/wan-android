import $http from "../js/http2";
import config from "../context";

/* 微信数据签名 */
export const api_signature = function(data){ return $http.post(`${config.UI_ROOT}/weixin/signature`,data)}

/* 根据accessToken换取用户信息 */
export const api_getUserInfo = (openid, access_token) => $http.get(`${config.UI_ROOT}/oauth/api/user?openId=${openid}&access_token=${access_token}`)
