<template>
    <div class="self-input form-template-item">
      <span class="form-template-item-left">{{childInfo.title}}</span>
      <input type="text" :placeholder="childInfo.palceholder" :readonly="childInfo.readonly"   class="form-template-item-right" v-model="inputData">
    </div>
</template>
<style>

</style>
<script>
  export default {
    data () {
      return {
        inputData: ''
      }
    },
    watch: {
      inputData (val) {
        this.$emit('getSelected', val)
      },
      childInfo: {
        handler (val) {
          this.inputData = val.defaultValue
        },
        deep: true
      }
    },
    props: ['childInfo'],
    mounted () {
      if (this.childInfo.defaultValue) {
        this.inputData = this.childInfo.defaultValue
      }
      this.$emit('getSelected', '')
    }
  }
</script>
