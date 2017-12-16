<template>
  <div class="replace-plate" id="temporaryLicense">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="licenseSelectMassage" disabled></g-input>
    </div>
    <g-input title="姓名" v-model="userName" maxlength="18" placeholder="请输入姓名" readonly></g-input>
    <g-input title="身份证号码" v-model="identityCard" maxlength="18" placeholder="请输入身份证号码" readonly></g-input>
    <g-input title="手机号码" v-model="mobilephone" maxlength="11" placeholder="请输入手机号码" readonly></g-input>
    <g-input title="车辆型号" v-model="cartModels" placeholder="请输入车辆型号"></g-input>
    <g-select title="车辆类型" :data="selectCarType" v-model="carTypeOne"></g-select>
    <g-input title="发动机号" v-model="engineNumber" placeholder="请输入发动机号"></g-input>
    <g-input title="车架号" v-model="behindTheFrame4Digits" placeholder="请输入车架号"></g-input>
    <g-radio title="车辆产地" :data="carOptList" v-model="carOrigin"></g-radio>
    <g-select title="户籍所在地" :data="selectCensusRegister" v-model="censusRegister" @getSelected="getCensusRegisterIndex"></g-select>
    <g-input title="收件人姓名" v-model="recipientName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" maxlength="11" placeholder="请输入收件人手机号码"></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="areaSelectData" v-model="recipientAddressRegion"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证(正面)" id="file1" :bg="require('@/assets/images/IDcard-front.png')" v-model="IDcardFront"></g-upload>
        <g-upload text="身份证(反面)" id="file2" :bg="require('@/assets/images/IDcard-back.png')" v-model="IDcarfBack"></g-upload>
        <g-upload text="购置发票图" id="file5" :bg="require('@/assets/images/dealService-1.png')" v-model="dealService1"></g-upload>
        <g-upload text="交强险单据" id="file6" :bg="require('@/assets/images/dealService-2.png')" v-model="dealService2"></g-upload>
        <g-upload text="机动车合格证" v-show="this.carOrigin != 'B'" id="file3" :bg="require('@/assets/images/dealService-3.png')" v-model="dealService3"></g-upload>
        <g-upload text="进口货物证明书" v-show="this.carOrigin != 'A'" id="file7" :bg="require('@/assets/images/dealService-4.png')" v-model="dealService4"></g-upload>
        <g-upload text="境外人员临住表" v-show="showIndex == '2'" id="file4" :bg="require('@/assets/images/out-board.png')" v-model="outBoard"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
  import {GInput, GSelect, GButton, GSelectOne, GRadio, Group, GUpload} from 'form'
  import beforeSubmit from '@/mixins/beforeSubmit'
  import { applyCarTemporaryLicence } from '@/config/baseURL'
  export default {
    data () {
      return {
        licenseSelectMassage: '办理临时行驶车号牌',
        showIndex: '0',
        carOptList: [
          {name: '国产', choose: true, value: 'A'},
          {name: '进口', choose: false, value: 'B'}
        ],
        censusRegister: '1', // 户籍所在地
        carOrigin: 'A', // 车辆产地
        plateNumberOne: '',
        carTypeOne: 'K31',
        recipientPhone: '',    // 收件人手机号码
        recipientName: '',    // 收件人姓名
        recipientAddressRegion: '福田区',  // 收件人地址区域
        recipientAddressDetail: '',  // 收件人详细地址
        outBoard: '',
        carCertificateNumber: '',  // 车主证件号码
        plateToCarNumber: {},  // 车牌号对应车主证件号码
        behindTheFrame4Digits: '', // 车架号
        engineNumber: '', // 发动机号
        cartModels: '', // 车辆型号
        mobilephone: '', // 手机号码
        identityCard: '', // 身份证号码
        userName: '', // 姓名
        IDcardFront: '', // 身份证正面
        IDcarfBack: '', // 身份证反面
        dealService1: '', // 购置发票
        dealService2: '', // 交强险单据
        dealService3: '', // 机动车合格证
        dealService4: '' // 进口货物证明书
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
    mixins: [beforeSubmit],
    computed: {
      areaSelectData () {
        return this.$store.state.cityAreaS
      },
      selectCarType () {
        return this.$store.state.cartype
      },
      queryURL () {
        return this.$store.getters.queryURL
      },
      selectCensusRegister () {
        return this.$store.state.censusRegister
      },
      getUser () {
        return this.$store.state.user
      }
    },
    methods: {
      getCensusRegisterIndex (index) {
        this.showIndex = index
      },
      confirmInfo () {
        let obj = {
          userName: '请输入姓名',
          mobilephone: '手机号码格式不正确',
          recipientPhone: '收件人手机号码格式不正确',
          identityCard: '请输入身份证号码',
          cartModels: '请输入车辆型号',
          engineNumber: '请输入发动机型号',
          behindTheFrame4Digits: '请输入车架号',
          recipientName: '请输入收件人姓名',
          recipientAddressDetail: '请输入收件人详细地址',
          IDcardFront: '请上传身份证正面',
          IDcarfBack: '请上传身份证反面',
          dealService1: '请上传购置发票图',
          dealService2: '请上传交强险单据'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        if (this.$verification.isPhone(this.mobilephone)) return
        if (this.$verification.isPhone(this.recipientPhone)) return
        if ((!this.dealService3) && (this.carOrigin !== 'B')) {
          this.$toast({message: '请上传机动车合格证'})
          return
        }
        if ((!this.dealService4) && (this.carOrigin !== 'A')) {
          this.$toast({message: '请上传进口货物证明书'})
          return
        }
        if ((!this.outBoard) && (this.showIndex === '2')) {
          this.$toast({message: '请上传境外人员临住表'})
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
            'carOrigin': this.carOrigin, // 车辆产地
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
      this.userName = this.getUser.userName
      this.mobilephone = this.getUser.mobilePhone
      this.identityCard = this.getUser.identityCard
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
