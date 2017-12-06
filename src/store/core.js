import { getQueryString } from '@/utils/utils'

export default {
  state: {
    source: getQueryString('source'),
    idCard: getQueryString('idCard') || getQueryString('idcard'),
    openId: getQueryString('openId') || getQueryString('openid')
  },
  getters: {
    // URL 查询参数
    queryURL (state) {
      let query = {}
      query.source = state.source
      if (query.source === 'M') {
        query.idCard = state.idCard
        query.openId = state.openId
      }
      return query
    }
  }
}
