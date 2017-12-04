<template>
  <div class="changeCard">
    <g-select title="业务类型" :data="censusTypeList" v-model="censusType"></g-select>
    <g-input title="姓名" v-model="userName" readonly></g-input>
    <g-input title="身份证号码" v-model="IDCard" readonly></g-input>
    <g-input title="手机号码" v-model="mobilePhone" type="tel" readonly></g-input>
    <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
    <g-input title="收件人名字" v-model="receiverName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人号码" v-model="receiverMobilePhone" placeholder="请输入收件人号码"></g-input>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <g-select-one class="changeCard-set" title="深圳市" type="邮寄地址" :data="censusTypeList" v-model="censusType"></g-select-one>
    <userUpload :idCard1="true" :idCard2="true" :outTable="outTable" @btnSureStar="btnSureStar()" ref="getImgUrl"></userUpload>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne} from 'form'
import userUpload from '@/components/userUpload'
export default {
  name: 'changeCard',
  data () {
    return {
      userName: '',
      IDCard: '',
      mobilePhone: '',
      receiverName: '',
      receiverMobilePhone: '',
      mailingAddress: '',
      outTable: false,
      censusTypeList: [
        {name: '补证', value: 0}, {name: '期满换证', value: 1}
      ],
      censusType: 0,
      censusRegisterList: [
          {name: '深圳', value: 0}, {name: '港澳台籍', value: 1}, {name: '外国籍', value: 2}, {name: '其他', value: 3}
      ],
      censusRegisterOne: 0,
      img: require('@/assets/images/IDcard-front.png')
    }
  },
  components: {
    userUpload,
    GInput,
    GSelect,
    GButton,
    GSelectOne
  },
  methods: {
    // 图片上传
    subFn: function (data, id) {
      this.imgOne = data.imgUrl
      this.imgTime = data.dateTime
    }
  }
}
</script>

<style lang="less" scoped>
</style>