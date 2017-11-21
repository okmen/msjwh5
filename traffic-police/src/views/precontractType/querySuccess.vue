<template>
  <div class="form-template query-success">
    <div class="query-success-content">
      <div class="item" v-for="(value, key) in dataInfo" v-if="keyListObj[key]">
        <span>{{ keyListObj[key] }}</span>
        ：<span  >{{ valListObj[key] ? valListObj[key][value] : value }}</span>
      </div>
    </div>
    <div class="form-template-submit" @click="cancelReverse" v-if="this.dataInfo.bookStates==='1'">取消预约</div>
    <div class="form-template-submit cancel-btn" v-else>取消预约</div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<style lang="less">
  .query-success{
    height: 100%!important;
  }
  .cancel-btn{
    background: #ccc!important;
    color: #fff!important;
  }
  .query-success-content{
    border:2px solid #ccc;
    border-radius: 8px;
    .item{
      font-size: 32px;
      line-height: 80px;
      padding-left: 20px;
    }
  }
</style>

<script>
  import { resultPost } from 'service/getData'
  import { MessageBox, Toast } from 'mint-ui'
  import {
    cancel
  } from 'config/baseUrl'
  export default {
    // 获取数据
    computed: {
      dataInfo: function () {
        return this.$store.state.successInfo
      },
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    components: {
      'pageBottom': require('../../components/pageBottom')
    },
    data () {
      return {
        keyListObj: {
          businessTypeName: '业务类型',
          name: '车主姓名',
          idNumber: '证件号码',
          mobile: '手机号码',
          organizationName: '预约地点',
          appointmentDate: '预约日期',
          appointmentTime: '预约时间',
          platNumber: '号牌号码',
          carTypeName: '车辆类型',
          bookStates: '预约状态'
        },
        valListObj: {
          bookStates: {
            '1': '预约中',
            '2': '预约完成',
            '3': '失约',
            '4': '预约取消'
          }
        }
      }
    },
    methods: {
      // 取消预约
      /*eslint-disable*/
      cancelReverse () {
        MessageBox.confirm('确定取消预约?').then(action => {
          let requestData = {
            mobile: this.dataInfo.mobile,
            businessType: this.dataInfo.businessType,
            bookerNumber: this.dataInfo.bookerNumber,
            organizationName: this.dataInfo.organizationName,
            appointmentDate: this.dataInfo.appointmentDate,
            appointmentTime: this.dataInfo.appointmentTime,
            openId: window.localStorage.getItem('openId'),
            businessTypeName: this.dataInfo.businessTypeName
          }
          resultPost(cancel, requestData).then(data => {
            if (data.code === '0000') {
              MessageBox.alert('您已成功取消本次预约').then(action => {
                this.$root.$router.isWeChat ? window.location.href = data.msg : this.$router.push('/')
              })
            } else {
              Toast({
                message: data.data + data.msg,
                duration: 2000
              })
            }
          })
        })
      }
    }
  }
</script>
