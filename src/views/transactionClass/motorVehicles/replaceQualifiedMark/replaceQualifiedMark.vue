<template>
  <div class="replaceQualifiedMark">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="name" readonly></g-input>
    </div>
    <g-input title="姓名" readonly v-model="userName"></g-input>
    <g-input title="身份证号码" readonly maxlength="18" v-model="IDCard"></g-input>
    <g-input title="手机号码" readonly maxlength="11" v-model="mobilePhone" type="tel"></g-input>
    <g-select title="名下车辆" ref="officeName" :data="myNumberPlateData" v-model="myNumberPlate"></g-select>
    <g-input title="车牌类型" v-model="carSelectData[myNumberPlate]" readonly></g-input>
    <g-select title="户籍所在地" @getSelected = "getIndex" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
    <g-input title="收件人名字" v-model="receiverName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人号码" maxlength="11" v-model="receiverMobilePhone" placeholder="请输入收件人号码"></g-input>
    <g-select-one class="changeCard-set" title="深圳市" type="邮寄地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证(人像面)" id="file1" :bg="require('@/assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
        <g-upload text="身份证(国徽面)" id="file2" :bg="require('@/assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
        <g-upload text="机动车登记证书" id="file3" :bg="require('@/assets/images/register-credential.png')" v-model="registerCredential"></g-upload>
        <g-upload text="居住证正面" id="file4" :bg="require('@/assets/images/residence-permit-f.png')" v-model="residencePermitF" v-show="censusIndex === 1"></g-upload>
        <g-upload text="居住证反面" id="file5" :bg="require('@/assets/images/residence-permit-b.png')" v-model="residencePermitB" v-show="censusIndex === 1"></g-upload>
        <g-upload text="境外人员临住表" id="file6" :bg="require('@/assets/images/out-board.png')" v-model="board" v-show="censusIndex === 2"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="myNumber"></g-button>
    <g-button text="确认信息" v-if="!myNumber" type="gray"></g-button>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
import { replaceInspectionMark } from '@/config/baseURL'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {

  name: 'replaceQualifiedMark',

  data () {
    return {
      name: '补换检验合格标志',
      myNumber: '',
      cars: '',
      userName: '',
      IDCard: '',
      mobilePhone: '',
      receiverName: '',
      receiverMobilePhone: '',
      mailingAddress: '',
      IDCardFront: '',
      IDCardBack: '',
      board: '',
      registerCredential: '',
      residencePermitF: '',
      residencePermitB: '',
      bindDriverLicence: '',
      censusRegisterList: [
        {
          name: '深户',
          value: '1'
        },
        {
          name: '非深户',
          value: '0'
        },
        {
          name: '外籍',
          value: '0'
        }
      ],
      censusRegisterOne: '1',
      censusIndex: 0,   // 户籍或在地的下标
      areaSelect: '福田区',
      myNumberPlateData: [],
      myNumberPlate: '',
      carSelectData: {
        '01': '黄牌',
        '06': '黑牌',
        '02': '蓝牌',
        '52': '小型新能源车号牌',
        '51': '大型新能源车号牌'
      }
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    GSelectOne,
    Group,
    GUpload
  },
  mixins: [beforeSubmit],
  computed: {
    areaSelectData () {
      return this.$store.state.cityAreaS
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  methods: {
    // 获取户籍所在地的下标
    getIndex: function (index) {
      this.censusIndex = index
    },
    confirmInfo: function () {
      let officeName = this.$refs.officeName.currentName // 获取 name 值
      let obj = {
        userName: '请输入姓名',
        IDCard: '请输入身份证号码',
        mobilePhone: '请输入手机号码',
        receiverName: '请输入收件人姓名',
        receiverMobilePhone: '请输入收件人手机号码',
        mailingAddress: '请输入详细地址',
        IDCardFront: '请上传身份证（人像面）',
        IDCardBack: '请上传身份证（国徽面）',
        registerCredential: '请上传机动车登记证书'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.isPhone(this.mobilePhone)) return
      if (this.$verification.isPhone(this.receiverMobilePhone)) return
      if (this.censusIndex === 2 && !this.board) {
        this.$toast({message: '请上传境外人员临住表', position: 'middle', duration: 3000})
      } else if (this.censusIndex === 1 && !this.residencePermitF) {
        this.$toast({message: '请上传居住证正面', position: 'middle', duration: 3000})
      } else if (this.censusIndex === 1 && !this.residencePermitB) {
        this.$toast({message: '请上传居住证反面', position: 'middle', duration: 3000})
      } else {
        let dataList = {
          type: '补换检验合格标志',
          url: replaceInspectionMark,
          title: 'replaceInspectionMark',
          textObj: {
            'userName': this.userName,
            'identityCard': this.IDCard,
            'mobilephone': this.mobilePhone,
            'numberPlate': officeName,
            'plateType': this.myNumberPlate,
            'placeOfDomicile': this.censusRegisterOne,
            'showIndex': this.censusIndex,   // 0 表示深户，1 表示非深户，2 表示外籍
            'receiverName': this.receiverName,
            'receiverNumber': this.receiverMobilePhone,
            'receiverAddress': `深圳市${this.areaSelect}${this.mailingAddress}`
          },
          imgObj: {
            'PHOTO9': this.IDCardFront || '',
            'PHOTO10': this.IDCardBack || '',
            'DJZSFYJ': this.registerCredential || '',
            'PHOTO31': this.censusIndex === 2 ? this.board : '',
            'JZZA': this.censusIndex === 1 ? this.residencePermitF : '',
            'JZZB': this.censusIndex === 1 ? this.residencePermitB : ''
          }
        }
        this.$store.commit('savePassByValue', dataList)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    }
  },
  created () {
    let val = this.$store.state.user
    this.myNumber = val.myNumberPlate
    this.cars = val.cars
    if (this.myNumber) {
      let PlateData = []
      this.cars.map(item => {
        if (+item.isMySelf === 0) {
          PlateData.push({name: item.myNumberPlate, value: item.plateType})
        }
      })
      this.myNumberPlateData = PlateData
      this.myNumberPlate = this.myNumberPlateData[0].value
    } else {
      this.$MessageBox('温馨提示', '暂无车辆，您的车辆未绑定或者审核中')
    }
    this.userName = val.userName
    this.IDCard = val.identityCard
    this.mobilePhone = val.mobilePhone
    this.bindDriverLicence = val.bindDriverLicence
  }
}
</script>

<style lang="less" scoped>
.replaceQualifiedMark{
  padding-bottom: 40px;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .RichScan {
    width: 24%;
    line-height: 56px;
    border-radius: 8px;
    text-align: center;
    background-color: #09bb07;
    color: #fff;
    margin-left: 16px;
  }
  .changeCard-examine {
    padding-left: 240px;
    line-height: 70px;
    color: #2696dd;
    text-decoration: underline;
  }
}
</style>
