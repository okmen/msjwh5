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
  ]
}

const actions = {}

const mutations = {}

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
