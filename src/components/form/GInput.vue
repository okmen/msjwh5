<template>
  <div class="g-input">
    <div class="g-input-title">
      {{title}}
    </div>
    <div class="g-input-content">
      <input type="text" v-model="currentValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'g-input',
    data () {
      return {
        currentValue: ''
      }
    },
    created () {
      this.currentValue = this.value
    },
    props: ['title', 'value', 'placeholder', 'disabled', 'readonly'],
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
      }
    }
  }
</script>

<style scoped lang="less">
.g-input{
  display: flex;
  padding:10px 40px;
  box-sizing: border-box;
  align-items: center;
  .g-input-title{
    /*min-width: 20%;*/
    /*max-width: 40%;*/
    width: 30%;
  }
  .g-input-content{
    /*width: 80%;*/
    flex:1;
    input{
      width: 100%;
    }
  }
}
</style>
