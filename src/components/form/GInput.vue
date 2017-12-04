<template>
  <div class="g-input">
    <div class="g-input-title">
      {{title}}
    </div>
    <div class="g-input-content">
      <input type="text" :placeholder="placeholder" :disabled="disabled" :readonly="readonly">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'g-input',
    data () {
      return {}
    },
    props: ['title', 'value', 'placeholder', 'disabled', 'readonly']
  }
</script>

<style scoped lang="less">
.g-input{
  display: flex;
  padding:10px 40px;
  box-sizing: border-box;
  align-items: center;
  .g-input-title{
    width: 20%;
  }
  .g-input-content{
    width: 80%;
    input{
      width: 100%;
    }
  }
}
</style>
