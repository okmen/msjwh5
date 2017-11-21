<template>
  <div id="systemUpdate">
    <div class="img-wraper">
      <img src="../images/syestem-update.png">
    </div>
  </div>
</template>
<style lang="less" scoped>
  .mint-msgbox-message{
    text-align: left !important;
  }
  #systemUpdate{
    position: fixed;
    left: 0;
    top: 0;
    height:100%;
    width:100%;
    background:#FFF url('../images/appointBack.png') bottom no-repeat;
    background-size:100% 26%;
    box-sizing: border-box;
    padding-top: 290px;
    .img-wraper{
      width: 384px;
      height: 318px;
      margin: 0 auto;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

</style>
<script>
import { MessageBox } from 'mint-ui'
export default{
  mounted () {
    setTimeout(function () {
      MessageBox('公告', `为了更好提升星级用户平台的服务体验，我们将在6月27号下午进行系统升级。<br/>
【更新时间】2017年6月27日18:00~6月27日19:00<br/>
【更新方式】页面停用，恢复后正常使用 <br/>                         
若您有相关业务需要办理，还请在系统恢复后完成办理。`)
    }, 300)
  }
}
</script>