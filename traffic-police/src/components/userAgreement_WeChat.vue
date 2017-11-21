<template>
 <div id="takePhotoTipsCom">
    <div class="tp-title">
      {{getNoticeTitle}}
    </div>
   <div class="tp-tips-intro" v-html="userAgreementCon"></div>
   <div class="tp-read" v-if="isShow">
     <div class="tp-read-checkbox">
       <input type="checkbox" id="informReadCheckbox" name="informReadCheckbox" v-model="checked">
       <label for="informReadCheckbox"></label>
     </div>
     <span class="read-and-agree">
       我已认真阅读以上内容，并愿意承担相关法律责任。
     </span>
   </div>
   <div class="tp-btn-sure" v-if="isShow">
     <button @click="btnAgreeRequest">确认</button>
   </div>
   <!-- <div class="tp-btn-sure" v-else>
     <button @click="btnReturn">返回</button>
   </div> -->
   <pageBottom></pageBottom>
   <div v-wechat-title="$route.meta.title"></div>
 </div>
</template>
<script>
import { resultPost } from '../service/getData'
import { userAgreement } from '../config/baseUrl'
import { Toast } from 'mint-ui'
export default {
  name: 'userAgreement',
  computed: {
    isWeChat: function () {
      return /_WeChat/.test(this.$route.name)
    }
  },
  data () {
    return {
      userAgreementCon: '',
      getNoticeTitle: '',
      checked: '',
      entryHash: '',
      isShow: true,
      isLogin: false
    }
  },
  mounted: function () {
    this.$root.$router.isWeChat = this.isWeChat
    // let locationHref = decodeURIComponent(window.location.href)
    // this.entryHash = locationHref.split('?')[0].split('#')[2]  // 截取#后的值
    this.entryHash = this.$route.params.id
    if (this.entryHash === 'wfsspjbzy' || this.entryHash === 'sspjbzysx') {
      this.isShow = false
    }
    let userAgreementData = {
      noticeKey: this.entryHash
    }
    console.log()
//    let userAgreement = 'http://192.168.1.243:8080/web/user/getDocumentationORMByNoticeKey.html'
    this.isLogin = JSON.parse(window.localStorage.getItem('isLogin'))
    console.log('isLogin', this.isLogin)
    if (!this.isLogin) { // 未登录
      console.log(this.entryHash)
      switch (this.entryHash) {
        case 'xfNotice':
        case 'jszbzhz':
        case 'jszns':
          this.$router.push('/login')
          break
      }
    }
    resultPost(userAgreement, userAgreementData).then(json => { // 调取随手拍举报接口
      console.log(json)
      this.getNoticeTitle = json.data.title
      this.userAgreementCon = json.data.content
    })
  },
  methods: {
    getHash: function (hash) {
      if (/_WeChat/.test(this.$route.name)) {
        var hashArr = hash.split('/')
        return `/${hashArr[1]}_WeChat/${hashArr[2] || ''}`
      }
      return hash
    },
    btnAgreeRequest: function () {
      if (this.checked === true) {
        console.log(this.entryHash)
        switch (this.entryHash) {
          case 'wfsspjbzy':  // 随手拍举报范围说明
            this.$router.push(this.getHash('/takePicturesInform'))
            break
          case 'sspjbzysx': // 随手拍举报注意事项
            this.$router.push(this.getHash('/takePicturesInform'))
            break
          case 'xfNotice': // 消分学习须知
            this.$router.push(this.isWeChat ? '/motorstudy_WeChat#1' : '/motorstudy#1')
            break
          case 'mfNotice': // 满分学习须知
            this.$router.push(this.isWeChat ? '/motorstudy_WeChat#2' : '/motorstudy#2')
            break
          case 'abNotice': // ab类学习须知
            this.$router.push(this.isWeChat ? '/motorstudy_WeChat#3' : '/motorstudy#3')
            break
          case 'ddcNotice': // 电动车学习须知
            this.$router.push(this.isWeChat ? '/motorstudy_WeChat#4' : '/motorstudy#4')
            break
          case 'xrNotice': // 行人学习须知
            this.$router.push(this.isWeChat ? '/motorstudy_WeChat#5' : '/motorstudy#5')
            break
          case 'xjyhrz': // 星级用户认证须知
            this.$root.$router.businessType = this.$route.query.businessType
            this.$router.push(this.getHash('/starUser'))
            break
          case 'aqsgxyb':  // 驾驶人安全事故信用表须知
            this.$router.push(this.getHash('/driverCredit'))
            break
          case 'wczm':  // 无车证明须知
            this.$router.push(this.getHash('/carFree'))
            break
          case 'jsrxxd':  // 驾驶人信息单
            this.$router.push(this.getHash('/driversInformation'))
            break
          case 'jdcxxd':  // 机动车信息单
            this.$router.push(this.getHash('/motorVehicle'))
            break
          case 'jszbzhz':  // 驾驶证补证换证
            this.$router.push(this.isWeChat ? '/changeCard_WeChat/id/1' : '/changeCard/id/1')
            break
          case 'jszyqhz':  // 驾驶证延期换证
            this.$router.push(this.isWeChat ? '/changeCard_WeChat/id/2' : '/changeCard/id/2')
            break
          case 'jszns':  // 驾驶证年审
            this.$router.push(this.getHash('/annualExaminations'))
            break
          case 'jszzr':  // 驾驶证转入
            this.$router.push(this.getHash('/intoCard'))
            break
          case 'jszzyjj':  // 驾驶证自愿降级
            this.$router.push(this.getHash('/degradeCard'))
            break
          case 'jsrlxfsbg':  // 驾驶人联系方式变更
            this.$router.push(this.getHash('/changeConnect'))
            break
          case 'szjj_hander_ctmvdl':  // 补领行驶证
            this.$router.push(this.getHash('/replaceCredentials/repairDrivingLicense'))
            break
          case 'szjj_hander_cvi':  // 六年免检预约
            this.$router.push(this.getHash('/esemptionCar'))
            break
          case 'szjj_hander_rim':  // 补换检验合格标志
            this.$router.push(this.getHash('/replaceCredentials/replaceQualifiedMark'))
            break
          case 'szjj_hander_id':  // 机动车异地定期检验申报
            this.$router.push(this.getHash('/placeExamine'))
            break
          case 'szjj_hander_rmvp':  // 补领机动车号牌
            this.$router.push(this.getHash('/replaceCredentials/replaceLicencePlate'))
            break
          case 'szjj_hander_icr':  // 换领机动车行驶证
            this.$router.push(this.getHash('/replaceCredentials/exchangeDrivingLicense'))
            break
          case 'szjj_hander_iccc':  // 机动车变更联系方式
            this.$router.push(this.getHash('/motorAlteration'))
            break
        }
      } else {
        Toast({
          message: '请勾选已阅读温馨提示',
          position: 'bottom',
          duration: 1500
        })
      }
    },
    btnReturn: function () {
      if (this.checked === true) {
        this.$router.go(-1)
      } else {
        Toast({
          message: '请勾选已阅读温馨提示',
          position: 'bottom',
          duration: 1500
        })
      }
    }
  },
  components: {
    'pageBottom': require('./pageBottom.vue')
  }
}
</script>
<style lang="less">
#takePhotoTipsCom{
  min-height: 100%;
  .tp-title{
    width:100%;
    height:74px;
    background:url("../images/takePictureTipBg.png") no-repeat;
    background-size:100% 100%;
    font-size:30px;
    line-height:74px;
    text-align:center;
    color:#FFF;
  }
  .tp-tips-intro{
    padding:0 50px;
    width:100%;
    height:auto;
    p{
      font-size:28px;
      line-height:40px;
    }
  }
  .tp-red-packet{
    padding:0 50px;
    width:100%;
    h3{
      width:100%;
      height:80px;
      font-size:26px;
      line-height:90px;
    }
    .tp-red-intro{
      width:100%;
      p{
        font-size:24px;
        line-height:36px;
        text-indent:52px;
      }
      p:first-child{
        margin-bottom:38px;
      }
    }
    .tp-inform-box{
      width:100%;
      height:200px;
      a{
        display:block;
        font-size:26px;
        color:#24a6f8;
        text-decoration:underline;
      }
      a:first-child{
        margin-bottom:34px;
      }
    }
  }
  .tp-read{
    padding:28px 50px 0;
    width:100%;
    height:106px;
    .read-and-agree {
      font-size: 26px;
    }
    .tp-read-checkbox{
      float:left;
      position:relative;
      margin:4px 20px 0 0;
      width:26px;
      height:26px;
      input[type=checkbox]{
        visibility: hidden;
      }
      label{
        position:absolute;
        width:26px;
        height:26px;
        top:0;
        left:0;
        background:#FFF;
        border:1px dotted #6a6a6a;
        -webkit-border-radius:6px;
        -moz-border-radius:6px;
        border-radius:6px;
        cursor:pointer;
      }
      label:after{
        opacity:0.2;
        content:'';
        position:absolute;
        width:24px;
        height:8px;
        background:transparent;
        top:0;
        left:3px;
        border:4px solid #333;
        border-top:none;
        border-right:none;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
      label:hover::after{
        opacity:0.5;
      }
      input[type=checkbox]:checked + label:after{
        opacity:1;
      }
    }
    span{
      display:block;
      float:left;
      font-size:22px;
    }
  }
  .tp-btn-sure{
    width:100%;
    height:158px;
    button{
      margin-left:52px;
      width:646px;
      height:80px;
      background:#09bb07;
      color:#FFF;
      font-size:36px;
      text-align:center;
      line-height:80px;
      outline:none;
      -webkit-border-radius:8px;
      -moz-border-radius:8px;
      border-radius:8px;
    }
  }
}

</style>
