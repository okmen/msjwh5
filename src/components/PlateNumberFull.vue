<template>
    <div class="plate-number-full">
      <g-input title="车牌号码" v-model="plateNumber" placeholder="请输入车牌号码">
        <template slot="left">
          <g-select v-model="province" :data="provinceCodeAll" class="province"></g-select>
        </template>
      </g-input>
    </div>
</template>

<script>
  import {GSelect, GInput} from 'form'
  export default {
    name: 'plate-number-full',
    data () {
      return {
        plateNumber: '',
        province: '粤'
      }
    },
    props: ['value'],
    components: {
      GSelect, GInput
    },
    computed: {
      provinceCodeAll () {
        return this.$store.state.provinceCodeAll
      },
      plateNumberFull () {
        return this.province + this.plateNumber
      }
    },
    watch: {
      plateNumberFull (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped lang="less">
.province{
  width: 140px;
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
