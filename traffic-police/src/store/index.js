import Vue from 'vue'
import Vuex from 'vuex'
import motorVehicleAppointment from './modules/motorVehicleAppointment'
import pageRecord from './modules/pageRecord'
Vue.use(Vuex)

const state = {
  newLawlessQuery: {},  // 违法处理 车牌号查询结果
  newLawlessDeal: {},   // 违法处理 当前选中违法信息和个人信息
  motorVehicleHandling: {},  // 机动车办理类业务传值
  successInfo: {}, // 提交成功页面数据 type 为 1 申办成功, 为 2 预约成功
  illegalPark: {}, // 违停免罚信息
  earlyLawless: {}, // 交通违法预约数据
  appoinSuccess: {
    appoinNum: '',
    appoinType: ''
  },
  userInfo: {
    applicationType: '',
    IDcard: '',
    phoneNumber: '',
    userName: ''
  },
  informSuccess: {
    takePicturesRecord: '',
    takePicturesPassword: ''
  },
  appealQuery: [],
  licenseSelectData: [
    {
      'str': '蓝牌',
      'type': '02'
    },
    {
      'str': '黄牌',
      'type': '01'
    },
    {
      'str': '黑牌',
      'type': '06'
    },
    {
      'str': '个性牌',
      'type': '02'
    },
    {
      'str': '小型新能源车号牌',
      'type': '52'
    },
    {
      'str': '大型新能源车号牌',
      'type': '51'
    }
  ]
}

const actions = {
  postAppoin ({ commit }, appoinSuccess) {
    commit('saveAppoin', appoinSuccess)
  },
  postInform ({ commit }, informSuccess) {
    commit('saveInform', informSuccess)
  },
  postAppealQuery ({ commit }, appealQuery) {
    commit('saveAppealQuery', appealQuery)
  }
}

const mutations = {
  saveAppoin (state, appoinSuccess) {
    state.appoinSuccess = appoinSuccess
  },
  saveInform (state, informSuccess) {
    state.informSuccess = informSuccess
  },
  saveAppealQuery (state, appealQuery) {
    state.appealQuery = appealQuery
  },
  getUserInfo (state, to) {
    state.userInfo.applicationType = to.meta.title
    state.userInfo.IDcard = window.localStorage.getItem('identityCard')
    state.userInfo.phoneNumber = window.localStorage.getItem('mobilePhone')
    state.userInfo.userName = window.localStorage.getItem('userName')
  },
  saveMotorVehicleHandling (state, value) {
    state.motorVehicleHandling = value
  },
  saveSuccessInfo (state, value) {
    state.successInfo = value
  },
  saveEarlyLawLess (state, value) {
    state.earlyLawless = value
  },
  saveIllegalPark (state, value) {
    state.illegalPark = value
  },
  saveNewLawlessQuery (state, value) {
    state.newLawlessQuery = value
  },
  saveNewLawlessDeal (state, value) {
    state.newLawlessDeal = value
  }
}

const getters = {
  showAppoin (state) {
    return state.appoinSuccess
  },
  getMotorVehicleHandling (state) {
    return state.motorVehicleHandling
  },
  showInform (state) {
    return state.informSuccess
  },
  showAppealQuery (state) {
    return state.appealQuery
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    motorVehicleAppointment,
    pageRecord
  }
})
