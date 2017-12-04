<!--
* 申请机动车临牌
 -->
<template>
  <div class="replace-plate" id="temporaryLicense">
    <g-input title="姓名" v-model="userName" maxlength="18" placeholder="请输入姓名"></g-input>
    <g-input title="身份证号码" v-model="identityCard" maxlength="18" placeholder="请输入身份证号码"></g-input>
    <g-input title="手机号码" v-model="mobilephone" maxlength="11" placeholder="请输入手机号码"></g-input>
    <g-input title="车辆型号" v-model="cartModels" placeholder="请输入车辆型号"></g-input>
    <!-- 车辆类型 -->
    <!-- <div-select :childInfo="cartype" @getSelected="getPlateType" defaultVal="小型普通客车"></div-select> -->
    <g-select title="车辆类型" :data="cartype.option" v-model="carTypeOne"></g-select>
    <g-input title="发动机号" v-model="engineNumber" placeholder="请输入发动机号"></g-input>
    <g-input title="车架号" v-model="behindTheFrame4Digits" placeholder="请输入车架号"></g-input>
    <!-- <div class="domicile-place">
      <span class="item-title">车辆产地</span>
      <div-radio :optname="optname2" @getSelected="getCensusRegister2"> </div-radio>
    </div> -->
    <g-select title="户籍所在地" :data="censusRegister3.option" v-model="censusRegister"></g-select>
    <!-- <div class="domicile-place">
      <span class="item-title">户籍所在地</span>
      <div-radio :optname="optname1" @getSelected="getCensusRegister1"> </div-radio>
    </div> -->
    <!-- <div-select :childInfo="censusRegister3" @getSelected="getCensusRegister1" defaultVal="深户"></div-select> -->
    <g-input title="收件人姓名" v-model="recipientName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" maxlength="11" placeholder="请输入收件人手机号码"></g-input>
    <g-input title="收件人地址" v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <div class="upload-photo">
      <div class="">请按示例图上传以下证件照片</div>
      <div class="upload-all-img">
        <div class="upload-item-img">
          <label class="upload-item-img-one" for="file1">
            <input id="file1" type="file" accept="image/*" >
            <img :src="imgOne1" />
          </label>
          <div class="upload-item-text-one">身份证(正面)</div>
        </div>
        <div class="upload-item-img">
          <label class="upload-item-img-one" for="file2">
            <input id="file2" type="file" accept="image/*" >
            <img :src="imgOne2" />
          </label>
          <div class="upload-item-text-one">身份证(反面)</div>
        </div>
        <div class="upload-item-img">
          <label class="upload-item-img-one" for="file5">
            <input id="file5" type="file" accept="image/*" >
            <img :src="imgOne5" />
          </label>
          <div class="upload-item-text-one">购置发票图</div>
        </div>
        <div class="upload-item-img">
          <label class="upload-item-img-one" for="file6">
            <input id="file6" type="file" accept="image/*" >
            <img :src="imgOne6" />
          </label>
          <div class="upload-item-text-one">交强险单据</div>
        </div>
        <div class="upload-item-img" v-show="this.censusRegister2 != 'B'">
          <label class="upload-item-img-one" for="file3">
            <input id="file3" type="file" accept="image/*" >
            <img :src="imgOne3" />
          </label>
          <div class="upload-item-text-one">机动车合格证</div>
        </div>
        <div class="upload-item-img" v-show="this.censusRegister2 != 'A'">
          <label class="upload-item-img-one" for="file7">
            <input id="file7" type="file" accept="image/*" >
            <img :src="imgOne7" />
          </label>
          <div class="upload-item-text-one">进口货物证明书</div>
        </div>
        <div class="upload-item-img" v-show="this.showIndex == '2'">
          <label class="upload-item-img-one" for="file4">
            <input id="file4" type="file" accept="image/*" >
            <img :src="imgOne4" />
          </label>
          <div class="upload-item-text-one">境外人员临住表</div>
        </div>
      </div>
    </div>
    <div class="btn-confirm" @click="confirmInfo">
      确认信息
    </div>
  </div>
</template>
<script>
  import {GInput, GSelect, GButton} from 'form'
  import uploadFile from '@/utils/uploadFile.js'
  import { Toast } from 'mint-ui'
  import { isPhone } from '@/utils/regExp.js'
  import { applyCarTemporaryLicence } from '@/config/baseURL.js'
  export default {
    data () {
      return {
        imgOne1: require('@/assets/images/IDcard-front.png'),
        imgOne2: require('@/assets/images/IDcard-back.png'),
        imgOne3: require('@/assets/images/dealService-3.png'),
        imgOne4: require('@/assets/images/out-board.png'),
        imgOne5: require('@/assets/images/dealService-1.png'),
        imgOne6: require('@/assets/images/dealService-2.png'),
        imgOne7: require('@/assets/images/dealService-4.png'),
        cartype: {
          title: '车辆类型',
          option: [
            {
              name: '小型普通客车',
              value: 'K31'
            },
            {
              name: '小型越野客车',
              value: 'K32'
            },
            {
              name: '小型轿车',
              value: 'K33'
            },
            {
              name: '小型专用客车',
              value: 'K34'
            },
            {
              name: '微型普通客车',
              value: 'K41'
            },
            {
              name: '微型越野客车',
              value: 'K42'
            },
            {
              name: '微型轿车',
              value: 'K43'
            },
            {
              name: '小型专用校车',
              value: 'K38'
            }
          ]
        },
        optname1: [
          {'str': '深户', choose: true, id: '1'},
          {'str': '外籍户口', choose: false, id: '0'}
        ],
        optname2: [
          {'str': '国产', choose: true, id: 'A'},
          {'str': '进口', choose: false, id: 'B'}
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
        censusRegister: '1',
        showIndex: '0',
        censusRegister2: 'A',
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
        homeAddress: '',  // 住所地址
        degree45: '',
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
        dealService4: '' // 进口货物证明书
      }
    },
    components: {
      // divSelect: require('../replaceCredentials/components/divSelect.vue'),
      // divRadio: require('../replaceCredentials/components/divRadio.vue')
      GInput,
      GSelect,
      GButton
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
            this.dealService3 = res.imgUrl
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
            this.dealService1 = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file6',
          callback: (res) => {
            console.log(res)
            this.imgOne6 = res.imgUrl
            this.dealService2 = res.imgUrl
          }
        })
        uploadFile.upload({
          id: 'file7',
          callback: (res) => {
            console.log(res)
            this.imgOne7 = res.imgUrl
            this.dealService4 = res.imgUrl
          }
        })
      },
      getCensusRegister1 (val, index) {
        console.log(val)
        this.censusRegister = val
        this.showIndex = index
      },
      getCensusRegister2 (val) {
        console.log(val)
        this.censusRegister2 = val
      },
      getRecipientAddress (val) {
        this.recipientAddressRegion = val
      },
      getPlateNumber (val) {
        this.plateNumberOne = val
        this.carCertificateNumber = this.plateToCarNumber[val]
        this.ownersName = this.allOwnersName[val]
      },
      getPlateType (val) {
        this.carTypeOne = val
      },
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
            'PHOTO26': this.dealService1.split(',')[1] || '',
            'PHOTO27': this.dealService2.split(',')[1] || '',
            'PHOTO9': this.IDcardFront.split(',')[1] || '',
            'PHOTO10': this.IDcarfBack.split(',')[1] || '',
            'PHOTO28': this.dealService3.split(',')[1] || '',
            'PHOTO31': this.outBoard.split(',')[1] || '',
            'PHOTO29': this.dealService4.split(',')[1] || ''
          }
        }
        this.$store.commit('saveMotorVehicleHandling', dataList)
        console.log(dataList)
        this.$router.push(/_WeChat/g.test(this.$route.name) ? '/affirmInfo_WeChat' : '/affirmInfo')
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
    .upload-all-img{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      flex-wrap: wrap;
      .upload-item-img{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
    .upload-photo{
      margin-top: 30px;
      padding: 0 40px;
      display: block;
      .upload-item-text-one{
        margin-top: 10px;
        margin-bottom: 30px;
        color: #7e7e7e;
        text-align: center;
      }
      .upload-item-img-one{
        width: 300px;
        height: 300px;
        border: 2px solid #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        input{
          display: none;
        }
        img{
          max-height: 90%;
          max-width: 90%;
        }
      }
    }
    .btn-confirm{
      margin: 40px;
      background: #09bb07;
      height: 80px;
      line-height: 80px;
      border-radius: 8px;
      font-size: 30px;
      color: #fff;
      text-align: center;
    }
  }
</style>
