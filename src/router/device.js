/**
 * 账号配置
 * */
 const deviceList = resolve => require.ensure([], () => resolve(require('@/views/device/list.vue')));
 const deviceEdit = resolve => require.ensure([], () => resolve(require('@/views/device/edit.vue')));
 
 let device_router = [];
 
device_router = device_router.concat([
   {
     path: '/device/list',
     name: 'device-list',
     component: deviceList,
     meta: {
       title: '设备配置',
       keepAlive: true
     }
   },
   {
    path: '/device/edit',
    name: 'device-edit',
    component: deviceEdit,
    meta: {
      title: '设备配置',
    }
  },
 ]);
 
 export default device_router
 