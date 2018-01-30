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
<!--     <div class="tp-btn-sure" v-if="isShow">
      <button @click="btnAgreeRequest">确认</button>
    </div> -->
<!--     <div class="tp-btn-sure" v-else>
      <button @click="btnReturn">返回</button>
    </div> -->
    <g-button @click.native="btnAgreeRequest" text="确认信息" v-if="isShow"></g-button>
    <g-button @click.native="btnReturn" text="返回" v-else></g-button>
  </template>
   <div v-wechat-title="$route.meta.title"></div>
 </div>
</template>
<script>
import { GButton } from 'form'
import axios from '../utils/axios'
import { userAgreement } from '../config/baseURL'
import { Toast } from 'mint-ui'
import { getUserAgreement } from './../utils/utils'
export default {
  name: 'userAgreement',
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
  components: {
    GButton
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted: function () {
    this.entryHash = this.$route.params.id
    if (this.entryHash === 'wfsspjbzy' || this.entryHash === 'sspjbzysx' || this.entryHash === 'wtmf') {
      this.isShow = false
    }
    // 如果是民生警务平台，则使用本地须知
    if (this.$store.state.core.source === 'M') {
      if (this.entryHash === 'xszbz' || this.entryHash === 'xszhz') {
        this.entryHash = 'xszbzhz'
      }
      let agreenentData = getUserAgreement(this.entryHash)
      this.getNoticeTitle = agreenentData.title
      this.userAgreementCon = agreenentData.text
      if (this.entryHash === 'jszbz' || this.entryHash === 'jszhz') {
        this.entryHash = 'jszbzhz'
      }
    } else {
      if (this.entryHash === 'jszbz' || this.entryHash === 'jszhz') {
        this.entryHash = 'jszbzhz'
      }
      if (this.entryHash === 'xszbz' || this.entryHash === 'xszhz') {
        this.entryHash = 'xszbzhz'
      }
      let userAgreementData = {
        noticeKey: this.entryHash
      }
      console.log(userAgreement, userAgreementData)
      axios.post(userAgreement, userAgreementData).then(json => {
        this.getNoticeTitle = json.data.title
        this.userAgreementCon = json.data.content
      })
    }
  },
  methods: {
    btnAgreeRequest: function () {
      if (this.checked === true) {
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
          case 'szjj_hander_cvi':  // 六年免检预约
            this.$router.push({ path: '/esemptionCar', query: this.queryURL })
            break
          case 'szjj_hander_rim':  // 补换检验合格标志
            // this.$router.push('/replaceQualifiedMark')
            this.$router.push({ path: '/replaceQualifiedMark', query: this.queryURL })
            break
          case 'szjj_hander_id':  // 机动车异地定期检验申报
            // this.$router.push('/placeExamineCar')
            this.$router.push({ path: '/placeExamineCar', query: this.queryURL })
            break
          case 'szjj_hander_rmvp':  // 补领机动车号牌
            // this.$router.push('/replaceCredentials/replaceLicencePlate')
            this.$router.push({ path: '/replaceLicencePlate', query: this.queryURL })
            break
          case 'xszbzhz':  // 行驶证补证换证
            if (this.$route.params.id === 'xszbz') {
              this.$router.push({ path: '/repairDrivingLicense', query: this.queryURL })
            }
            if (this.$route.params.id === 'xszhz') {
              this.$router.push({ path: '/exchangeDrivingLicense', query: this.queryURL })
            }
            break
          case 'szjj_hander_iccc':  // 机动车变更联系方式
            this.$router.push({ path: '/motorAlteration', query: this.queryURL })
            break
          case 'jdcgrdyjydj':  // 机动车个人抵押解押登记
            this.$router.push({ path: '/mortgageBusiness', query: this.queryURL })
            break
          case 'jszbzhz':  // 驾驶证补证换证
            let urlId
            if (this.$route.params.id === 'jszbz') {
              urlId = '1'
            }
            if (this.$route.params.id === 'jszhz') {
              urlId = '2'
            }
            this.$router.push({ path: `/changeCard/${urlId}`, query: this.queryURL })
            break
          case 'jszyqhz':  // 驾驶证延期换证
            this.$router.push({ path: '/postponeChangeCard', query: this.queryURL })
            break
          case 'jszns':  // 驾驶证年审
            // this.$router.push('/annualExaminations')
            this.$router.push({ path: '/annualExaminations', query: this.queryURL })
            break
          case 'jszzr':  // 驾驶证转入
            this.$router.push({ path: '/intoCard', query: this.queryURL })
            break
          case 'jszzyjj':  // 驾驶证自愿降级
            this.$router.push({ path: '/degradeCard', query: this.queryURL })
            break
          case 'jsrlxfsbg':  // 驾驶人联系方式变更
            this.$router.push({ path: '/changeConnect', query: this.queryURL })
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
<style lang="less" scoped>
  @import '../assets/style/userAgreement';
</style>
