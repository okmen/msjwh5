import { getQueryString } from '@/utils/utils'

export default {
  state: {
    source: getQueryString('source'),
    idCard: getQueryString('idcard'),
    openId: getQueryString('openid')
  }
}
