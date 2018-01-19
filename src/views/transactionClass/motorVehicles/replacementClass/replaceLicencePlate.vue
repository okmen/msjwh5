<template>
  <div class="replace-plate">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="serviceType" readonly></g-input>
    </div>
    <g-input title="车主姓名" v-model="ownersName" readonly></g-input>
    <g-input title="证件号码" v-model="certificateNumber" readonly></g-input>
    <g-input title="车主证件号码" v-model="carCertificateNumber" readonly></g-input>
    <g-select title="车牌号码" :data="plateNumber" v-model="plateNumberOne" @getSelected="getPlateNumber" ref="plateNumberName"></g-select>
    <g-select title="车牌类型" :data="selectPlateType" v-model="plateTypeOne" @getSelected="getPlateType" ref="plateTypeStr"></g-select>
    <g-select title="户籍所在地" :data="selectCensusRegister" v-model="censusRegisterOne" @getSelected="getCensusRegisterIndex"></g-select>
    <g-input title="收件人姓名" v-model="recipientName" maxlength="18" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" maxlength="11" placeholder="请输入收件人手机号码"></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="areaSelectData" v-model="recipientAddressRegion"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <g-input title="住所地址" v-model="homeAddress" placeholder="请输入住所地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证(正面)" id="file1" :bg="imgOne1" v-model="IDcardFront"></g-upload>
        <g-upload text="身份证(反面)" id="file2" :bg="imgOne2" v-model="IDcarfBack"></g-upload>
        <g-upload text="机动车登记证书" id="file3" :bg="imgOne3" v-model="registerCredential"></g-upload>
        <g-upload text="境外人员临住表" v-show="showIndex == '2'" id="file4" :bg="imgOne4" v-model="outBoard"></g-upload>
        <g-upload text="居住证正面" v-show="showIndex == '1'" id="file5" :bg="imgOne5" v-model="residencePermitF"></g-upload>
        <g-upload text="居住证反面" v-show="showIndex == '1'" id="file6" :bg="imgOne6" v-model="residencePermitB"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="myNumberPlate"></g-button>
    <g-button text="确认信息" v-if="!myNumberPlate" type="gray"></g-button>
  </div>
</template>

<script>
  import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
  import { replaceMotorVehicleLicensePlate } from '@/config/baseURL.js'
  import beforeSubmit from '@/mixins/beforeSubmit'
  export default {
    data () {
      return {
        myNumberPlate: '',
        serviceType: '办理补证、换领机动车号牌',
        showIndex: 0,
        imgOne1: require('@/assets/images/IDcard-front.png'),
        imgOne2: require('@/assets/images/IDcard-back.png'),
        imgOne3: require('@/assets/images/register-credential.png'),
        imgOne4: require('@/assets/images/out-board.png'),
        imgOne5: require('@/assets/images/residence-permit-f.png'),
        imgOne6: require('@/assets/images/residence-permit-b.png'),
        censusRegisterOne: '1',
        plateNumberOne: '0',
        plateNumberName: '',
        plateTypeOne: '02',
        recipientPhone: '',    // 收件人手机号码
        recipientName: '',    // 收件人姓名
        recipientAddressRegion: '福田区',  // 收件人地址区域
        recipientAddressDetail: '',  // 收件人详细地址
        homeAddress: '',  // 住所地址
        IDcardFront: '',
        IDcarfBack: '',
        registerCredential: '',
        outBoard: '',
        residencePermitF: '',  // 居住证正面
        residencePermitB: '',   // 居住证反面
        certificateNumber: '',  // 证件号码
        carCertificateNumber: '',  // 车主证件号码
        plateToCarNumber: {},  // 车牌号对应车主证件号码
        allOwnersName: {},
        ownersName: '',
        plateTypeStr: '蓝牌'
      }
    },
    components: {
      GInput,
      GSelect,
      GSelectOne,
      GButton,
      Group,
      GUpload
    },
    mixins: [beforeSubmit],
    computed: {
      plateNumber () {
        var plateInfo = {
          title: '车牌号码',
          option: []
        }
        let cars = this.$store.state.user.cars
        if (!cars) return plateInfo.option
        cars.map((item, index) => {
          if (+item.isMySelf === 0) {
            plateInfo.option.push({'name': item.myNumberPlate, 'value': index + ''})
            this.plateToCarNumber[index] = item.identityCard
            this.allOwnersName[index] = item.name
          }
        })
        return plateInfo.option
      },
      queryURL () {
        return this.$store.getters.queryURL
      },
      areaSelectData () {
        return this.$store.state.cityAreaS
      },
      selectPlateType () {
        return this.$store.state.plateType
      },
      selectCensusRegister () {
        return this.$store.state.censusRegister
      }
    },
    methods: {
      getCensusRegisterIndex (index) {
        this.showIndex = index + ''
      },
      getPlateNumber () {
        this.plateNumberName = this.$refs.plateNumberName.currentName
        this.carCertificateNumber = this.plateToCarNumber[this.plateNumberOne]
        this.ownersName = this.allOwnersName[this.plateNumberOne]
      },
      getPlateType () {
        this.plateTypeStr = this.$refs.plateTypeStr.currentName
      },
      confirmInfo () {
        let obj = {
          recipientName: '请输入收件人姓名',
          recipientPhone: '收件人手机号码格式不正确',
          recipientAddressDetail: '请输入收件人详细地址',
          IDcardFront: '请上传身份证正面',
          IDcarfBack: '请上传身份证反面',
          registerCredential: '请上传机动车登记证书'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        if (this.$verification.isPhone(this.recipientPhone)) return
        if ((!this.residencePermitF) && (this.censusRegister !== '1') && (this.showIndex === '1')) {
          this.$toast({message: '请上传居住证正面'})
          return
        }
        if ((!this.residencePermitB) && (this.censusRegister !== '1') && (this.showIndex === '1')) {
          this.$toast({message: '请上传居住证反面'})
          return
        }
        if ((!this.outBoard) && (this.censusRegister !== '1') && (this.showIndex === '2')) {
          this.$toast({message: '请上传境外人员临住表'})
          return
        }
        let dataList = {
          type: '补换机动车号牌',
          url: replaceMotorVehicleLicensePlate,
          title: 'createVehicleInfo_JD02',
          textObj: {
            'name': this.ownersName,
            'identityCard': this.certificateNumber,
            'carOwnerIdentityCard': this.carCertificateNumber,
            'numberPlate': this.plateNumberName,
            'plateType': this.plateTypeOne,
            'plateTypeStr': this.plateTypeStr,
            'placeOfDomicile': this.censusRegisterOne,
            'showIndex': this.showIndex,
            'receiverName': this.recipientName,
            'receiverNumber': this.recipientPhone,
            'receiverAddress': `深圳市${this.recipientAddressRegion}${this.recipientAddressDetail}`,
            'address': this.homeAddress
          },
          imgObj: {
            'PHOTO9': this.IDcardFront || '',
            'PHOTO10': this.IDcarfBack || '',
            'DJZSFYJ': this.registerCredential || '',
            'PHOTO31': this.outBoard || '',
            'JZZA': this.residencePermitF || '',
            'JZZB': this.residencePermitB || ''
          }
        }
        this.$store.commit('savePassByValue', dataList)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    },
    mounted () {
      this.carCertificateNumber = this.plateToCarNumber[this.plateNumberOne]
      this.ownersName = this.allOwnersName[this.plateNumberOne]
      this.certificateNumber = this.$store.state.user.identityCard
      this.plateNumberName = this.$refs.plateNumberName.currentName
      this.myNumberPlate = this.$store.state.user.myNumberPlate
      if (!this.myNumberPlate) {
        this.$MessageBox('温馨提示', '暂无车辆，您的车辆未绑定或者审核中')
      }
    }
  }
</script>

<style lang="less" scoped>
  .replace-plate {
    position:relative;
    padding-bottom: 40px;
    .upload-group{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
</style>
