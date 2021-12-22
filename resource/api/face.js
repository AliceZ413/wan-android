import $http from '../js/http2';
import config from '../context'

/* 人脸照片与船员证件照1v1比对 */
export const api_faceCompare1v1 = function(data){return $http.post(`${config.MSA_ROOT}/weixin/face/compareByIdNo`,data)}

/* 人脸识别 */
export const api_faceMatch = function(data){return $http.post(`${config.MSA_ROOT}/man/match`, data)}

/* 人脸注册 */
export const api_faceRegister = function(data){return $http.post(`${config.MSA_ROOT}/man/register`, data)}
