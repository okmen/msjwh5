<template>
  <div class="answer">
    <div class="answer-head">
      <div class="answer-head-regit">
        <dl class="answer-head-rgt">
          <dt><img src="../../../assets/images/mistake.png"></dt>
          <dd>已错{{answererror}}题</dd>
        </dl>
        <dl class="answer-head-rgt" :click="popClick()">
          <dt><img src="../../../assets/images/time.png"></dt>
          <dd>{{chronoScope}}</dd>
        </dl>
        <dl class="answer-head-rgt">
          <dt><img src="../../../assets/images/sand.png"></dt>
          <dd v-if="learningID === 1">已答{{surplusAnswe}}题</dd>
          <dd v-else>剩余{{surplusAnswe}}题</dd>
        </dl>
        <dl class="answer-head-rgt" @click="secede()">
          <dt><img src="../../../assets/images/exit.png"></dt>
          <dd>退出</dd>
        </dl>
        <div class="pop-up" v-if="reveal">
          <ul class="pop-up-center" >
            <li class="up-cengter-hint">限时时间到！</li>
            <li class="up-cengter-hint">请退出做题或者从新做题</li>
            <li class="up-cengter-hint">本次学习将不做记分</li>
            <li class="up-cengter-hint" @click="againclicks()" >重新学习</li>
            <li class="up-cengter-hint"><router-link :to="{ path: '/smallClass', query: this.queryURL}" class="quit">退出学习</router-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="answer-nav">
      <span class="answer-nav-left" v-if="testQuestionsType == '判断题'">判</span>
      <span class="answer-nav-left" v-else>选</span>
      <span class="answer-nav-right">{{answertData.subjectName}}
        <span class="answer-select" v-if="testQuestionsType == '不定选'">(不定选)</span>
      </span>
      <img class="answer-button" :src="'data:image/jpg/png;base64,'+answertData.subjectImg" v-if="answertData.subjectImg">
      <ul class="answer-foot">
        <li class="answer-foot-button" v-for="(item, index) in answerName" @click.stop="clickAnswer(index)" :class="{off:item.isSure}">
          <img class="answer-foot-img" :src="testData[index].img">{{item.answerName}}
        </li>
      </ul>
      <span id="swer" class="answer-ansr">{{judgeTrue}}</span>
      <div class="answer-option" @click="answerClick()" v-if="questionsShow">答题</div>
      <div id="NofItems" class="answer-option" v-if="nextQuestion" @click.stop="countClick()">{{Question}}</div>
    </div>
  </div>
</template>

<script>
import { answer, answers } from '@/config/baseURL'
export default {
  name: 'answer',
  data () {
    return {
      questionsShow: false,  // 答题样式
      nextQuestion: false,   // 下一题样式
      testQuestionsType: '',   // 判断题型
      shows: false,
      show: false,
      reveal: false,          // 30分钟控制
      Question: '下一题',
      learningID: '',
      val: '',
      answertData: '',
      answererror: 0,
      surplusAnswe: 0,
      answerCorrect: 0,  // 答对题数(消分学习)
      answerName: {},
      chronoScope: '00:00',   // 答题时间
      answerId: '',    // 答题选择
      judgeTrue: '',
      code: '',
      testData: [{
        img: require('../../../assets/images/A.png')
      },
      {
        img: require('../../../assets/images/B.png')
      },
      {
        img: require('../../../assets/images/C.png')
      },
      {
        img: require('../../../assets/images/D.png')
      }]
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  methods: {
    // 答题
    clickAnswer: function (index) {
      let that = this
      that.answerId = ''      // 答题选择
      this.questionsShow = true  // 答题显示
      this.nextQuestion = false  // 下一题显示
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
    // 30分钟弹框显示
    popClick () {
      if (this.chronoScope === '30:00') {
        this.reveal = true
      }
    },
    // 从新学习
    againclicks () {
      this.reveal = false
      this.timePiece()
      this.loadingData()
    },
    // 退出学习
    secede () {
      this.$MessageBox.confirm('是否退出学习').then(action => {
        this.$router.push({path: '/smallClass', query: this.queryURL})
      })
    },
    // 答题接口
    answerClick () {
      this.nextQuestion = true
      this.questionsShow = false
      var answesData = {
        classroomId: this.learningID, // 列表请求参数
        identityCard: this.val.identityCard, // 身份证
        mobilephone: this.val.mobilePhone,   // 手机号码
        userName: this.val.userName,         // 名字
        testQuestionsType: this.testQuestionsType,
        userSource: 'M',     // 用户来源
        SubjectAnswer: this.answerId,
        subjectId: this.answertData.subjectId,  // 答题编码
        scoreStartDate: this.answertData.scoreStartDate,  // 答题周期
        scoreEndDate: this.answertData.scoreEndDate   // 答题周期
      }
      this.$axios.post(answers, answesData).then(json => {
        // this.learningID等于1为消分学习
        if (this.learningID === 1) {
          this.surplusAnswe++     // 答题数
          if (json.code === '0000') {
            this.judgeTrue = '答题正确'
            document.getElementById('swer').style.color = 'green'
            this.answerCorrect++ // 答对题数
            if (this.answerCorrect === 10) {
              this.Question = '结束答题'
            }
          } else if (json.code === '0001') {
            this.judgeTrue = '答题错误'
            document.getElementById('swer').style.color = 'red'
            this.answererror++   // 答错题数
          } else {
            this.$toast({message: json.msg})
          }
        } else {
          // 其他学习
          if (json.code === '0000') {
            this.surplusAnswe = json.data[0].surplusAnswe  // 还剩题数
            this.answerCorrect = json.data[0].answerCorrect  // 答对题数
            this.batchResult = json.data[0].batchResult    // 答题合格判断
            this.answererror = json.data[0].answererror    // 答错题数
            this.answerDate = json.data[0].answerDate  // 答题日期
            this.judgeTrue = '答题正确'
            if (this.surplusAnswe === 0) {
              this.Question = '结束答题'
            }
            document.getElementById('swer').style.color = 'green'
          } else if (json.code === '0001') {
            this.surplusAnswe = json.data[0].surplusAnswe  // 还剩题数
            this.answerCorrect = json.data[0].answerCorrect  // 答对题数
            this.batchResult = json.data[0].batchResult    // 答题合格判断
            this.answererror = json.data[0].answererror    // 答错题数
            this.answerDate = json.data[0].answerDate  // 答题日期
            this.judgeTrue = '答题错误'
            if (this.surplusAnswe === 0) {
              this.Question = '结束答题'
            }
            document.getElementById('swer').style.color = 'red'
          } else {
            this.$toast({message: json.msg})
          }
        }
      })
    },
    // 下一题
    countClick () {
      this.judgeTrue = ''
      this.questionsShow = true      // 答题显示
      this.nextQuestion = false
      if (this.surplusAnswe === 0 && this.learningID !== 1) {
        window.sessionStorage.setItem('answererror', this.answererror)      // 答错题数
        window.sessionStorage.setItem('answerCorrect', this.answerCorrect)  // 答对题数
        window.sessionStorage.setItem('batchResult', this.batchResult)  // 答题合格判断
        window.sessionStorage.setItem('chronoScope', this.chronoScope)  // 答题时间
        window.sessionStorage.setItem('answerDate', this.answerDate)  // 答题日期
        clearInterval(this.Timepiece)
        this.$router.push({path: '/grade', query: this.queryURL})
      }
      this.loadingData()
    },
    // 计时器
    timePiece () {
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
    // 获取题目
    loadingData () {
      let answeData = {
        classroomId: this.learningID, // 列表请求参数
        identityCard: this.val.identityCard, // 身份证
        mobilephone: this.val.mobilePhone,   // 手机号码
        userName: this.val.userName,         // 名字
        userSource: 'M'   // 用户来源
      }
      this.$axios.post(answer, answeData).then(json => {
        this.code = json.code
        if (json.code === '0000') {
          this.answertData = json.data[0]
          this.answerName = this.answertData.answeroptions
          this.answerName.forEach((item) => {
            item.isSure = false
          })
          this.testQuestionsType = json.data[0].testQuestionsType   // 题目类型
        } else {
          clearInterval(this.Timepiece)
          this.$MessageBox('提示', json.msg).then(() => {
            if (this.learningID !== 1) {
              this.$router.push({path: '/smallClass', query: this.queryURL})
            }
          })
        }
      })
    }
  },
  watch: {
    code () {
      // 判断消分学习跳转
      if (this.code === '0001' && this.learningID === 1) {
        window.sessionStorage.setItem('answererror', this.answererror)      // 答错题数
        window.sessionStorage.setItem('answerCorrect', this.answerCorrect)  // 答对题数
        window.sessionStorage.setItem('surplusAnswe', this.surplusAnswe)  // 答题数
        this.$router.push({path: '/result', query: this.queryURL})
      }
    }
  },
  mounted () {
    this.val = this.$store.state.user
    this.learningID = +this.$route.query.id
    this.loadingData()
    this.timePiece()
  }
}
</script>

<style lang="less" scoped>
  .answer {
    .answer-head {
      width: 100%;
      height: 116px;
      background-color: #cfd2d4;
      overflow: hidden;
      .answer-head-regit {
        float: right;
        font-size: 16px;
        .answer-head-rgt {
          width: 120px;
          height: 116px;
          float: left;
          text-align: center;
          font-size: 16px;
          dt img {
            margin-top: 16px;
            height: 50px;
          }
        }
      }
    }
    .pop-up {
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
    .pop-up-center .quit{
      display: block;
      color: #2696dd;
      width: 100%;
      height: 100%;
      font-weight:normal;
    }
    .answer-nav {
      .answer-nav-left {
        display: inline-block;
        width: 56px;
        line-height: 52px;
        background-color: #4c9ff4;
        text-align: center;
        border-radius: 8px;
        color: #fff;
        margin: 22px 22px 0 32px;
      }
      .answer-nav-right {
        font-size: 26px;
        display: inline-block;
        width: 80%;
        vertical-align: middle;
        .answer-select {
          color: #FF0000;
        }
      }
      .answer-button {
        display: block;
        width: 400px;
        height: 400px;
        margin: 58px auto;
      }
      .answer-foot {
        width: 600px;
        margin: 0 auto;
        .answer-foot-button {
          line-height: 60px;
          font-size: 28px;
          margin-top: 20px;
          .answer-foot-img {
            display: inline-block;
            vertical-align: middle;
            width: 50px;
            height: 50px;
            margin-right: 30px;
          }
        }
        .off {
          color: #4c9ff4;
        }
      }
      .answer-ansr{
        display: block;
        width: 80%;
        margin: 20px auto;
      }
      .answer-option{
        width: 80%;
        line-height: 80px;
        margin: 54px auto;
        background: #4c9ff4;
        border-radius: 8px;
        color: #fff;
        font-size: 28px;
        text-align: center;
      }
    }
  }
</style>
