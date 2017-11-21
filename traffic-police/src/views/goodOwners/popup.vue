<template>
  <div class="m-goodPopup" v-if="popupStatus">
    <div class="pic">
      <img @click="$router.push('/goodOwners')" src="./../../images/goodOwners-p11.png">
      <div class="close" @click="popupStatus = false"><img src="./../../images/goodOwners-p3.png"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      popupStatus: false,
      popupInfo: window.localStorage.getItem('goodOwners') ? JSON.parse(window.localStorage.getItem('goodOwners')) : {
        show: false,
        time: null,
        status: false
      }
    }
  },
  created () {
    // 如果已经报名，则不显示弹窗
    if (this.popupInfo.status) {
      return true
    }
    // 如果距离上次显示超过三小时，则显示弹窗
    if (this.popupInfo.time) {
      let nTimer = new Date() - new Date(this.popupInfo.time)
      nTimer = nTimer / 1000 / 60 / 60
      if (nTimer > 3) {
        this.popupInfo.show = false
      }
    }
    // 显示弹窗
    if (!this.popupInfo.show) {
      this.popupStatus = true
      this.popupInfo.show = true
      this.popupInfo.time = new Date()
      window.localStorage.setItem('goodOwners', JSON.stringify(this.popupInfo))
    }
  }
}
</script>

<style lang="less" scoped>
.m-goodPopup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  .pic {
    width: 590px;
    height: 630px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -295px;
    margin-top: -330px;
    img { 
      width: 100%;
    }
  }
  .close {
    position: absolute;
    bottom: -100px;
    left: 50%;
    margin-left: -31px;
    width: 62px;
    height: 62px;
    img {
      width: 100%;
    }
  }
}
</style>