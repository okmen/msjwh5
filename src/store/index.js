import Vue from 'vue'
import Vuex from 'vuex'
import core from './core'
import user from './user'

Vue.use(Vuex)

const state = {
}

const actions = {
}

const mutations = {
}

const getters = {
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    core,
    user
  }
})
