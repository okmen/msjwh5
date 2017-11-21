<template>
  <div id="takePhotoTipsCom">
    <h1 class="tp-title">什么是首违免罚</h1>
    <div class="tp-tips-intro">
      <p>
       深圳经济特区道路交通安全违法行为处罚条例》第三十五条规定，同时具备六种条件的机动车所有人可以
       申请免除一次道路交通安全违法行为的罚款、扣分，交警部门可以给予警告处罚。（简称“首违免罚”）。
      </p>
      <p class="tp-two-title">一、“首违免罚”需同时具备的6种条件</p>
      <p>(一)2015年1月1日以后，在深圳辖区范围内发生的道路交通安全违法行为;</p>
      <p>(二)深圳市注册的机动车的所有人;</p>
      <p>(三)该违法行为未造成交通事故;</p>
      <p>(四)该违法行为发生之日前二十四个月内该机动车在本市无道路交通安全违法行为记录;</p>
      <p>(五)该违法行为仅被处以罚款处罚，且数额在五百元(含)以下;</p>
      <p>(六)机动车注册或者变更登记后已满二十四个月。</p>
      <p class="tp-two-title">二、申请“首违免罚”的办理途径</p>
      <p>符合申请条件的申请人携带上述材料前往需要申请“首违免罚”违法记录所对应执法单位所属的交通违法处理窗口提出“首违免罚”的申请，填写《“首违免罚”申请表》。收到申请的交警部门执法单位按照规定的审核流程及时限办理。</p>
      <p class="tp-two-title">三、申请“首违免罚”所需提交的材料</p>
      <p>(一)深圳市注册的机动车行驶证原件及复印件;</p>
      <p>(二)机动车所有人为个人的：携带所有人的身份证原件及复印件。经办人不是机动车所有人的，应当同时提交机动车所有人的委托办理该业务的委托书，经办人的身份证原件及复印件，机动车所有人的身份证原件及复印件;</p>
      <p>(三)机动车所有人为单位的：持单位委托书，单位组织机构代码证、经办人的身份证原件及复印件。</p>
    </div>
    <div class="tp-read">
       <div class="tp-read-checkbox">
         <input type="checkbox" id="informReadCheckbox" name="informReadCheckbox" v-model="checked">
         <label for="informReadCheckbox"></label>
       </div>
       <span class="read-and-agree">
         我已认真阅读以上内容，并愿意承担相关法律责任。
       </span>
    </div>
    <div class="tp-btn-sure">
       <button @click="btnReturn">返回</button>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  name: 'freeAbstract',
  data () {
    return {
      checked: ''
    }
  },
  computed: {
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  components: {
    'pageBottom': require('../../../../../components/pageBottom.vue')
  },
  methods: {
    btnReturn: function () {
      if (this.checked === true) {
        this.$router.go(-1)
      } else {
        Toast({
          message: '请勾选已阅读温馨提示',
          duration: 1500
        })
      }
    }
  }
}
</script>

<style lang="less">
  @import '../../../../../style/userAgreement';
</style>
