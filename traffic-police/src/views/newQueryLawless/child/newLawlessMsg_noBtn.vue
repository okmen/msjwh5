<template>
  <div class="newLawlessMsg-outer">
    <div class="newLawlessMsg-top">
      <p>共有<span>{{ lawlessData.data.length }}</span>条违法记录</p>
    </div>
    <div class="newLawlessMsg-list">
      <ul>
        <li v-for="item in lawlessData.data">
          <div class="newLawlessMsg-item-title">
            <p>违法信息</p>
            <!-- <span @click.stop="clickJump(item)">{{ claimList[item.isNeedClaim] }}</span> -->
          </div>
          <div class="newLawlessMsg-item-content">
            <p class="newLawlessMsg-item-content-No">违法编号：<span>{{ item.billNo }}</span></p>
            <p class="newLawlessMsg-item-content-car">{{ item.licensePlateNo }}</p>
            <p class="newLawlessMsg-item-content-time">{{ item.illegalTime }}</p>
            <p class="newLawlessMsg-item-content-add">{{ item.illegalAddr }}</p>
            <p class="newLawlessMsg-item-content-desc">{{ item.illegalDesc }}</p>
            <p class="newLawlessMsg-item-content-amt">{{ item.punishAmt }}</p>
            <p class="newLawlessMsg-item-content-score">{{ item.punishScore }}</p>
            <p class="newLawlessMsg-item-content-unit">{{ item.illegalUnit }}</p>
            <p class="newLawlessMsg-item-content-text"><span>处理方式：</span><span>{{ claimList[item.isNeedClaim] }}</span></p>
            <div class="newLawlessMsg-item-btn">
              <button v-if="isBoolean2(item.description)" @click="punishFreeDesc(item.description)">首违免罚</button>
              <button v-if="isBoolean(item.licensePlateNo, item.illegalUnit)" @click="hrefFn(item)">违法申诉</button>
              <button v-if="item.imgQueryCode && isLogin()" @click="illegalImgBtn(item.imgQueryCode)">查看违法图片</button>
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
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { queryPay, claimConfirm } from '../../../config/baseUrl'
  import popupImg from './../../../components/popupImg'
  // import { verifyCode } from '../../../config/verifyCode'
  import { MessageBox, Toast } from 'mint-ui'
  export default {
    name: 'newLawlessMsg',
    data () {
      return {
        lawlessArr: [],
        claimList: {
          '0': '直接缴款',
          '1': '需要打单',
          '2': '需要前往窗口办理',
          '3': '可使用好易机处理(需持有广东驾驶证)',
          '4': '使用好易机处理(需持有广东驾驶证)',
          '5': '违法地处理',
          '6': '强制措施窗口处理'
        },
        popupImgShow: false
      }
    },
    components: {
      popupImg
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
      passCancel: function () { // 点击通过弹窗的取消按钮
        this.popupImgShow = false // 隐藏通过弹窗
      },
      isLogin () {
        if (window.localStorage.isLogin === undefined) {
          return false
        } else {
          return true
        }
      },
      isBoolean2 (str) {
        if (str.indexOf('首违免罚') >= 0) {
          return true
        }
      },
      isBoolean (itemNum, add) {
        if (add.indexOf('深圳') < 0) {
          return false
        }
        // console.log(itemNum)
        if (window.localStorage.isLogin === undefined) {
          return false
        } else {
          return JSON.parse(window.localStorage.cars).some(item => {
            return item.myNumberPlate === itemNum
          })
        }
      },
      punishFreeDesc (str) {
        MessageBox('提示', str)
      },
      hrefFn (item) { // 违法申诉
        if (!JSON.parse(window.localStorage.isLogin)) {
          MessageBox.confirm('该功能需要登录后才能使用,是否前往登录').then(action => {
            this.$router.push('/login')
          })
          return false
        }
        let lawlessDeal = {
          data: item,
          info: JSON.stringify(this.lawlessDeal.info) === '{}' ? this.lawlessData.info : this.lawlessDeal.info
        }
        this.$store.commit('saveNewLawlessDeal', lawlessDeal)
        this.$router.push('/newqueryAppeal')
      },
      illegalImgBtn: function (imgCode) { // 查看违法图片
        if (!JSON.parse(window.localStorage.isLogin)) {
          MessageBox.confirm('该功能需要登录后才能使用,是否前往登录').then(action => {
            this.$router.push('/login')
          })
          return false
        }
        if (!imgCode) {
          Toast('暂无违法图片')
          return false
        }
        this.$router.push(`/illegalImage?imgQueryCode=${imgCode}`)
        // resultPost(illegalPictureQuery, {imgQueryCode: imgCode}).then(json => {
        //   this.popupImgShow = true
        //   this.imgBase = json.data[0]
        // })
      },
      clickJump (item) {
        if (item.isNeedClaim === '0') { // 直接缴款
          let reqData = {
            billNo: item.billNo,
            licensePlateNo: item.licensePlateNo
          }
          resultPost(queryPay, reqData).then(json => {
            console.log(json)
            if (json.code === '0000') {
              window.location.href = json.msg
            }
          })
        } else if (item.isNeedClaim === '1') { // 需要打单
          if (!JSON.parse(window.localStorage.isLogin)) {
            MessageBox.confirm('该功能需要登录后才能使用,是否前往登录').then(action => {
              this.$router.push('/login')
            })
            return false
          }
          MessageBox.confirm('确定打单吗?').then(action => {
            let reqData = {
              illegalNo: item.billNo
            }
            resultPost(claimConfirm, reqData).then(json => {
              console.log(json)
              if (json.code === '0000') {
                MessageBox('提示', '打单成功')
              }
            })
          })
        } else if (item.isNeedClaim === '2') { // 需要前往窗口办理，跳转预约
          if (!JSON.parse(window.localStorage.isLogin)) {
            MessageBox.confirm('该功能需要登录后才能使用,是否前往登录').then(action => {
              this.$router.push('/login')
            })
            return false
          }
          if (JSON.parse(window.localStorage.cars).length === 0) {
            MessageBox('提示', '此功能只能预约本人绑定车辆')
            return false
          } else {
            let ifBind = JSON.parse(window.localStorage.cars).some(arr => {
              return arr.myNumberPlate === item.licensePlateNo
            })
            if (!ifBind) {
              MessageBox('提示', '此功能只能预约本人绑定车辆')
              return false
            }
          }
          let lawlessDeal = {
            data: item,
            info: this.lawlessData.info
          }
          this.$store.commit('saveNewLawlessDeal', lawlessDeal)
          this.$router.push('/newTimeSelect')
        } else if (item.isNeedClaim === '3') {
          return false
        } else if (item.isNeedClaim === '4') {
          return false
        } else if (item.isNeedClaim === '5') {
          return false
        } else if (item.isNeedClaim === '6') {
          return false
        }
      }
    }
  }
</script>
<style lang="less">
  .newLawlessMsg-outer{
    background-color: #eee;
    .newLawlessMsg-top{
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
            .isBtn{
              font-size: 30px;
              font-weight: 600;
              text-decoration: underline;
              color: #2696dd;
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
              background-image: url('../../../images/carIco.png');
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
              background-image: url('../../../images/time_2.png');
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
              background-image: url('../../../images/local.png');
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
              background-image: url('../../../images/warn.png');
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
              background-image: url('../../../images/punish.png');
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
              background-image: url('../../../images/score_p.png');
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
              background-image: url('../../../images/unit.png');
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
              background-image: url('../../../images/fun.png');
              background-size: cover;
            }
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
    }
  }
</style>
