import axios from './../utils/axios'
import { getUserM } from './../config/baseURL'

export default {
  state: {
    // 用户名字
    userName: null,
    // 车牌类型
    plateType: null,
    // 昵称
    nickname: null,
    // 车牌号码
    myNumberPlate: null,
    // 手机号码
    mobilePhone: null,
    // 身份证
    identityCard: null,
    // 档案号
    fileNumber: null,
    // 绑车
    cars: null,
    // 车架号后四位
    behindTheFrame4Digits: null,
    // 登录状态
    isLogin: null
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
    },
    updataUserG ({ commit }, value) {
      let localStorage = window.localStorage
      let state = {}
      state.cars = value.cars || []
      localStorage.setItem('cars', JSON.stringify(state.cars))
      state.cars.forEach(item => {
        if (item.isMySelf === '0' || item.isMySelf === 0 || item.isMySelf === '本人') {
          state.myNumberPlate = item.myNumberPlate
          state.behindTheFrame4Digits = item.behindTheFrame4Digits
          state.plateType = item.plateType
          localStorage.setItem('myNumberPlate', state.myNumberPlate)
          localStorage.setItem('behindTheFrame4Digits', state.behindTheFrame4Digits)
          localStorage.setItem('plateType', state.plateType)
        }
      })
      if (value.driverLicenceInfoList) {
        state.fileNumber = value.driverLicenceInfoList[0].fileNumber
      }
      state.identityCard = value.authenticationBasicInformation.identityCard
      state.mobilePhone = value.authenticationBasicInformation.mobilephone
      state.userName = value.authenticationBasicInformation.trueName
      state.bindDriverLicence = value.authenticationBasicInformation.bindDriverLicence
      if (value.fileNumber) {
        state.bindDriverLicence = '1'
      }
      state.isLogin = true
      localStorage.setItem('fileNumber', state.fileNumber)
      localStorage.setItem('identityCard', state.identityCard)
      localStorage.setItem('mobilePhone', state.mobilePhone)
      localStorage.setItem('userName', state.userName)
      localStorage.setItem('bindDriverLicence', state.bindDriverLicence)
      localStorage.setItem('isLogin', state.isLogin)
      commit('updataUser', state)
    }
  }
}
