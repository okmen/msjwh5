<template>
<div class="annual-examinations">
  <g-input title="姓名" v-model="userName"></g-input>
  <g-input title="身份证号码" v-model="IDCard"></g-input>
  <g-input title="手机号码" v-model="mobilePhone"></g-input>
  <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
</div>
</template>

<script>
  import {GInput, GSelect} from 'form'
  export default {
    data () {
      return {
        userName: '',
        IDCard: '',
        mobilePhone: '',
        censusRegisterList: [
          '深圳', '港澳台籍', '外国籍', '其他'
        ],
        censusRegisterOne: '深圳'
      }
    },
    components: {
      GInput,
      GSelect
    },
    watch: {
      censusRegisterOne (val) {
        console.log(val, '户籍')
      }
    }
  }
</script>

<style scoped>

</style>
