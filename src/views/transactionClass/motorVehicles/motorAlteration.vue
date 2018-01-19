<template>
  <div class="motorAlteration">
    <g-input title="车主姓名" v-model="ownersName"></g-input>
    <g-select title="证件种类" :data="cardSelectData" v-model="cur_card_id"></g-select>
    <g-input title="证件号码" v-model="certificateNumber" placeholder="请输入证件号码"></g-input>
    <g-select title="车牌号码" :data="plateNumber" v-model="plateNumberOne" @getSelected="getPlateNumber" ref="plateNumberName"></g-select>
    <g-input title="车牌类型" v-model="carType" readonly></g-input>
    <g-select title="户籍所在地" :data="selectCensusRegister" v-model="censusRegisterOne" @getSelected="getCensusRegisterIndex"></g-select>
    <g-input title="车架号" v-model="behindTheFrame4Digits" readonly></g-input>
    <g-input title="手机号码" v-model="mobilephone" readonly></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="areaSelectData" v-model="recipientAddressRegion"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证(正面)" id="file1" :bg="imgOne1" v-model="IDcardFront"></g-upload>
        <g-upload text="身份证(反面)" id="file2" :bg="imgOne2" v-model="IDcarfBack"></g-upload>
        <g-upload text="机动车行驶证" id="file3" :bg="imgOne3" v-model="registerCredential"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="myNumberPlate"></g-button>
    <g-button text="确认信息" v-if="!myNumberPlate" type="gray"></g-button>
  </div>
</template>

<script>
  import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
  import { iocomotiveCarChangeContact } from '@/config/baseURL.js'
  import beforeSubmit from '@/mixins/beforeSubmit'
  export default {
    data () {
      return {
        showIndex: '0',
        myNumberPlate: '',
        imgOne1: require('@/assets/images/IDcard-front.png'),
        imgOne2: require('@/assets/images/IDcard-back.png'),
        imgOne3: require('@/assets/images/drivinglicense.png'),
        censusRegisterOne: '1',
        plateNumberOne: '0',
        plateNumberName: '',
        behindTheFrame4Digits: '', // 车架号
        mobilephone: '',
        recipientAddressRegion: '福田区',  // 收件人地址区域
        recipientAddressDetail: '',  // 收件人详细地址
        IDcardFront: '',
        IDcarfBack: '',
        registerCredential: '',  // 机动车登记证书
        certificateNumber: '',  // 证件号码
        allOwnersName: {},
        ownersName: '',
        cur_card_id: 'A',
        plateType: '',
        carType: ''
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
            this.allOwnersName[index] = item.name
          }
        })
        return plateInfo.option
      },
      carSelectData () {
        return this.$store.state.carSelectData
      },
      queryURL () {
        return this.$store.getters.queryURL
      },
      areaSelectData () {
        return this.$store.state.cityAreaS
      },
      selectCensusRegister () {
        return this.$store.state.censusRegister
      },
      cardSelectData () {
        return this.$store.state.cardSelectData
      }
    },
    methods: {
      getCensusRegisterIndex (index) {
        this.showIndex = index + ''
      },
      getPlateNumber () {
        this.plateNumberName = this.$refs.plateNumberName.currentName
        this.ownersName = this.allOwnersName[this.plateNumberOne]
      },
      confirmInfo () {
        let obj = {
          certificateNumber: '请输入身份证',
          recipientAddressDetail: '请输入收件人详细地址',
          IDcardFront: '请上传身份证正面',
          IDcarfBack: '请上传身份证反面',
          registerCredential: '请上传机动车行驶证'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        let dataList = {
          type: '机动车变更联系方式',
          url: iocomotiveCarChangeContact,
          textObj: {
            'name': this.ownersName,  // 车主姓名
            'identificationNO': this.cur_card_id,  // 证件种类
            'identificationNum': this.certificateNumber,  // 证件号码
            'numberPlate': this.plateNumberName,  // 车牌号码
            'cartype': this.plateType,  // 车辆类型
            'mobilephone': this.mobilephone,  // 手机号码
            'placeOfDomicile': this.censusRegisterOne,  // 户籍所在地
            'showIndex': this.showIndex,
            'behindTheFrame4Digits': this.behindTheFrame4Digits,  // 车架号
            'receiverAddress': `深圳市${this.recipientAddressRegion}${this.recipientAddressDetail}`  // 收件人地址
          },
          imgObj: {
            'PHOTO9': this.IDcardFront || '',
            'PHOTO10': this.IDcarfBack || '',
            'JDCXSZ': this.registerCredential || ''
          }
        }
        this.$store.commit('savePassByValue', dataList)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    },
    mounted () {
      this.ownersName = this.allOwnersName[this.plateNumberOne]
      this.certificateNumber = this.$store.state.user.identityCard
      this.plateNumberName = this.$refs.plateNumberName.currentName
      this.mobilephone = this.$store.state.user.mobilePhone
      this.plateType = this.$store.state.user.plateType
      this.carType = this.carSelectData[this.plateType]
      this.behindTheFrame4Digits = this.$store.state.user.behindTheFrame4Digits
      this.myNumberPlate = this.$store.state.user.myNumberPlate
      if (!this.myNumberPlate) {
        this.$MessageBox('温馨提示', '暂无车辆，您的车辆未绑定或者审核中')
      }
    }
  }
</script>

<style lang="less" scoped>
  .motorAlteration {
    position:relative;
    padding: 40px 0;
    .upload-group{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
</style>
