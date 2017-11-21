<template>
  <div class="mainBanner-outer">
    <router-link to="myECard" class="banner-qr"></router-link>
    <div class="banner-user">
      <div class="user-avatar"><img :src="avatar"></div>
      <div class="user-name">{{ userName }}</div>
      <div class="user-mobile">
        <i class="mobile"></i>{{ mobilePhone }}</div>
    </div>
    <router-link to="userInfo" class="banner-edit"></router-link>
  </div>
</template>
<style lang="less">
  .mainBanner-outer {
    position: absolute;
    width: 100%;
    height: 360px;
    background-image: url("../../../images/center_bg.png");
    background-size: cover;
    .banner-qr {
      position: absolute;
      left: 30px;
      top: 30px;
      width: 30px;
      height: 30px;
      background-image: url("../../../images/qrcode.png");
      background-size: cover;
    }
    .banner-edit {
      position: absolute;
      right: 30px;
      top: 30px;
      width: 30px;
      height: 30px;
      background-image: url("../../../images/edit.png");
      background-size: cover;
    }
    .banner-user {
      color: #fff !important;
      position: absolute;
      left: 50%;
      margin-left: -30%;
      width: 60%;
      height: 100%;
      text-align: center;
      padding: 30px 0;
      .user-avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background-color: #09bb07;
        display: inline-block;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          vertical-align: top;
        }
      }
      .user-name {
        padding: 10px 0;
        color: #fff;
      }
      .user-mobile {
        padding-top:30px;
        color: #fff;
        i {
          display: inline-block;
          width: 20px;
          height: 36px;
          vertical-align: -3px;
          margin-right: 12px;
          background-image: url("../../../images/mobile.png");
          background-size: cover;
        }
      }
    }
  }
</style>
<script>
  export default {
    name: 'mainBanner',
    data () {
      return {
        avatar: window.localStorage.getItem('headImgUrl'),
        mobilePhone: window.localStorage.getItem('mobilePhone'),
        userName: window.localStorage.getItem('userName')
      }
    }
  }
</script>
