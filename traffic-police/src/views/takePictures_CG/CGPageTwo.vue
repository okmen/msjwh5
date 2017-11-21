<template>
  <div class="CG-router">
    <div class="CG-btn">
      <p class="CG-icon-1"><router-link class="CG-a" to="takePicturesQuery">随手拍举报</router-link></p>
      <p class="CG-icon-2"><a class="CG-a" @click="hintFn" >交通文明我做主</a></p>  
    </div>
    <p class="CG-p">本功能由深圳市公安局交通警察局提供支持</p>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'CGPageTwo',
  data () {
    return {
    }
  },
  methods: {
    hintFn: function () {
      MessageBox('提示', `该功能正在升级中...`)
    }
  },
  mounted () {
    window.localStorage.setItem('sourceOfCertification', 'CG')
  }
}
</script>
<style lang="less" scoped>
  .CG-router{
    width: 100%;
    height: 100%;
    background: url('../../images/CG-2.png') no-repeat top center;
    background-size: 100%;
    overflow: hidden;
    .CG-btn{
      padding-top: 800px;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
      p{
        width: 330px;
        font-size: 30px;
        line-height: 70px;
        color: #fff;
        border-radius: 6px;
        margin: 0 auto;
        margin-bottom: 50px;
      }
      .CG-a{
        display: inline-block;
        width: 100%;
        color: #fff;
      }
      .CG-icon-1{
        background:#3792ed url(../../images/CG-icon-1.png) no-repeat;
        background-size: 40px;
        background-position: 20px;
      }
      .CG-icon-2{
        background:#3792ed url(../../images/CG-icon-2.png) no-repeat;
        background-size: 40px;
        background-position: 14px;
      }
    }
    .CG-p{
      text-align: center;
      color: #dddcdd;
      font-size: 22px;
      line-height: 50px;
      padding-top: 90px;
    }
  }
</style>
