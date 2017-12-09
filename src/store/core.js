import { getQueryString } from '@/utils/utils'

export default {
  state: {
    source: getQueryString('source'),
    idCard: getQueryString('idCard') || getQueryString('idcard'),
    openId: window.localStorage.getItem('openid')
  },
  getters: {
    // URL 查询参数
    queryURL (state) {
      let query = {}
      query.source = state.source
      return query
    }
  }
}
