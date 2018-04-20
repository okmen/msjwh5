<!--
  props
    title: 左边的标题
    value: textarea的值，使用v-model绑定
    placeholder：提示语
    maxlength：限制的最大长度
    disabled： 是否可编辑
-->
<template>
  <div class="g-textarea" :class="{ 'filled': classType === 'filled' }">
    <div class="g-textarea-title">
      {{title}}
    </div>
    <div class="g-textarea-content">
      <textarea v-model="currentValues" :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"></textarea>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'g-textarea',
    data () {
      return {
        currentValues: ''
      }
    },
    created () {
      this.currentValues = this.value
    },
    props: ['title', 'value', 'maxlength', 'placeholder', 'disabled', 'readonly', 'classType'],
    watch: {
      currentValues (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValues = val
      }
    }
  }
</script>

<style scoped lang="less">
.g-textarea{
  display: flex;
  padding: 10px 40px;
  box-sizing: border-box;
  align-items: center;
  .g-textarea-title{
    width: 30%;
  }
  .g-textarea-content{
    flex:1;
    textarea{
      width: 100%;
      height:190px;
      border:1px solid #e2e2e7;
      border-radius:10px;
      resize:none;
      outline:none;
      font-size: 30px;
      padding-left: 20px;
    }
  }
}
.filled {
  flex-wrap: wrap;
  display: block;
  .g-textarea-title{
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
