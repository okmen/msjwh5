// 保存页面记录
export default {
  state: {
    data: {}
  },
  mutations: {
    // 保存记录
    savePageRecord (state, data) {
      state.data = data
    }
  }
}
