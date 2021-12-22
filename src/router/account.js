/**
 * 账号配置
 * */
const accountList = resolve => require.ensure([], () => resolve(require('@/views/account/list')));
const accountAdd = resolve => require.ensure([], () => resolve(require('@/views/account/add')));
const accountDetail = resolve => require.ensure([], () => resolve(require('@/views/account/detail')));

let account_router = [];

account_router = account_router.concat([
  {
    path: '/account/list',
    name: 'account-list',
    component: accountList,
    meta: {
      title: '账号管理',
      keepAlive: true
    }
  },
  {
    path: '/account/add',
    name: 'account-add',
    component: accountAdd,
    meta: {
      title: '新增账号'
    }
  },
  {
    path: '/account/detail',
    name: 'account-detail',
    component: accountDetail,
    meta: {
      title: '账号详情'
    }
  }
]);

export default account_router
