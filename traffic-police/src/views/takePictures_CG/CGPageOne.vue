<template>
  <div class="CG-router">
    <div class="CG-btn">
      <dl>
        <dt class="CG-icon-1"><router-link class="CG-a" to="takePicturesTips">随手拍举报</router-link></dt>
        <dd><img class="CG-img" src="../../images/CG-icon-4.png">路面交通违法举报</dd>
      </dl>
      <dl>
        <dt class="CG-icon-2"><router-link class="CG-a" to="trafficCivilization">交通文明我做主</router-link></dt>
        <dd><img class="CG-img" src="../../images/CG-icon-4.png">设备损坏、安全隐患、拥堵等道路及附属设备的举报</dd>
      </dl>
      <dl>
        <dt class="CG-icon-3"><router-link class="CG-a" to="CGPageTwo">进度查询</router-link></dt>
      </dl>
    </div>
    <p class="CG-p">本功能由深圳市公安局交通警察局提供支持</p>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
export default {
  name: 'CGPageOne',
  data () {
    return {
    }
  },
  methods: {
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
    background: url('../../images/CG-1.png') no-repeat top center;
    background-size: 100%;
    overflow: hidden;
    .CG-btn{
      padding-top: 800px;
      margin: 0 auto;
      text-align: center;
      dl{
        dt{
          width: 330px;
          font-size: 30px;
          line-height: 70px;
          color: #fff;
          border-radius: 6px;
          margin: 0 auto;
        }
        dd{
          font-size: 22px;
          line-height: 50px;
          color: #cccccc;
        }
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
      .CG-icon-3{
        background:#3792ed url(../../images/CG-icon-3.png) no-repeat;
        background-size: 40px;
        background-position: 20px;
      }
      .CG-img{
        width: 30px;
        vertical-align:middle;
        margin-right: 10px;
      }
    }
    .CG-p{
      text-align: center;
      color: #dddcdd;
      font-size: 22px;
      line-height: 50px;
      padding-top: 30px;
    }
  }
</style>
