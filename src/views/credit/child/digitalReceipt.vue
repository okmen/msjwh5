<template>
  <div :style="boxStyle" class="digital-receipt">
    <img :src="digitData" alt="" :style="{width:boxStyle.width, height:boxStyle.height}">
  </div>
</template>

<script>
export default {
  data () {
    return {
      digitData: '',
      wHeight: '',
      wWidth: '',
      dHeight: '',
      boxStyle: {
        width: window.innerHeight + 'px',
        height: window.innerWidth + 'px',
        left: window.innerWidth + 'px'
      }
    }
  },
  created () {
    this.wHeight = document.body.clientHeight
    this.wWidth = document.body.clientWidth
    this.dHeight = document.body.scrollHeight
  },
  mounted () {
    this.digitData = JSON.parse(this.$route.query.answererror)
  }
}
</script>

<style lang="less" scoped>
  .digital-receipt{
    transform: rotate(90deg);
    transform-origin: 0 0;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    -webkit-overflow-scrolling: touch
  }
</style>
