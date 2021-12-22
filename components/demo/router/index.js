//CMD风格的异步加载
const index = resolve => require.ensure([], () => resolve(require('../views/index')));

/* 业务类 */
const orgPicker = resolve => require.ensure([], () => resolve(require('../views/component/service/org-picker')));
const crewBasic = resolve => require.ensure([], () => resolve(require('../views/component/service/crew/crew-basic')));
const crewCert = resolve => require.ensure([], () => resolve(require('../views/component/service/crew/crew-cert')));
const crewServe = resolve => require.ensure([], () => resolve(require('../views/component/service/crew/crew-serve')));
const crew = resolve => require.ensure([], () => resolve(require('../views/component/service/crew/crew')));
const shipCrew = resolve => require.ensure([], () => resolve(require('../views/component/service/ship/ship-crew')));
const validateCode = resolve => require.ensure([], () => resolve(require('../views/component/service/validate-code')));

/* UI类 */
const signature = resolve => require.ensure([], () => resolve(require('../views/component/ui/signature')));
const scroller = resolve => require.ensure([], () => resolve(require('../views/component/ui/scroller')));
// const showExcel = resolve => require.ensure([], () => resolve(require('../views/component/ui/show-excel')));
const tabs = resolve => require.ensure([], () => resolve(require('../views/component/ui/nav-tab')));
const popupSearch = resolve => require.ensure([], () => resolve(require('../views/component/ui/popup-search')));
const call = resolve => require.ensure([], () => resolve(require('../views/component/ui/call')));
const sms = resolve => require.ensure([], () => resolve(require('../views/component/ui/sms')));
const scrollLoader = resolve => require.ensure([], () => resolve(require('../views/component/ui/scroll-loader')));
const radio = resolve => require.ensure([], () => resolve(require('../views/component/ui/demo-radio')));
const checkbox = resolve => require.ensure([], () => resolve(require('../views/component/ui/demo-checkbox')));
const showPDF = resolve => require.ensure([], () => resolve(require('../views/component/ui/show-pdf')));
const mapPoint = resolve => require.ensure([], () => resolve(require('../views/component/ui/demo-map-point')));

/* 工具类 */
const util = resolve => require.ensure([], () => resolve(require('../views/component/ui/util')));
const sdk = resolve => require.ensure([], () => resolve(require('../views/component/ui/sdk')));

let demo = [
  {
    path: '/demo',
    component:index
  },

  // 业务
  {
    path: '/demo/component/org-picker',
    component: orgPicker,
    meta: {
      title: '机构选择组件演示'
    }
  },
  {
    path: '/demo/component/crew/crew-basic',
    component: crewBasic,
    meta: {
      title: '船员基础信息组件演示'
    }
  },
  {
    path: '/demo/component/crew/crew-cert',
    component: crewCert,
    meta: {
      title: '船员证书查询组件演示'
    }
  },
  {
    path: '/demo/component/crew/crew-serve',
    component: crewServe,
    meta: {
      title: '船员服务资历查询组件演示'
    }
  },
  {
    path: '/demo/component/crew/crew',
    component: crew,
    meta: {
      title: '船员信息组件演示'
    }
  },
  {
    path: '/demo/component/ship/ship-crew',
    component: shipCrew,
    meta: {
      title: '在船船员组件演示'
    }
  },
  {
    path: '/demo/component/validate-code',
    component: validateCode,
    meta: {
      title: '验证码组件演示'
    }
  },
  // UI组件
  {
    path: '/demo/component/tabs',
    component: tabs,
    meta: {
      title: '头部选项卡组件演示'
    }
  },
  {
    path: '/demo/component/signature',
    component: signature,
    meta: {
      title: '签名版组件演示'
    }
  },
  {
    path: '/demo/component/scroller',
    component: scroller,
    meta: {
      title: '滚动加载组件',
      keepAlive: true
    }
  },
  // {
  //   path: '/demo/component/show-excel',
  //   component: showExcel,
  //   meta: {
  //     title: 'excel预览组件'
  //   }
  // },
  {
    path: '/demo/component/popup-search',
    component: popupSearch,
    meta: {
      title: '弹出搜索组件演示'
    }
  },
  {
    path: '/demo/component/call',
    component: call,
    meta: {
      title: '拨打电话组件演示'
    }
  },
  {
    path: '/demo/component/sms',
    component: sms,
    meta: {
      title: '发送短信组件演示'
    }
  },
  {
    path: '/demo/component/scroll-loader',
    component: scrollLoader,
    meta: {
      title: '上拉刷新下拉加载'
    }
  },
  {
    path: '/demo/component/demo-radio',
    component: radio,
    meta: {
      title: '单选组件'
    }
  },
  {
    path: '/demo/component/demo-checkbox',
    component: checkbox,
    meta: {
      title: '多选组件'
    }
  },
  {
    path: '/demo/component/show-pdf',
    component: showPDF,
    meta: {
      title: 'PDF预览组件'
    }
  },
  {
    path: '/demo/component/map-point',
    component: mapPoint,
    meta: {
      title: '地图选点组件'
    }
  },

  // 工具演示
  {
    path: '/demo/component/util',
    component: util,
    meta: {
      title: '基础工具类演示'
    }
  },
  {
    path: '/demo/component/sdk',
    component: sdk,
    meta: {
      title: '高级工具类演示'
    }
  }
];
export default demo;
