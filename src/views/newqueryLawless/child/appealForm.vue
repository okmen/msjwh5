<!-- 
* 违法申诉 提交表单
 -->
<template>
  <div>
    <g-select title="业务类型" :data="illegalSelectData" v-model="selectInformTypeMsg"></g-select>
    <g-select-one title="深圳市" type="联系地址" :data="areaSelectData" v-model="recipientAddressRegion"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <g-input title="手机号码" v-model="mobilephone" placeholder="请输入手机号码"></g-input>
    <g-textarea title="申述内容" v-model="appealContent" placeholder="请输入申述理由"></g-textarea>
    <g-button text="提交" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
import beforeSubmit from '@/mixins/beforeSubmit'
import { illegalAppeal } from '@/config/baseURL'
import { GInput, GSelect, GButton, GUpload, Group, GSelectOne, GTextarea } from 'form'
export default {
  name: 'appealForm',
  data () {
    return {
      selectInformTypeMsg: '记录的机动车号牌信息错误的', // 申诉类型
      illegalSelectData: [
        '记录的机动车号牌信息错误的',
        '违法行为系统记录重复的',
        '有证据证明救助危难或紧急避险造成',
        '因交通信号指示不一致造成的',
        '交通技术监控设备收集的违法行为记录材料包括车辆类型、违法时间、违法地点不准确的'
      ],
      recipientAddressRegion: '福田区',  // 收件人地址区域
      recipientAddressDetail: '',        // 详细地址
      mobilephone: '',
      appealContent: ''
    }
  },
  components: {
    GInput, GSelect, GButton, GUpload, Group, GSelectOne, GTextarea
  },
  computed: {
    areaSelectData () {
      return this.$store.state.cityAreaS
    },
    lawlessData: function () {
      return this.$store.state.newLawlessDeal
    }
  },
  mounted () {
  },
  mixins: [beforeSubmit],
  methods: {
    confirmInfo () {
      let obj = {
        recipientAddressDetail: '请输入详细地址',
        mobilephone: '请输入手机号码',
        appealContent: '请输入申述理由'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.isPhone(this.mobilephone)) return
      let reqData = {
        billNo: this.lawlessData.data.billNo, // 违法书单编号
        illegalTime: this.lawlessData.data.illegalTime, // 违法时间
        illegalAddress: this.lawlessData.data.illegalAddr, // 违法地点
        illegalDesc: this.lawlessData.data.illegalDesc, // 违法行为
        punishAmount: this.lawlessData.data.punishAmt, // 罚款金额
        punishScore: this.lawlessData.data.punishScore, // 罚分
        agency: this.lawlessData.data.illegalUnit, // 执法单位
        licensePlateNo: this.lawlessData.data.licensePlateNo,
        claimant: this.$store.state.user.userName, // 申诉人姓名
        identityCard: this.$store.state.user.identityCard,  // 身份证
        claimantAddress: this.recipientAddressDetail, // 申诉联系地址
        claimantPhone: this.mobilephone, // 申人联系电话
        appealType: '1', // 申诉类型
        appealContent: this.appealContent, // 申诉内容
        userCode: ''
      }
      this.$axios.post(illegalAppeal, reqData).then(json => {
        this.$MessageBox('提示', json.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>