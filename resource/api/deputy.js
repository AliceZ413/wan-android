/* 履职 */
/* 查询码头 */
import config from "../context";
import $http from "../js/http2";

export const api_listWharfByName = function(data){return $http.post(`${config.MSA_ROOT}/wharf/listWharfByName`,data)}

/* 类型库查询 */
export const api_getEnforceMeasures = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/dictionary/getEnforceMeasures`,data)}

/* 处理措施查询 */
export const api_getDictionary = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/dictionary/getDictionary`,data)}

/* 处理结果保存 */
export const api_saveExamineBasicList = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/shipLable/saveExamineBasicList`,data)}

/*处理结果查询*/
export const api_findExamineBasic = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/shipLable/findExamineBasic`,data)}

/* 保存处理状态 */
export const api_saveCheck = function(data){return $http.post(`${config.MSA_ROOT}/checkup-api/check/save`, data)}
