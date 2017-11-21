<template>
  <div class="answer">
  <div v-wechat-title="$route.meta.title"></div>
    <div class="answer-head">
      <div class="answer-head-regit">
        <dl class="answer-head-rgt">
          <dt><img src="../../../images/mistake.png"></dt>
          <dd>已错{{answererror}}题</dd>
        </dl>
        <dl class="answer-head-rgt" :click="popClick()">
          <dt><img src="../../../images/time.png"></dt>
          <dd>{{chronoScope}}</dd>
        </dl>
        <dl class="answer-head-rgt">
          <dt><img src="../../../images/sand.png"></dt>
          <dd>剩余{{surplusAnswe}}题</dd>
        </dl>
        <dl class="answer-head-rgt" @click="secede()">
          <dt><img src="../../../images/exit.png"></dt>
          <dd>退出</dd>
        </dl>
        <div id="select" class="pop-up" v-bind:class="{ 'reveal' : isReveals}">
          <ul class="pop-up-center" >
            <li class="up-cengter-hint">限时时间到！</li>
            <li class="up-cengter-hint">请退出做题或者从新做题</li>
            <li class="up-cengter-hint">本次学习将不做记分</li>
            <li class="up-cengter-hint" @click="againclicks()" >重新学习</li>
            <li class="up-cengter-hint"><router-link to="wschool" class="quit">退出学习</router-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="answer-center">
      <span class="answer-center-left" v-if="testQuestionsType == '判断题'">判</span>
      <span class="answer-center-left" v-else>选</span>
      <span class="answer-center-right">{{answertData.subjectName}}
        <span class="answer-select" v-show="testQuestionsType == '不定选'">(不定选)</span>
      </span>
    </div>
    <img class="answer-button" :src="'data:image/jpg/png;base64,'+answertData.subjectImg" v-show="answertData.subjectImg">

    <ul class="answer-foot">
      <li class="answer-foot-button" v-for="(item, index) in answerName" @click="clickAnswer(index)" :class="{off: item.isSure }">
        <img class="answer-foot-img" :src="testData[index].img">{{item.answerName}}
      </li>
    </ul>
    <span id="swer" class="answer-ansr" v-bind:class="{ 'anshow' : answerShow}">{{judgeTrue}}</span>
    <div class="answer-options" v-bind:class="{ 'shows' : isBtnShows}" @click.stop="answerClick()">答题</div>
    <div id="NofItems" class="answer-option" v-bind:class="{ 'show' : isBtnShow}" @click.stop="countClick()">下一题</div>
  </div>
</template>
<script>
import { resultPost } from '../../../service/getData'
import { answer, answers } from '../../../config/baseUrl'
import { MessageBox, Toast } from 'mint-ui'
export default {
  name: 'answer',
  data () {
    return {
      testQuestionsType: '',   // 判断题型
      answererror: 0,        // 答错题数
      surplusAnswe: '',     // 剩余题数
      isBtnShows: false,   // 答题样式
      isBtnShow: false,   // 下一题样式
      isReveals: false,    // 弹框控制
      answerShow: false,  // 对错显示
      flag: 5,   // 答案选项颜色
      chronoScope: '00:00',    // 答题时间
      answerDate: 0,    // 答题日期
      answerCorrect: 0,  // 答对题数
      batchResult: '',  // 答题合格判断
      code: '', // 消分学习判断
      msg: '',
      answertData: {
      },
      subjectAnswer: '',
      subjectId: '',    // 答题编码
      answerName: {},   // 答题选项
      codes: '',        // 判断答题对错
      scoreStartDate: '',  // 答题周期
      scoreEndDate: '',     // 答题周期
      hashRoomId: '', // 列表号
      Timepiece: '',   // 停止计时器
      answerId: '',    // 答题选择
      judgeTrue: '',
      testData: [{
        img: require('../../../images/A.png')
      },
      {
        img: require('../../../images/B.png')
      },
      {
        img: require('../../../images/C.png')
      },
      {
        img: require('../../../images/D.png')
      }]
    }
  },
  methods: {
    clickAnswer: function (index) {     // 选项答题
      let that = this
      that.answerId = ''      // 答题选择
      this.isBtnShows = true  // 答题显示
      this.isBtnShow = false  // 下一题显示
      if (this.testQuestionsType === '不定选') {
        this.answerName[index].isSure = !this.answerName[index].isSure
        this.answerName.forEach((item) => {
          if (!item.isSure) {
          } else {
            that.answerId += item.answerId
          }
        })
      } else {
        this.answerName.forEach((item, indexs) => {
          if (indexs === index) {
            this.answerName[index].isSure = true
            that.answerId = item.answerId
          } else {
            item.isSure = false
          }
        })
      }
    },
    answerClick: function () {     // 答题
      this.isBtnShows = false  // 答题显示
      this.answerShow = true  // 对错显示
      this.isBtnShow = true    // 下一题显示
      var answesData = {
        classroomId: this.hashRoomId, // 列表请求参数
        identityCard: window.localStorage.getItem('identityCard'), // 身份证
        mobilephone: window.localStorage.getItem('mobilePhone'),   // 手机号码
        userName: window.localStorage.getItem('userName'),         // 名字
        openId: window.localStorage.getItem('openId'),
        testQuestionsType: this.testQuestionsType,
        userSource: 'C',     // 用户来源
        SubjectAnswer: this.answerId,
        subjectId: this.subjectId,  // 答题编码
        scoreStartDate: this.scoreStartDate,  // 答题周期
        scoreEndDate: this.scoreEndDate   // 答题周期
      }
      resultPost(answers, answesData).then(json => {     // 答案数据接口
        this.codes = json.code
        if (this.codes === '0000') {
          this.surplusAnswe = json.data[0].surplusAnswe  // 还剩题数
          this.answerCorrect = json.data[0].answerCorrect  // 答对题数
          this.batchResult = json.data[0].batchResult    // 答题合格判断
          this.answererror = json.data[0].answererror    // 答错题数
          this.answerDate = json.data[0].answerDate  // 答题日期
          this.judgeTrue = '答题正确'
          if (this.surplusAnswe === 0) {
            document.getElementById('NofItems').innerHTML = '结束答题'
          }
          document.getElementById('swer').style.color = 'green'
        } else if (this.codes === '0001') {
          this.surplusAnswe = json.data[0].surplusAnswe  // 还剩题数
          this.answerCorrect = json.data[0].answerCorrect  // 答对题数
          this.batchResult = json.data[0].batchResult    // 答题合格判断
          this.answererror = json.data[0].answererror    // 答错题数
          this.answerDate = json.data[0].answerDate  // 答题日期
          this.judgeTrue = '答题错误'
          if (this.surplusAnswe === 0) {
            document.getElementById('NofItems').innerHTML = '结束答题'
          }
          document.getElementById('swer').style.color = 'red'
        } else if (this.codes === '0002') {
          Toast({
            message: json.msg,
            duration: 1000
          })
        }
      })
    },
    countClick: function () {      // 获取下一题数据
      this.loadingData()
      this.judgeTrue = ''
      this.isBtnShows = false      // 答题显示
      this.answerShow = false      // 对错显示
      if (this.surplusAnswe === 0) {
        window.sessionStorage.setItem('answererror', this.answererror)      // 答错题数
        window.sessionStorage.setItem('answerCorrect', this.answerCorrect)  // 答对题数
        window.sessionStorage.setItem('batchResult', this.batchResult)  // 答题合格判断
        window.sessionStorage.setItem('chronoScope', this.chronoScope)  // 答题时间
        window.sessionStorage.setItem('answerDate', this.answerDate)  // 答题日期
        this.$router.push('grade')
      }
    },
    loadingData: function () {     //  页面接口数据
      this.isBtnShow = false  // 初始化下一题选项样式
      this.hashRoomId = window.location.hash.split('#')[2]
      var answeData = {
        classroomId: this.hashRoomId, // 列表请求参数
        identityCard: window.localStorage.getItem('identityCard'), // 身份证
        mobilephone: window.localStorage.getItem('mobilePhone'),   // 手机号码
        userName: window.localStorage.getItem('userName'),         // 名字
        openId: window.localStorage.getItem('openId'),
        userSource: 'C'   // 用户来源
      }
      resultPost(answer, answeData).then(json => {
        this.code = json.code // 状态码
        this.msg = json.msg // 状态返回
        if (this.code === '0000') {      // 答题判断
          this.answertData = json.data[0]
          this.answerName = json.data[0].answeroptions  // 答题选项
          this.subjectId = json.data[0].subjectId  // 答题编码
          this.testQuestionsType = json.data[0].testQuestionsType   // 题目类型
          this.answerName.forEach((item) => {
            item.isSure = false
          })
          this.scoreEndDate = json.data[0].scoreEndDate  // 答题周期
          this.scoreStartDate = json.data[0].scoreStartDate  // 答题周期
        } else {
          clearInterval(this.Timepiece)
          MessageBox('提示', this.msg).then(() => {
            this.$router.push('wschool')
          })
        }
      })
    },
    popClick: function () {       // 倒计时弹框
      let anData = this.chronoScope
      if (anData === '30:00') {
        this.isReveals = true
      }
    },
    againclicks: function () {
      document.getElementById('select').style.display = 'none'
      // this.isReveals = false
      console.log(this.isReveals)
      this.timePiece()
      this.loadingData()
    },
    timePiece: function () {    // 计时器
      clearInterval(this.Timepiece)
      var mm = 0
      var ss = 0
      var str = ''
      this.Timepiece = setInterval(() => {
        str = ''
        if (++ss === 60) {
          if (++mm === 60) {
            mm = 0
          }
          ss = 0
        }
        str += mm < 10 ? '0' + mm : mm
        str += ':'
        str += ss < 10 ? '0' + ss : ss
        this.chronoScope = str
      }, 1000)
    },
    secede: function () {
      MessageBox.confirm('是否退出学习').then(action => {
        this.$router.push('wschool')
      })
    }
  },
  created () {
    this.loadingData()
    this.timePiece()
  }
}
</script>
<style lang="less">
.answer-head {
  width: 100%;
  height: 116px;
  background-color: #cfd2d4;
  overflow: hidden;
}
.answer-head-regit {
  float: right;
  font-size: 16px;
}
.answer-head-regit .answer-head-rgt {
  width: 120px;
  height: 116px;
  float: left;
  text-align: center;
  font-size: 16px;
}
.answer-head-regit .answer-head-rgt dt img {
  margin-top: 16px;
  height: 50px;
}
.answer-center-left {
  display: inline-block;
  width: 56px;
  height: 52px;
  line-height: 52px;
  background-color: #4c9ff4;
  text-align: center;
  border-radius: 8px;
  color: #fff;
  margin: 22px 22px 0 32px;
}
.answer-center-right {
  font-size: 24px;
  display: inline-block;
  width: 80%;
  vertical-align: middle;
}
.answer-button {
  display: block;
  width: 400px;
  height: 400px;
  margin: 0 auto;
  vertical-align: middle;
  margin-top: 58px;
}
.answer-foot {
  width: 600px;
  margin: 0 auto;
}
.answer-foot li {
  line-height: 60px;
  font-size: 28px;
  margin-top: 20px;
}
.answer-foot-button {
  margin-top: 60px;
}
.answer-foot-img {
  display: inline-block;
  vertical-align: middle;
  width: 50px;
  height: 50px;
  margin-right: 30px;
}
.answer-option {
  display: none;
  width: 430px;
  line-height: 80px;
  margin: 54px auto;
  background: #4c9ff4;
  border-radius: 8px;
  color: #fff;
  font-size: 28px;
  text-align: center;
}
.answer-options {
  display: none;
  width: 430px;
  line-height: 80px;
  margin: 54px auto;
  background: #4c9ff4;
  border-radius: 8px;
  color: #fff;
  font-size: 28px;
  text-align: center;
}
.answer-foot-button.color{
  color: #16b221
}
.answer-option.show {
  display: block;
}
.answer-options.shows {
  display: block;
}
.pop-up {
  display: none;
  position: fixed;
  left: 50%;
  top: 50%;
  width: 550px;
  height: 444px;
  margin-top: -225px;
  margin-left: -274px;
  background: #fff;
  border-radius: 10px;
}
.pop-up-center .up-cengter-hint{
  width:416px;
  margin: 20px auto;
  text-align: center;
}
.pop-up-center :nth-of-type(1){
  font:700 30px/70px "";
  color: #f46263;
}
.pop-up-center :nth-of-type(4){
  font-size: 30px;
  line-height: 70px;
  border: 1px solid #2696dd;
  color: #2696dd;
  border-radius: 10px;
  margin-top: 30px;
}
.pop-up-center :nth-of-type(5){
  font-size: 30px;
  line-height: 70px;
  border: 1px solid #2696dd;
  color: #2696dd;
  border-radius: 10px;
}
.pop-up.reveal{
  display: block
}
.pop-up-center .quit{
  display: block;
  color: #2696dd;
  width: 100%;
  height: 100%;
  font-weight:normal;
}
.answer-ansr{
  display: none;
  width: 600px;
  margin: 0 auto;
}
.answer-ansr.anshow{
  display: block;
}
.off{
  color: #4c9ff4
}
.on{ color: #4c9ff4; }
.answer-select{color:red}
</style>
