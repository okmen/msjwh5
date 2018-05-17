<template>
  <div class="electrocarFile">
    <div class="electrocarFile-head">
      <div class="electrocarFile-text" :class="{'click-color':currentColor}" @click="sunfn(true)">司机信息</div>
      <div class="electrocarFile-text" :class="{'click-color':!currentColor}" @click="sunfn(false)">车辆信息</div>
    </div>
    <div class="electrocarFile-nav">
      <!-- 司机信息 -->
      <div class="ebikeInfo" v-if="currentColor">
        <div v-for="item in userInfoList" v-if="userInfoList">
          <div class="ebikeInfo-img">
            <img v-if="item.userImgUrl" :src="item.userImgUrl"/>
            <img v-else src="../../../assets/images/upload.png" height="92" width="134"/>
          </div>
          <div class="ebikeInfo-info-text">
            <div class="ebikeInfo-info-text-item" v-for="(el, key) in item" v-if="key !== 'userImgUrl'">
              <template v-if="key === 'gender'">{{ items[key] }} : {{ el | gender }}</template>
              <template v-else>{{items[key] + ' :  ' +el}}</template>
            </div>
          </div>
        </div>
        <div v-if="!userInfoList">暂无司机数据</div>
      </div>
      <!-- 车辆信息 -->
      <div class="ebikeInfo" v-if="!currentColor">
        <div class="ebikeInfo-img" v-if="ebikeInfo">
          <img v-if="ebikeInfo.ebikeImgUrl" :src="ebikeInfo.ebikeImgUrl" alt="">
          <img v-else src="../../../assets/images/upload.png" height="92" width="134" alt="">
        </div>
        <div class="ebikeInfo-info-text" v-if="ebikeInfo">
          <div class="ebikeInfo-info-text-item" v-for="(item, key) in ebikeInfo" v-if="key !== 'ebikeImgUrl'">
            <template v-if="key === 'footDevice'">{{ itemType[key] }} : {{ item | footDevice }}</template>
            <template v-else>{{ itemType[key] }} : {{ item }}</template>
          </div>
        </div>
        <div v-else>暂无车辆数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { electrocarFileScancode } from '@/config/baseURL'
export default {
  name: 'electrocarFile',
  data () {
    return {
      currentColor: true,
      ebikeInfo: '',
      userInfoList: '',
      itemType: {
        assocName: '协会名称',
        brandType: '品牌型号',
        color: '车身颜色',
        drivingArea: '行驶区域',
        engineNo: '电机号码',
        fileNo: '档案编号',
        footDevice: '脚踏装置',
        plateNo: '车辆号牌',
        vehicleStatus: '车辆状态'
      },
      items: {
        age: '年龄',
        companyName: '所属单位名称',
        driverName: '驾驶人姓名',
        gender: '性别',
        identityNo: '身份证号码',
        mobilephone: '联系电话'
      }
    }
  },
  filters: {
    footDevice (value) {
      if (value === '0') {
        return '有'
      } else {
        return '无'
      }
    },
    gender (value) {
      if (value === '0') {
        return '男'
      } else {
        return '女'
      }
    }
  },
  methods: {
    sunfn (item) {
      this.currentColor = item
    },
    init () {
      // 440300000001
      this.$axios.post(electrocarFileScancode, {fileNo: this.$route.query.billNo}).then(json => {
        console.log(json)
        if (json.code === '0000') {
          this.ebikeInfo = json.data.ebikeInfo
          this.userInfoList = json.data.userInfoList
        } else {
          this.$toast({message: json.msg})
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .electrocarFile {
    min-height: 100%;
    background: url('../../../assets/images/appointBack.png') left bottom/contain no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    .electrocarFile-head {
      width: 650px;
      height: 80px;
      display: flex;
      background-color: #cfcfcf;
      margin: 20px auto 0;
      border-radius: 6px;
      .electrocarFile-text {
        width: 50%;
        line-height: 80px;
        text-align: center;
        font-weight: 600;
        color: #fff;
      }
    }
    .click-color {
      background-color: #40aadb;
      border-radius: 8px;
    }
    .electrocarFile-nav {
      width: 650px;
      margin: 0 auto;
      border: 1px solid #40aadb;
      border-top: none;
      border-radius: 6px;
      padding: 38px 60px 60px 64px;
    }
    .ebikeInfo {
      .ebikeInfo-img {
        width: 296px;
        padding: 2px;
        margin: 0 auto 40px;
        border: 1px solid #b2b2b2;
        border-radius: 4px;
        img {
          width: 100%; display: block;
        }
      }
      .ebikeInfo-info-text {
        color: #333;
        font-size: 26px;
        line-height: 54px;
      }
    }
  }
</style>
