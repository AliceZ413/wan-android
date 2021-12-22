import $http from "../js/http2";
import config from "../context";

/* 上传文件 */
export const api_save_file = data => $http.post(`${config.MSA_ROOT}/file/save`, data);

/* 通过guid查询文件属性 */
export const api_get_fileDetail = data => $http.get(`${config.MSA_ROOT}/file/details`, data);

/**
 * 带标签文件上传
 * @param data.catalog
 * @param data.file
 * @param data.tags
 * */
export const api_save_tagFile = data => $http.post(`${config.MSA_ROOT}/file/saveWithTags`, data);

/**
 * 通过guid获取带标签文件
 * */
export const api_get_tagFile = data => $http.get(`${config.MSA_ROOT}/file/getFileWithTags`, data);

/**
 * 更新文件标签
 * @param data.guid
 * @param data.tags
 * */
export const api_update_tagFile = data => $http.get(`${config.MSA_ROOT}/file/updateTags`, data);


