import $http from "../js/http2";
import config from "../context";

/* 查询船检证书 闻讯的接口 2020-09-08废弃 */
export const api_getCjShipCertData = function(data){ return $http.post(`${config.MSA_ROOT}/mediator/shipIns/getShipInspectCertList`, data) }

/* 查询船检信息 闻讯的接口 2020-09-08废弃 */
export const api_getCjShipMainData = function(data){return $http.post(`${config.MSA_ROOT}/mediator/shipIns/getLastShipInspectInfo`, data)}

/* （新）查询船检证书 2020-09-08更新接口 */
export const api_getShipInspectCerts = function(data){ return $http.post(`${config.MSA_ROOT}/mediator/proxy/shipInspectCert`, data) }

/* （新）查询船检信息 2020-09-08更新接口  */
export const api_getShipInspect = function(data){return $http.post(`${config.MSA_ROOT}/mediator/proxy/shipInspect`, data)}

/* （新）船舶进出港报告 2020-09-08更新接口  */
export const api_getShipReport = function(data){return $http.post(`${config.MSA_ROOT}/mediator/proxy/eepReportDw`, data)}

/* （新）船舶进出港报告 2020-09-08更新接口  */
export const api_getShipReport_v2 = function(data){return $http.post(`${config.MSA_ROOT}/mediator/proxy/eepReportDwV2`, data)}


/* （新）船舶综合信息融合接口 2020-09-08更新接口  */
export const api_getShipData = function(data){return $http.post(`${config.MSA_ROOT}/mediator/proxy/shipFuse`, data)}

/* （新）船舶AIS查询接口 2020-09-10更新 */
export const api_getShipAIS = function(data){return $http.post(`${config.MSA_ROOT}/mediator/proxy/shipLocation`, data)}

/* 船員檢查記錄 */

export const api_getTaskCheckAndExpe = function (data) { return $http.get(`${config.MSA_ROOT}/mediator/proxy/getTaskCheckAndExpe`, data)}
