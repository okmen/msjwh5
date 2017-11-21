<template>
  <div class="navv">
    <div class="nav-xstudy">
      <div class="nav-top">
        <img class="xstudy-img" :src="userImg">
      </div>
      <span class="nav-top-bottom">{{listData.userName}}</span>
    </div>
    <ul class="nav-xstudy-cengter">
      <li class="nav-xstudy-left"><span>驾驶证号</span><em class="nav-xstudy-right">{{listData.identityCard}}</em></li>
      <li class="nav-xstudy-left" v-show="listData.scoreStartDate"><span>记分周期(始)</span><em class="nav-xstudy-right">{{listData.scoreStartDate}}</em></li>
      <li class="nav-xstudy-left" v-show="listData.scoreEndDate"><span>记分周期(末)</span><em class="nav-xstudy-right">{{listData.scoreEndDate}}</em></li>
      <li class="nav-xstudy-left" v-show="listData.integral"><span>学习积分数</span><em class="nav-xstudy-right nav-col">{{listData.integral}}</em></li>
      <li class="nav-xstudy-left">
        <p @click.stop="clickShow()" v-show="itemData"><span>学习记录</span></p>
        <div class="nav-xstudy-footer-lout" v-bind:class="{ 'show' : isShow}">
          <ul class="nav-box">
            <li v-for="record in itemData">
              <div class="nav-xstudy-footer">
                <div class="nav-footer-top"></div>
                <ul class="nav-footer-bottom">
                  <li><span>{{record.answerDate}}</span>
                    <a class="nav-xstudy-footer-right" href="javascripit:void(0)" v-if="record.isComplete == '不合格'">不合格</a>
                    <a class="nav-xstudy-footer-rig" href="javascripit:void(0)" v-if="record.isComplete == '合格'">合格</a>
                    <a class="nav-xstudy-footer-right" href="javascripit:void(0)" v-if="record.isComplete == ''">未完成</a>
                  </li>
                  <li><span>答对题数</span><a class="nav-xstudy-right nav-col" href="javascripit:void(0)">{{record.ansLogarithm}}</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="nav-xstudy-button" @click="pageDown()">开始学习</div>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
import { resultPost } from '../../../service/getData'
import { xstudy } from '../../../config/baseUrl'
import { Toast, MessageBox } from 'mint-ui'

export default {
  computed: {
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  components: {
    'pageBottom': require('../../../components/pageBottom.vue')
  },
  data () {
    return {
      isShow: false, // 控制学习记录样式
      integral: '', // 学习积分
      codes: '', // 消分学习判断
      hashRoomId: '', // 列表号
      msg: '',
      userImg: '',  // 头像
      listData: {},
      itemData: [{ // 学习记录数据
      }]
    }
  },
  methods: {
    clickShow: function () { // 学习记录控制样式
      this.isShow = !this.isShow
      this.itemData.sort(function (a, b) {
        return Date.parse(b.answerDate) - Date.parse(a.answerDate)  // 时间正序
      })
    },
    pageDown: function () {
      window.sessionStorage.setItem('integral', this.listData.integral) // 学习积分
      if (this.hashRoomId === 1) {  // 进入消分答题判断
        this.$router.push('answers#1') // 进入消分答题页面
      } else {
        this.$router.push(`answer#${this.hashRoomId}`) // 进入答题页面
      }
    }
  },
  mounted () {
    let isLogin = window.localStorage.getItem('isLogin') // 是否登录
    if (isLogin === 'false') {
      MessageBox('提示', '请先登录,才可以进入学习').then(() => {
        this.$router.push(`login`)
      })
    } else {
      this.hashRoomId = parseInt(window.location.hash.split('#')[2])
      this.userImg = window.localStorage.getItem('headImgUrl')
      let motorstudyData = { // 获取页面数据
        classroomId: this.hashRoomId, // 列表请求参数
        identityCard: window.localStorage.getItem('identityCard'), // 身份证
        mobilephone: window.localStorage.getItem('mobilePhone'), // 手机号码
        userName: window.localStorage.getItem('userName'), // 名字
        openId: window.localStorage.getItem('openId'),
        userSource: 'C' // 用户来源
      }
      resultPost(xstudy, motorstudyData).then(json => {
        if (json.code === '0000') {       // 请求成功
          this.listData = json.data[0]
          this.itemData = json.data[0].studyRecord  // 学习记录
          this.isComplete = json.data[0].isComplete
          this.integral = json.data[0].integral // 学习积分
        } else {
          Toast({
            message: json.msg,
            position: 'bottom',
            className: 'white'
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.nav-xstudy {
  width: 100%;
  height: 350px;
  background: url('../../../images/xstudyBackground.png');
  position: relative;
  background-size: 100% 100%;
}

.nav-top {
  width: 194px;
  height: 194px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -87px;
  margin-top: -140px;
  overflow: hidden;
}
.xstudy-img {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.nav-xstudy .nav-top-bottom {
  position: absolute;
  left: 38%;
  top: 70%;
  display: block;
  width: 200px;
  color: #fff;
  font-size: 30px;
  text-align: center;
}

.nav-xstudy-left {
  width: 100%;
  line-height: 108px;
  font-size: 26px;
  border-bottom: 1px solid #ddd;
}

.nav-xstudy-left span {
  margin-left: 46px;
}

.nav-xstudy-footer {
  width: 100%;
  background-color: #f0f1f3;
  overflow: hidden;
}

.nav-footer-top {
  background: url('../../../images/xstudy-tu.png')no-repeat;
  width: 104px;
  height: 126px;
  float: left;
  background-position: right center;
}

.nav-footer-bottom {
  float: left;
  width: 86%;
}

.nav-footer-bottom li {
  width: 100%;
  border-bottom: 1px solid #dadada;
  line-height: 126px;
}

.nav-footer-bottom .nav-xstudy-footer-right {
  display: inline-block;
  width: 98px;
  font-size: 26px;
  background: #939393;
  margin: 50px 0 50px 310px;
  border-radius: 8px;
  text-align: center;
  line-height: 40px;
  color: #fff;
}

.nav-xstudy-footer-rig {
  display: inline-block;
  width: 98px;
  font-size: 26px;
  background: #ffae00;
  margin: 50px 0 50px 310px;
  border-radius: 8px;
  text-align: center;
  line-height: 40px;
  color: #fff;
}

.nav-xstudy-button {
  display: inline-block;
  width: 650px;
  margin: 48px 50px 12px;
  line-height: 80px;
  color: #fff;
  font-size: 30px;
  background-color: #09bb07;
  border-radius: 8px;
  text-align: center;
}
.nav-xstudy-right {
  float: right;
  margin-right: 48px;
  font-style: normal;
}

.nav-col {
  color: #ff0000;
}

.nav-box {
  width: 100%;
  height: 266px;
  z-index: 666;
  overflow: scroll;
}

.nav-xstudy-footer-lout {
  display: none;
}

.nav-mstudy-left.show {
  display: block;
}
</style>
