/* 机构相关 */
import config from "../context";
import $http from "../js/http2";

/* 查询机构层级 */
export const api_getMsaOrgDeatil = data => $http.post(`${config.MSA_ROOT}/org/getMsaOrgDeatil`, data)

/* 海事机构查询 */
export const api_searchOrg = function(data){ return $http.post(`${config.MSA_ROOT}/org`,data)}

/* 查找海事机构 */
export const api_org = function(parentId){return $http.get(`${config.SERVICE_ROOT}/healthy_report/org?parentId=${parentId}`)}

