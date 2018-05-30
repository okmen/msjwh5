<template>
  <div class="appealQuery">
    <g-input title="姓名" v-model="userName" readonly></g-input>
    <g-input title="联系方式" v-model="mobilePhone" readonly></g-input>
    <g-input title="身份号码" v-model="identityCard" readonly></g-input>
    <g-select title="名下车辆" :data="cars" v-model="myNumberPlate" @getSelected="getCensusRegisterIndex"></g-select>
    <g-input title="号牌种类" v-model="plateTypeList[plateType]" readonly></g-input>
    <g-input title="车架号" v-model="behindTheFrame4Digits" readonly></g-input>
    <g-button text="查询" @click.native="confirmInfo"></g-button>
    <div class="hint">
      <h4>温馨提示：</h4>
      <p>对交通安全违法行为记录有异议的（如已作出处罚决定，应该申请行政复议和提起行政诉讼），请详细填写申诉内容，我们会安排专人与您联系办理</p>
  </div>
  </div>
</template>

<script>
import { queryLawlessByCar } from '@/config/baseURL'
export default {
  name: 'appealQuery',
  data () {
    return {
      userName: '',
      mobilePhone: '',
      identityCard: '',
      cars: [],
      myNumberPlate: '',
      plateType: '',
      plateTypeList: {
        '02': '蓝牌',
        '01': '黄牌',
        '06': '黑牌',
        '99': '无'
      },
      behindTheFrame4Digits: '',
      idCard: '',
      licensePlateNo: ''
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    },
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.val = this.$store.state.user
    let car = this.val.cars || []
    if (car.length !== 0 && car.myNumberPlate) {
      this.$MessageBox('提示', '当前用户没有车辆信息')
      return false
    }
    this.userName = this.val.userName
    this.mobilePhone = this.val.mobilePhone
    this.identityCard = this.val.identityCard
    this.val.cars.map(item => {
      this.cars.push({name: item.myNumberPlate, value: item.plateType, behindTheFrame4Digits: item.behindTheFrame4Digits, identityCard: item.identityCard})
    })
    // 初始化数据
    this.behindTheFrame4Digits = this.cars[0].behindTheFrame4Digits
    this.plateType = this.cars[0].value
    this.myNumberPlate = this.cars[0].value
    this.idCard = this.cars[0].identityCard
    this.licensePlateNo = this.cars[0].name
  },
  methods: {
    getCensusRegisterIndex (str) {
      // 名下车辆对应数据
      this.behindTheFrame4Digits = this.cars[str].behindTheFrame4Digits
      this.plateType = this.cars[str].value
      this.idCard = this.cars[str].identityCard
      this.licensePlateNo = this.cars[str].name
    },
    confirmInfo () {
      let reqData = {
        sourceOfCertification: 'C',
        licensePlateNo: this.licensePlateNo,         // 车牌号码
        licensePlateType: this.plateType,            // 车牌类型
        vehicleIdentifyNoLast4: this.behindTheFrame4Digits,  // 车架号
        identityCard: this.idCard,             // 身份证
        mobilephone: this.mobilePhone          // 手机号码
      }
      console.log(reqData)
      this.$axios.post(queryLawlessByCar, reqData).then(json => {
        if (json.code === '0000') {
          let lawlessData = {
            info: {
              behindTheFrame4Digits: reqData.vehicleIdentifyNoLast4,
              plateType: reqData.licensePlateType,
              myNumberPlate: reqData.myNumberPlate,
              mobilephone: reqData.mobilephone,
              identityCard: reqData.identityCard
            },
            data: json.data
          }
          this.$store.commit('saveNewLawlessQuery', lawlessData)
          this.$router.push({path: '/newLawlessMsg', query: this.queryURL})
        } else {
          this.$toast(json.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .appealQuery {
    .hint {
      padding: 10px 36px;
    }
  }
</style>
