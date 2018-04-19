<!-- 驾驶证违法查询 -->
<template>
  <div class="newqueryByCard">
    <g-input class="newqueryByCard-top" title="驾驶证号" v-model="drivingLicenceNo" placeholder="请输入驾驶证号"></g-input>
    <g-input title="档案编号" v-model="fileNumber" placeholder="请输入档案编号"></g-input>
    <g-input title="手机号码" v-model="mobilePhone" placeholder="请输入手机号码"></g-input>
    <Verify title="验证码" v-model="verifyCode" ref="callVerifyByCode"></Verify>
    <g-button text="查询" @click.native="newqueryByCard"></g-button>
  </div>
</template>

<script>
import Verify from '@/components/Verify'
import { GInput, GButton } from 'form'
import beforeSubmit from '@/mixins/beforeSubmit'
import { queryLawlessByCard } from '@/config/baseURL'
export default {
  name: 'newqueryByCard',
  data () {
    return {
      drivingLicenceNo: '',
      fileNumber: '',
      mobilePhone: '',
      verifyCode: '' // 验证码
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  components: {
    GInput, GButton, Verify
  },
  mixins: [beforeSubmit],
  mounted () {
    // 获取初始化数据
    this.drivingLicenceNo = this.$store.state.user.identityCard || ''
    this.fileNumber = this.$store.state.user.fileNumber || ''
    this.mobilePhone = this.$store.state.user.mobilePhone || ''
  },
  methods: {
    newqueryByCard () {
      let obj = {
        drivingLicenceNo: '请输入驾驶证号',
        fileNumber: '请输入档案编号',
        mobilePhone: '请输入手机号码'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.isPhone(this.mobilePhone)) return
      if (!this.$refs.callVerifyByCode.checkCode()) return
      let newqueryByCardData = {
        drivingLicenceNo: this.drivingLicenceNo,
        recordNo: this.fileNumber,
        identityCard: this.drivingLicenceNo,
        sourceOfCertification: 'M',
        mobilephone: this.mobilePhone
      }
      this.$axios.post(queryLawlessByCard, newqueryByCardData).then(json => {
        if (json.code === '0000') {
          if (!json.data) {
            this.$toast(json.msg)
            return false
          }
          let lawlessData = {
            info: {},
            data: json.data
          }
          this.$store.commit('saveNewLawlessQuery', lawlessData)
          // this.$router.push('newLawlessMsg')
          this.$router.push({path: '/newLawlessMsg', query: this.queryURL})
        } else {
          this.$toast(json.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .newqueryByCard{
    .newqueryByCard-top {
      margin-top: 30px;
    }
  }
</style>
