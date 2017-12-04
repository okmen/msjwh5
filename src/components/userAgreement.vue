<template>
 <div id="takePhotoTipsCom">
   <!--<pop-up-g v-if="showPopUpG" :title="{name:'请选择认证的方式'}" :buttons="[{title: '上传文字资料认证',class:'btn2',methods(){$router.push('/starUser')}}]"></pop-up-g>-->
   <div class="tp-title">
      {{getNoticeTitle}}
    </div>
   <div class="tp-tips-intro" v-html="userAgreementCon"></div>
   <template v-if="$route.query.type !== 'nohandle'">
    <div class="tp-read">
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
    <div class="tp-btn-sure" v-else>
      <button @click="btnReturn">返回</button>
    </div>
  </template>
   <div v-wechat-title="$route.meta.title"></div>
   <!-- <page-bottom v-if="isWeChat"></page-bottom> -->
 </div>
</template>
<script>
// import PopUpG from './popUp_G/popUp_G.vue'
// import { resultPost } from '../service/getData'
import axios from '../utils/axios'
import { userAgreement } from '../config/baseURL'
import { Toast } from 'mint-ui'
export default {
  name: 'userAgreement',
  // computed: {
  //   isWeChat: function () {
  //     return /_WeChat/g.test(this.$route.name)
  //   }
  // },
  // components: {
  //   'pageBottom': require('../components/pageBottom.vue'),
  //   PopUpG
  // },
  data () {
    return {
      showPopUpG: false,
      userAgreementCon: '',
      getNoticeTitle: '',
      checked: '',
      entryHash: '',
      isShow: true
    }
  },
  mounted: function () {
    // let locationHref = decodeURIComponent(window.location.href)
    // this.entryHash = locationHref.split('?')[0].split('#')[2]  // 截取#后的值
    // this.$root.$router.isWeChat = this.isWeChat
    this.entryHash = this.$route.params.id
    if (this.entryHash === 'wfsspjbzy' || this.entryHash === 'sspjbzysx' || this.entryHash === 'wtmf') {
      this.isShow = false
    }
    let userAgreementData = {
      noticeKey: this.entryHash
    }
    console.log(userAgreementData)
//    let userAgreement = 'http://192.168.1.243:8080/web/user/getDocumentationORMByNoticeKey.html'
    axios.post(userAgreement, userAgreementData).then(json => { // 调取随手拍举报接口
      console.log(json)
      this.getNoticeTitle = json.data.title
      this.userAgreementCon = json.data.content
    })
  },
  methods: {
    btnAgreeRequest: function () {
      if (this.checked === true) {
        console.log(this.entryHash)
        switch (this.entryHash) {
          case 'wfsspjbzy':  // 随手拍举报范围说明
            this.$router.push('/takePicturesInform')
            break
          case 'sspjbzysx': // 随手拍举报注意事项
            this.$router.push('/takePicturesInform')
            break
          case 'xfNotice': // 消分学习须知
            this.$router.push('/motorstudy#1')
            break
          case 'mfNotice': // 满分学习须知
            this.$router.push('/motorstudy#2')
            break
          case 'abNotice': // ab类学习须知
            this.$router.push('/motorstudy#3')
            break
          case 'ddcNotice': // 电动车学习须知
            this.$router.push('/motorstudy#4')
            break
          case 'xrNotice': // 行人学习须知
            this.$router.push('/motorstudy#5')
            break
          case 'xjyhrz': // 星级用户认证须知
//            this.showPopUpG = true
            this.$root.$router.businessType = ''
            // this.$router.push('/starUser')
            this.$router.push('/registerChoose')
            break
          case 'aqsgxyb':  // 驾驶人安全事故信用表须知
            this.$router.push('/driverCredit')
            break
          case 'wczm':  // 无车证明须知
            this.$router.push('/carFree')
            break
          case 'jsrxxd':  // 驾驶人信息单
            this.$router.push('/driversInformation')
            break
          case 'jdcxxd':  // 机动车信息单
            this.$router.push('/motorVehicle')
            break
          case 'szjj_hander_ctmvdl':  // 补领行驶证
            this.$router.push('/replaceCredentials/repairDrivingLicense')
            break
          case 'szjj_hander_cvi':  // 六年免检预约
            this.$router.push('/esemptionCar')
            break
          case 'szjj_hander_rim':  // 补换检验合格标志
            this.$router.push('/replaceCredentials/replaceQualifiedMark')
            break
          case 'szjj_hander_id':  // 机动车异地定期检验申报
            this.$router.push('/placeExamineCar')
            break
          case 'szjj_hander_rmvp':  // 补领机动车号牌
            this.$router.push('/replaceCredentials/replaceLicencePlate')
            break
          case 'szjj_hander_icr':  // 换领机动车行驶证
            this.$router.push('/replaceCredentials/exchangeDrivingLicense')
            break
          case 'szjj_hander_iccc':  // 机动车变更联系方式
            this.$router.push('/motorAlteration')
            break
          case 'jszbzhz':  // 驾驶证补证换证
            this.$router.push('/changeCard')
            break
          case 'jszyqhz':  // 驾驶证延期换证
            this.$router.push('/changeCard/id/2')
            break
          case 'jszns':  // 驾驶证年审
            this.$router.push('/annualExaminations')
            break
          case 'jszzr':  // 驾驶证转入
            this.$router.push('/intoCard')
            break
          case 'jszzyjj':  // 驾驶证自愿降级
            this.$router.push('/degradeCard')
            break
          case 'jsrlxfsbg':  // 驾驶人联系方式变更
            this.$router.push('/changeConnect')
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
  }
}
</script>
<style lang="less">
  @import '../assets/style/userAgreement';
</style>
