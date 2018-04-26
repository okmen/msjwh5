<template>
  <div class="newLawlessMsg-outer">
    <div class="newLawlessMsg-top">
      <p>共有<span>{{ lawlessData.data.length }}</span>条违法记录</p>
    </div>
    <div class="newLawlessMsg-list">
      <ul>
        <li v-for="item in lawlessDatass">
          <div class="newLawlessMsg-item-title">
            <p>违法信息</p>
          </div>
          <div class="newLawlessMsg-item-content">
            <p class="newLawlessMsg-item-content-No" v-if="item.billNo">{{ item.isNeedClaim === '0' ? '缴款编号' : '违法编号'
              }}：<span>{{ item.billNo }}</span></p>
            <p class="newLawlessMsg-item-content-car">{{ item.licensePlateNo }}</p>
            <p class="newLawlessMsg-item-content-time">{{ item.illegalTime }}</p>
            <p class="newLawlessMsg-item-content-add">{{ item.illegalAddr }}</p>
            <p class="newLawlessMsg-item-content-desc">{{ item.illegalDesc }}</p>
            <p class="newLawlessMsg-item-content-amt">{{ item.punishAmt }}</p>
            <p class="newLawlessMsg-item-content-score">{{ item.punishScore }}</p>
            <p class="newLawlessMsg-item-content-unit">{{ item.illegalUnit }}</p>
            <div class="newLawlessMsg-item-btn">
              <button @click="illegalImgBtn(item)" style="padding: 3px 9px">预约</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        lawlessDatass: '',
        lawlessArr: [],
        popupImgShow: false
      }
    },
    computed: {
      lawlessData: function () {
        return this.$store.state.newLawlessQuery
      },
      lawlessDeal: function () {
        return this.$store.state.newLawlessDeal
      }
    },
    created () {
      // this.init() // 初始化页面，查询名下所有车辆的违法
    },
    methods: {
      illegalImgBtn (item) {
        let lawlessDeal = {
          data: item,
          info: this.lawlessData.info
        }
        this.$store.commit('saveNewLawlessDeal', lawlessDeal)
        this.$router.push('/newTimeSelect')
      }
    }
  }
</script>
<style lang="less" scoped>
  .newLawlessMsg-outer {
    background-color: #eee;
    .newLawlessMsg-top {
      background-color: #fff;
      margin-bottom: 15px;
      p {
        font-size: 32px;
        color: #333;
        text-align: center;
        line-height: 85px;
        span {
          color: #2696dd;
          font-weight: 600;
        }
      }
    }
    .newLawlessMsg-list {
      padding: 35px 50px 100px;
      background-color: #fff;
      li {
        border: 1px solid #2696dd;
        .newLawlessMsg-item-title {
          padding: 0 30px;
          font-size: 30px;
          display: flex;
          justify-content: space-between;
          line-height: 75px;
          border-bottom: 1px solid #2696dd;
          span {
            color: #2696dd;
            text-decoration: underline;
          }
        }
        .newLawlessMsg-item-content {
          padding: 15px 35px;
          p {
            line-height: 32px;
            padding-left: 55px;
            font-size: 26px;
            color: #333;
            margin-bottom: 15px;
            position: relative;
          }
          .newLawlessMsg-item-content-text {
            padding-left: 0;
            .isBtn, span.isLink.isQuery {
              font-size: 30px;
              font-weight: 600;
              text-decoration: underline;
              color: #2696dd;
            }
            span.isQuery {
              text-decoration: none;
              color: #000;
              font-weight: normal;
              font-size: 26px;
            }
          }
          .newLawlessMsg-item-content-No {
            font-size: 28px;
            padding-left: 0;
            span {
              color: #ff0000;
            }
          }
          .newLawlessMsg-item-content-car {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 30px;
              height: 23px;
              background-image: url('../../../assets/images/carIco.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-time {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 30px;
              height: 30px;
              background-image: url('../../../assets/images/time_2.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-add {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 25px;
              height: 34px;
              background-image: url('../../../assets/images/local.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-desc {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 28px;
              height: 30px;
              background-image: url('../../../assets/images/warn.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-amt {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 28px;
              height: 28px;
              background-image: url('../../../assets/images/punish.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-score {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 28px;
              height: 28px;
              background-image: url('../../../assets/images/score_p.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-unit {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 28px;
              height: 28px;
              background-image: url('../../../assets/images/unit.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-content-fun {
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 28px;
              height: 28px;
              background-image: url('../../../assets/images/fun.png');
              background-size: cover;
            }
          }
          .newLawlessMsg-item-btn {
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            padding-bottom: 10px;
            button {
              height: 50px;
              padding: 0 10px;
              background-color: #2696dd;
              color: #fff;
              font-size: 26px;
              border-radius: 4Px;
              outline: none;
            }
          }
        }
      }
    }
  }
</style>
