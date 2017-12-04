<template>
<div class="annual-examinations">
  <g-input title="姓名" v-model="userName"></g-input>
  <g-input title="身份证号码" v-model="IDCard"></g-input>
  <g-input title="手机号码" v-model="mobilePhone"></g-input>
  <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
  <g-button text="确认信息" @click.native="confirmInfo"></g-button>
</div>
</template>

<script>
  import {GInput, GSelect, GButton} from 'form'
  export default {
    data () {
      return {
        userName: '',
        IDCard: '',
        mobilePhone: '',
        censusRegisterList: [
          {name: '深圳', value: 0}, {name: '港澳台籍', value: 1}, {name: '外国籍', value: 2}, {name: '其他', value: 3}
        ],
        censusRegisterOne: 1
      }
    },
    components: {
      GInput,
      GSelect,
      GButton
    },
    methods: {
      confirmInfo () {
        console.log(this.censusRegisterOne)
      }
    }
  }
</script>

<style scoped>

</style>
