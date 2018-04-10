<template>
  <div class="motorstudy">
    <div class="motorstudy-head">
      <div class="motorstudy-itop">
        <!-- <img class="motorstudy-img" src=""> -->
        <!-- <img class="motorstudy-img" src="../../../assets/images/login-logo.png" alt=""> -->
      </div>
      <span class="motorstudy-name">{{listData.userName}}</span>
    </div>
    <mt-cell title="驾驶证号" :value="listData.identityCard"></mt-cell>
    <mt-cell title="记分周期(始)" :value="listData.scoreStartDate" v-if="listData.scoreStartDate"></mt-cell>
    <mt-cell title="记分周期(末)" :value="listData.scoreEndDate" v-if="listData.scoreEndDate"></mt-cell>
    <mt-cell title="学习积分数" :value="listData.integral" v-if="listData.integral"></mt-cell>
    <mt-cell @click.native= "learningRecord" v-if="itemData" title="学习记录"></mt-cell>
    <div class="motorstudy-footer" v-if = "show">
      <div class="motorstudy-box">
        <div v-for="item in itemData">
          <div class="motorstudy-footer-top"></div>
          <ul class="motorstudy-footer-bottom">
            <li><span>{{item.answerDate}}</span>
              <a class="motorstudy-footer-rig background-939393" href="javascripit:void(0)" v-if="item.isComplete == '不合格'">不合格</a>
              <a class="motorstudy-footer-rig background-ffae00" href="javascripit:void(0)" v-if="item.isComplete == '合格'">合格</a>
              <a class="motorstudy-footer-rig background-939393" href="javascripit:void(0)" v-if="item.isComplete == ''">未完成</a>
            </li>
            <li><span>答对题数</span><a class="motorstudy-right nav-col" href="javascripit:void(0)">{{item.ansLogarithm}}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <g-button text="开始学习" @click.native="submit"></g-button>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
import { GButton } from 'form'
import { xstudy } from '@/config/baseURL'
export default {

  name: 'motorstudy',

  data () {
    return {
      show: false,
      listData: '',
      itemData: '',
      learningID: ''
    }
  },
  components: {
    Cell,
    GButton
  },
  methods: {
    learningRecord () {
      this.itemData.sort(function (a, b) {
        return Date.parse(b.answerDate) - Date.parse(a.answerDate)  // 时间正序
      })
      this.show = !this.show
    },
    submit () {
      let source = this.$route.query.source
      window.sessionStorage.setItem('integral', this.listData.integral) // 消分学习积分
      // if (this.learningID === 1) {  // 进入消分答题判断
      //   this.$router.push('answers#1') // 进入消分答题页面
      // } else {
      //   this.$router.push({path: '/answer', query: {source: source, id: this.learningID}})
      // }
      this.$router.push({path: '/answer', query: {source: source, id: this.learningID}})
    },
    init () {
      this.learningID = this.$route.query.id
      console.log(this.learningID)
      let val = this.$store.state.user
      let motorstudyData = {
        classroomId: this.learningID, // 列表请求参数
        identityCard: val.identityCard, // 身份证
        mobilephone: val.mobilePhone, // 手机号码
        userName: val.userName, // 名字
        userSource: 'M' // 用户来源
      }
      this.$axios.post(xstudy, motorstudyData).then(json => {
        if (json.code === '0000') {
          this.listData = json.data[0]
          this.itemData = json.data[0].studyRecord  // 学习记录
        } else {
          this.$MessageBox('提示', json.msg)
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
  .motorstudy {
    .motorstudy-head {
      width: 100%;
      height: 350px;
      background: url('../../../assets/images/xstudyBackground.png');
      background-size: 100% 100%;
      position: relative;
    }
    .motorstudy-itop {
      /*width: 204px;*/
      width: 194px;
      height: 194px;
      /*background-color: #fff;*/
      background: url('../../../assets/images/logo.png');
      /*border-radius: 50%;*/
      background-size: cover;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -87px;
      margin-top: -140px;
      overflow: hidden;
      .motorstudy-img {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .motorstudy-name {
      position: absolute;
      left: 38%;
      top: 70%;
      display: block;
      width: 200px;
      color: #fff;
      font-size: 30px;
      text-align: center;
    }
    .mint-cell {
      border-bottom: 1px solid #ddd;
    }
    .motorstudy-footer {
      width: 100%;
      background-color: #f0f1f3;
      overflow: hidden;
      .motorstudy-box {
        width: 100%;
        height: 250px;
        z-index: 666;
        overflow: scroll;
      }
      .motorstudy-footer-top {
        background: url('../../../assets/images/xstudy-tu.png')no-repeat;
        width: 104px;
        height: 100px;
        float: left;
        background-position: right center;
      }
      .motorstudy-footer-bottom {
        float: left;
        width: 86%;
      }
      li {
        width: 100%;
        border-bottom: 1px solid #dadada;
        line-height: 100px;
        padding-left: 20px;
        overflow: hidden;
        .motorstudy-right {
          float: right;
          margin-right: 48px;
          font-style: normal;
        }
        .motorstudy-col {
          color: #ff0000;
        }
        .motorstudy-footer-rig {
          display: inline-block;
          width: 98px;
          font-size: 26px;
          margin: 50px 0 50px 310px;
          border-radius: 8px;
          text-align: center;
          line-height: 40px;
          color: #fff;
        }
        .background-ffae00 {
          background: #ffae00;
        }
        .background-939393 {
          background: #939393;
        }
      }
    }
  }
</style>
