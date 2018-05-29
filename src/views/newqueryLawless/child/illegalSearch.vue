<template>
  <div class="illegalSearch">
    <div class="illegalSearch-nav">
      <ul>
        <li v-for="item in carArr" @click="getLawlessData(item)">
          <span>{{ item.myNumberPlate }}</span>
          <i></i>
          <em class="blue" v-if="item.isMySelf == '0'">本人</em>
          <em class="yellow" v-else>他人</em>
        </li>
      </ul>
    </div>
    <div class="hint">
        <p>温馨提示：可预约粤B牌车全国的违法及外地车深圳的违法</p>
    </div>
    <div v-for="(reserve, index) in reserveList" class="queryResults pad-side-50">
      <div class="results-box">
        <div class="box-header">
          <div class="header-item">预约结果</div>
        </div>
        <div class="box-body">
          <div class="left-line">
            预约编号:
            <p>{{ reserve.yylsh }}</p>
          </div>
          <div class="left-line">
            车牌号码:
            <p>{{ reserve.hphm }}</p>
          </div>
          <div class="left-line">
            手机号码:
            <p>{{ reserve.sjhm }}</p>
          </div>
          <div class="left-line">
            服务点&nbsp;&nbsp;&nbsp;:
            <p>{{ reserve.cldbmmc }}</p>
          </div>
          <div class="left-line">
            预约时间:
            <p>{{ reserve.yydate }} {{ reserve.yydate_sjd }}</p>
          </div>
          <div class="left-line" v-if="reserve.zt == '正常'">
            <div class="cancel" @click.stop="CancelConfirm(reserve.yylsh, index)">
              取消预约
            </div>
          </div>
          <div class="left-line" v-if="reserve.zt == '取消'">
            <div class="cancel canceled">
              已取消
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { earlyQuery, earlyCancel } from '@/config/baseURL'
  export default {
    name: 'illegalSearch',
    data () {
      return {
        carArr: [],
        reserveList: [],
        currentItem: ''
      }
    },
    mounted () {
      // this.reserveList = [{
      //   yylsh: '111',
      //   hphm: '222',
      //   sjhm: '333',
      //   cldbmmc: '444',
      //   yydate: '555',
      //   yydate_sjd: '666',
      //   zt: '正常'
      // }]
      this.carArr = this.$store.state.user.cars || []
    },
    methods: {
      getLawlessData (item) {
        if (item) {
          this.currentItem = item
        }
        this.$axios.post(earlyQuery, {
          // sourceOfCertification: 'C',
          car_number: this.currentItem.myNumberPlate.substr(1),
          licensePlateNo: this.currentItem.myNumberPlate,
          licensePlateType: this.currentItem.plateType,
          mobilephone: this.$store.state.user.mobilePhone
        }).then(json => {
          console.log(json)
          if (json.code === '0000') {
            this.reserveList = json.data
            if (json.data.length === 0) {
              this.$MessageBox('提示', '该车辆暂无预约信息')
            }
          } else {
            this.$MessageBox('提示', json.msg)
          }
        })
      },
      CancelConfirm (subscribeNo, index) {
        this.$MessageBox({
          title: '',
          message: '确定要取消预约吗？',
          showCancelButton: true,
          confirmButtonText: '是的'
        }).then(action => {
          action === 'confirm' && this.earlyCancel(subscribeNo, index)
        })
      },
      earlyCancel: function (subscribeNo, index) {
        let data = this.reserveList[index]
        let yydate = data.yydate // 预约日期
        let ccsjd = data.yydate_sjd // 预约时间段
        let cldbmmc = data.cldbmmc // 预约处理点
        let reqData = {
          // sourceOfCertification: 'C',
          subscribeNo: subscribeNo, // 预约编号
          businessName: '违法处理预约', // 业务名称
          yydate, // 预约日期
          ccsjd, // 预约时间段
          cldbmmc // 服务点
        }
        this.$axios.post(earlyCancel, reqData).then(json => {
          if (json.code === '0') {
            this.getLawlessData() // 重新查询
            this.$toast(json.msg)
          } else {
            this.$toast(json.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .illegalSearch {
    padding: 30px 30px 0;
    background-color: #F5F5F5;
    .illegalSearch-nav {
      li {
        height: 104px;
        border: 2px solid #2696dd;
        border-radius: 6px;
        padding-left: 130px;
        position: relative;
        margin-top: 20px;
        &::after{
          content: '';
          position: absolute;
          top:50%;
          left: 40px;
          transform: translateY(-50%);
          width: 43px;
          height: 34px;
          background-image: url('../../../assets/images/car1.png');
          background-size: cover;
        }
        &::before{
          content: '';
          position: absolute;
          top: 50%;
          right: 40px;
          transform: translateY(-50%);
          width: 21px;
          height: 38px;
          background-image: url('../../../assets/images/arrow_blue.png');
          background-size: cover;
        }
        span{
          font-size: 40px;
          font-weight: 600;
          color: #2696dd;
          line-height: 100px;
        }
        i{
          display: block;
          position: absolute;
          font-size: 18px;
          background-color: red;
          color: #fff;
          border-radius: 20px;
          left: 65px;
          top: 15px;
          padding: 0 9px;
          z-index: 10;
        }
        em{
          font-style: normal;
          display: inline-block;
          width: 60px;
          height: 30px;
          font-size: 20px;
          color: #fff;
          text-align: center;
          border-radius: 10Px;
        }
        em.blue{
          background-color: #2696dd;
        }
        em.yellow{
          background-color: #ffbe00;
        }
      }
    }
    .btnn {
      padding: 0
    }
    .hint {
      font-size: 24px;
      color: #666
    }
    .queryResults {
      margin-top: 20px;
      border: 1px solid #ccc;
      .results-box {
        border: 1px solid #a7d9f9;
        background-color: #fff;
        border-radius: 4px;
        .box-header {
          height: 80px;
          line-height: 80px;
          border-bottom: 1px solid #a7d9f9;
          &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
          .header-item {
            font-size: 1rem;
            padding: 0 24px;
            font-weight: bold;
            text-align: center;
          }
        }
      }
      .box-body {
        color: #333;
        padding: 0 24px 10px;
        position: relative;
        .body-left-side {
          width: 80%;
          .left-number {
            font-size: 0.95rem;
            font-weight: bold;
            height: 80px;
            line-height: 80px;
          }
        }
        .left-line {
          padding: 8px 0;
          font-size: 0.9rem;
          height: 1.875rem;
          &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
          span {
            display: inline-block;
            width: 50px;
            text-align: center;
            position: absolute;
          }
          p {
            display: inline-block;
            position: relative;
            left: 70px;
            vertical-align: middle;
          }
        }
        .cancel {
          position: absolute;
          right: 30px;
          bottom: 0.625rem;
          width: 3.75rem;
          height: 1.25rem;
          line-height: 1.25rem;
          background: red;
          color: #fff;
          text-align: center;
          border-radius: 0.1875rem;
        }
        .canceled {
          background: #09bb07;
        }
      }
    }
  }
</style>
