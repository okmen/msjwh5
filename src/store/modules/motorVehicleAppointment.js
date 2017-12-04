/**
 * Created by Administrator on 2017/7/18.
 */
/* 机动车预约类 */
const motorVehicleAppointment = {
  state: {
    modelOfCar: '', // 车辆型号
    credentialsName: '', // 证件类型
    businessTypeId: '', // 业务类型
    carSelectData: '',  // 车辆类型
    pointerType: '', // 指标类型
    appointmentLocation: '', // 预约地点
    useNature: '' // 使用性质
  },
  mutations: {
    saveModelOfCar (state, data) {
      state.modelOfCar = data
    },
    saveCarSelectData (state, data) {
      state.carSelectData = data
    },
    saveCredentialsName (state, data) {
      state.credentialsName = data
    },
    savePointerType (state, data) {
      state.pointerType = data
    },
    saveAppointmentLocation (state, data) {
      state.appointmentLocation = data
    },
    saveUseNature (state, data) {
      state.useNature = data
    }
  },
  getters: {
    getAppointmentLocationAll (state) {
      return state.appointmentLocation
    },
    getModelOfCar (state) {
      let option = []
      if (!state.modelOfCar) {
        return {
          'title': '车辆型号',
          'option': option
        }
      } else {
        return {
          'title': '车辆型号',
          'option': state.modelOfCar
        }
      }
    },
    getCarSelectData (state) {
      let option = []
      if (!state.carSelectData) {
        return {
          'title': '车辆类型',
          'option': option
        }
      }
      state.carSelectData.map(item => {
        option.push({'str': item.name, 'id': item.id})
      })
      return {
        'title': '车辆类型',
        'option': option
      }
    },
    getCredentialsName (state) {
      let option = []
      if (!state.credentialsName) {
        return {
          'title': '证件名称',
          'option': option
        }
      }
      state.credentialsName.map(item => {
        option.push({'str': item.name, 'id': item.id})
      })
      return {
        'title': '证件名称',
        'option': option
      }
    },
    getPointerType (state) {
      let option = []
      if (!state.pointerType) {
        return {
          'title': '指标类型',
          'option': option
        }
      }
      state.pointerType.map(item => {
        option.push({'str': item.name, 'id': item.id})
      })
      return {
        'title': '指标类型',
        'option': option
      }
    },
    getAppointmentLocation (state) {
      let option = []
      if (!state.appointmentLocation) {
        return {
          'title': '预约地点',
          'option': option
        }
      }
      state.appointmentLocation.map(item => {
        option.push({'str': item.name, 'id': item.id})
      })
      return {
        'title': '预约地点',
        'option': option
      }
    },
    getUseNature (state) {
      let option = []
      if (!state.useNature) {
        return {
          'title': '使用性质',
          'option': option
        }
      }
      state.useNature.map(item => {
        option.push({'str': item.name, 'id': item.id})
      })
      return {
        'title': '使用性质',
        'option': option
      }
    }
  }
}

export default motorVehicleAppointment
