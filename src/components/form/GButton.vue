<template>
<div class="g-button h-center">
  <div class="h-center button" :class="{'gray': type === 'gray', 'margin': !noMargin}">
    {{text || '提交'}}
  </div>
</div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['text', 'type', 'noMargin']
  }
</script>

<style scoped lang="less">
  @import "../../assets/style/var.less";
.g-button {
  padding:10px 40px;
  width: 100%;
  .button {
    height: 70px;
    border-radius: 8px;
    width: 100%;
    background-color: @buttonColor;
    color: white;
  }
  .margin{
    margin-top: 40px;
  }
  .gray {
    background-color: @gray;
  }
}
</style>
