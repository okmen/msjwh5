<template>
  <div class="postpone-change-card">
    <div class="changeCard-top">
      <g-input title="业务类型" value="驾驶证延期换证" readonly></g-input>
    </div>
    <g-input title="证件名称" value="居民身份证" readonly></g-input>
    <g-input title="证件号码" :value="IDcard" readonly></g-input>
    <g-input title="姓名" :value="name" readonly></g-input>
    <g-input title="驾驶证号" :value="driverLicense" readonly></g-input>
    <g-input title="档案编号" :value="fileNumber" readonly></g-input>
    <g-date-picker title="延期日期" v-model="postponeTime"></g-date-picker>
    <g-select title="延期原因" :data="reasonSelectData" v-model="reasonSelectOne" ref="reasonSelectStr"></g-select>
    <g-input title="收件人姓名" :value="receiverName" readonly></g-input>
    <g-input title="收件人号码" :value="receiverNumber" readonly></g-input>
    <g-select-one type="邮寄地址" title="深圳市" :data="cityArea" v-model="cityAreaOne" ref="cityAreaOneStr"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload id="file1" text="身份证（正面）" :bg="require('../../../assets/images/IDcard-front.png')" v-model="cardFront"></g-upload>
        <g-upload id="file2" text="身份证（反面）" :bg="require('../../../assets/images/IDcard-back.png')" v-model="cardBack"></g-upload>
        <g-upload id="file3" text="驾驶证照片" :bg="require('../../../assets/images/drivinglicense.png')" v-model="drivinglicenseImg"></g-upload>
        <g-upload id="file4" text="延期说明照片" :bg="require('../../../assets/images/newDelayIntro.png')" v-model="newDelayIntro"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
  import beforeSubmit from '@/mixins/beforeSubmit'
  import { changeDelay, getFileNumber } from '@/config/baseURL'
  export default {
    name: 'postpone-change-card',
    data () {
      return {
        mailingAddress: '',
        fileNumber: '',
        reasonSelectData: [
          {
            'value': '01',
            'name': '服兵役'
          },
          {
            'value': '02',
            'name': '出国（境）'
          },
          {
            'value': '03',
            'name': '其他'
          }
        ],
        reasonSelectOne: '01',
        cityAreaOne: '01',
        cardFront: '',
        cardBack: '',
        drivinglicenseImg: '',
        newDelayIntro: '',
        postponeTime: this.formatDate(new Date()),
        receiverNumber: '',
        receiverName: '',
        reasonSelectStr: ''
      }
    },
    mixins: [beforeSubmit],
    computed: {
      user () {
        return this.$store.state.user
      },
      IDcard () {
        return this.user.identityCard
      },
      driverLicense () {
        return this.user.identityCard
      },
      name () {
        return this.user.userName
      },
      censusRegister () {
        return this.$store.state.censusRegister
      },
      cityArea () {
        return this.$store.state.cityArea
      }
    },
    created () {
      if (this.user.bindDriverLicence !== '1') {
        this.$MessageBox('温馨提示', '您还没绑定驾驶证,请到星级用户中心绑定！')
        return
      }
      this.$axios.post(getFileNumber, {identityCard: this.IDcard}).then(json => {
        if (json.code === '0000') {
          this.fileNumber = json.data.fileNumber
        }
      })
      this.receiverNumber = this.user.mobilePhone
      this.receiverName = this.name
    },
    methods: {
      formatDate: (date, addYear) => {
        var y = !addYear ? date.getFullYear() : date.getFullYear() + addYear
        var m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
      },
      confirmInfo () {
        let obj = {
          mailingAddress: '请输入详细地址',
          cardFront: '请上传身份证（正面）',
          cardBack: '请上传身份证（反面）',
          drivinglicenseImg: '请上传驾驶证照片',
          newDelayIntro: '请上传延期说明照片'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        let reqData = {
          type: '驾驶证延期换证',
          url: changeDelay,
          textObj: {
            delayDate: this.postponeTime,
            delayReason: this.$refs.reasonSelectStr.currentName,
            driverLicense: this.driverLicense,
            fileNumber: this.fileNumber,
            identityCard: this.IDcard,
            userName: this.name,
            receiverName: this.receiverName,
            receiverNumber: this.receiverNumber,
            receiverAddress: '深圳市' + this.$refs.cityAreaOneStr.currentName + this.mailingAddress
          },
          imgObj: {
            PHOTO9: this.cardFront || '',
            PHOTO10: this.cardBack || '',
            JSZZP: this.drivinglicenseImg || '',
            YQZMZP: this.newDelayIntro || ''
          },
          invisibleObj: {
            loginUser: this.IDcard,
            userSource: this.$route.query.source,
            identificationNO: 'A'
          }
        }
        console.log(reqData)
        this.$store.commit('savePassByValue', reqData)
        this.$router.push('/affirmInfo')
      }
    }
  }
</script>
<style lang="less">
  .postpone-change-card{
    .g-date-picker{
      display: flex;
      align-items: center;
      justify-content: center;
      .g-date-picker-title{
        width: 30%;
        margin-bottom: 0 !important;
      }
      .g-date-picker-value{
        flex: 1;
      }
    }
  }
</style>
<style scoped lang="less">
  .postpone-change-card{
    padding: 20px 0 40px;
  }
</style>
