<template>
  <div class="grade">
    <div class="grade-top">
      <img v-if="batchResult == '合格'" src="../../../assets/images/qualified.png">
      <img v-else-if="batchResult == '不合格'" src="../../../assets/images/disqualification.png">
      <img v-else-if="batchResult == '未完成'" src="../../../assets/images/disqualification.png">
    </div>
    <p v-if="batchResult == '合格'" class="grade-head">本次学习通过,欢迎下次学习！</p>
    <p v-else-if="batchResult == '不合格'" class="grade-head">本次学习不通过,欢迎继续学习！</p>
    <p v-else-if="batchResult == '未完成'" class="grade-head">本次学习不合格,欢迎继续学习！</p>
    <ul class="grade-footer" >
      <li class="grade-footer-center">
        <span>答题日期</span>
        <em class="grade-footer-right">{{answerDate}}</em>
      </li>
      <li class="grade-footer-center">
        <span>答题用时</span>
        <em class="grade-footer-right">{{ganswerTime}}</em>
      </li>
      <li class="grade-footer-center">
        <span>答对题数</span>
        <em class="grade-footer-right">{{answerCorrect}}</em>
      </li>
      <li class="grade-footer-center">
        <span>答错题数</span>
        <em class="grade-footer-right">{{answererror}}</em>
      </li>
    </ul>
    <router-link class="grade-footer-bottom" :to="{ path: '/smallClass', query: this.queryURL}">好的</router-link>
  </div>
</template>
<script>
export default {
  name: 'grade',
  data () {
    return {
      answererror: 0,  // 答错题数
      ganswerTime: 0,  // 答题用时
      answerCorrect: 0,  // 答对题数
      answerDate: '',   // 答题日期
      batchResult: ''   // 合格判断
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  methods: {
    gradeclick () {
      this.answererror = window.sessionStorage.getItem('answererror')    // 答错题数
      this.ganswerTime = window.sessionStorage.getItem('chronoScope')   // 答题用时
      this.batchResult = window.sessionStorage.getItem('batchResult')    // 合格判断
      this.answerCorrect = window.sessionStorage.getItem('answerCorrect')  // 答对题数
      this.answerDate = window.sessionStorage.getItem('answerDate')   // 答题日期
    }
  },
  mounted () {
    this.gradeclick()
  }
}
</script>
<style lang="less" scoped>
.grade {
  .grade-top {
    width: 440px;
    height: 420px;
    margin: 40px auto;
    img {
      display: block;
      width: 440px;
      height: 420px;
      background-size: 100%;
    }
  }
  .grade-head {
    width: 500px;
    margin: 0 auto;
    text-align: center;
    font-size: 28px;
    color: #000000;
    font: 700 28px/48px "";
    margin-bottom: 60px;
  }
  .grade-footer {
    width: 80%;
    margin: 0 auto;
  }
  .grade-footer-center {
    line-height: 80px;
  }

  .grade-footer-right {
    float: right;
    font-style: normal;
  }
  .grade-footer-bottom {
    display: block;
    width: 350px;
    margin: 170px auto;
    line-height: 68px;
    background: #e6e6e6;
    border-radius: 8px;
    box-shadow: 4px 4px 4px 4px #7a7a7a;
    text-align: center;
  }
}
</style>
