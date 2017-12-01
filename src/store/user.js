import axios from './../utils/axios'
import { getUserM } from './../config/baseURL'

export default {
  state: {
    address: null,
    bindDriverLicence: null,
    bindVehicle: null,
    certTime: null,
    driverLicenceInfoList: null,
    identityCard: null,
    mobilephone: null,
    name: null,
    placeOfDomicile: null,
    userRole: null,
    userStatus: null,
    vehicleInfoList: null
  },
  mutations: {
    updataUser (state, value) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const element = value[key]
          state[key] = element
        }
      }
    }
  },
  actions: {
    // 民生警务获取用户数据
    updataUserM ({ commit, rootState }) {
      axios.post(getUserM, {
        identityCard: rootState.core.idCard
      }).then(data => {
        if (data.code === '0000') {
          commit('updataUser', data.data)
        }
      })
    }
  }
}
