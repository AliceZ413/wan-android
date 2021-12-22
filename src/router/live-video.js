/**
 * 视频
 * */
 const liveVideo = resolve => require.ensure([], () => resolve(require('@/views/live-video/live-video.vue')));
 
 let video_router = [];
 
 video_router = video_router.concat([
   {
     path: '/live-video/index',
     name: 'liveVideo',
     component: liveVideo,
     meta: {
       title: '实时视频',
       keepAlive: false
     }
   },
 ]);
 
 export default video_router
 