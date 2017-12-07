<template>
  <div class="replace-plate">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="serviceType" readonly></g-input>
    </div>
    <g-input title="车主姓名" v-model="ownersName" disabled></g-input>
    <g-input title="证件号码" v-model="certificateNumber" disabled></g-input>
    <g-input title="车主证件号码" v-model="carCertificateNumber" disabled></g-input>
    <g-select title="车牌号码" :data="plateNumber" v-model="plateNumberOne" @getSelected="getPlateNumber" ref="plateNumberName"></g-select>
    <g-select title="车牌类型" :data="plateType.option" v-model="plateTypeOne" @getSelected="getPlateType" ref="plateTypeStr"></g-select>
    <g-select title="户籍所在地" :data="censusRegister.option" v-model="censusRegisterOne" @getSelected="getCensusRegisterIndex"></g-select>
    <g-input title="收件人姓名" v-model="recipientName" maxlength="18" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" maxlength="11" placeholder="请输入收件人手机号码"></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="recipientInfo.option" v-model="recipientAddressRegion"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <g-input title="住所地址" v-model="homeAddress" placeholder="请输入住所地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证（正面)" id="file1" :bg="imgOne1" v-model="IDcardFront"></g-upload>
        <g-upload text="身份证（反面)" id="file2" :bg="imgOne2" v-model="IDcarfBack"></g-upload>
        <g-upload text="机动车登记证书" id="file3" :bg="imgOne3" v-model="registerCredential"></g-upload>
        <g-upload text="境外人员临住表" v-show="showIndex == '2'" id="file4" :bg="imgOne4" v-model="outBoard"></g-upload>
        <g-upload text="居住证正面" v-show="showIndex == '1'" id="file5" :bg="imgOne5" v-model="residencePermitF"></g-upload>
        <g-upload text="居住证反面" v-show="showIndex == '1'" id="file6" :bg="imgOne6" v-model="residencePermitB"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="plateNumber.length"></g-button>
    <g-button text="确认信息" v-if="!plateNumber.length" type="gray"></g-button>
  </div>
</template>

<script>
  import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
  import { replaceMotorVehicleLicensePlate } from '@/config/baseURL.js'
  import beforeSubmit from '@/mixins/beforeSubmit'
  export default {
    data () {
      return {
        showIndex: 0,
        imgOne1: require('@/assets/images/IDcard-front.png'),
        imgOne2: require('@/assets/images/IDcard-back.png'),
        imgOne3: require('@/assets/images/register-credential.png'),
        imgOne4: require('@/assets/images/out-board.png'),
        imgOne5: require('@/assets/images/residence-permit-f.png'),
        imgOne6: require('@/assets/images/residence-permit-b.png'),
        plateType: {
          title: '车牌类型',
          option: [
            {name: '蓝牌', value: '02'},
            {name: '黄牌', value: '01'},
            {name: '黑牌', value: '06'},
            {name: '个性牌', value: '02'},
            {name: '小型新能源车号牌', value: '52'},
            {name: '大型新能源车号牌', value: '51'}
          ]
        },
        optname: [
          {'str': '深户', choose: true, id: '1'},
          {'str': '外籍户口', choose: false, id: '0'}
        ],
        recipientInfo: {
          title: '深圳市',
          option: [
            {name: '福田区', value: '福田区'},
            {name: '罗湖区', value: '罗湖区'},
            {name: '南山区', value: '南山区'},
            {name: '宝安区', value: '宝安区'},
            {name: '龙岗区', value: '龙岗区'},
            {name: '盐田区', value: '盐田区'},
            {name: '龙华新区', value: '龙华新区'},
            {name: '光明新区', value: '光明新区'},
            {name: '坪山新区', value: '坪山新区'},
            {name: '大鹏新区', value: '大鹏新区'}
          ]
        },
        censusRegisterOne: '1',
        censusRegister: {
          title: '户籍所在地',
          option: [
            {name: '深户', value: '1'},
            {name: '非深户', value: '0'},
            {name: '外籍', value: '0'}
          ]
        },
        serviceType: '补领机动车号牌',
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
        degree45: '',
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
        let storage = window.localStorage.getItem('cars')
        if (!JSON.parse(storage).length) return plateInfo.option
        JSON.parse(storage).map((item, index) => {
          if (+item.isMySelf === 0) {
            plateInfo.option.push({'name': item.myNumberPlate, 'value': index + ''})
            this.plateToCarNumber[index] = item.identityCard
            this.allOwnersName[index] = item.name
          }
        })
        return plateInfo.option
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
        console.log(this.plateTypeStr)
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
        if (this.$verification.isChinese(this.recipientName)) return
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
            'PHOTO9': this.IDcardFront || this.IDcardFront,
            'PHOTO10': this.IDcarfBack || this.IDcarfBack,
            'DJZSFYJ': this.registerCredential || this.registerCredential,
            'PHOTO31': this.outBoard || this.outBoard,
            'JZZA': this.residencePermitF || this.residencePermitF,
            'JZZB': this.residencePermitB || this.residencePermitB
          }
        }
        this.$store.commit('savePassByValue', dataList)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    },
    mounted () {
      this.carCertificateNumber = this.plateToCarNumber[this.plateNumberOne]
      this.ownersName = this.allOwnersName[this.plateNumberOne]
      this.certificateNumber = window.localStorage.getItem('identityCard')
      this.plateNumberName = this.$refs.plateNumberName.currentName
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
