<template>
  <div class="replace-plate">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="serviceType" readonly></g-input>
    </div>
    <g-input title="车主姓名" v-model="ownersName" disabled></g-input>
    <g-input title="证件号码" v-model="certificateNumber" disabled></g-input>
    <g-input title="车主证件号码" v-model="carCertificateNumber" disabled></g-input>
    <!-- <div-select :childInfo="plateNumber" @getSelected="getPlateNumber" :defaultVal="defaultPlateNumber"></div-select> -->
    <!-- <div-select :childInfo="plateType" @getSelected="getPlateType" defaultVal="蓝牌"></div-select> -->
    <!--<div class="domicile-place">
      <span class="item-title">户籍所在地</span>
      <div-radio :optname="optname" @getSelected="getCensusRegister"></div-radio>
    </div>-->
    <!-- <div-select :childInfo="censusRegister" @getSelected="getCensusRegister" defaultVal="深户"></div-select> -->
    <g-input title="收件人姓名" v-model="recipientName" maxlength="18" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" maxlength="11" placeholder="请输入收件人手机号码"></g-input>
    <!-- <div class="recipient-address">
      <span class="item-title">收件人地址</span>
      <div class="recipient-address-select item-info">
        <div-select :childInfo="recipientInfo" @getSelected="getRecipientAddress" defaultVal="福田区"></div-select>
        <input type="text" placeholder="请输入详细地址" v-model="recipientAddressDetail">
      </div>
    </div> -->
    <g-input title="住所地址" v-model="homeAddress" placeholder="请输入住所地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证（正面)" id="file1" :bg="imgOne1" v-model="IDcardFront"></g-upload>
        <g-upload text="身份证（反面)" id="file2" :bg="imgOne2" v-model="IDcarfBack"></g-upload>
        <g-upload text="机动车登记证书" id="file3" :bg="imgOne3" v-model="registerCredential"></g-upload>
        <g-upload text="境外人员临住表" id="file4" :bg="imgOne4" v-model="outBoard"></g-upload>
        <g-upload text="居住证正面" v-show="this.showIndex == '1'" id="file5" :bg="imgOne5" v-model="residencePermitF"></g-upload>
        <g-upload text="居住证反面" v-show="this.showIndex == '1'" id="file6" :bg="imgOne6" v-model="residencePermitB"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
  import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
  import uploadFile from '@/utils/uploadFile.js'
  import { Toast } from 'mint-ui'
  import { isPhone, isChinese } from '@/utils/regExp.js'
  import { replaceMotorVehicleLicensePlate } from '@/config/baseURL.js'
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
            {
              'str': '蓝牌',
              'id': '02'
            },
            {
              'str': '黄牌',
              'id': '01'
            },
            {
              'str': '黑牌',
              'id': '06'
            },
            {
              'str': '个性牌',
              'id': '02'
            },
            {
              'str': '小型新能源车号牌',
              'id': '52'
            },
            {
              'str': '大型新能源车号牌',
              'id': '51'
            }
          ]
        },
        optname: [
          {'str': '深户', choose: true, id: '1'},
          {'str': '外籍户口', choose: false, id: '0'}
        ],
        recipientInfo: {
          title: '深圳市',
          option: [
            {
              'str': '福田区'
            },
            {
              'str': '罗湖区'
            },
            {
              'str': '南山区'
            },
            {
              'str': '宝安区'
            },
            {
              'str': '龙岗区'
            },
            {
              'str': '盐田区'
            },
            {
              'str': '龙华新区'
            },
            {
              'str': '光明新区'
            },
            {
              'str': '坪山新区'
            },
            {
              'str': '大鹏新区'
            }
          ]
        },
        censusRegisterOne: '1',
        censusRegister: {
          title: '户籍所在地',
          option: [
            {'str': '深户', id: '1'},
            {'str': '非深户', id: '0'},
            {'str': '外籍', id: '0'}
          ]
        },
        serviceType: '补换机动车号牌',
        plateNumberOne: '',
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
        plateTypeStr: '蓝牌',
        defaultPlateNumber: ''
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
    computed: {
      // certificateNumber () {
      //   return window.localStorage.getItem('identityCard')
      // },
      plateNumber () {
        var plateInfo = {
          title: '车牌号码',
          option: []
        }
        let storage = window.localStorage.getItem('cars')
        if (!JSON.parse(storage).length) return plateInfo
        JSON.parse(storage).map(item => {
          if (item.isMySelf === 0) {
            plateInfo.option.push({'str': item.myNumberPlate})
            this.plateToCarNumber[item.myNumberPlate] = item.identityCard
            this.allOwnersName[item.myNumberPlate] = item.name
          }
        })
        if (plateInfo.option[0]) {
          this.defaultPlateNumber = plateInfo.option[0].str
          this.plateNumberOne = plateInfo.option[0].str
        }
        return plateInfo
      }
    },
    methods: {
      uploadImg () {
        uploadFile.upload({
          id: 'file1',
          callback: (res) => {
            console.log(res)
            this.imgOne1 = res.imgUrl
            this.IDcardFront = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file2',
          callback: (res) => {
            console.log(res)
            this.imgOne2 = res.imgUrl
            this.IDcarfBack = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file3',
          callback: (res) => {
            console.log(res)
            this.imgOne3 = res.imgUrl
            this.registerCredential = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file4',
          callback: (res) => {
            console.log(res)
            this.imgOne4 = res.imgUrl
            this.outBoard = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file5',
          callback: (res) => {
            console.log(res)
            this.imgOne5 = res.imgUrl
            this.residencePermitF = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file6',
          callback: (res) => {
            console.log(res)
            this.imgOne6 = res.imgUrl
            this.residencePermitB = res.imgUrl
          }
        })
      },
      getCensusRegister (val, index) {
        this.censusRegisterOne = val
        this.showIndex = index
      },
      getRecipientAddress (val) {
        this.recipientAddressRegion = val
      },
      getPlateNumber (val) {
        this.plateNumberOne = val
        this.carCertificateNumber = this.plateToCarNumber[val]
        this.ownersName = this.allOwnersName[val]
      },
      getPlateType (val, index, str) {
        this.plateTypeOne = val
        this.plateTypeStr = str
      },
      confirmInfo () {
        console.log(this.censusRegisterOne)
        if (!this.recipientName) {
          Toast({
            message: '请输入收件人姓名',
            duration: 2000
          })
          return
        } else if (!isChinese(this.recipientName)) {
          Toast({
            message: '收件人姓名只能输入汉字',
            duration: 2000
          })
          return
        }
        if (!isPhone(this.recipientPhone)) {
          Toast({
            message: '收件人手机号码格式不正确',
            duration: 2000
          })
          return
        }
        if (!this.recipientAddressDetail) {
          Toast({
            message: '请输入收件人详细地址',
            duration: 2000
          })
          return
        }
        if (!this.IDcardFront) {
          Toast({
            message: '请上传身份证正面',
            duration: 2000
          })
          return
        }
        if (!this.IDcarfBack) {
          Toast({
            message: '请上传身份证反面',
            duration: 2000
          })
          return
        }
        if (!this.registerCredential) {
          Toast({
            message: '请上传机动车登记证书',
            duration: 2000
          })
          return
        }
        if ((!this.outBoard) && (this.showIndex === '2')) {
          Toast({
            message: '请上传境外人员临住表',
            duration: 2000
          })
          return
        }
       /*  if ((!this.residencePermitF) && (this.censusRegister !== '1')) {
          Toast({
            message: '请上传居住证正面',
            duration: 2000
          })
          return
        }
        if ((!this.residencePermitB) && (this.censusRegister !== '1')) {
          Toast({
            message: '请上传居住证反面',
            duration: 2000
          })
          return
        } */
        let dataList = {
          type: '补换机动车号牌',
          url: replaceMotorVehicleLicensePlate,
          textObj: {
            'name': this.ownersName,
            'identityCard': this.certificateNumber,
            'carOwnerIdentityCard': this.carCertificateNumber,
            'numberPlate': this.plateNumberOne,
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
            'PHOTO9': this.IDcardFront.split(',')[1] || this.IDcardFront,
            'PHOTO10': this.IDcarfBack.split(',')[1] || this.IDcarfBack,
            'DJZSFYJ': this.registerCredential.split(',')[1] || this.registerCredential,
            'PHOTO31': this.outBoard.split(',')[1] || this.outBoard,
            'JZZA': this.residencePermitF.split(',')[1] || this.residencePermitF,
            'JZZB': this.residencePermitB.split(',')[1] || this.residencePermitB
          }
        }
        this.$store.commit('saveMotorVehicleHandling', dataList)
        console.log(dataList)
        this.$router.push(/_WeChat/g.test(this.$route.path) ? '/affirmInfo_WeChat' : '/affirmInfo')
      }
    },
    mounted () {
      this.uploadImg()
      this.carCertificateNumber = this.plateToCarNumber[this.plateNumberOne]
      this.ownersName = this.allOwnersName[this.plateNumberOne]
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
