<template>
    <div class="self-textarea ">
      <span class="form-template-item-left">{{childInfo.title}}</span>
      <textarea :placeholder="childInfo.palceholder" :readonly="childInfo.readonly" class="form-template-item-right" v-model="textareaData"></textarea>
    </div>
</template>
<style>

</style>
<script>
  export default {
    data () {
      return {
        textareaData: ''
      }
    },
    watch: {
      textareaData (val) {
        this.$emit('getSelected', val)
      },
      childInfo: {
        handler (val) {
          this.textareaData = val.defaultValue
        },
        deep: true
      }
    },
    props: ['childInfo'],
    mounted () {
      if (this.childInfo.defaultValue) {
        this.textareaData = this.childInfo.defaultValue
      }
      this.$emit('getSelected', '')
    }
  }
</script>
