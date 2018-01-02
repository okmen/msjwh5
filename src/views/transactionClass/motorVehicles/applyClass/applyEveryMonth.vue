<template>
  <div class="applyEveryMonth">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" value="每月1天通行证业务申请" disabled></g-input>
    </div>
    <g-select title="车牌类型" :data="plateSelectData" v-model="plateSelect"></g-select>
    <g-select title="车牌类型" :data="licenseSelectData" v-model="licenseSelect"></g-select>
    <g-input title="车架号" v-model="vehicleIdentifyNoLast" placeholder="请输入车架号后四位"></g-input>
    <g-input title="车主姓名" v-model="name" placeholder="请按行驶证填写"></g-input>
    <g-input title="手机号码" v-model="mobilephone" placeholder="请填写手机号码"></g-input>
    <g-date-picker title="申请日期" v-model="effectiveDate"></g-date-picker>
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
import {GInput, GSelect, GButton, GSelectOne, GRadio, Group, GUpload, GDatePicker} from 'form'
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
      effectiveDate: this.formatDate(new Date())
    }
  },
  components: {
    GInput,
    GSelect,
    GSelectOne,
    GButton,
    GRadio,
    Group,
    GUpload,
    GDatePicker
  },
  computed: {
    licenseSelectData () {
      return this.$store.state.cartype
    }
  },
  methods: {
    // 日期格式化
    formatDate: (date, addYear) => {
      var y = !addYear ? date.getFullYear() : date.getFullYear() + addYear
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
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
