<template>
<div class="change-connect">
  <g-select title="证件名称" :data="cardSelectData" v-model="cur_card_id"></g-select>
  <g-input title="证件号码" placeholder="请输入证件号码" v-model="IDcard"></g-input>
  <g-input title="用户姓名" :value="name" readonly></g-input>
  <g-radio title="用户性别" :data="sexList" v-model="sex"></g-radio>
  <g-input title="驾驶证号码" readonly :value="driverLicense"></g-input>
  <g-input title="手机号码" readonly :value="mobilephone"></g-input>
  <g-select-one type="邮寄地址" title="深圳市" :data="cityArea" v-model="cityAreaOne" ref="cityAreaOneStr"></g-select-one>
  <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
  <group title="请按示例图上传以下证件照片">
    <div class="upload-group">
      <g-upload id="file1" text="身份证（人像面）" :bg="require('../../../assets/images/IDcard-front.png')" v-model="cardFront"></g-upload>
      <g-upload id="file2" text="身份证（国徽面）" :bg="require('../../../assets/images/IDcard-back.png')" v-model="cardBack"></g-upload>
      <g-upload id="file3" text="驾驶证照片" :bg="require('../../../assets/images/drivinglicense.png')" v-model="drivinglicenseImg"></g-upload>
    </div>
  </group>
  <g-button text="确认信息" @click.native="confirmInfo"></g-button>
</div>
</template>

<script>
  import beforeSubmit from '@/mixins/beforeSubmit'
  import { changeConnect } from '@/config/baseURL'
  export default {
    name: 'change-connect',
    data () {
      return {
        sexList: [
          {name: '男', choose: true, value: '1'},
          {name: '女', choose: false, value: '2'}
        ],
        cityAreaOne: '01',
        mailingAddress: '',
        cardFront: '',
        cardBack: '',
        drivinglicenseImg: '',
        cur_card_id: 'A',
        sex: '1',
        IDcard: ''
      }
    },
    mixins: [beforeSubmit],
    computed: {
      user () {
        return this.$store.state.user
      },
      cityArea () {
        return this.$store.state.cityArea
      },
      cardSelectData () {
        return this.$store.state.cardSelectData
      },
      name () {
        return this.user.userName
      },
      driverLicense () {
        return this.user.identityCard
      },
      mobilephone () {
        return this.user.mobilePhone
      }
    },
    created () {
      if (this.user.bindDriverLicence !== '1') {
        this.$MessageBox('温馨提示', '您还没绑定驾驶证,请到民生警务个人中心绑定！')
      }
      this.IDcard = this.user.identityCard
    },
    methods: {
      confirmInfo () {
        let obj = {
          IDcard: '请输入证件号码',
          sex: '请选择性别',
          mailingAddress: '请输入详细地址',
          cardFront: '请上传身份证（人像面）',
          cardBack: '请上传身份证（国徽面）',
          drivinglicenseImg: '请上传驾驶证照片'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        let reqData = {
          type: '驾驶人联系方式变更',
          url: changeConnect,
          textObj: {
            identificationNO: this.cur_card_id,
            identificationNum: this.IDcard,
            userName: this.name,
            gender: this.sex,
            driverLicense: this.driverLicense,
            mobilephone: this.mobilephone,
            receiverAddress: '深圳市' + this.$refs.cityAreaOneStr.currentName + this.mailingAddress
          },
          imgObj: {
            PHOTO9: this.cardFront || '',
            PHOTO10: this.cardBack || '',
            JSZZP: this.drivinglicenseImg || ''
          },
          invisibleObj: {
            loginUser: this.driverLicense,
            userSource: this.$route.query.source
          }
        }
        this.$store.commit('savePassByValue', reqData)
        this.$router.push('/affirmInfo')
      }
    }
  }
</script>

<style scoped lang="less">
.change-connect{
  padding: 20px 0 40px;
}
</style>
