<template>
  <div class="moveCar">
    <div v-show="people">
      <p class="title">填写以下表单申请挪车：</p>
      <plate-number-full v-model="plateNumber"></plate-number-full>
      <g-select title="车辆类型" :data="moveCarData" v-model="moveCarType"></g-select>
      <g-input title="挪车地址" maxlength="18" v-model="detailedAddress" readonly placeholder="点击右侧按钮选择地址">
        <div slot='right' class="RichScan" @click="getLocation()"><img src="../../../assets/images/location-1.png" alt=""></div>
      </g-input>
      <g-button text="发送短信" @click.native="confirmInfo"></g-button>
      <p class="title">拨打专线通知挪车：</p>
      <p class="moveCar-tip-content">深圳交警全新推出电话挪车服务，星级用户如遇见正常停车后被其他车辆堵住，可拨打专线电话，交警将联系对方车主移车；或者提交表单发起挪车需求，交警将发起挪车需求，交警将发送提示短信通知对方车主移车。对方拒绝移车且违法停放的，交警将依法处罚。</p>
      <div class="btn-title">
        <div class="btn-button"><a href="tel:83333333">拨打专线</a></div>
      </div>
    </div>
    <mymap v-if="mapShow" @submit="submitMap" @hide="hideMap()"></mymap>
  </div>
</template>

<script>
import mymap from '@/components/map/map'
import {GInput, GSelect, GButton, Group} from 'form'
import PlateNumberFull from '@/components/PlateNumberFull'
import axios from '@/utils/axios'
import { moveCar } from '@/config/baseURL'
export default {
  name: 'moveCar',
  data () {
    return {
      people: true,
      mapShow: false,
      detailedAddress: '',
      plateNumber: '',
      moveCarType: '02'
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    },
    moveCarData () {
      return this.$store.state.moveCarData
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    Group,
    PlateNumberFull,
    mymap
  },
  methods: {
    submitMap: function (obj) {
      this.people = true
      this.mapShow = false
      this.mapObj = obj
      this.detailedAddress = `${this.mapObj.addressRegion}${this.mapObj.addressStreet}`   // 详细地址
    },
    hideMap: function () {
      this.mapShow = false
    },
    // 地图显示
    getLocation: function () {
      this.mapShow = true
      this.people = false
    },
    confirmInfo () {
      if (this.$verification.plateVerification(this.plateNumber)) return
      let moveCarData = {
        abbreviation: this.plateNumber.substring(0, 1), // 车牌简称
        numberPlate: this.plateNumber.substring(1), // 车牌号码
        carType: this.moveCarType, // 汽车种类
        doodgenAddress: this.detailedAddress, // 挪车地址
        identityCard: this.$store.state.user.identityCard // 身份证
      }
      axios.post(moveCar, moveCarData).then(data => {
        if (data.code === '0000') {
          this.$MessageBox('温馨提示', '已在交警系统发出通知，请耐心等待！')
        } else {
          this.$toast(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.moveCar{
    .RichScan {
      width: 12%;
      text-align: center;
      img {
        height: 56px;
      }
    }
    .title{
      width: 90%;
      margin: 20px auto;
      line-height: 40px;
    }
    .moveCar-tip-content{
      width: 90%;
      line-height: 50px;
      margin: 20px auto;
    }
    .btn{
      width: 90%;
      margin: 20px auto;
      color: #fff;
      background: #174ed0;
      a{
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .btn-title{
      margin-top:40px;
      width: 100%;
      .btn-button{
        width: 90%;
        text-align: center;
        line-height: 70px;
        margin: 20px auto;
        background: #174ed0;
        color: #fff;
        border: none;
        border-radius: 6px;
        a{
          display: inline-block;
          width: 100%;
          color: #fff;
          font-size: 32px;
        }
      }
    }
  }
</style>
