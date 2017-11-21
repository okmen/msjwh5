<template>
    <div class="form-template-item">
      <span class="form-template-item-left">验证码</span>
      <div class="form-template-item-right send-code">
        <input type="text" class="send-code-input" placeholder="请输入验证码" v-model="inputData">
        <div class="send-code-btn" v-if="showBtn" @click="getCode">获取验证码</div>
        <div class="send-code-btn" v-if="!showBtn" style="background: gray">{{countdown}} s</div>
      </div>
    </div>
</template>
<style>

</style>
<script>
  export default {
    data () {
      return {
        inputData: '',
        countdown: 5,
        showBtn: true,
        timer: ''
      }
    },
    watch: {
      inputData (val) {
        this.$emit('getSelected', val)
      }
    },
    props: ['childInfo'],
    methods: {
      getCode () {
        this.showBtn = false
        this.timer = setInterval(() => {
          if (this.countdown === 0) {
            this.showBtn = true
            this.countdown = 5
            clearInterval(this.timer)
            return
          }
          this.countdown--
        }, 1000)
      }
    },
    mounted () {
      this.$emit('getSelected', '')
    }
  }
</script>
