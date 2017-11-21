<template>
  <div class="m-submitSuccess">
    <div class="box">
      <dl>
        <dd><img src="./../../images/correct.png" alt=""></dd>
        <dt>提交成功</dt>
      </dl>
      <div class="title">感谢您的参与，提交成功！</div>
      <div class="info">我们将在3工作日内通过“深圳交警微信公众号”告知您审核结果。</div>
      <ul>
        <li>业务类型：平安好车主评选</li>
        <li>车主姓名：{{ name }}</li>
        <li>车牌号码：{{ licenseNumber || '无' }}</li>
      </ul>
    </div>
    <router-link to="/" class="btn" v-if="$route.query.type === 'sq'">确定</router-link>
    <!-- <div class="link">
      <router-link to="/goodOwners/pushWX">微信推送报名结果</router-link>
      <router-link to="/goodOwners/pushZFB">支付宝推送报名结果</router-link>
    </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      number: ''
    }
  },
  created () {
    this.name = this.$route.query.name
    this.licenseNumber = this.$route.query.licenseNumber
  }
}
</script>

<style lang="less" scoped>
@import 'goodOwners.less';
</style>