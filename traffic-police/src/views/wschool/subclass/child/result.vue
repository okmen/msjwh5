<template>
  <div class="result" :click="resultclick()">
    <div class="result-head" >
      <span class="result-digit">{{integrals}}</span>
      <p class="result-head-bottom">驾驶证号：<i class="result-col">{{resultData.identityCard}}</i></p>
    </div>
    <div class="result-cen" >
      <dl class="result-center">
        <dt class="result-center-colour tian">{{surplusAnswe}}</dt>
        <dd class="result-center-colo">答题数</dd>
      </dl>
      <img class="result-xian" src="../../../../images/xian.png">
      <dl class="result-center">
        <dt class="result-center-colour">{{answererror}}</dt>
        <dd class="result-center-colo">答错次数</dd>
      </dl>
    </div>
    <router-link class="result-bottom" :to="getReturnPath">返回</router-link>
  </div>
</template>
<script>
import { resultPost } from '../../../../service/getData'
import { xstudy } from '../../../../config/baseUrl'
export default {
  name: 'result',
  computed: {
    getReturnPath () {
      return this.$root.$router.isWeChat ? 'motorstudy_WeChat#1' : 'wschool'
    }
  },
  data () {
    return {
      surplusAnswe: 0,    // 答题数
      answererror: 0,     // 答错题数
      answerCorrect: 0,   // 答对题数
      integral: 0,        // 积分
      integrals: 0,
      resultData: {
      }
    }
  },
  methods: {
    resultclick: function () {
      this.surplusAnswe = window.sessionStorage.getItem('surplusAnswe')   // 答题数
      this.answererror = window.sessionStorage.getItem('answererror')     // 答错题数
      this.answerCorrect = window.sessionStorage.getItem('answerCorrect')  // 答对题数
      this.integrals = parseInt(this.integral) - parseInt(window.sessionStorage.getItem('integral'))   // 积分
      console.log(window.sessionStorage.getItem('integral'))
    }
  },
  created () {
    // let hashRoomId = window.location.hash.split('#')[2]
    var resData = {
      classroomId: 1, // 列表请求参数
      identityCard: window.localStorage.getItem('identityCard'), // 身份证
      mobilephone: window.localStorage.getItem('mobilePhone'),   // 手机号码
      userName: window.localStorage.getItem('userName'),         // 名字
      openId: window.localStorage.getItem('openId'),
      userSource: 'C'    // 用户来源
    }
    resultPost(xstudy, resData).then(json => {
      console.log(json)
      this.resultData = json.data[0]
      this.integral = json.data[0].integral
      console.log(this.integral)
    })
  }
}
</script>
<style lang="less">
.result {
  overflow: hidden;
}

.result-head {
  width: 100%;
  height: 468px;
  background: url("../../../../images/score.png");
  background-size: 100%;
  overflow: hidden;
  position: relative;
}

.result-digit {
  position: absolute;
  left: 256px;
  top: 206px;
  display: block;
  width: 200px;
  text-align: center;
  font-size: 74px;
  font-weight: bold;
}

.result .result-head-bottom {
  font-size: 26px;
  color: #fff;
  text-align: center;
  margin-top: 400px;
  background: url("../../../../images/idte.png") no-repeat;
  background-size: 40px;
  background-position: 100px 0px;
}

.result-center {
  float: left;
  width: 49%;
  text-align: center;
}

.result-xian {
  float: left;
}

.result-cen {
  overflow: hidden;
  margin-top: 40px;
}

.result-bottom {
  display: block;
  width: 644px;
  margin: 60px auto;
  text-align: center;
  line-height: 80px;
  font-size: 30px;
  color: #fff;
  background: #2696dd;
  border-radius: 10px;
}
.result-col{
	color: #fff;
}
.result-center-colo {
  font-size: 30px;
  line-height: 60px;
}

.result-center-colour {
  color: #ff3939;
  font-size: 70px;
  line-height: 140px;
}

.tian {
  color: #4ebfe9;
}
</style>
