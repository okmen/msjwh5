<template>
  <div class="g-time-picker">
    <div class="g-time-picker-title" v-if="title">{{title}}</div>
    <input class="g-time-picker-value" readonly @click.stop="openPick" v-model="currentDate">
    <mt-datetime-picker ref="picker" :startDate='startDate' :endDate= 'endDate' type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
</template>

<script>
import moment from 'moment'
import {DatetimePicker} from 'mint-ui'
export default {
  name: 'GTimePicker',
  data () {
    return {
      startDate: new Date(moment().add(1, 'days')),   // 开始时间
      endDate: new Date(moment().add(1, 'months').endOf('month'))
    }
  },
  props: {
    title: '',
    value: ''
  },
  components: {
    'mt-datetime-picker': DatetimePicker
  },
  mounted () {
    this.currentDate = this.value
  },
  computed: {
    currentDate: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    openPick () {
      this.$refs.picker.open()
    },
    handleConfirm (value) {
      this.currentDate = this.formatDate(value)
    },
    // 日期格式化
    formatDate: (date) => {
      var y = date.getFullYear()
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
  .g-time-picker{
    display: flex;
    padding:10px 40px;
    box-sizing: border-box;
    align-items: center;
    .g-time-picker-title {
      width: 43%;
    }
    .g-time-picker-value {
      width: 100%;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      height: 56px;
      font-size: 30px;
      line-height: 56px;
      padding-left: 20px;
      position: relative;
      background: white url("../../assets/images/select1.png") 95% center/22px 13px no-repeat;
      span{
        display: block;
        width: 90%;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
