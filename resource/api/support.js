import $http from '../js/http2';
import config from '../context'

/* 根据经纬度返回辖区信息 */
export const api_location_save = function(data){return $http.post(`${config.MSA_ROOT}/support/location/client/save`,data)}

/* 发送验证码 */
export const api_sendCode = function(data){ return $http.post(`${config.MSA_ROOT}/support/verifycode/send`,data)}

/* 发送验证码 */
export const api_sendCodeV2 = function(data){ return $http.post(`${config.MSA_ROOT}/support/verifycode/v2/send`,data)}

/* 获取图形验证码 */
export const api_getGraphCode = function(data){ return $http.post(`${config.MSA_ROOT}/support/verifycode/image`,data)}

/* 验证验证码 */
export const api_checkCode = function(data){ return $http.post(`${config.MSA_ROOT}/support/verifycode/check`,data)}

