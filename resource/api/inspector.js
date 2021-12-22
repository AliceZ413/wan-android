import $http from "../js/http2";
import config from "../context";

/* 类型库查询 */
export const api_getEnforceMeasures = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/dictionary/getEnforceMeasures`,data)}

/* 处理措施查询 */
export const api_getDictionary = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/dictionary/getDictionary`,data)}

/* 处理结果保存 */
export const api_saveExamineBasicList = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/shipLable/saveExamineBasicList`,data)}

/*处理结果查询*/
export const api_findExamineBasic = function(data){return $http.post(`${config.MSA_ROOT}/inspector-api/shipLable/findExamineBasic`,data)}
