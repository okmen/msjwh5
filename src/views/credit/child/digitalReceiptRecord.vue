<template>
  <div id="digRecord">
    <div class="digRecord-top">共有<span>{{this.digitData.length}}</span>条缴款记录</div>
    <div class="digRecord-nav" v-for="(item, index) in digitData">
      <div class="digRecord-nav-one digRecord-p">
        <p>缴款成功</p>
        <p>{{item.writeOffDate}}</p>
        <p>{{item.amt}}元</p>
      </div>
      <div class="digRecord-nav-two digRecord-p">
        <p>缴款编号:<span>{{item.billNo}}</span></p>
        <!-- <p><span class="icon">缴</span><i>{{key === 'payWay' ? payWayType[key] : item}}</i></p> -->
        <p v-if="item.payWay == 'NETBANK'">缴款方式:<i>网银支付</i></p>
        <p v-if="item.payWay == 'WECHAT'">缴款方式:<i>微信支付</i></p>
        <p v-if="item.payWay == 'ALIPAY_APP'">缴款方式:<i>支付宝钱包</i></p>
        <p>执收单位名称:<i>{{item.companyName}}</i></p>
      </div>
      <div class="digRecord-nav-three digRecord-p" @click="clickFn(index)">查看详情</div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { szTrafficPoliceElecBillQry } from '@/config/baseURL'
export default {
  name: 'digitalReceiptRecord',
  data () {
    return {
      digitData: []
    }
  },
  mounted () {
    this.digitData = JSON.parse(this.$route.query.answererror)
  },
  methods: {
    clickFn: function (index) {
      let digData = {
        orderId: this.digitData[index].sdb
      }
      this.$axios.post(szTrafficPoliceElecBillQry, digData).then(json => {
        if (json.code === '0000') {
          let source = this.$route.query.source
          this.$router.push({path: 'digitalReceipt', query: {source: source, answererror: JSON.stringify(json.data)}})
        } else {
          this.$toast({message: json.msg, position: 'bottom', className: 'white'})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#digRecord{
  background: #fff;
  overflow: hidden;
  .digRecord-top{
    width: 100%;
    line-height: 86px;
    text-align: center;
    border-bottom: 10px solid #ccc;
    span{
      padding: 0 10px;
      color: #2696dd;
      font-weight: bold;
    }
  }
  .digRecord-nav{
    margin: 34px 48px;
    border: 1px solid #a7d9f9;
    border-radius: 8px;
    .digRecord-p{
      padding-left: 34px;
    }
    .digRecord-nav-one{
      border-bottom: 1px solid #a7d9f9;
      p:first-of-type{
        font: 400 34px/70px "";
        line-height: 70px;
        color: #000000;
      }
      p:nth-of-type(2){
        font: 100 24px/48px "";
        line-height: 48px;
        color: #666666;
      }
      p:nth-of-type(3){
        /*padding-left: 204px;*/
        text-align: center;
        font-size: 34px;
        font-weight: bold;
        line-height: 90px;
        color: #000000;
      }
    }
    .digRecord-nav-two{
      border-bottom: 1px solid #a7d9f9;
      p{
        font: 100 25px/50px "";
        line-height: 50px;
        color: #666666;
      }
      p:first-of-type{
        font: 100 25px/50px "";
        line-height: 50px;
        color: #666666;
        span{
          padding-left: 10px;
          color: #ff0000;
        }
      }
/*      .icon{
        display: inline-block;
        width: 30px;
        height: 30px;
        border: 1px solid #40a2e1;
        font-size: 26px;
        line-height: 30px;
        color: #40a2e1;
        border-radius: 50%;
      }*/
      i{
        padding-left: 30px;
        font: 100 25px/50px "";
        line-height: 50px;
        color: #333333;
      }
    }
    .digRecord-nav-three{
      font-size: 26px;
      line-height: 82px;
      color: #349ddf;
      background: url(../../../assets/images/dig.png) no-repeat;
      background-position: 90%;
      background-size: 26px 40px;
    }
  }
}
</style>
