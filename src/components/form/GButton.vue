<template>
<div class="g-button h-center">
  <div class="h-center button" :class="{'gray': type === 'gray'}">
    {{text || '提交'}}
  </div>
</div>
</template>

<script>
  export default {
    data () {
      return {
        isGray: this.gray
      }
    },
    props: ['text', 'type']
  }
</script>

<style scoped lang="less">
.g-button {
  padding:10px 40px;
  width: 100%;
  margin-top: 40px;
  .button {
    height: 70px;
    border-radius: 8px;
    width: 100%;
    background-color: #09bb07;
    color: white;
  }
  .gray {
    background-color: gray;
  }
}
</style>
