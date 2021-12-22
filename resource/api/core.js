import $http from "../js/http2";
import config from "../context";
const CORE_ROOT = `${config.MSA_ROOT}/core-api`

/**
 * 查询执法人员基本信息
 * access_token   默认传参
 * */
export const api_officer = function(){ return $http.post(`${CORE_ROOT}/user/officer`) };

/**
 * 查询船员基本信息
 * access_token   默认传参
 * */
export const api_crew = function(){return $http.post(`${CORE_ROOT}/user/crew`)};

/**
 * 查询船员所在船V2（无入参，只查当前用户所在船的船员列表）
 * */
export const api_getCrewOnShipListArV2 = function () {return $http.post(`${CORE_ROOT}/ship/getCrewOnShipListArV2`)};

/**
 * 查询在船船员列表
 * */
export const api_getCrewListByShipId = function (data) {return $http.post(`${CORE_ROOT}/ship/getCrewOnShipListAr`, data)};

/**
 * 查询船员任职资历
 * */
export const api_getHistoryDismissV2 = function () {return $http.post(`${CORE_ROOT}/weixin/crew/getHistoryDismissV2`)};

/**
 * 查询船员证书
 * */
export const api_getCerts = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/getCerts`, data)};

/**
 * 查询船员任解职详情
 * */
export const api_getDismissDetailV2 = function () {return $http.post(`${CORE_ROOT}/dismiss/getDetailV2`)};

/**
 * 查询船员基本信息
 * */
export const api_getCrewInfo = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/info`, data)};

/**
 * 查询船员所在船（报告制）
 * */
export const api_getShipByCrewAr = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/getShipByCrewAr`, data)};

/**
 * 查询船员年度任职天数
 * */
export const api_getSeniority = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/seniority`, data)};

/**
 * 查询船员任职资历
 * */
export const api_getHistoryDismiss = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/getHistoryDismissV2`, data)};

/**
 * 船员绑定船舶
 * */
export const api_bindShip = function (data) {return $http.get(`${CORE_ROOT}/user/ship/binding`, data)};

/**
 * 船员解绑船舶
 * */
export const api_unbindShip = function () {return $http.get(`${CORE_ROOT}/user/ship/unbundling`)};

/**
 * 查询船员所在船-融合接口
 * */
export const api_getShipByCrewV2 = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/getShipByCrewV2`, data)};

/**
 * 查询船员是否重点跟踪船员
 * guid 船员加密身份证号
 * */
export const api_getCrewKeyTrack = function (data) {return $http.post(`${CORE_ROOT}/weixin/crew/keyTrack/info`, data)};
