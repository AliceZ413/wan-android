import p404 from '@/../components/ui/status/404'
// 正式版发布请移除此demo路由
// import demo from '@/../components/demo/router/index';
const hwVideo = resolve => require.ensure([], () => resolve(require('@/views/hw-no1/video')));
const historyTrail = resolve => require.ensure([], () => resolve(require('@/views/hw-no1/history-trail')));
const historyPic = resolve => require.ensure([], () => resolve(require('@/views/hw-no1/history-pic')));
const historyPicNext = resolve => require.ensure([], () => resolve(require('@/views/hw-no1/history-pic-next')));
const historyPicDetail = resolve => require.ensure([], () => resolve(require('@/views/hw-no1/history-pic-detail')));
import account_router from './account'
import message_router from './message'
import device_router from './device'
import help_router from './help'
import video_router from './live-video';

let routes = [];

//发布正式版的时候请不要使用demo
routes = routes.concat(account_router).concat(message_router).concat(device_router).concat(help_router).concat(video_router).concat([
  {
    path:'*',
    component: p404
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/home/layout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/home.vue'),
      }
    ],
  },
  {
    path:  '/device/video',
    name: 'hw-no1-video',
    component: hwVideo,
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/device/video/history-trail',
    name: 'history-trail',
    component: historyTrail
  },
  {
    path: '/device/video/history-pic',
    name: 'history-pic',
    component: historyPic,
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/device/video/history-pic-next',
    name: 'history-pic-next',
    component: historyPicNext,
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/device/video/history-pic-detail',
    name: 'history-pic-detail',
    component: historyPicDetail,
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/test/test.vue'),
  // }
]);

export default routes
