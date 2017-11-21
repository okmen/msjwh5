<template>
  <div id="register-outer">
    <!-- 一键注册 -->
    <div class="register-quick register-item">
      <div class="register-item-title">
        <img :src="imgSrc" alt="">
        <p>一键注册</p>
        <span>通过人脸识别快速成为星级用户</span>
      </div>
      <form ref="formFace" class="button" style="overflow: hidden" action="https://iauth.wecity.qq.com/new/cgi-bin/auth.php" method="post">
        <!--<div class="self-input form-template-item">
          <span class="form-template-item-left">姓名</span>
          <input type="text" placeholder="请输入姓名"  name="name"  class="form-template-item-right" v-model="userName">
        </div>
        <div class="self-input form-template-item">
          <span class="form-template-item-left">身份证号</span>
          <input type="text" name="ID" placeholder="请输入身份证号码"    class="form-template-item-right" v-model="IDcard">
        </div>-->
        <input type="hidden" name="appid" :value="appid">
        <input type="hidden" name="signature" :value="signature">
        <input type="hidden" name="redirect" :value="redirect">
        <input type="hidden" name="uid" :value="uid">
        <input type="hidden" name="type" value="0">
        <!--<input type="hidden" name="ID" value="362429199112305319">-->
        <!--<input type="hidden" name="name" value="朱乐义">-->
        <input type="hidden" name="sig" :value="sig">
        <div  class=" register"  style="width: 100%;" @click="sweepInto">一键注册</div>
      </form>
    </div>
    <!-- 认证注册 -->
    <div class="register-normal register-item">
      <div class="register-item-title">
        <p>认证注册</p>
        <span>通过提交用户资料绑定为星级用户</span>
      </div>
        <div class="register" @click="$router.push('/starUser')">认证注册</div>
    </div>
  </div>
</template>
<script>
  import crypto from 'crypto'
  export default {
    data () {
      return {
        imgSrc: require('../../images/1.png'),
        uid: window.localStorage.getItem('openId'),
        countDown: 60,
        verificationCode: '',
        mobilePhone: '',
        userName: '',
        IDcard: '',
        showTime: true,
        appid: '4435',
        secretkey: '9828577231bdc6d01754e292023cdbb8',
        aeskey: '26cb3f325891d42bec10efdeec9a4f95',
        redirect: '',
        signature: null,
        sig: null,
        infoSignature: null,
        infoSig: null
      }
    },
    methods: {
      sweepInto () {
        // 更新签名和校验
        this.signature = this.getAppSign()
        this.sig = this.getHashSig()
        this.$nextTick(() => {
          this.$refs.formFace.submit()
        })
      },
      // 获取认证签名
      getAppSign () {
        let appid = this.appid
        let secretkey = this.secretkey
        let apiname = 'auth'
        let e = 600
        let time = (Date.parse(new Date()) / 1000).toString()
        let orignal = 'a=' + appid + '&m=' + apiname + '&t=' + time + '&e=' + e
        orignal = new Buffer(orignal, 'utf8')
        let wordArray = crypto.createHmac('sha1', secretkey).update(orignal).digest()
        let buf = Buffer.concat([wordArray, orignal])
        let signature = buf.toString('base64')
        // console.log(signature)
        return signature
      },
      // 获取认证签名校验
      getHashSig () {
        let datas = {
          appid: this.appid,
          signature: this.signature,
          redirect: this.redirect,
          uid: window.localStorage.getItem('openId'),
          type: 0,
          /* ID: this.IDcard,
           name: this.userName, */
          sig: this.aeskey
        }
        let srcData = ''
        for (let index in datas) {
          if (index !== 'sig') {
            srcData += datas[index] + '-'
          }
        }
        srcData += 'authkey'
        return crypto.createHash('md5').update(srcData).digest('hex')
      }
    },
    created () {
      this.redirect = window.location.href.split('#')[0] + '#/getFaceInfo'
    }
  }
</script>

<style lang="less" scoped>
  #register-outer{
    height: 100%;
    padding: 40px 40px;
    box-sizing: border-box;
    .register{
     background: #09bb07;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      border-radius: 6px;
      height: 80px;
      margin: 50px 0;
    }
    .register-item{
      .register-item-title{
        background: #fff;
        padding: 40px 40px;
        box-sizing: border-box;
        text-align: center;
        img{
          display: block;
          width: 100px;
          height: 100px;
          margin: auto;
        }
        p{
          color: #333;
          line-height: 40px;
          margin: 30px 0;
          text-align: center;
        }
        span{
          display: block;
          color: #999;
        }
      }
    }
  }
</style>
