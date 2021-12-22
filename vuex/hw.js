
module.exports = {
  namespaced: true, // 为了解决不同模块命名冲突的问题
  state: () => ({
    //保存页面元素滚动位置，格式：scrollId: {x: 0, y: 0}
    refresh: false,
  }),
  mutations: {
    setRefresh (state,  value) {
      // 这里的 `state` 对象是模块的局部状态
      state.refresh = value;
    }
  },
  getters: {
    refresh (state) {
      return state.refresh;
    }
  }
}
