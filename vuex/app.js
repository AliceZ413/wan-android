/**
 * 请不要改动此文件，否则更新配置会造成你的改动被覆盖
 * 应用配置
 * */
module.exports = {
  namespaced: true, // 为了解决不同模块命名冲突的问题
  state: () => ({
    //保存页面元素滚动位置，格式：scrollId: {x: 0, y: 0}
    scrollPositions: {},
    primaryColor: '#fc966d',
  }),
  mutations: {
    setScroll (state,  value) {
      // 这里的 `state` 对象是模块的局部状态
      let id = value.id;
      delete value.id;
      state.scrollPositions[id] = value;
    }
  },
  getters: {
    scrollPositions (state) {
      return state.scrollPositions;
    }
  }
}
