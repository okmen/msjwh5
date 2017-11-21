<template>
  <div class="noneDriverCard-outer">
    <div class="icon-box">
      <img src="../../../images/driverCard.png">
    </div>
    <div class="desc-box">
      <p>尊敬的用户，很抱歉暂时没有您的驾驶证信息</p>
      <p>请点击下方按钮进行驾驶证验证</p>
    </div>
    <router-link class="btn btn-blue" type="button" name="button" to="/DriverCardVerify">驾驶证认证</router-link>
    <!-- <button class="btn btn-blue" type="button" name="button">领取电子证件</button> -->
  </div>
</template>
<style lang="less" scoped>
  .noneDriverCard-outer {
    padding: 40px;
    .icon-box {
      text-align: center;
      padding: 60px 0;
      img {
        width: 240px;
      }
    }
    .desc-box {
      padding-bottom: 60px;
      p {
        text-align: center;
        font-size: 0.9rem;
        color:#999;
        line-height: 80px;
      }
    }
    a {
      display: block;
      text-align: center;
      line-height: 80px;
      &:visited {
        color: #fff;
      }
    }
  }
</style>
