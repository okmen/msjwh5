<template>
  <div class="g-date-picker" :class="{timeSelect: pickerType}">
    <div class="g-date-picker-title" v-if="title">{{title}}</div>
    <input class="g-date-picker-value" readonly @click.stop="openPick" v-model="currentDate">
    <mt-datetime-picker v-if="pickerType" ref="picker" v-model="timePickerVisible" type="time" @confirm="timeHandleConfirm"></mt-datetime-picker>
    <mt-datetime-picker v-if="!pickerType" ref="picker" v-model="pickerVisible" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
</template>

<script>
import {DatetimePicker} from 'mint-ui'
export default {
  name: 'GDatePicker',
  data () {
    return {
      pickerVisible: new Date(),
      timePickerVisible: '',
      pickerType: false
    }
  },
  props: {
    title: String,
    value: [String, Number],
    timeSelect: Boolean
  },
  components: {
    'mt-datetime-picker': DatetimePicker
  },
  created () {
    if (this.timeSelect) {
      this.pickerType = true
    }
  },
  mounted () {
    this.currentDate = this.value
    // this.pickerVisible = this.value
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
      if (this.timeSelect) {
        this.timePickerVisible = this.value
      } else {
        this.pickerVisible = this.value
      }
    },
    handleConfirm (value) {
      this.currentDate = this.formatDate(value)
    },
    timeHandleConfirm (value) {
      this.currentDate = value
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
  .g-date-picker{
    display: flex;
    padding:10px 40px;
    box-sizing: border-box;
    align-items: center;
    flex-wrap: wrap;
    .g-date-picker-title {
      margin-bottom: 20px;
    }
    .g-date-picker-value {
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
  .timeSelect {
    .g-date-picker-title {
      width: 30%;
    }
    .g-date-picker-value {
      flex: 1;
    }
  }
</style>
