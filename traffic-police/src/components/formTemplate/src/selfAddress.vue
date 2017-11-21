<template>
    <div class="self-address">
      <div class="form-template-item-left">
        <div class="address-title">{{childInfo.title}}</div>
      </div>
      <div class="form-template-item-right">
        <div-select :childInfo="childInfo.list" @getSelected="getSelected"></div-select>
        <input type="text" v-model="msAddress" placeholder="请输入详细地址" class="ms-address">
      </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        msAddress: '',
        cityDistrict: ''
      }
    },
    props: ['childInfo'],
    components: {
      divSelect: require('components/divSelect')
    },
    watch: {
      addressData (val) {
        this.$emit('getSelected', val)
      }
    },
    computed: {
      addressData () {
        return this.childInfo.list.title + this.cityDistrict + this.msAddress
      }
    },
    methods: {
      getSelected (val) {
        this.cityDistrict = val
      }
    }
  }
</script>
