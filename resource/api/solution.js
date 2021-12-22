import $http from "../js/http2";
import config from "../context";

/* 图片识别 */
export const api_scanImage = data => $http.post(`${config.MSA_ROOT}/identity/ocr`, data)

/* 人脸识别 */
export const api_faceMatch = function(data){return $http.post(`${config.MSA_ROOT}/man/match`, data)}

/* 人脸注册 */
export const api_faceRegister = function(data){return $http.post(`${config.MSA_ROOT}/man/register`, data)}

/* 查询机构层级 */
export const api_getMsaOrgDeatil = data => $http.post(`${config.MSA_ROOT}/org/getMsaOrgDeatil`, data)

/* 海事机构查询 */
export const api_searchOrg = function(data){ return $http.post(`${config.MSA_ROOT}/org`,data)}

/* 查询船员服务资历 */
export const api_crewServeHistory = function(data){ return $http.post(`${config.MSA_ROOT}/dismiss/getHistoryDismiss`,data)}

/* 查询船员年度任职时长 */
export const api_getSeniorityDay = function(data){ return $http.post(`${config.MSA_ROOT}/dismiss/getSeniorityDay`,data)}

/* 船员所在船（动态2.0） */
export const api_getCrewOnShipZc = function(data){return $http.post(`${config.MSA_ROOT}/dismiss/getCrewOnShipListZc`,data)}

/* 船员所在船（报告制） */
export const api_getCrewOnShipBGZ = function(data){return $http.post(`${config.MSA_ROOT}/dismiss/getCrewOnShipListAr`,data)}

/* 查询用户注册信息 */
export const api_getUserRegister = function(data){return $http.post(`${config.MSA_ROOT}/register/apply/search`,data)}

/* 查询用户注册某个角色对信息 */
export const api_getUser = function(data){return $http.post(`${config.MSA_ROOT}/register/getUser`,data)}

/* 船员所在船（海事之眼） */
export const api_getShip = function(data){return $http.post(`${config.MSA_ROOT}/task/passcard/crewWork`,data)}

/* 人脸照片与船员证件照1v1比对 */
export const api_faceCompare1v1 = function(data){return $http.post(`${config.MSA_ROOT}/weixin/face/compareByIdNo`,data)}

/* 识别身份证 */
export const api_idcardOCR = function(data){return $http.post(`${config.MSA_ROOT}/weixin/user/idcard`,data)}

/* 查询船员证书 */
export const api_getCrewCertificate = function(data){return $http.post(`${config.MSA_ROOT}/weixin/cert/getCerts`,data)}

/* 查询船员基本信息 */
export const api_getCrewInfo = function(idNo){return $http.get(`${config.MSA_ROOT}/weixin/crew?idNo=${idNo}`)}

/* 查询船舶最低安全配员证书-列表 */
export const api_getShipManningCertificate = function(data){return $http.post(`${config.MSA_ROOT}/weixin/manning/getMinManning`,data)}

//查询船舶最低安全配员表-单张证书
export const api_getSingleMinManning = function(data){return $http.post(`${config.MSA_ROOT}/weixin/manning/getSingleMinManning`, data)}

/* 查询船舶最低安全配员证书详情-证书配员表 */
export const api_getShipManningDetail = function(data){return $http.post(`${config.MSA_ROOT}/weixin/manning/getMinManningDetails`,data)}

/* 查询船舶AIS经纬度信息 */
export const api_getAis = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getAis`, data)}

/* 查询船舶列表 */
export const api_findShip = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/search`,data)}

/* 船员任职船舶 */
export const api_getShipByCrew = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getShipByCrew`,data)}

/* 查询船舶基础信息 */
export const api_getShipList = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getShipList`,data)}

/* 查询船舶基础信息 */
export const api_getShipBasic = function(shipId){return $http.get(`${config.MSA_ROOT}/weixin/ship?shipId=${shipId}`)}

/* 查询船舶综合信息 */
export const api_getShipSynthesize = function(shipName){return $http.get(`${config.MSA_ROOT}/weixin/ship/certs?shipName=${shipName}`)}

/* 查询船舶照片 */
export const api_getCjcbzp = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getCjcbzp`, data)}

/* 船舶协查信息 */
export const api_xcInfoList = function(data){return $http.post(`${config.MSA_ROOT}/weixin/ship/getXcList`, data)}

/* 用户登录 */
export const api_login = function(data){return $http.post(`${config.MSA_ROOT}/weixin/user/login`,data)}

/* 退出登录 */
export const api_logout = function(data){return $http.post(`${config.MSA_ROOT}/weixin/user/logout`,data)}

/* 查询码头列表 */
export const api_listWharfByName = function(data){return $http.post(`${config.MSA_ROOT}/wharf/listWharfByName`,data)}

