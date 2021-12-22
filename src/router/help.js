/**
 * 账号配置
 * */
 const help = resolve => require.ensure([], () => resolve(require('@/views/help/help.vue')));
 const gzpc = resolve => require.ensure([], () => resolve(require('@/views/help/gzpc.vue')));
 const contactUs = resolve => require.ensure([], () => resolve(require('@/views/help/contact-us.vue')));
 
 let help_router = [];
 
 help_router = help_router.concat([
   {
     path: '/help',
     name: 'help',
     component: help,
     meta: {
       title: '帮助',
       keepAlive: true
     }
   },
   {
     path: '/help/gzpc',
     name: 'gzpc',
     component: gzpc,
     meta: {
       title: '现场故障排查指引',
       keepAlive: true,
     }
   },
   {
      path: '/help/contact-us',
      name: 'contact-us',
      component: contactUs,
      meta: {
        title: '联系我们',
        keepAlive: true,
      }
   }
 ]);
 
 export default help_router
 