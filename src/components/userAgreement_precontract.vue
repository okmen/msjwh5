<template>
 <div id="takePhotoTipsCom">
    <div class="tp-title">
      {{getNoticeTitle}}
    </div>
   <div class="tp-tips-intro" v-html="getUserAgreementCon"></div>
   <div class="tp-read">
     <div class="tp-read-checkbox">
       <input type="checkbox" id="informReadCheckbox" name="informReadCheckbox" v-model="checked">
       <label for="informReadCheckbox"></label>
     </div>
     <span class="read-and-agree">
       我已认真阅读以上内容，并愿意承担相关法律责任。
     </span>
   </div>
<!--    <div class="tp-btn-sure" v-if="isShow">
     <button @click="btnAgreeRequest">确认</button>
   </div>
   <div class="tp-btn-sure" v-else>
     <button @click="btnReturn">返回</button>
   </div> -->
    <g-button @click.native="btnAgreeRequest" text="确认信息" v-if="isShow"></g-button>
    <g-button @click.native="btnReturn" text="返回" v-else></g-button>
 </div>
</template>
<script>
import { GButton } from 'form'
import { getBusinessTypes } from '../config/baseURL'
import { Toast } from 'mint-ui'
export default {
  name: 'userAgreement',
  computed: {
    getUserAgreementCon: function () {
      return this.userAgreementCon.replace(/href=".*?"/gi, '')
    }
  },
  data () {
    return {
      userAgreementCon: '',
      getNoticeTitle: '',
      checked: '',
      entryHash: '',
      isShow: true,
      menuJson: {},
      routerQuery: '',
      positionBottom: false
    }
  },
  components: {
    GButton
  },
  mounted: function () {
    if (JSON.stringify(this.$route.query) !== '{}') {
      this.routerQuery = this.$route.query
      this.routerQuery.type === 'card' ? this.getData(0) : this.getData(1)
    }
    this.$nextTick(function () {
      this.positionBottom = document.getElementById('app').offsetHeight >= document.getElementById('takePhotoTipsCom').offsetHeight
    })
  },
  methods: {
    getData: function (type) {
      let code = this.routerQuery.codeName
      if (type === 0 && window.sessionStorage.card) {
        let cards = JSON.parse(window.sessionStorage.card)
        for (let i = 0; i < cards.length; i++) {
          if (cards[i].code === code) {
            this.menuJson = cards[i]
            this.userAgreementCon = this.menuJson.description
            this.getNoticeTitle = this.menuJson.name
            return this.getNoticeTitle
          }
        }
      } else if (type === 1 && window.sessionStorage.car) {
        let cars = JSON.parse(window.sessionStorage.car)
        for (let i = 0; i < cars.length; i++) {
          if (cars[i].code === code) {
            this.menuJson = cars[i]
            this.userAgreementCon = this.menuJson.description
            this.getNoticeTitle = this.menuJson.name
            return this.getNoticeTitle
          }
        }
      }
      this.$axios.post(getBusinessTypes, {type}).then(obj => {
        if (obj.code === '0000') {
          if (type === 0) {
            window.sessionStorage.setItem('card', JSON.stringify(obj.data))
          } else {
            window.sessionStorage.setItem('car', JSON.stringify(obj.data))
          }
          for (let i = 0; i < obj.data.length; i++) {
            if (obj.data[i].code === code) {
              this.menuJson = obj.data[i]
              this.userAgreementCon = this.menuJson.description
              this.getNoticeTitle = this.menuJson.name
              this.$nextTick(function () {
                this.positionBottom = document.getElementById('app').offsetHeight >= document.getElementById('takePhotoTipsCom').offsetHeight
              })
              return this.menuJson.name
            }
          }
        } else {
          Toast(obj.msg)
        }
      })
    },
    btnAgreeRequest: function () {
      if (this.checked === true) {
        let queryJson = { codeName: this.menuJson.code, id: this.menuJson.id, name: this.menuJson.name }
        switch (this.menuJson.code) {
          case 'JD06':  // 换领机动车登记证书
            this.$router.push({name: 'renewingCollarCredential', query: queryJson})
            break
          case 'JD02':  // 补领机动车号牌
            this.$router.push({name: 'replacementNumber', query: queryJson})
            break
          case 'JD01':  // 补换机动车行驶证
            this.$router.push({name: 'renewingDrivingLicense', query: queryJson})
            break
          case 'JD30':  // 换领机动车登记证书
            this.$router.push({name: 'renewingQualification', query: queryJson})
            break
          case 'JD13':  // 换领机动车登记证书
            this.$router.push({name: 'renewingCertificate', query: queryJson})
            break
          case 'ZJ11':  // 换领机动车登记证书
            this.$router.push({name: 'armyLicence', query: queryJson})
            break
          case 'ZJ16':  // 换领机动车登记证书
            // this.$router.push('/appClass/temporaryLicence')
            this.$router.push({name: 'temporaryLicence', query: queryJson})
            break
          case 'ZJ17':  // 换领机动车登记证书
            this.$router.push({name: 'overseasLicence', query: queryJson})
            break
          case 'ZJ13':  // 换领机动车登记证书
            this.$router.push({name: 'HkLicence', query: queryJson})
            break
          case 'JD15':  // 换领机动车登记证书
            this.$router.push({name: 'transferRegistration', query: queryJson})
            break
          case 'JD19':  // 换领机动车登记证书
            this.$router.push({name: 'intoRegister', query: queryJson})
            break
          case 'JD17':  // 换领机动车登记证书
            this.$router.push({name: 'enteringRegister', query: queryJson})
            break
          case 'JD18':  // 换领机动车登记证书
            this.$router.push({name: 'cancellationRegister', query: queryJson})
            break
          case 'JD36':  // 换领机动车登记证书
            this.$router.push({name: 'fakeLicensedEvidence', query: queryJson})
            break
          case 'JD35':  // 换领机动车登记证书
            this.$router.push({name: 'manWifeChange', query: queryJson})
            break
          // case 'JD01':  // 换领机动车登记证书
          //   this.$router.push({name: '/registerClass/replaceLicense', query: { code: this.menuJson.code, id: this.menuJson.id, name: this.menuJson.name }})
          //   break
          case 'JD24':  // 换领机动车登记证书
            this.$router.push({name: 'generalChangeRegister', query: queryJson})
            break
          case 'JD28':  // 机动车打刻原车发动机号变更备案
            this.$router.push({name: 'numberAlter', query: queryJson})
            break
          case 'JD29':  // 机动车打刻原车辆识别代号变更备案
            this.$router.push({name: 'markAlter', query: queryJson})
            break
          case 'JD33':  // 档案更正
            this.$router.push({name: 'fileAlter', query: queryJson})
            break
          case 'ZJ22':  // 逾期一年以上未体检类
            this.$router.push({name: 'noPhysicalCheck', query: queryJson})
            break
          case 'ZJ21':  // 逾期一年以上未体检类
            this.$router.push({name: 'noChangeLicence', query: queryJson})
            break
          case 'ZJ10':  // 满分学习
            this.$router.push({name: 'fullmarkStudy', query: queryJson})
            break
          case 'ZJ20':  // 其他业务
            this.$router.push({name: 'otherBusiness', query: queryJson})
            break
          case 'JD34':  // 核发临牌
            this.$router.push({name: 'verifyIssueCard', query: queryJson})
            break
          case 'JD27':  // 核发校车标牌
            this.$router.push({name: 'verifyIssueSchoolCard', query: queryJson})
            break
          case 'JD38':  // 机动车委托异地年审现场办理
            this.$router.push({name: 'otherPlaceAudit', query: queryJson})
            break
          case 'JD37':  // 抵押/解押登录现场办理
            this.$router.selfPush({path: '/pledgeRegister', query: queryJson})
            break
          case 'JD41':  // 转出、注销恢复
            this.$router.push({name: 'rollOutRecover', query: queryJson})
            break
          case 'JD48':  // 转出、注销恢复
            this.$router.push({name: 'onlineCarAlter', query: queryJson})
            break
          default:
            this.$router.push('systemUpdateNoAlert')
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
  .positionBottom{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
