/**
 * 账号配置
 * */
 const messageList = resolve => require.ensure([], () => resolve(require('@/views/message/list.vue')));
 const messageEdit = resolve => require.ensure([], () => resolve(require('@/views/message/edit.vue')));
 
 let message_router = [];
 
 message_router = message_router.concat([
   {
     path: '/message/list',
     name: 'message-list',
     component: messageList,
     meta: {
       title: '短信配置',
       keepAlive: true
     }
   },
   {
    path: '/message/edit',
    name: 'message-edit',
    component: messageEdit,
    meta: {
      title: '短信配置',
    }
  },
 ]);
 
 export default message_router
 