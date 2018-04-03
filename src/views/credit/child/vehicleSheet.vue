<template>
  <div class="vehicleSheet">
    <g-input title="申请类型" v-model="applyType" readonly></g-input>
    <g-input title="姓名" v-model="userName" readonly></g-input>
    <g-input title="身份证号" v-model="identityCard" readonly></g-input>
    <g-input title="联系电话" v-model="mobilePhone" readonly></g-input>
    <g-select title="车牌号码" :data="plateNumberData" v-model="plateNumber" ref="plateNumberName"></g-select>
    <g-select title="车牌类型" :data="plateSelectData" v-model="plateSelect" ref="plateSelectName"></g-select>
    <g-button text="提交" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
  import {submitApplicationForMotorVehicleInformation} from '@/config/baseURL.js'
  export default {
    data () {
      return {
        applyType: '',
        userName: '',
        identityCard: '',
        mobilePhone: '',
        // plateNumberData: [],
        plateNumber: '0',
        plateSelect: '02'
      }
    },
    computed: {
      plateNumberData () {
        var plateInfo = {
          title: '车牌号码',
          option: []
        }
        let cars = this.$store.state.user.cars
        if (!cars) return plateInfo.option
        cars.map((item, index) => {
          if (+item.isMySelf === 0) {
            plateInfo.option.push({'name': item.myNumberPlate, 'value': index + ''})
          }
        })
        return plateInfo.option
      },
      plateSelectData () {
        return this.$store.state.plateType
      },
      queryURL () {
        return this.$store.getters.queryURL
      },
      user () {
        return Object.assign({}, this.$store.state.user)
      }
    },
    created () {
      this.applyType = this.$route.meta.title
      this.userName = this.user.userName
      this.identityCard = this.user.identityCard
      this.mobilePhone = this.user.mobilePhone
    },
    methods: {
      confirmInfo () {
        let obj = {
          applyType: '1',
          applyName: this.userName,
          identityCard: this.identityCard,
          applyPhone: this.mobilePhone,
          licensePlateNumber: this.$refs.plateNumberName.currentName,
          plateType: this.plateSelect
        }
        this.$axios.post(submitApplicationForMotorVehicleInformation, obj).then(
            json => {
              console.log(json)
              if (json.code === '0000') {
                let appoinSuccess = this.$store.state.appoinSuccess
                appoinSuccess.appoinType = this.applyType.applicationType
                appoinSuccess.appoinNum = json.msg.replace(/[^0-9]/ig, '')
                this.$router.push({path: '/appointSuccess', query: this.queryURL})
              } else if (json.code === '0001') {
                this.$MessageBox({
                  title: '提示',
                  message: json.msg
                })
              }
            }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  .vehicleSheet {
    padding: 40px 0;
  }
  .warm-prompt {
    padding-top: 40px;
    margin-left: 50px;
    margin-right: 50px;
  }
  .warm-prompt-title {
    font-size: 30px;
    color: #333;
    line-height: 60px;
  }
  .warm-prompt-content {
    font-size: 26px;
    color: #666;
    text-indent: 2em;
  }
</style>
