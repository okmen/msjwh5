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
          <dd>已答{{surplusAnswe}}题</dd>
        </dl>
        <dl class="answer-head-rgt">
          <dt><img src="../../../images/exit.png"></dt>
          <dd @click="secede()">退出</dd>
        </dl>
        <div id="selects" class="pop-up" v-bind:class="{ 'reveal' : isReveal}">
          <ul class="pop-up-center" >
            <li class="up-cengter-hint">限时时间到！</li>
            <li class="up-cengter-hint">请退出做题或者从新做题</li>
            <li class="up-cengter-hint">本次学习将不做记分</li>
            <li class="up-cengter-hint" @click="againclick()">重新学习</li>
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
    <img class="answer-button" :src="'data:image/jpg/png/gif;base64,'+answertData.subjectImg" v-show="answertData.subjectImg">

    <ul class="answer-foot">
       <li class="answer-foot-button" v-for="(item, index) in answerName" @click="clickAnswer(index)" :class="{off: item.isSure }">
        <img class="answer-foot-img" :src="testData[index].img">{{item.answerName}}
      </li>
    </ul>
    <span id="swer" class="answer-ansr" v-bind:class="{ 'anshow' : answerShow}">{{judgeTrue}}</span>
    <div class="answer-options" v-bind:class="{ 'shows' : isBtnShows}" @click.stop="answerClick()">答题</div>
    <div id="NofItemss" class="answer-option" v-bind:class="{ 'show' : isBtnShow}" @click="countClick()">下一题</div>
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
      answererror: 0,
      surplusAnswe: 0,
      isBtnShows: false,
      isBtnShow: false,   // 下一题样式
      isReveal: false,    // 弹框控制
      tlag: 5,   // 正确选项颜色
      flag: 5,  // 错误选项颜色
      chronoScope: '00:00',    // 答题时间
      answerCorrect: 0,  // 答对题数
      batchResult: '',  // 答题合格判断
      code: '', // 消分学习判断
      msg: '',
      judgeTrue: '',
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
      answerShow: false,  // 对错显示
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
      console.log(this.answerId)
    },
    popClick: function () {       // 倒计时弹框
      let anData = this.chronoScope
      if (anData === '30:00') {
        clearInterval(this.Timepiece)
        this.isReveal = true
      }
    },
    againclick: function () {
      document.getElementById('selects').style.display = 'none'
      this.timePiece()
      this.loadingData()
    },
    answerClick: function () {     // 答题
      this.isBtnShow = true    // 下一题显示
      this.isBtnShows = false  // 答题显示
      this.answerShow = true  // 对错显示
      this.surplusAnswe++     // 答题数
      var answesData = {
        classroomId: this.hashRoomId, // 列表请求参数
        identityCard: window.localStorage.getItem('identityCard'), // 身份证
        mobilephone: window.localStorage.getItem('mobilePhone'),   // 手机号码
        userName: window.localStorage.getItem('userName'),         // 名字
        openId: window.localStorage.getItem('openId'),
        testQuestionsType: this.testQuestionsType,   // 答题类型
        userSource: 'C',     // 用户来源
        SubjectAnswer: this.answerId,
        subjectId: this.subjectId,  // 答题编码
        scoreStartDate: this.scoreStartDate,
        scoreEndDate: this.scoreEndDate
      }
      resultPost(answers, answesData).then(json => {     // 答案数据接口
        this.codes = json.code
        if (this.codes === '0000') {
          this.judgeTrue = '答题正确'
          document.getElementById('swer').style.color = 'green'
          this.answerCorrect++ // 答对题数
          if (this.answerCorrect === 10) {
            document.getElementById('NofItemss').innerHTML = '结束答题'
          }
        } else if (this.codes === '0001') {
          this.judgeTrue = '答题错误'
          document.getElementById('swer').style.color = 'red'
          this.answererror++   // 答错题数
        } else {
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
      this.answerShow = false
      // if (this.answerCorrect === 10) {
      //   window.sessionStorage.setItem('answererror', this.answererror)      // 答错题数
      //   window.sessionStorage.setItem('answerCorrect', this.answerCorrect)  // 答对题数
      //   window.sessionStorage.setItem('surplusAnswe', this.surplusAnswe)  // 答题数
      //   this.$router.push('result#1')
      // }
    },
    loadingData: function () {     //  页面接口数据
      this.isBtnShow = false  // 初始化下一题选项样式
      this.hashRoomId = window.location.hash.split('#')[2]
      var answeData = {
        classroomId: this.hashRoomId, // 列表请求参数
        identityCard: window.localStorage.getItem('identityCard'), // 身份证
        mobilephone: window.localStorage.getItem('mobilePhone'),   // 手机号码
        userName: window.localStorage.getItem('userName'), // 名字
        openId: window.localStorage.getItem('openId'),
        userSource: 'C'   // 用户来源
      }
      resultPost(answer, answeData).then(json => {     // 取题接口
        console.log(json)
        this.code = json.code // 状态码
        this.msg = json.msg // 状态返回
        if (this.code === '0000') {      // 答题判断
          this.answertData = json.data[0]
          this.answerName = json.data[0].answeroptions
          this.subjectId = json.data[0].subjectId
          this.testQuestionsType = json.data[0].testQuestionsType
          this.answerName.forEach((item) => {
            item.isSure = false
          })
          this.scoreEndDate = json.data[0].scoreEndDate
          this.scoreStartDate = json.data[0].scoreStartDate
        } else {
          clearInterval(this.Timepiece)
          MessageBox('提示', this.msg).then(() => {
            this.$router.push(this.$root.$router.isWeChat ? 'motorstudy_WeChat#1' : 'wschool')
          })
        }
      })
    },
    timePiece: function () {    // 计时器
      clearInterval(this.Timepiece)
      var mm = 0
      var ss = 0
      var str = ''
      setInterval(() => {
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
  watch: {
    code () {
      if (this.code === '0001') {
        window.sessionStorage.setItem('answererror', this.answererror)      // 答错题数
        window.sessionStorage.setItem('answerCorrect', this.answerCorrect)  // 答对题数
        window.sessionStorage.setItem('surplusAnswe', this.surplusAnswe)  // 答题数
        this.$router.push('result#1')
      }
    }
  },
  created () {
    this.loadingData()
    this.timePiece()
  }
}
</script>
