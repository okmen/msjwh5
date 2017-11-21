<template>
  <div class="popup-box" @click="cancel">
    <div class="popup-box-inner">
      <img :src="'data:image/png;base64,' + data">
    </div>
  </div>
</template>
<script>
export default{
  name: 'popupImg',
  props: ['data'],
  data () {
    return {
    }
  },
  methods: {
    cancel: function () { // 取消
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="less">
.popup-box{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .5);
  .popup-box-inner{
    width: 100%;
    height: 100%;
    img{
      display: block;
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
}
</style>
