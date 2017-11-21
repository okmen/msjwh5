<template>
<div class="error-outer">
  <div class="error-img">
    <img src="../../../images/no-network-logo.png" alt="网络不给力">
  </div>
  <p class="error-text">抱歉，网络不给力</p>
  <p class="error-text">请点击屏幕刷新</p>
</div>
</template>

<script>
export default{
  name: 'error',
  created () {
    document.addEventListener('click', (e) => {
      window.location.reload()
    })
  }
}
</script>

<style lang="less">
.error-outer{
  width: 100%;
  height: 100%;
  padding-top: 294px;
  background: #eee;
  text-align: center;
  box-sizing: border-box;
  position: absolute;
  z-index: 888;
  .error-img{
    width: 203px;
    height: 301px;
    margin: 0 auto 22px auto;
    img{
      width: 100%;
    }
  }
  .error-text{
    line-height: 56px;
    font-size: 32px;
    font-weight: bold;
    color: #9e9e9e;
  }
}

</style>