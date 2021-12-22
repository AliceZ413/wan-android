import $http from '../js/http2';
import config from '../context'

/* 用户登录 */
export const api_login = function(data){return $http.post(`${config.MSA_ROOT}/weixin/user/login`,data)}

/* 退出登录 */
export const api_logout = function(data){return $http.post(`${config.MSA_ROOT}/weixin/user/logout`,data)}

/* 查询用户注册信息 */
export const api_getUserRegister = function(data){return $http.post(`${config.MSA_ROOT}/register/apply/search`,data)}

/* 查询用户注册某个角色对信息 */
export const api_getUser = function(data){return $http.post(`${config.MSA_ROOT}/register/getUser`,data)}

/* 根据code换取accessToken信息 */
export const api_getAccessToken = (appId, code) => $http.get(`${config.MSA_ROOT}/token/app/access_token?appId=${appId}&code=${code}`)

/* 根据accessToken换取用户信息 */
export const api_getUserInfo = (openid, access_token) => $http.get(`${config.UI_ROOT}/oauth/api/user`)
