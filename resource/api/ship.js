import $http from '../js/http2';
import config from '../context'

/* 查询船舶最低安全配员证书-列表 */
export const api_getShipManningCertificate = function(data){return $http.post(`${config.MSA_ROOT}/weixin/manning/getMinManning`,data)}

//查询船舶最低安全配员表-单张证书
export const api_getSingleMinManning = function(data){return $http.post(`${config.MSA_ROOT}/weixin/manning/getSingleMinManning`, data)}

/* 查询船舶最低安全配员证书详情-证书配员表 */
export const api_getShipManningDetail = function(data){return $http.post(`${config.MSA_ROOT}/weixin/manning/getMinManningDetails`,data)}

/* 查询船舶列表 */
export const api_findShip = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/search`,data)}

/* 船员任职船舶 */
export const api_getShipByCrew = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getShipByCrew`,data)}

/* 查询船舶基础信息 */
export const api_getShipList = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getShipList`,data)}

/* 船员所在船（海事之眼） */
export const api_getShip = function(data){return $http.post(`${config.MSA_ROOT}/task/passcard/crewWork`,data)}

/* 船员所在船（动态2.0） */
export const api_getCrewOnShipZc = function(data){return $http.post(`${config.MSA_ROOT}/dismiss/getCrewOnShipListZc`,data)}

/* 船员所在船（报告制） */
export const api_getCrewOnShipBGZ = function(data){return $http.post(`${config.MSA_ROOT}/dismiss/getCrewOnShipListAr`,data)}

/* 查询船舶基础信息 */
export const api_getShipBasic = function(shipId){return $http.get(`${config.MSA_ROOT}/weixin/ship?shipId=${shipId}`)}

/* 查询船舶综合信息 */
export const api_getShipSynthesize = function(shipName){return $http.get(`${config.MSA_ROOT}/weixin/ship/certs?shipName=${shipName}`)}

/* 查询船舶照片 */
export const api_getCjcbzp = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getCjcbzp`, data)}

/* 查询船检证书 旧 */
// export const api_getCjShipCertData = function(data){ return $http.post(`${config.MSA_ROOT}/weixin/cjCert/getCjShipCertData`, data) }

/* 查询船检证书 新 */
export const api_getCjShipCertData = function(data){ return $http.post(`${config.MSA_ROOT}/mediator/shipIns/getShipInspectCertList`, data) }

/* 查询船舶AIS经纬度信息 */
export const api_getAis = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getAis`, data)}

/* 查询船检信息 旧 */
// export const api_getCjShipMainData = function(data){return $http.post(`${config.MSA_ROOT}/weixin/cjCert/getCjShipMainData`, data)}

/* 查询船检信息 新 */
export const api_getCjShipMainData = function(data){return $http.post(`${config.MSA_ROOT}/mediator/shipIns/getLastShipInspectInfo`, data)}

/* 船舶协查信息 */
export const api_xcInfoList = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getXcList`, data)}

/* 船舶安检信息 */
export const api_queryShipFscList = function(data){return $http.post(`${config.SERVICE_ROOT}/ShipInspect/queryShipFscList`, data)}

/* 船舶安检详情 */
export const api_queryShipFscDetail = function(data){return $http.post(`${config.SERVICE_ROOT}/ShipInspect/queryShipFscDetail`, data)}

/* 船舶信息 */
export const api_shipDataDetail = function(data){return $http.post(`${config.SERVICE_ROOT}/shipDataMultiple/FindShipDataDetail`, data)}

/* 查询船舶AIS信息 */
export const api_findShipAIS = function(data){return $http.post(`${config.SERVICE_ROOT}/shipDataMultiple/FindShipAis`, data)}

/* 查询船舶综合信息 */
export const api_findShipMultiple = function(data){return $http.post(`${config.SERVICE_ROOT}/shipDataMultiple/findShipMultiple`, data)}
