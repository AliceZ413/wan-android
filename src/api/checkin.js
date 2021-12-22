import config from "@/../resource/context";
import $http from "@/../resource/js/http2";

/* 类型库查询 */
export const api_getEquidInfo = function(data){return $http.get(`${config.MSA_ROOT}/checkin-api/faceAdapter/getEquidInfo`,data)}
