<template>
  <div class="dieselEngineTrucks">
    <div class="dieselEngineTrucks-form">
      <g-select title="业务类型" :data="typeData" v-model="typeId"></g-select>
      <div v-if="this.typeId === '2'">
        <plate-number-full v-model="plateNumber"></plate-number-full>
        <g-input title="rfid号码" v-model="rfidVal" placeholder="请输入rfid车号"></g-input>
        <g-input title="车架号" v-model="vehicleIdentificationNumber" maxlength="4" placeholder="请输入车架号后4位"></g-input>
      </div>
      <div v-else>
        <g-select title="申请类型" :data="ownerData" v-model="ownerid"></g-select>
        <g-input v-if ="this.ownerid === '2'" title="单位名称" v-model="monadName" placeholder="请输入单位名称"></g-input>
        <plate-number-full v-model="plateNumber"></plate-number-full>
        <g-input title="车架号" v-model="vehicleIdentificationNumber" maxlength="4" placeholder="请输入车架号后4位"></g-input>
        <template v-if ="this.ownerid === '2'">
          <g-input title="单位法人姓名" v-model="monadPersonName" placeholder="请输入单位法人姓名"></g-input>
          <g-input title="组织机构代码／统一社会信用代码" v-model="monadPersonIdentityCard" classType='filled' placeholder="请输入组织机构代码／统一社会信用代码"></g-input>
        </template>
        <template v-if ="this.ownerid === '1'">
          <g-input title="车主姓名" v-model="ownerName" placeholder="请输入车主姓名"></g-input>
          <g-input title="车主身份证号" v-model="ownerItyCard" placeholder="请输入车主身份证号"></g-input>
          <g-input title="车主联系电话" v-model="ownerMobile" placeholder="请输入车主联系电话"></g-input>
        </template>
        <g-select-one v-if ="this.ownerid === '2'" class="changeCard-set" title="深圳市" type="单位申请人联系地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
        <g-select-one v-if ="this.ownerid === '1'" class="changeCard-set" title="深圳市" type="车主联系地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
        <g-input title="" v-model="distpSite" placeholder="请输入详细地址"></g-input>
        <g-select v-if ="this.ownerid === '1'" classType='filled' title="是否是挂靠车辆" :data="handData" v-model="handid"></g-select>
      </div>
      <group title="上传证件照片" v-if="this.typeId === '1'">
        <div class="upload-group" v-show="ownerid == '2'">
          <g-upload text="单位法人身份证(正面)" id="file1" :bg="require('@/assets/images/IDcard-front.png')" v-model="legalIDCardFront"></g-upload>
          <g-upload text="单位法人身份证(反面)" id="file11" :bg="require('@/assets/images/IDcard-back.png')" v-model="legalIDCardBack"></g-upload>
          <g-upload text="申请人身份证(正面)" id="file2" :bg="require('@/assets/images/IDcard-front.png')" v-model="applicantIDCardFront"></g-upload>
          <g-upload text="车辆行驶证" id="file3" :bg="require('@/assets/images/drivinglicense.png')" v-model="carDrivingLicense"></g-upload>
          <g-upload text="申请人驾驶证" id="file4" :bg="require('@/assets/images/license-card.png')" v-model="applicantDriverLicense"></g-upload>
          <g-upload text="申请人手持身份证及组织机构代码证照片" id="file5" :bg="require('@/assets/images/ID-organizations.png')" v-model="codeCertificate"></g-upload>
        </div>
        <div class="upload-group" v-if="ownerid === '1'">
          <g-upload text="车主身份证(正面)" id="file6" :bg="require('@/assets/images/IDcard-front.png')" v-model="ownerIDCardFront"></g-upload>
          <g-upload text="车主驾驶证" id="file7" :bg="require('@/assets/images/license-card.png')" v-model="ownerDriverLicense"></g-upload>
          <g-upload text="车主行驶证" id="file8" :bg="require('@/assets/images/drivinglicense.png')" v-model="ownerDrivingLicense"></g-upload>
          <g-upload v-show="handid == '1'" text="申请人手持身份证及组织机构代码证照片" id="file9" :bg="require('@/assets/images/ID-organizations.png')" v-model="codeCertificate"></g-upload>
        </div>
      </group>
    </div>
    <g-button text="提交" @click.native="typeSubFn" v-if="typeId === '2'"></g-button>
    <g-button text="提交" @click.native="subFn" v-else></g-button>
  </div>
</template>

<script>
import { informationCollection, informationCollection2 } from '@/config/baseURL'
import PlateNumberFull from '@/components/PlateNumberFull'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  name: 'dieselEngineTrucks',
  data () {
    return {
      typeId: '1', // 业务类型
      typeData: [
        {
          value: '1', name: '柴油轻型自卸货车(新申请)'
        },
        {
          value: '2', name: '已装rfid车辆绑定'
        }
      ],
      ownerid: '2', // 申请类型
      ownerData: [
        {
          value: '2',
          name: '单位车辆'
        },
        {
          value: '1',
          name: '个人车辆(含挂靠)'
        }
      ],
      plateNumber: '', // 车牌号码
      rfidVal: '', // rfid号码
      vehicleIdentificationNumber: '', // 车架号
      monadName: '',  // 单位名称
      monadPersonName: '', // 单位法人姓名
      monadPersonIdentityCard: '', // 组织机构代码
      ownerName: '', // 车主姓名
      ownerItyCard: '', // 车主身份证号
      ownerMobile: '', // 车主联系电话
      areaSelect: '福田区', // 地区
      distpSite: '', // 详细地址
      handid: '1', // 挂靠
      handData: [
        {
          value: '0',
          name: '否'
        },
        {
          value: '1',
          name: '是'
        }
      ],
      legalIDCardFront: '', // 单位法人身份证(正面)
      legalIDCardBack: '', // 单位法人身份证(反面)
      applicantIDCardFront: '', // 申请人身份证(正面)
      carDrivingLicense: '', // 车辆行驶证
      applicantDriverLicense: '', // 申请人驾驶证
      codeCertificate: '', // 组织机构代码证
      ownerIDCardFront: '', // 车主身份证(正面)
      ownerDriverLicense: '', // 车主驾驶证
      ownerDrivingLicense: '' // 车主行驶证
    }
  },
  components: {
    PlateNumberFull
  },
  mixins: [beforeSubmit],
  computed: {
    user () {
      return Object.assign({}, this.$store.state.user)
    },
    areaSelectData () {
      return this.$store.state.cityAreaS
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted: function () {
  },
  methods: {
    typeSubFn () {
      let obj = {
        plateNumber: '请输入车牌号码',
        rfidVal: '请输入RFID',
        vehicleIdentificationNumber: '请输入车架号后4位'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.plateVerification(this.plateNumber)) return
      this.typeSubFnData()
    },
    subFn () {
      let obj
      if (this.ownerid === '2') {
        obj = {
          monadName: '请输入单位名称',
          plateNumber: '请输入车牌号码',
          vehicleIdentificationNumber: '请输入车架号后4位',
          monadPersonName: '请输入单位法人姓名',
          monadPersonIdentityCard: '请输入单位法人身份证号',
          distpSite: '请输入单位申请人联系地址',
          legalIDCardFront: '请上传单位法人身份证(正面)',
          legalIDCardBack: '请上传单位法人身份证(反面)',
          applicantIDCardFront: '请上传申请人身份证(正面)',
          carDrivingLicense: '请上传车辆行驶证',
          applicantDriverLicense: '请上传申请人驾驶证',
          codeCertificate: '请上传申请人手持身份证组织机构代码证照片'
        }
      } else if (this.ownerid === '1') {
        obj = {
          ownerName: '请输入车主姓名',
          ownerItyCard: '请输入车主身份证号',
          ownerMobile: '请输入车主联系电话',
          distpSite: '请输入车主联系地址',
          ownerIDCardFront: '请上传车主身份证',
          ownerDriverLicense: '请上传车主驾驶证',
          ownerDrivingLicense: '请上传车主行驶证',
          codeCertificate: '请上传申请人手持身份证组织机构代码证照片'
        }
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.plateVerification(this.plateNumber)) return
      this.subFnData()
    },
    typeSubFnData: function () {
      let reqData = {
        licenseNumber: this.plateNumber.toUpperCase(),
        numberPlate: '02',
        rfId: this.rfidVal,
        loginUser: this.user.identityCard,
        mobilePhone: this.user.mobilePhone,
        cjh4: this.vehicleIdentificationNumber,
        carType: 'H37'
      }
      this.$axios.post(informationCollection2, reqData).then(json => {
        if (json.code === '0000') {
          let dataInfo = {
            state: '2'
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$router.push({path: '/submitSuccessCommon', query: this.queryURL})
          // this.$router.push('/submitSuccessCommon')
        } else {
          this.$MessageBox({
            title: '提示',
            message: json.msg
          })
        }
      })
    },
    subFnData: function () {
      let dieselData
      if (this.ownerid === '2') {
        dieselData = {
          isAttached: '0',
          issuingBrigade: `深圳市${this.areaSelect}`,    // 发卡大队
          certificationType: this.ownerid,   // 申请类型
          licenseNumber: this.plateNumber.toUpperCase(), // 车牌号码
          numberPlate: '02', // 车牌种类
          carType: 'H37', // 车辆类型
          legalEntityName: this.monadPersonName,   // 车主姓名
          vehicleIdentificationNumber: this.vehicleIdentificationNumber, // 车架号
          ownerIdentityCard: this.monadPersonIdentityCard, // 单位法人身份证号或车主身份证号码
          ownerMobilephone: this.user.mobilePhone, // 单位申请人联系电话或者车主联系电话
          ownerAddress: `深圳市${this.areaSelect}${this.distpSite}`, // 车主地址
          identityCard: this.monadPersonIdentityCard, // 身份证
          mobilephone: this.user.mobilePhone, // 联系电话
          address: `深圳市${this.areaSelect}${this.distpSite}`, // 地址
          copyOfOwnerIdentityCard: this.applicantIDCardFront, // 车辆所有人身份证复印件
          copyOfDriverLicense: this.applicantDriverLicense, // 车辆驾驶人驾驶证复印件
          copyOfVehicleTravelLicense: this.carDrivingLicense, // 车辆行驶证复印件
          copyOfLegalEntityA: this.legalIDCardFront, // 单位法人复印件正面
          copyOfLegalEntity: this.legalIDCardBack, // 单位法人复印件反面
          copyOfApplicant: this.codeCertificate, // 申请人手持身份证+组织代码证复印件
          loginUser: this.user.identityCard, // 申请星级用户身份证明号码
          userMobilepbone: this.user.mobilePhone // 申请星级用户手机号码
        }
      } else if (this.ownerid === '1') {
        dieselData = {
          isAttached: this.handid,  // 0-否,1-是
          issuingBrigade: `深圳市${this.areaSelect}`,    // 发卡大队
          certificationType: this.ownerid,
          licenseNumber: this.plateNumber.toUpperCase(), // 车牌号码
          numberPlate: '02', // 车牌种类
          carType: 'H37', // 车辆类型
          legalEntityName: this.ownerName,   // 车主姓名
          vehicleIdentificationNumber: this.vehicleIdentificationNumber, // 车架号
          ownerIdentityCard: this.ownerItyCard, // 车主身份证号码
          ownerMobilephone: this.ownerMobile, // 车主联系电话
          ownerAddress: `深圳市${this.areaSelect}${this.distpSite}`, // 车主地址
          identityCard: this.ownerItyCard, // 身份证
          mobilephone: this.ownerMobile, // 联系电话
          address: `深圳市${this.areaSelect}${this.distpSite}`, // 地址
          copyOfOwnerIdentityCard: this.ownerIDCardFront, // 车辆所有人身份证复印件
          copyOfDriverLicense: this.ownerDriverLicense, // 车辆驾驶人驾驶证复印件
          copyOfVehicleTravelLicense: this.ownerDrivingLicense, // 车辆行驶证复印件
          copyOfLegalEntity: '', // 单位法人复印件
          copyOfLegalEntityA: '',
          copyOfApplicant: this.handid === '0' ? '' : this.codeCertificate, // 申请人手持身份证+组织代码证复印件
          loginUser: this.user.identityCard, // 申请星级用户身份证明号码
          userMobilepbone: this.user.mobilePhone // 申请星级用户手机号码
        }
      }
      console.log(dieselData)
      this.$axios.post(informationCollection, dieselData).then(json => {
        if (json.code === '0000') {
          this.$store.commit('saveSuccessInfo', {
            type: 4,
            ownerid: this.ownerid,   // 申请类型
            areaSelectMassage: this.areaSelect, // 发卡大队
            licenseNumber: this.plateNumber.toUpperCase(), // 车牌号码
            JsonData: json.data   // 流水号
          })
          this.$router.push({path: '/submitSuccess', query: this.queryURL})
          // this.$router.push('/submitSuccess')
        } else {
          this.$MessageBox({
            title: '提示',
            message: json.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.dieselEngineTrucks{
  padding: 40px 0 40px 0;
  .g-upload {
    width: 304px;
  }
}
</style>
