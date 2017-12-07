<template>
  <g-input title="验证码" placeholder="请输入验证码" v-model.lazy="verificationCode" maxlength="6">
    <div slot="right" class="verify-code" @click="method(getCode)" v-if="!showTime">
      获取验证码
    </div>
    <div slot="right" class="verify-code verify-code-gray"  v-if="showTime">
      {{countDown + " s "}}
    </div>
  </g-input>
</template>

<script>
  import {GInput} from 'form'
  export default {
    name: 'get-verification-code',
    data () {
      return {
        showTime: false,
        countDown: 60,
        timer: '',
        verificationCode: ''
      }
    },
    props: ['url', 'data', 'method'],
    components: {
      GInput
    },
    methods: {
      getCode () {
        this.showTime = true
        this.timer = setInterval(() => {
          if (this.countDown === 0) {
            clearInterval(this.timer)
            this.showTime = false
            this.countDown = 60
            return
          }
          this.countDown--
        }, 1000)
      }
    },
    watch: {
      verificationCode (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="less">

</style>
