<template>
  <div class="replace-plate" id="temporaryLicense">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="licenseSelectMassage" disabled></g-input>
    </div>
    <g-input title="姓名" v-model="userName" maxlength="18" placeholder="请输入姓名"></g-input>
    <g-input title="身份证号码" v-model="identityCard" maxlength="18" placeholder="请输入身份证号码"></g-input>
    <g-input title="手机号码" v-model="mobilephone" maxlength="11" placeholder="请输入手机号码"></g-input>
    <g-input title="车辆型号" v-model="cartModels" placeholder="请输入车辆型号"></g-input>
    <g-select title="车辆类型" :data="cartype.option" v-model="carTypeOne"></g-select>
    <g-input title="发动机号" v-model="engineNumber" placeholder="请输入发动机号"></g-input>
    <g-input title="车架号" v-model="behindTheFrame4Digits" placeholder="请输入车架号"></g-input>
    <g-radio title="车辆产地" :optname="carOptList" @getSelected="getCensusRegister2"></g-radio>
    <g-select title="户籍所在地" :data="censusRegister3.option" v-model="censusRegister" @getSelected="getCensusRegisterIndex"></g-select>
    <g-input title="收件人姓名" v-model="recipientName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" maxlength="11" placeholder="请输入收件人手机号码"></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证（正面)" id="file1" :bg="require('@/assets/images/IDcard-front.png')" v-model="IDcardFront"></g-upload>
        <g-upload text="身份证（反面)" id="file2" :bg="require('@/assets/images/IDcard-back.png')" v-model="IDcarfBack"></g-upload>
        <g-upload text="购置发票图" id="file5" :bg="require('@/assets/images/dealService-1.png')" v-model="dealService1"></g-upload>
        <g-upload text="交强险单据" id="file6" :bg="require('@/assets/images/dealService-2.png')" v-model="dealService2"></g-upload>
        <g-upload text="机动车合格证" v-show="this.censusRegister2 != 'B'" id="file3" :bg="require('@/assets/images/dealService-3.png')" v-model="dealService3"></g-upload>
        <g-upload text="进口货物证明书" v-show="this.censusRegister2 != 'A'" id="file7" :bg="require('@/assets/images/dealService-4.png')" v-model="dealService4"></g-upload>
        <g-upload text="境外人员临住表" v-show="this.showIndex == '2'" id="file4" :bg="require('@/assets/images/out-board.png')" v-model="outBoard"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
  import {GInput, GSelect, GButton, GSelectOne, GRadio, Group, GUpload} from 'form'
  import { Toast } from 'mint-ui'
  import { isPhone } from '@/utils/regExp'
  import { applyCarTemporaryLicence } from '@/config/baseURL'
  export default {
    data () {
      return {
        cartype: {
          title: '车辆类型',
          option: [
            {name: '小型普通客车', value: 'K31'},
            {name: '小型越野客车', value: 'K32'},
            {name: '小型轿车', value: 'K33'},
            {name: '小型专用客车', value: 'K34'},
            {name: '微型普通客车', value: 'K41'},
            {name: '微型越野客车', value: 'K42'},
            {name: '微型轿车', value: 'K43'},
            {name: '小型专用校车', value: 'K38'}
          ]
        },
        carOptList: [
          {'str': '国产', choose: true, id: 'A'},
          {'str': '进口', choose: false, id: 'B'}
        ],
        licenseSelectMassage: '申请机动车临牌',
        censusRegister: '1', // 户籍所在地
        showIndex: '0',
        censusRegister2: 'A', // 车辆产地
        censusRegister3: {
          title: '户籍所在地',
          option: [
            {name: '深户', value: '1'},
            {name: '非深户', value: '0'},
            {name: '外籍', value: '0'}
          ]
        },
        plateNumberOne: '',
        carTypeOne: 'K31',
        recipientPhone: '',    // 收件人手机号码
        recipientName: '',    // 收件人姓名
        recipientAddressRegion: '福田区',  // 收件人地址区域
        recipientAddressDetail: '',  // 收件人详细地址
        outBoard: '',
        carCertificateNumber: '',  // 车主证件号码
        plateToCarNumber: {},  // 车牌号对应车主证件号码
        allOwnersName: {},
        ownersName: '',
        behindTheFrame4Digits: '', // 车架号
        engineNumber: '', // 发动机号
        cartModels: '', // 车辆型号
        mobilephone: window.localStorage.getItem('mobilePhone'), // 手机号码
        identityCard: window.localStorage.getItem('identityCard'), // 身份证号码
        userName: window.localStorage.getItem('userName'), // 姓名
        IDcardFront: '', // 身份证正面
        IDcarfBack: '', // 身份证反面
        dealService1: '', // 购置发票
        dealService2: '', // 交强险单据
        dealService3: '', // 机动车合格证
        dealService4: '', // 进口货物证明书
        areaSelect: '福田区'
      }
    },
    components: {
      GInput,
      GSelect,
      GSelectOne,
      GButton,
      GRadio,
      Group,
      GUpload
    },
    computed: {
      certificateNumber () {
        return window.localStorage.getItem('identityCard')
      },
      plateNumber () {
        var plateInfo = {
          title: '车牌号码',
          option: []
        }
        JSON.parse(window.localStorage.getItem('cars')).map(item => {
          plateInfo.option.push({'str': item.myNumberPlate})
          this.plateToCarNumber[item.myNumberPlate] = item.identityCard
          this.allOwnersName[item.myNumberPlate] = item.name
        })
        this.plateNumberOne = plateInfo.option[0].str
        this.defaultPlateNumber = plateInfo.option[0].str
        return plateInfo
      },
      areaSelectData () {
        return this.$store.state.cityAreaS
      }
    },
    methods: {
      getCensusRegisterIndex (index) {
        console.log(index)
        this.showIndex = index
      },
      getCensusRegister2 (val) {
        console.log(val)
        this.censusRegister2 = val
      },
      // getPlateNumber (val) {
      //   this.plateNumberOne = val
      //   this.carCertificateNumber = this.plateToCarNumber[val]
      //   this.ownersName = this.allOwnersName[val]
      // },
      confirmInfo () {
        if (!this.userName) {
          Toast({
            message: '请输入姓名',
            duration: 2000
          })
          return
        }
        if (!isPhone(this.mobilephone)) {
          Toast({
            message: '手机号码格式不正确',
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
        if (!this.identityCard) {
          Toast({
            message: '请输入身份证号码',
            duration: 2000
          })
          return
        }
        if (!this.cartModels) {
          Toast({
            message: '请输入车辆型号',
            duration: 2000
          })
          return
        }
        if (!this.engineNumber) {
          Toast({
            message: '请输入发动机型号',
            duration: 2000
          })
          return
        }
        if (!this.behindTheFrame4Digits) {
          Toast({
            message: '请输入车架号',
            duration: 2000
          })
          return
        }
        if (!this.recipientName) {
          Toast({
            message: '请输入收件人姓名',
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
        if (!this.dealService1) {
          Toast({
            message: '请上传购置发票图',
            duration: 2000
          })
          return
        }
        if (!this.dealService2) {
          Toast({
            message: '请上传交强险单据',
            duration: 2000
          })
          return
        }
        if ((!this.dealService3) && (this.censusRegister2 !== 'B')) {
          Toast({
            message: '请上传机动车合格证',
            duration: 2000
          })
          return
        }
        if ((!this.dealService4) && (this.censusRegister2 !== 'A')) {
          Toast({
            message: '请上传进口货物证明书',
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
        let dataList = {
          type: '申请机动车临牌',
          url: applyCarTemporaryLicence,
          title: 'applyCarTemporaryLicence',
          textObj: {
            'userName': this.userName, // 姓名
            'identityCard': this.identityCard, // 身份证
            'mobilephone': this.mobilephone, // 手机号码
            'cartModels': this.cartModels, // 车辆型号
            'cartype': this.carTypeOne, // 车辆类型
            'engineNumber': this.engineNumber, // 发动机号
            'behindTheFrame4Digits': this.behindTheFrame4Digits, // 车架号
            'carOrigin': this.censusRegister2, // 车辆产地
            'placeOfDomicile': this.censusRegister, // 户籍所在地
            'showIndex': this.showIndex,
            'receiverName': this.recipientName, // 收件人姓名
            'receiverNumber': this.recipientPhone, // 收件人号码
            'receiverAddress': `深圳市,${this.recipientAddressRegion},${this.recipientAddressDetail}` // 收件人地址
          },
          imgObj: {
            'PHOTO26': this.dealService1 || '',
            'PHOTO27': this.dealService2 || '',
            'PHOTO9': this.IDcardFront || '',
            'PHOTO10': this.IDcarfBack || '',
            'PHOTO28': this.dealService3 || '',
            'PHOTO31': this.outBoard || '',
            'PHOTO29': this.dealService4 || ''
          }
        }
        this.$store.commit('savePassByValue', dataList)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    },
    mounted () {
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
