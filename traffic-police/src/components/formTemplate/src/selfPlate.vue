<template>
    <div class="self-plate form-template-item">
      <span class="form-template-item-left">{{childInfo.title}}</span>
      <div class="form-template-item-right both-ends">
        <div class="form-proveice-select">
          <div-select :childInfo="childInfo.list" @getSelected="getSelected"></div-select>
        </div>
        <input type="text" class="form-proveice-input" placeholder="请输入车牌号码" v-model="plateNum">
      </div>
    </div>
</template>
<style>

</style>
<script>
  export default {
    data () {
      return {
        plateNum: '',
        provice: ''
      }
    },
    props: ['childInfo'],
    watch: {
      plateData (val) {
        this.$emit('getSelected', val)
      }
    },
    computed: {
      plateData () {
        return this.provice + this.plateNum
      }
    },
    components: {
      divSelect: require('components/divSelect')
    },
    methods: {
      getSelected (val) {
        this.provice = val
      }
    }
  }
</script>
