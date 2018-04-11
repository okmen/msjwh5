<!--
  描述：绿色出行-未登录用户显示页面
  时间：2017-07-20
  作者：猪不乐意
  联系：914230482
-->
<template>
  <div class="m-starLevel">
    <div class="logo"><img src="~src/images/green-logo.png"></div>
    <div class="info">
      <p>您想申报绿色出行吗？请点击</p>
      <div class="item">
        <el-button type="success" @click.native="$router.push({ name: 'login' })">我是星级用户</el-button>
      </div>
      <div class="item">
        <el-button type="primary" @click.native="$router.push({ name: 'greenApplyNoLogin' })">我不是星级用户</el-button>
      </div>
      <div class="link">
        <router-link to="/userAgreement/xjyhrz">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from 'element-ui'
export default {
  components: {
    'el-button': Button
  }
}
</script>

<style lang="less">
@import 'style/greenTravel.less';
</style>
