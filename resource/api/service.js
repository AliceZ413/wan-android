import $http from "../js/http2";
import config from "../context";

/* 查找海事机构 */
export const api_org = function(parentId){return $http.get(`${config.SERVICE_ROOT}/healthy_report/org?parentId=${parentId}`)}

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
