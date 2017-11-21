<template>
  <div class="car-info">
    <div class="car-info-img" v-if="ebikeInfo">
      <img v-if="ebikeInfo.ebikeImgUrl" :src="ebikeInfo.ebikeImgUrl"/>
      <img v-else src="../../../images/upload.png" height="92" width="134"/>
    </div>
    <div class="car-info-text" v-if="ebikeInfo">
      <div class="car-info-text-item" v-for="(item, key) in ebikeInfo" v-if="key !== 'ebikeImgUrl'">
        <template v-if="key === 'footDevice'">{{ itemType[key] }} : {{ item | footDevice }}</template>
        <template v-else>{{ itemType[key] }} : {{ item }}</template>
      </div>
    </div>
    <div v-else style="text-algin: center;">暂无车辆数据</div>
  </div>
</template>
<style lang="less" scoped>
  .car-info {
    width: 650px;
    padding: 38px 60px 60px 64px;
    margin: 0 auto;
    border: 2px solid #40aadb;
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    .car-info-img {
      width: 296px;
      padding: 2px;
      margin: 0 auto 40px;
      border: 1px solid #b2b2b2;
      border-radius: 4px;
      img{
        width: 100%; display: block;
      }
    }
    .car-info-text-item {
      color: #333;
      font-size: 26px;
      line-height: 54px;
    }
  }
</style>
<script>
  export default {
    props: ['ebikeInfo'],
    data () {
      return {
        itemType: {
          'assocName': '协会名称',
          'brandType': '品牌型号',
          'color': '车身颜色',
          'drivingArea': '行驶区域',
          'engineNo': '电机号码',
          'fileNo': '档案编号',
          'footDevice': '脚踏装置',
          'plateNo': '车辆号牌',
          'vehicleStatus': '车辆状态'
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
      }
    }
  }
</script>
