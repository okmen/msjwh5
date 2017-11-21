<template>
  <div class="form-template">
    <div-select :childInfo="businessType" @getSelected="getBusinessTypeOne"></div-select>
    <div class="form-template-item">
      <span class="form-template-item-left">预约编号</span>
      <input type="text" placeholder="请输入预约编号" class="form-template-item-right" v-model="reserveNum">
    </div>
    <div class="form-template-item">
      <span class="form-template-item-left">证件号码</span>
      <input type="text" placeholder="请输入证件号码" class="form-template-item-right" v-model="IDCardNum">
    </div>
    <div class="form-template-submit" @click="querySubmit">查 询</div>
  </div>
</template>
<script>
  import { resultPost } from 'service/getData'
  import { Toast, MessageBox } from 'mint-ui'
  import {
    getVehicleInfo,
    getDriveInfo
  } from 'config/baseUrl'
  export default {
    data () {
      return {
        businessType: {
          title: '证件名称',
          option: [
            {
              'str': '驾驶证业务',
              'id': 1
            },
            {
              'str': '机动车业务',
              'id': 2
            }
          ]
        },
        businessTypeOne: '', // 业务类型
        reserveNum: '', // 预约编号
        IDCardNum: '' // 证件号码
      }
    },
    components: {
      divSelect: require('components/divSelect.vue')
    },
    methods: {
      // 获取选择的业务类型
      getBusinessTypeOne (val) {
        this.businessTypeOne = val
      },
      // 查询前的校验规则
      beforeSubmit () {
        if (!this.reserveNum) {
          Toast({
            message: '请输入预约编号',
            duration: 2000
          })
          return false
        }
        if (!this.IDCardNum) {
          Toast({
            message: '请输入证件号码',
            duration: 2000
          })
          return false
        }
        return true
      },
      // 查询按钮
      querySubmit () {
        if (!this.beforeSubmit()) return
        let requestData = {
          bookerNumber: this.reserveNum,
          idNumber: this.IDCardNum
        }
        if (this.businessTypeOne === 1) {
          // 驾驶证业务查询
          resultPost(getDriveInfo, requestData).then(data => {
            if (data.code === '0000') {
              let dataInfo = {
                businessTypeName: data.data.businessTypeName,
                name: data.data.name,
                idNumber: data.data.idNumber,
                mobile: data.data.mobile,
                organizationName: data.data.organizationName,
                appointmentDate: data.data.appointmentDate,
                appointmentTime: data.data.appointmentTime,
                businessType: this.businessTypeOne,
                bookerNumber: data.data.bookNumber,
                bookStates: data.data.bookState
              }
              this.$store.commit('saveSuccessInfo', dataInfo)
              this.$router.push(this.isWeChat ? '/querySuccess_WeChat' : '/querySuccess')
            } else {
              MessageBox('提示', data.msg)
            }
          })
        } else {
          // 机动车业务查询
          resultPost(getVehicleInfo, requestData).then(data => {
            if (data.code === '0000') {
              let dataInfo = {
                businessTypeName: data.data.businessTypeName,
                name: data.data.name,
                idNumber: data.data.idNumber,
                mobile: data.data.mobile,
                organizationName: data.data.organizationName,
                appointmentDate: data.data.appointmentDate,
                appointmentTime: data.data.appointmentTime,
                platNumber: data.data.platNumber,
                carTypeName: data.data.carTypeName,
                businessType: this.businessTypeOne,
                bookerNumber: data.data.bookNumber,
                bookStates: data.data.bookState
              }
              this.$store.commit('saveSuccessInfo', dataInfo)
              this.$router.push('/querySuccess')
            } else {
              MessageBox('提示', data.msg)
            }
          })
        }
      }
    }
  }
</script>

