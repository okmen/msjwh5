<template>
<div class="payment-succeed">
  <div class="payment-title">
    <div class="title-img"><img src="../images/appointSuccess.png"/></div>
    <div class="title-text">
      提交成功
    </div>
  </div>
  <div class="payment-content">
    <div style="background: #ccc; width: 80%; height: 1px;margin: 10px auto;"></div>
    <div class="list-item" v-for="(value, key) in list">
      <div class="item-title">
        {{key}}:
      </div>
      <div class="item-value">{{value}}</div>
    </div>
  </div>
  <div class="payment-button form-template-submit" @click="$router.push('/')">返 回</div>
</div>
</template>
<script>
  export default {
    data () {
      return {
        queryValue: ''
      }
    },
    created () {
      this.queryValue = this.$route.query
      if (this.queryValue.openId === window.localStorage.getItem('openId')) {
        console.log()
      }
    },
    computed: {
      list () {
        return {
          '订单号码': this.queryValue.orderNumber,
          '支付时间': this.queryValue.payTime,
          '订单金额': this.queryValue.orderAmount,
          '订单状态': this.queryValue.orderStatus,
          '订单款项': this.queryValue.orderFund
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.payment-succeed{
  padding: 60px 40px;
  .payment-title{
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      width: 160px;
      height: auto;
    }
    .title-text{
      font-size: 40px;
      margin-top: 20px;
    }
  }
  .payment-content{
    padding: 18px 15px;
    .item-title{
      color: #6a6a6a;
    }
    .list-item{
      display: flex;
      align-items: center;
      height: 50px;
      font-size: 28px;
    }
    .item-value{
      margin-left: 10px;
    }
  }
  .payment-button{
    background: #00be00;
  }
}
</style>

