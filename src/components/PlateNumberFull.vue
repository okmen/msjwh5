<template>
  <div class="plate-number-full">
    <g-input title="车牌号码" v-model="plateNumber" placeholder="请输入车牌号码">
      <template slot="left">
        <g-select :class="{'width-80': type === 'mortgageBusiness'}" :disabled="disabled" :center="center" v-model="province" :data="provinceCodeAll"></g-select>
        <g-select class="width-80" v-if="type === 'mortgageBusiness'" :disabled="disabled" :center="center" v-model="letter" :data="letterGroup"></g-select>
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
        province: '粤',
        letter: 'B',
        letterGroup: ['B']
      }
    },
    props: {
      'value': [String, Boolean],
      'disabled': Boolean,
      'center': Boolean,
      'type': String
    },
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
.g-select, .letter {
  width: 140px;
  padding: 0;
}
.width-80 {
  width: 80px;
}
</style>
