<template>
  <div class="dirver-info">
    <div class="item" v-for="item in userInfoList" v-if="userInfoList">
      <div class="dirver-info-img">
        <img v-if="item.userImgUrl" :src="item.userImgUrl"/>
        <img v-else src="../../../images/upload.png" height="92" width="134"/>
      </div>
      <div class="dirver-info-text">
        <div class="dirver-info-text-item" v-for="(el, key) in item" v-if="key !== 'userImgUrl'">
          <template v-if="key === 'gender'">{{ itemType[key] }} : {{ el | gender }}</template>
          <template v-else>{{itemType[key] + ' :  ' +el}}</template>
        </div>
      </div>
      <!-- <div class="dirver-info-change">
        修改密码
      </div> -->
    </div>
    <div v-if="!userInfoList" class="item">暂无司机数据</div>
  </div>
</template>
<style lang="less" scoped>
  .dirver-info{
    width: 650px;
    margin:0 auto ;
    border: 2px solid #40aadb;
    border-top:none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    .dirver-info-img{
      width: 296px;
      height: 296px;
      overflow: hidden;
      margin: 0 auto 40px;
      border: 1px solid #b2b2b2;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 100%;
      }
    }
   .item{
      padding: 38px 60px 60px 64px;
      border-top: 2px solid #40aadb;
    }
    .dirver-info-text-item{
      color:#333;
      font-size: 26px;
      line-height: 54px;
    }
    .dirver-info-change{
      width: 170px;
      height: 60px;
      background:#40aadb;
      line-height: 60px;
      margin: 56px auto 0;
      border-radius: 6px;
      text-align: center;
      color: white;
      font-size: 30px;
    }
  }
</style>
<script>
  export default {
    props: ['userInfoList'],
    data () {
      return {
        itemType: {
          'age': '年龄',
          'companyName': '所属单位名称',
          'driverName': '驾驶人姓名',
          'gender': '性别',
          'identityNo': '身份证号码',
          'mobilephone': '联系电话'
        }
      }
    },
    filters: {
      gender (value) {
        if (value === '0') {
          return '男'
        } else {
          return '女'
        }
      }
    }
  }
</script>
