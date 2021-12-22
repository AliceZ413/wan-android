import $http from '../../resource/js/http';
import config from '../../resource/context';

/* 获取banner */
export const api_getBanner = function (data) {
  return $http.get(`${config.WA}/banner/json`, data);
}
