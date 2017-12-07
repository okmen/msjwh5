<!--
  props
    title: 左边的标题
    value: input的值，使用v-model绑定
    placeholder：提示语
    maxlength：限制的最大长度
    disabled： 是否可编辑
  slot
  left： input的左侧
  right：input的右侧
-->
<template>
  <div class="g-input">
    <div class="g-input-title">
      {{title}}
    </div>
    <slot name="left"></slot>
    <div class="g-input-content">
      <input type="text" v-model="currentValue" :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :readonly="readonly">
    </div>
    <slot name="right"></slot>
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
    props: ['title', 'value', 'maxlength', 'placeholder', 'disabled', 'readonly'],
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
