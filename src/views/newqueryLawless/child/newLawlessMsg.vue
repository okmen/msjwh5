<template>
  <div class="newLawlessMsg">
    <div class="newLawlessMsg-head">
      <p>共有<span>{{ lawlessData.data.length }}</span>条违法记录</p>
    </div>
    <div class="newLawlessMsg-list">
      <ul class="newLawlessMsg-item-title">
        <li v-for="item in lawlessData.data">
          <div class="newLawlessMsg-item-title">
            <p>违法信息</p>
            <span @click.stop="clickJump(item)">{{ claimList[item.isNeedClaim] }}</span>
          </div>
          <div class="newLawlessMsg-item-content">
            <p class="newLawlessMsg-item-content-No" v-if="item.billNo">{{ item.isNeedClaim === '0' ? '缴款编号' : '违法编号' }}：<span>{{ item.billNo }}</span></p>
            <p class="newLawlessMsg-item-content-car">{{ item.licensePlateNo }}</p>
            <p class="newLawlessMsg-item-content-time">{{ item.illegalTime }}</p>
            <p class="newLawlessMsg-item-content-add">{{ item.illegalAddr }}</p>
            <p class="newLawlessMsg-item-content-desc">{{ item.illegalDesc }}</p>
            <p class="newLawlessMsg-item-content-amt">{{ item.punishAmt }}</p>
            <p class="newLawlessMsg-item-content-score">{{ item.punishScore }}</p>
            <p class="newLawlessMsg-item-content-unit">{{ item.illegalUnit }}</p>
            <p class="newLawlessMsg-item-content-text" v-if="!$route.query.login"><span>处理方式：</span><span :class="{isBtn: item.isNeedClaim == 0 || item.isNeedClaim == 1 || item.isNeedClaim == 2, isQuery: $route.query.type === 'query', isLink: item.isNeedClaim == 0 }" @click="clickJump(item)">{{ claimList[item.isNeedClaim] }}</span></p>
            <p class="newLawlessMsg-item-content-textNO" v-if="$route.query.login"><span>处理方式：</span><span :class="{isBtn: (item.isNeedClaim == 0 || item.isNeedClaim == 1 || item.isNeedClaim == 2) && !isHave(item.description), isQuery: $route.query.type === 'query', isLink: item.isNeedClaim == 0 && !isHave(item.description)}"  @click="clickFun(item)">{{ handleMethodFun(item) }}</span></p>
            <div class="newLawlessMsg-item-btn" v-if="!$route.query.login">
              <!-- <button v-if="item.description && isBoolean2(item.description)" @click="punishFreeDesc(item)">申请首违免罚</button> -->
              <button class="reviewImages" v-if="item.imgQueryCode && isLogin(item.licensePlateNo)" @click="illegalImgBtn(item.imgQueryCode)">查看违法图片</button>
              <div></div>
              <button v-if="isBoolean(item.licensePlateNo, item.illegalUnit)" @click="hrefFn(item)">违法申诉</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <popupImg
      @cancel="passCancel"
      v-if="popupImgShow"
      :data="imgBase">
    </popupImg>
  </div>
</template>

<script>
import { claimConfirm, queryPay, queryIllegalNoByClaimBefore } from '@/config/baseURL'
import popupImg from './../../../components/popupImg'
export default {
  name: 'newLawlessMsg',
  data () {
    return {
      lawlessArr: [],
      popupImgShow: false,
      handleMethod: ''  // 处理方式
    }
  },
  components: {
    popupImg
  },
  computed: {
    claimList () {
      return {
        '0': '直接缴款',
        '1': this.$route.query.type === 'query' ? '请去《交通违法在线处理》确认打单' : '去处理',
        '2': '需要前往窗口办理',
        '3': '可使用好易机处理(需持有广东驾驶证)',
        '4': '使用好易机处理(需持有广东驾驶证)',
        '5': '违法地处理',
        '6': '强制措施窗口处理'
      }
    },
    lawlessData: function () {
      return this.$store.state.newLawlessQuery
    },
    lawlessDeal: function () {
      return this.$store.state.newLawlessDeal
    },
    cars () {
      return this.$store.state.user.cars
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted () {
  },
  methods: {
    // 点击通过弹窗的取消按钮
    passCancel: function () {
      this.popupImgShow = false // 隐藏通过弹窗
    },
    isBoolean2 (str) {
      if (str.indexOf('80338') >= 0) {
        return true
      }
    },
    isLogin (itemNum) {
      this.cars.some(item => {
        return item.myNumberPlate === itemNum
      })
    },
    isBoolean (itemNum, add) {
      if (add.indexOf('深圳') < 0) {
        return false
      }
      this.cars.some(item => {
        return item.myNumberPlate === itemNum
      })
    },
    punishFreeDesc (item) {
      this.$MessageBox.confirm('尊敬的用户您好，该宗违法符合深圳交警首违免罚范围，是否申请免除一次道路交通安全违法行为的罚款？').then(action => {
        this.$MessageBox.confirm('确定打单吗?').then(action => {
          let reqData = {
            illegalNo: item.billNo,
            sourceOfCertification: 'C'
          }
          this.$axios.post(claimConfirm, reqData).then(json => {
            if (json.code === '0000') {
              this.$MessageBox.alert('该宗违法已处罚完毕，按规定给予警告，免予罚款处罚。').then(action => {
                // this.$router.push('/personalCenter')  // 跳转个人中心
                this.$router.push({path: '/personalCenter', query: this.queryURL})
              })
            }
          })
        })
      })
    },
    // 违法申诉
    hrefFn (item) {
      let lawlessDeal = {
        data: item,
        info: JSON.stringify(this.lawlessDeal.info) === '{}' ? this.lawlessData.info : this.lawlessDeal.info
      }
      this.$store.commit('saveNewLawlessDeal', lawlessDeal)
      // this.$router.push('/newqueryAppeal')
      this.$router.push({path: '/newqueryAppeal', query: this.queryURL})
    },
    // 查看违法图片
    illegalImgBtn: function (imgCode) {
      if (!imgCode) {
        this.$toast('暂无违法图片')
        return false
      }
      // this.$router.push(`/illegalImage?imgQueryCode=${imgCode}`)
      let source = this.$route.query.source
      this.$router.push({path: '/illegalImage', query: {source: source, imgQueryCode: imgCode}})
    },
    // 判断首违免罚
    clickFun (item) {
      let isNext = this.isHave(item.description)
      if (item.isNeedClaim === '0' && isNext) {
        let dec = item.description
        this.$toast(dec)
      }
    },
    clickJump (item) {
      console.log(item)
      if (item.isNeedClaim === '0') { // 直接缴款
        let reqData = {
          sourceOfCertification: 'C',
          billNo: item.billNo,
          licensePlateNo: item.licensePlateNo
        }
        this.$axios.post(queryPay, reqData).then(json => {
          console.log(json)
          if (json.code === '0000') {
            window.location.href = json.msg
          }
        })
      } else if (item.isNeedClaim === '1') { // 需要打单
        console.log('打单')
        if (this.$route.query.type === 'query') {
          console.log('违法查询页面阻止打单')
          return false
        }
        this.$axios.post(queryIllegalNoByClaimBefore, {
          sourceOfCertification: 'C',
          licensePlateNo: item.licensePlateNo,
          licensePlateType: item.licensePlateType,
          mobilephone: this.$store.state.user.mobilePhone,
          illegalTime: item.illegalTime,
          illegalAddr: item.illegalAddr,
          illegalDesc: item.illegalDesc,
          identityCard: this.$store.state.newLawlessQuery.info.identityCard
        }).then(result => {
          if (result.code === '0000') {
            this.$MessageBox.confirm('尊敬的用户您好，一旦确认或打印了处罚决定书后，15日内不处理将会产生滞纳金，是否确定马上打印决定书？').then(action => {
              this.$MessageBox.confirm('确定打单吗?').then(action => {
                this.$axios.post(claimConfirm, {illegalNo: result.data}).then(json => {
                  if (json.code === '0000') {
                    if (json.data.billNo) {
                      this.$MessageBox.confirm('打单成功,是否在线缴款？').then(action => {
                        let requestData = {
                          billNo: json.data.billNo,
                          licensePlateNo: item.licensePlateNo
                        }
                        this.$axios.post(queryPay, requestData).then(data => {
                          console.log(data)
                          if (data.code === '0000') {
                            window.location.href = data.msg
                          }
                        })
                      }).catch(action => {
                        item.isNeedClaim = '0'
                        item.billNo = json.data.billNo
                      })
                    }
                  } else {
                    this.$MessageBox('提示', json.msg)
                  }
                })
              })
            })
          } else {
            this.$MessageBox('提示', result.msg)
          }
        })
      } else if (item.isNeedClaim === '2') { // 需要前往窗口办理，跳转预约
        // if (JSON.parse(this.$store.state.user.cars).length === 0) {
        //   this.$MessageBox('提示', '此功能只能预约本人绑定车辆')
        //   return false
        // } else {
        //   let ifBind = JSON.parse(this.$store.state.user.cars).some(arr => {
        //     return arr.myNumberPlate === item.licensePlateNo
        //   })
        //   if (!ifBind) {
        //     this.$MessageBox('提示', '此功能只能预约本人绑定车辆')
        //     return false
        //   }
        // }
        let lawlessDeal = {
          data: item,
          info: this.lawlessData.info
        }
        this.$store.commit('saveNewLawlessDeal', lawlessDeal)
        // this.$router.push(/_WeChat/g.test(this.$route.name) ? '/newTimeSelect_WeChat' : '/newTimeSelect')
        this.$router.push({path: '/newTimeSelect', query: this.queryURL})
      } else if (item.isNeedClaim === '3') {
        return false
      } else if (item.isNeedClaim === '4') {
        return false
      } else if (item.isNeedClaim === '5') {
        return false
      } else if (item.isNeedClaim === '6') {
        return false
      }
    },
    // 判断首违免罚情况下，处理方式的文字变更
    handleMethodFun (item) {
      if (this.isHave(item.description)) {
        return '去处理'
      } else {
        return this.claimList[item.isNeedClaim]
      }
    },
    // 判断是否为首违免罚范围
    isHave (str) {
      return str.indexOf('首违免罚') >= 0
    }
  }
}
</script>

<style lang="less" scoped>
.newLawlessMsg{
    background-color: #eee;
    .newLawlessMsg-head{
      background-color: #fff;
      margin-bottom: 15px;
      p{
        font-size: 32px;
        color: #333;
        text-align: center;
        line-height: 85px;
        span{
          color: #2696dd;
          font-weight: 600;
        }
      }
    }
    .newLawlessMsg-list{
      padding: 35px 50px 100px;
      background-color: #fff;
      li{
        margin-top: 30px;
        border: 1px solid #2696dd;
        .newLawlessMsg-item-title{
          padding: 0 30px;
          font-size: 30px;
          display: flex;
          justify-content: space-between;
          line-height: 75px;
          border-bottom: 1px solid #2696dd;
          span{
            color: #2696dd;
            text-decoration: underline;
          }
        }
        .newLawlessMsg-item-content{
          padding: 15px 35px;
          position: relative;
          p{
            line-height: 32px;
            padding-left: 55px;
            font-size: 26px;
            color: #333;
            margin-bottom: 15px;
            position: relative;
          }
          .newLawlessMsg-item-content-text{
            padding-left: 0;
            .isBtn, span.isLink.isQuery{
              font-size: 30px;
              font-weight: 600;
              text-decoration: underline;
              color: #2696dd;
            }
            span.isQuery{
              text-decoration: none;
              color: #000;
              font-weight: normal;
              font-size: 26px;
            }
          }
          .newLawlessMsg-item-content-textNO{
            padding-left: 0;
            .isBtn, span.isLink.isQuery{
              font-size: 30px;
              font-weight: 600;
              text-decoration: underline;
              color: #ccc;
            }
            span.isQuery{
              text-decoration: none;
              color: #000;
              font-weight: normal;
              font-size: 26px;
            }
          }
          .newLawlessMsg-item-content-No{
            font-size: 28px;
            padding-left: 0;
            span{
              color: #ff0000;
            }
          }
          .newLawlessMsg-item-content-car{
            &::after{
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
          .newLawlessMsg-item-content-time{
            &::after{
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
          .newLawlessMsg-item-content-add{
            &::after{
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
          .newLawlessMsg-item-content-desc{
            &::after{
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
          .newLawlessMsg-item-content-amt{
            &::after{
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
          .newLawlessMsg-item-content-score{
            &::after{
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
          .newLawlessMsg-item-content-unit{
            &::after{
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
          .newLawlessMsg-item-content-fun{
            &::after{
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
          .reviewImages {
            position: absolute;
            top: 10px;
            right: 10px;
          }
          .newLawlessMsg-item-btn{
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            padding-bottom: 10px;
            button{
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
      li:first-child {
        margin-top: 0;
      }
    }
  }
</style>