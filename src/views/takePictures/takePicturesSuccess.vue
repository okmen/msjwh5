<template>
  <div id="takePhotosSuccess">
    <div class="tp-success">
      <img src="../../assets/images/tpInformSuccess.png">
      <span>
        随手拍举报成功
      </span>
    </div>
    <div class="tp-success-title">
      <p>
        您举报的交通违法信息已经记录：
      </p>
      <div class="tp-success-line"></div>
    </div>
    <div class="tp-success-record">
      <p>记录号码：<span>{{takePicturesRecord}}</span></p>
      <p>查询密码：<span>{{takePicturesPassword}}</span></p>
    </div>
  </div>
</template>
<script>
export default{
  data () {
    return {
      takePicturesRecord: '',
      takePicturesPassword: ''
    }
  },
  mounted () {
    this.takePicturesRecord = JSON.parse(this.$route.query.takePicturesRecord)
    this.takePicturesPassword = JSON.parse(this.$route.query.takePicturesPassword)
  }
}
</script>
<style lang="less" scoped>
.tp-success{
  padding-left:25px;
  width:100%;
  height:128px;
  img{
    margin-top:40px;
    width:60px;
    height:60px;
  }
  span{
    display:block;
    margin-top:-56px;
    margin-left:90px;
    font-size:30px;
    color:#09bb07;
  }
}
.tp-success-title{
  width:100%;
  p{
    padding-left:25px;
    font-size:24px;
    color:#999;
  }
  .tp-success-line{
    padding:0 50px;
    margin:0 auto;
    width:650px;
    height:60px;
    border-bottom:1px solid #EEE;
  }
}
.tp-success-record{
  padding-left:25px;
  width:100%;
  p{
    font-size:24px;
    color:#999;
  }
  p:first-child{
    margin-top:44px;
    margin-bottom:24px;
  }
  p:nth-of-type(2){
    margin-bottom:24px;
  }
  span{
    font-size:24px;
    color:#333;
  }
}
</style>
