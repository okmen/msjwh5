<template>
  <div class="applyEveryMonth">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" value="每月1天通行证业务申请" disabled></g-input>
    </div>
    <g-select title="车牌类型" :data="plateSelectData" v-model="plateSelect"></g-select>
    <g-select title="车辆类型" :data="licenseSelectData" v-model="licenseSelect"></g-select>
    <plate-number-full v-model="plateNumber"></plate-number-full>
    <g-input title="车架号" maxlength="18" v-model="vehicleIdentifyNoLast" placeholder="请输入车架号后四位"></g-input>
    <g-input title="车主姓名" v-model="name" placeholder="请按行驶证填写"></g-input>
    <g-input title="手机号码" v-model="mobilephone" placeholder="请输入手机号码"></g-input>
    <g-time-picker title="申请日期" v-model="effectiveDate"></g-time-picker>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
    <div class="hint">
      <h4>温馨提示：</h4>
      <p>1.每月只能申请一次，且只能申请第二天及下个月的日期。</p>
      <p>2.工作日限外的时间段为（早高峰7：00至9：00，晚高峰17：30至19：30）</p>
      <p>3.法定节假日不限外，请勿申请。</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {GInput, GSelect, GButton, Group, GUpload, GTimePicker} from 'form'
import PlateNumberFull from '@/components/PlateNumberFull'
import { applyGatePass } from '@/config/baseURL'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  name: 'applyEveryMonth',
  data () {
    return {
      plateSelect: '02',         // 默认车牌类型
      plateSelectData: [
        {
          value: '02',
          name: '蓝牌'
        },
        {
          value: '01',
          name: '黄牌'
        },
        {
          value: '06',
          name: '黑牌'
        }
      ],
      licenseSelect: 'K31',
      vehicleIdentifyNoLast: '',
      name: '',
      mobilephone: '',
      plateNumber: '',
      effectiveDate: this.formatDate(new Date(moment().add(1, 'days')))
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    Group,
    GUpload,
    GTimePicker,
    PlateNumberFull
  },
  mixins: [beforeSubmit],
  computed: {
    licenseSelectData () {
      return this.$store.state.cartype
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted: function () {
    console.log(this.mtDateTimeMsg = moment().add(1, 'days').format('YYYY-MM-DD'), '6666')
  },
  methods: {
    confirmInfo () {
      let obj = {
        plateNumber: '请输入车牌号码',
        vehicleIdentifyNoLast: '请输入车架号',
        name: '请按行驶证填写',
        mobilephone: '请输入手机号码'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.plateVerification(this.plateNumber)) return
      if (this.$verification.isPhone(this.mobilephone)) return
      let dataList = {
        type: '申请通行证',
        noTip: true,
        url: applyGatePass,
        textObj: {
          'plateType': this.plateSelect,   // 车牌类型
          'cartype': this.licenseSelect, // 车辆类型
          'abbreviation': this.plateNumber.substring(0, 1), // 车牌简称
          'numberPlate': this.plateNumber.substring(1), // 车牌号码
          'behindTheFrame4Digits': this.vehicleIdentifyNoLast,    // 车架号
          'name': this.name,  // 车主姓名
          'mobilephone': this.mobilephone,  // 手机号码
          'applyDate': this.effectiveDate  // 申请时间
        },
        invisibleObj: {
          'remarks': '' // 备注
        }
      }
      console.log(dataList)
      this.$store.commit('savePassByValue', dataList)
      this.$router.push({path: '/affirmInfo', query: this.queryURL})
    },
    // 日期格式化
    formatDate: (date, addYear) => {
      var y = !addYear ? date.getFullYear() : date.getFullYear() + addYear
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      console.log(y + '-' + m + '-' + d, '88888')
      return y + '-' + m + '-' + d
    }
  }
}
</script>

<style lang="less" scoped>
  .hint {
    padding: 40px;
    h4{
      color:#e64340;
    }
    p {
      color:#666;
    }
  }
</style>
