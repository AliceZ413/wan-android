import $http from '../js/http2';
import config from '../context'

/* 查询船员证书 */
export const api_getCrewCertificate = function(data){return $http.post(`${config.MSA_ROOT}/weixin/cert/getCerts`,data)}

/* 查询船员基本信息 */
export const api_getCrewInfo = function(idNo){return $http.get(`${config.MSA_ROOT}/weixin/crew?idNo=${idNo}`)}

/* 查询船员服务资历 */
export const api_crewServeHistory = function(data){ return $http.post(`${config.MSA_ROOT}/dismiss/getHistoryDismiss`,data)}

/* 查询船员年度任职时长 */
export const api_getSeniorityDay = function(data){ return $http.post(`${config.MSA_ROOT}/dismiss/getSeniorityDay`,data)}


