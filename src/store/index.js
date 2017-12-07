import Vue from 'vue'
import Vuex from 'vuex'
import core from './core'
import user from './user'
import motorVehicleAppointment from './modules/motorVehicleAppointment'

Vue.use(Vuex)

const state = {
  passByValue: '',
  censusRegisterList: [
    {
      'value': '1',
      'name': '深圳'
    },
    {
      'value': '2',
      'name': '港澳台籍'
    },
    {
      'value': '3',
      'name': '外国籍'
    },
    {
      'value': '4',
      'name': '其他'
    }
  ],
  cityArea: [
    {
      'value': '01',
      'name': '福田区'
    },
    {
      'value': '02',
      'name': '罗湖区'
    },
    {
      'value': '03',
      'name': '南山区'
    },
    {
      'value': '04',
      'name': '宝安区'
    },
    {
      'value': '05',
      'name': '龙岗区'
    },
    {
      'value': '06',
      'name': '盐田区'
    },
    {
      'value': '07',
      'name': '龙华新区'
    },
    {
      'value': '08',
      'name': '光明新区'
    },
    {
      'value': '09',
      'name': '坪山新区'
    },
    {
      'value': '10',
      'name': '大鹏新区'
    }
  ],
  cityAreaS: [
    '福田区',
    '罗湖区',
    '南山区',
    '宝安区',
    '龙岗区',
    '盐田区',
    '龙华新区',
    '光明新区',
    '坪山新区',
    '大鹏新区'
  ],
  // 省份简称
  provinceCodeAll: [
    '粤',
    '鄂',
    '豫',
    '皖',
    '赣',
    '冀',
    '鲁',
    '浙',
    '苏',
    '湘',
    '闽',
    '蒙',
    '京',
    '辽',
    '渝',
    '沪',
    '陕',
    '川',
    '黑',
    '晋',
    '桂',
    '吉',
    '宁',
    '贵',
    '琼',
    '甘',
    '青',
    '津',
    '云',
    '藏',
    '新'
  ],
  cartype: [
    {name: '小型普通客车', value: 'K31'},
    {name: '小型越野客车', value: 'K32'},
    {name: '小型轿车', value: 'K33'},
    {name: '小型专用客车', value: 'K34'},
    {name: '微型普通客车', value: 'K41'},
    {name: '微型越野客车', value: 'K42'},
    {name: '微型轿车', value: 'K43'},
    {name: '小型专用校车', value: 'K38'}
  ],
  censusRegister: [
    {name: '深户', value: '1'},
    {name: '非深户', value: '0'},
    {name: '外籍', value: '0'}
  ]
}

const actions = {}

const mutations = {
  savePassByValue (state, value) {
    state.passByValue = value
  },
  saveSuccessInfo (state, value) {
    state.successInfo = value
  }
}

const getters = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    core,
    user,
    motorVehicleAppointment
  }
})
