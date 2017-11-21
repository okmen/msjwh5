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
// import { MessageBox } from 'mint-ui'
export default{
}
</script>