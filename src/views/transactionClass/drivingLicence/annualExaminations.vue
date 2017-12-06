<template>
<div class="annual-examinations">
  <g-input title="姓名" v-model="userName"></g-input>
  <g-input title="身份证号码" v-model="IDCard"></g-input>
  <g-input title="手机号码" v-model="mobilePhone"></g-input>
  <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
  <g-input title="收件人姓名" v-model="recipientsName"></g-input>
  <g-input title="收件人号码" v-model="recipientsPhone"></g-input>
  <g-select-one type="邮寄地址" title="深圳市" :data="cityArea" v-model="cityAreaOne"></g-select-one>
  <g-input placeholder="请输入详细地址" v-model="addressMs"></g-input>
  <group title="请按示例图上传以下证件照片">
    <div class="upload-group">
      <g-upload text="身份证（正面)" id="file1" :bg="require('../../../assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
      <g-upload text="身份证（反面)" id="file2" :bg="require('../../../assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
      <g-upload text="审核教育绘制表" id="file3" :bg="require('../../../assets/images/edu-table.png')" v-model="eduTable"></g-upload>
    </div>
  </group>
 <g-button text="确认信息" @click.native="confirmInfo"></g-button>
</div>
</template>

<script>
  import {GInput, GSelect, GButton, GUpload, Group, GSelectOne} from 'form'
  import beforeSubmit from '@/mixins/beforeSubmit'
  import { annualExaminations } from '@/config/baseURL'
  export default {
    data () {
      return {
        userName: '',
        IDCard: '',
        mobilePhone: '',
        IDCardFront: '',
        IDCardBack: '',
        eduTable: '',
        recipientsName: '',
        recipientsPhone: '',
        censusRegisterOne: '1',
        cityAreaOne: '福田区',
        addressMs: ''
      }
    },
    mixins: [beforeSubmit],
    computed: {
      censusRegisterList () {
        return this.$store.state.censusRegisterList
      },
      cityArea () {
        return this.$store.state.cityAreaS
      },
      user () {
        return Object.assign({}, this.$store.state.user)
      },
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    created () {
      let val = this.$store.state.user
      this.userName = val.userName
      this.IDCard = val.identityCard
      this.mobilePhone = val.mobilePhone
      this.recipientsName = val.userName
      this.recipientsPhone = val.mobilePhone
    },
    components: {
      GInput,
      GSelect,
      GButton,
      GUpload,
      Group,
      GSelectOne
    },
    methods: {
      confirmInfo () {
        let obj = {
          userName: '请输入姓名',
          IDCard: '请输入身份证号码',
          mobilePhone: '请输入手机号码',
          recipientsName: '请输入收件人姓名',
          recipientsPhone: '请输入收件人手机号码',
          addressMs: '请输入详细地址',
          IDCardFront: '请上传身份证（正面）',
          IDCardBack: '请上传身份证（反面）',
          eduTable: '请上传审核教育绘制表'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        let reqData = {
          type: '驾驶证年审',
          url: annualExaminations,
          title: 'driverLicenseAnnualVerification',
          textObj: {
            identityCard: this.IDCard,
            userName: this.userName,
            mobilephone: this.mobilePhone,
            placeOfDomicile: this.censusRegisterOne,
            receiverName: this.recipientsName,
            receiverNumber: this.recipientsPhone,
            receiverAddress: '深圳市' + this.cityAreaOne + this.addressMs
          },
          imgObj: {
            PHOTO9: this.IDCardFront || '',
            PHOTO10: this.IDCardBack || '',
            PHOTO31: '',
            SHJYPXB: this.eduTable || ''
          },
          invisibleObj: {
            JZZA: this.IDCardFront || '',      // 居住证照片 页面不给居住证上传入口 直接传与身份证正反面同样的数据
            JZZB: this.IDCardBack || '',
            loginUser: window.localStorage.getItem('identityCard'),
            userSource: 'C',
            identificationNO: 'A'
          }
        }
        this.$store.commit('savePassByValue', reqData)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    }
  }
</script>

<style scoped>
  .annual-examinations{
    padding: 40px 0;
  }
.upload-group{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
