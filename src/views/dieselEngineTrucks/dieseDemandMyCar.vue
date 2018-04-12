<template>
  <div class="dieseDemandMyCar">
    <ul>
      <li v-for="(item, index) of dieseDemandData" :key="index">
        <p><img src="/assets/images/certificates.png" alt=""><span>{{item.licenseNumber}}</span></p>
        <p>车牌类型&nbsp;:&nbsp;{{typeData[item.numberPlate]}}</p>
        <p>车辆卡号&nbsp;:&nbsp;{{item.rfId}}</p>
        <p>车辆类型&nbsp;:&nbsp;{{cartype[item.carType]}}</p>
        <p>车辆状态&nbsp;:&nbsp;已通过</p>
      </li>
    </ul>
    <p class="txt-noMsg" v-if="isShowMsg">未查询到相关数据</p>
  </div>
</template>

<script>
import { queryInformationCollection2 } from '@/config/baseURL'
import numberType from '../../../src/config/numberType'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      loginUser: window.localStorage.getItem('identityCard'),
      dieseDemandData: [],
      typeData: numberType,
      isShowMsg: false,
      cartype: {
        'H37': '轻型自卸货车'
      }
    }
  },
  mounted () {
    let reqData = {
      loginUser: this.loginUser
    }
    this.$axios.post(queryInformationCollection2, reqData).then(json => {
      if (json.code === '0000') {
        this.dieseDemandData = json.data
        if (this.dieseDemandData.length === 0) {
          this.isShowMsg = true
        }
      } else {
        Toast({message: json.msg, position: 'bottom', className: 'white'})
      }
    })
  }
}
</script>

<style lang="less" scoped>
.dieseDemandMyCar {
  padding-top: 20px;
  li {
    margin-bottom: 20px;
    padding: 40px;
    background-color: #fff;
    p {
      font-size: 28px;
      margin: 10px 0;
      &:first-child {
        margin-bottom: 40px;
      }
    }
  }
  img {
    margin-right: 20px;
    width: 48px;
    height: 48px;
    vertical-align: middle;
  }
  .txt-noMsg {
    text-align: center;
  }
}
</style>
