<template>
  <div class="addVehicle">
    <div class="changeCard-top">
      <g-select title="业务类型" :data="typeList" v-model="typeData"></g-select>
    </div>
    <g-select title="车牌类型" :data="vehicleTypeData" v-model="vehicleType"></g-select>
    <plate-number-full v-model="plateNumber"></plate-number-full>
    <g-input title="车架号码" maxlength="4" v-model="frameNumber" placeholder="请输入车架号后4位"></g-input>
    <g-input title="车主名字" v-model="addVehicleName" readonly v-if="typeData === '1'"></g-input>
    <g-input title="身份证号" v-model="idCard" readonly v-if="typeData === '1'"></g-input>
    <g-input title="车主名字" v-model="othersAddVehicleName" placeholder="请输入车主名字" v-if="typeData === '0'"></g-input>
    <g-input class="addVehicle-input" title="身份证号" v-model="othersIdCard" placeholder='(车主身份证)外籍人士请在证件号前加F' v-if="typeData === '0'"></g-input>
    <group title="请按示例图上传以下证件照片" v-if="typeData === '0'">
      <div class="upload-group">
        <g-upload text="身份证(人像面)" id="file" :bg="require('../../assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
        <g-upload text="身份证(国徽面)" id="file2" :bg="require('../../assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
        <g-upload text="车主手持身份证" id="file3" :bg="require('../../assets/images/ID-hand.png')" v-model="handheldID"></g-upload>
      </div>
    </group>
    <g-button text="提交" @click.native="submit"></g-button>
  </div>
</template>

<script>
import { GInput, GSelect, GButton, GUpload, Group } from 'form'
import PlateNumberFull from '@/components/PlateNumberFull'
import { addVehicle } from '@/config/baseURL'
import beforeSubmit from '@/mixins/beforeSubmit'
import axios from '@/utils/axios'
export default {

  name: 'addVehicle',

  data () {
    return {
      IDCardFront: '',
      IDCardBack: '',
      handheldID: '',
      typeList: [
        {
          value: '1',
          name: '绑定个人车辆信息'
        },
        {
          value: '0',
          name: '绑定他人车辆'
        }
      ],
      typeData: '1',
      vehicleType: '02',
      plateNumber: '',
      frameNumber: '',
      addVehicleName: '',   // 本人车主名字
      idCard: '',            // 本人身份证号
      othersAddVehicleName: '',   // 他人名字
      othersIdCard: ''             // 他人身份证
    }
  },
  components: {
    GInput, GSelect, GButton, PlateNumberFull, GUpload, Group
  },
  computed: {
    vehicleTypeData () {
      return this.$store.state.plateType
    }
  },
  mixins: [beforeSubmit],
  created () {
    let val = this.$store.state.user
    this.addVehicleName = val.userName
    this.idCard = val.identityCard
  },
  methods: {
    submit () {
      let obj = ''
      if (this.typeData === '1') {    // 添加本人车辆验证
        obj = {
          plateNumber: '请输入车牌号码',
          frameNumber: '请输入车架号后4位'
        }
      } else if (this.typeData === '0') {    // 添加他人车辆验证
        obj = {
          plateNumber: '请输入车牌号码',
          frameNumber: '请输入车架号后4位',
          othersAddVehicleName: '请输入车主名字',
          othersIdCard: '(车主身份证)外籍人士请在证件号前加F',
          IDCardFront: '请选择身份证(人像面)',
          IDCardBack: '请选择身份证(国徽面)',
          handheldID: '请选择手持身份证'
        }
        console.log(this.othersIdCard)
        if (this.othersIdCard) {
          if (/[（*|）*]/g.test(this.othersIdCard)) {
            this.$toast({message: '请使用英文状态下的括号'})
            return
          }
        }
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.plateVerification(this.plateNumber)) return
      this.addSubmitFn()
    },
    addSubmitFn () {
      let addVehicleData = {}
      if (this.typeData === '1') {
        addVehicleData = {
          bindType: this.typeData, // 绑定类型
          licensePlateType: this.vehicleType, // 号牌种类
          licensePlateNumber: this.plateNumber.substring(1), // 车牌号码
          frameNumber: this.frameNumber, // 车架号码
          ownerName: this.addVehicleName, // 车主姓名
          provinceAbbreviation: this.plateNumber.substring(0, 1), // 省简称
          userIdCard: this.idCard, // 当前登录用户身份证
          certifiedSource: 'M' // 绑定类型
        }
      } else {
        addVehicleData = {
          bindType: this.typeData, // 绑定类型
          licensePlateType: this.vehicleType, // 号牌种类
          licensePlateNumber: this.plateNumber.substring(1), // 车牌号码
          frameNumber: this.frameNumber, // 车架号码
          ownerName: this.othersAddVehicleName, // 车主姓名
          ownerIdCard: this.othersIdCard, // 车主身份证号
          provinceAbbreviation: this.plateNumber.substring(0, 1), // 省简称
          userIdCard: this.idCard, // 当前登录用户身份证
          certifiedSource: 'M', // 绑定类型
          idCardImgPositive: this.IDCardFront, // 车主身份证正面照
          idCardImgHandHeld: this.handheldID // 车主身份证手持照
        }
      }
      console.log(addVehicleData)
      axios.post(addVehicle, addVehicleData).then(json => {
        if (json.code === '0000') {
          let sendData = {
            type: 5
          }
          this.$store.commit('saveSuccessInfo', sendData)
          this.$router.push({path: '/submitSuccess', query: this.$store.getters.queryURL})
        } else {
          this.$toast({message: json.msg})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.addVehicle {
  padding: 10px 0 40px;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>

<style  lang='less'>
.addVehicle-input {
  .g-input-content input::-webkit-input-placeholder { /* WebKit browsers */
    font-size:24px;
    line-height: 56px;
  }
  .g-input-content input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size:24px;
    line-height: 56px;
  }
  .g-input-content input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size:24px;
    line-height: 56px;
  }
  .g-input-content input:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size:24px;
    line-height: 56px;
  }
}
</style>
