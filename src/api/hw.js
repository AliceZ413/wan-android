import $http from '@/../resource/js/http';
import config from '@/../resource/context';

/* 获取异常行为列表 */
export const api_getCaptainListByShipCode = function(data){return $http.post(`${config.AI_ROOT}/captain/getCaptainListByShipCode`,data)}

/* 获取驾驶舱详情 */
export const api_getCaptainShipByShipCode = function(data){return $http.post(`${config.AI_ROOT}/captain/getCaptainShipByShipCode`,data)}

/* 获取实时视频 */
export const api_getNowStreamByStreamId = function(data){return $http.post(`${config.AI_ROOT}/ferry/getNowStreamByStreamId`,data)}

/**
 * 新增用户
 * userName 用户姓名
 * userMobile 用户手机号
 * remark 备注
 * userId
 * companyUuid
 * manageShipList
 * */
export const api_addCaptainUser = function(data){return $http.post(`${config.AI_MAIN}/captainUser/addCaptainUser`, data)}

/**
 * 删除用户船舶
 * recordUuid
 * deleteBy
 * */
export const api_delManageShip = function(data){return $http.post(`${config.AI_MAIN}/captainUser/delManageShip`, data)}

/**
 * 获取用户列表
 * companyUuid  公司uuid
 * */
export const api_getCompanyUser = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/getCompanyUser`, data)}

/**
 * 删除用户
 * userId
 * isDefault
 * */
export const api_delCaptainUser = function(data){return $http.post(`${config.AI_MAIN}/captainUser/delCaptainUser`, data)}

/**
 * 获取公司船舶
 * companyUuid
 * */
export const api_getCompanyShip = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/getCompanyShip`, data)}

/**
 * 获取用户详情
 * userId
 * isDefault
 * */
export const api_getUserInfo = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/getUserInfo`, data)}

/**
 * 查看用户短信预警配置
 * shipUuid
 * userId
 * */
 export const api_getUserMessageInfo = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/getUserMessageInfo`, data)}

/**
* 修改用户短信预警配置
* */
 export const api_updateUserMessageInfo = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/updateUserMessageInfo`, data)}
 
/**
 * 获取设备预警详情
 * shipUuid
 * userId
 * */
 export const api_getDeviceInfo = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/getDeviceInfo`, data)}

 /**
 * 修改设备预警详情
 * */
  export const api_updateDeviceInfo = function(data){return $http.post(`${config.AI_ROOT}/captainHwManage/updateDeviceInfo`, data)}

  /**
   * 获取范围时间内的异常列表
  */
 export const api_getCaptainListByShipCodeV2 = function(data) { return $http.post(`${config.AI_ROOT}/captain/getCaptainListByShipCodeV2`, data) }

 /**
  * 获取某个时间段的船舶轨迹
 */
 export const api_getTrail = function(data) { return $http.post(`${config.AI_ROOT}/captain/getTrail`, data) }

 /**
  * 获取船舶历史轨迹
 */
 export const api_getHistoryGpsMessage = function(data) { return $http.post(`${config.AI_ROOT}/captain/getHistoryGpsMessage`, data) }

 /**
  * 船舶历史图片-获取封面
  */
 export const api_getPhotoCover = function(data) { return $http.post(`${config.AI_ROOT}/captain/getPhotoCover`, data) }

  /**
  * 船舶历史图片-获取小时内所有图片
  * shipId 船舶id
  * start 开始时间
  * end 结束时间
  * behavior 异常行为，使用逗号隔开
  * page 页数
  * size 页量
  */
   export const api_getPhotoList = function(data) { return $http.post(`${config.AI_ROOT}/captain/getPhotoList`, data) }

  /**
  * 直接修改用户的短信配置权限
  * recordUuid 公司管理用户的记录id
  * isMessage 是否启用短信配置 0启用 1禁用
  */
  export const api_updateIsMessage = function(data) { return $http.post(`${config.AI_ROOT}/captainHwManage/updateIsMessage`, data) }

  /**
   * 获取用户身份信息
   */ 
  export const api_getUserInfoByUserId = function(data) { return $http.post(`${config.AI_ROOT}/captainHwManage/getUserRole`, data) }

  /**
   * 获取公司列表
   * */ 
  export const api_getCompany = function(data) { return $http.post(`${config.AI_ROOT}/captainHwManage/getCompany`, data) }

  /**
  * 获取船舶实时视频
  * */
  export const api_getRealVideo = function(data) { return $http.post(`${config.AI_ROOT}/ferry/getNowStream`, data) }