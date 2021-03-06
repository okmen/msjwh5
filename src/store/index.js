import Vue from 'vue'
import Vuex from 'vuex'
import core from './core'
import user from './user'
import motorVehicleAppointment from './modules/motorVehicleAppointment'
import pageRecord from './modules/pageRecord'

Vue.use(Vuex)

const state = {
  passByValue: '',
  illegalPark: {}, // 违停免罚信息
  newLawlessQuery: {},  // 违法处理 车牌号查询结果
  newLawlessDeal: {},   // 违法处理 当前选中违法信息和个人信息
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
  plateType: [
    {name: '蓝牌', value: '02'},
    {name: '黄牌', value: '01'},
    {name: '黑牌', value: '06'},
    {name: '个性牌', value: '02'},
    {name: '小型新能源车号牌', value: '52'},
    {name: '大型新能源车号牌', value: '51'}
  ],
  censusRegister: [
    {name: '深户', value: '1'},
    {name: '非深户', value: '0'},
    {name: '外籍', value: '0'}
  ],
  carSelectData: {
    '01': '大型汽车',
    '02': '小型汽车',
    '03': '使馆汽车',
    '04': '领馆汽车',
    '05': '境外汽车',
    '06': '外籍汽车',
    '07': '普通摩托车',
    '08': '轻便摩托车',
    '09': '使馆摩托车',
    '10': '领馆摩托车',
    '15': '挂车',
    '16': '教练汽车',
    '17': '教练摩托车',
    '18': '实验汽车',
    '19': '实验摩托车',
    '22': '临时行驶车',
    '23': '警用汽车',
    '24': '警用摩托',
    '20': '临时入境车',
    '51': '临时行驶车',
    '52': '新能源小型车'
  },
  moveCarData: [
    {
      name: '大型汽车',
      value: '01'
    },
    {
      name: '小型汽车',
      value: '02'
    },
    {
      name: '使馆汽车',
      value: '03'
    },
    {
      name: '领馆汽车',
      value: '04'
    },
    {
      name: '境外汽车',
      value: '05'
    },
    {
      name: '外籍汽车',
      value: '06'
    },
    {
      name: '两、三轮摩托车',
      value: '07'
    },
    {
      name: '轻便摩托车',
      value: '08'
    },
    {
      name: '使馆摩托车',
      value: '09'
    },
    {
      name: '领馆摩托车',
      value: '10'
    },
    {
      name: '境外摩托车',
      value: '11'
    },
    {
      name: '外籍摩托车',
      value: '12'
    },
    {
      name: '农用运输车',
      value: '13'
    },
    {
      name: '拖拉机',
      value: '14'
    },
    {
      name: '挂车',
      value: '15'
    },
    {
      name: '教练汽车',
      value: '16'
    },
    {
      name: '教练摩托车',
      value: '17'
    },
    {
      name: '试验汽车',
      value: '18'
    },
    {
      name: '试验摩托车',
      value: '19'
    },
    {
      name: '临时入境汽车',
      value: '20'
    },
    {
      name: '试验摩托车',
      value: '21'
    },
    {
      name: '临时行驶车',
      value: '22'
    },
    {
      name: '警用汽车',
      value: '23'
    },
    {
      name: '警用摩托',
      value: '24'
    },
    {
      value: '51',
      name: '新能源大型车'
    },
    {
      value: '52',
      name: '新能源小型车'
    }
  ],
  cardSelectData: [
    {
      'value': 'A',
      'name': '居民身份证'
    },
    {
      'value': 'B',
      'name': '组织机构代码书'
    },
    {
      'value': 'C',
      'name': '军官证'
    },
    {
      'value': 'E',
      'name': '军官离退休证'
    },
    {
      'value': 'D',
      'name': '士兵证'
    },
    {
      'value': 'F',
      'name': '境外人员身份证明'
    },
    {
      'value': 'G',
      'name': '外交人员身份证明'
    },
    {
      'value': 'H',
      'name': '居民户口簿'
    },
    {
      'value': 'J',
      'name': '单位注销证明'
    },
    {
      'value': 'K',
      'name': '居住暂住证明'
    },
    {
      'value': 'L',
      'name': '驻华机构证明'
    },
    {
      'value': 'M',
      'name': '临时居民身份证'
    }
  ],
  appoinSuccess: {
    appoinNum: '',
    appoinType: ''
  }
}

const actions = {
  postAppoin ({ commit }, appoinSuccess) {
    commit('saveAppoin', appoinSuccess)
  }
}

const mutations = {
  saveAppoin (state, appoinSuccess) {
    state.appoinSuccess = appoinSuccess
  },
  savePassByValue (state, value) {
    state.passByValue = value
  },
  saveSuccessInfo (state, value) {
    state.successInfo = value
  },
  saveNewLawlessQuery (state, value) {
    state.newLawlessQuery = value
  },
  saveNewLawlessDeal (state, value) {
    state.newLawlessDeal = value
  },
  saveIllegalPark (state, value) {
    state.illegalPark = value
  }
}

const getters = {
  showAppoin (state) {
    return state.appoinSuccess
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    core,
    user,
    motorVehicleAppointment,
    pageRecord
  }
})
