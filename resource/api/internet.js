import $http from "../js/http2";
import config from "../context";
const INTERNET_ROOT = `${config.MSA_ROOT}/internet`

/**
 * 经纬度坐标解析
 * location   23.2040,113.3420    纬度，经度
 * coordtype  wgs84ll             bd09ll（百度经纬度坐标） bd09mc（百度米制坐标） gcj02ll（国测局经纬度坐标，仅限中国） wgs84ll（ GPS经纬度）默认
 * */
export const api_coordAnalysis = function(data){ return $http.get(`${INTERNET_ROOT}/baidu/position`, data) }

/**
 * 地址解析
 * address        广东省广州市越秀区越秀北路214      地址
 * city           广州                            当根据地址查询到多个位置时，city可以起到过滤作用
 * ret_coordtype  wgs84ll                         bd09ll（百度经纬度坐标） bd09mc（百度米制坐标） gcj02ll（国测局经纬度坐标，仅限中国） wgs84ll（ GPS经纬度）默认
 * */
export const api_addressAnalysis = function(data){return $http.get(`${INTERNET_ROOT}/baidu/address`, data)}
