<template>
  <div class="m-greenApplyDate">
    <div class="calendar">
      <vue-calendar
        :date="time"
        :carNum="carNum"
        :loadDateArr="loadDateArr"
        :carInfo="carInfo"
        :zts="zts"
        v-on:arrTime="handleArrTime"
        v-on:skipDate="handleSkipDate"
        :selectedDate="selectedDate"
        v-if="showCalendar"
      ></vue-calendar>
    </div>
    <ul class="list">
      <li><span class="white"></span>白色表示可申报停驶日期</li>
      <li><span class="green"></span>绿色表示申报停驶日期</li>
      <li><span class="gray"></span>灰色表示节假日或已过期日期，不可进行申报停驶</li>
      <li><span class="yellow"></span>黄色表示申报停驶日期已过期</li>
      <li><span class="red"></span>红色表示申报停驶日期未履诺</li>
    </ul>
    <div class="info">
      <p>温馨提示：</p>
      <p>可自主选择当日起2天后的日期为停驶日，天数不限。遇特殊情况需要恢复出行，需要提前1天选择已申报绿色出行日期，申报提交恢复出行。</p>
    </div>
    <g-button text="提交" noMargin="true" @click.native="handleConfirm"></g-button>
    <div class="m-confirm" :class="{ open: confirmState }">
      <div class="box">
        <div class="title">温馨提示</div>
        <div class="text">您是否确认提交？</div>
        <div class="footer">
          <div class="ok" @click="submit">是的</div>
          <div class="cancel" @click="confirmState = false">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Button } from 'element-ui'
import calendar from '@/components/calendar'
import moment from 'moment'
// import { Toast } from 'mint-ui'
import { getGreenApply, postGreenApply } from '@/config/baseURL'
export default {
  components: {
    'vue-calendar': calendar
  },
  data () {
    return {
      carInfo: {
        hphm: this.$store.state.greenApply.car,
        hpzl: this.$store.state.greenApply.type
      },
      zts: 0,
      cardBagData: '',
      time: new Date().getTime(),
      carNum: null,
      selectedDate: [],
      loadDateArr: [],
      loadDateMonthArr: [],
      selectArrTime: [],
      selectArrTimeType: [],
      confirmState: false,
      showCalendar: false
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  created () {
    if (!this.$store.state.greenApply) {
      console.log('没有接收到数据，回到信息输入页面')
      this.$router.push({ name: 'greenApply', query: this.queryURL })
    } else {
      console.log('接收VUEX传递过来的数据')
      console.log(this.$store.state.greenApply)
      this.carNum = this.$store.state.greenApply.car
      this.getDate(moment(new Date()).format('YYYYMM'))
    }
  },
  methods: {
    // 选择申报日期
    handleArrTime (data, data2) {
      let Arr = data.concat(data2)
      this.selectArrTime = Arr.map((item) => {
        return moment(item).format('YYYYMMDD')
      })
      let typeArr = []
      data.forEach(key => {
        typeArr.push('1')
      })
      data2.forEach(key => {
        typeArr.push('0')
      })
      this.selectArrTimeType = typeArr
    },
    // 切换月份
    handleSkipDate (date) {
      console.log(date, '切换月份')
      // 如果当前月份没有数据，则拉取数据
      if (this.loadDateMonthArr.indexOf(date) < 0) {
        this.getDate(date)
      }
    },
    // 获取数据
    getDate (month) {
      let greenApply = this.$store.state.greenApply
      let requestData = {
        hphm: greenApply.car,
        hpzl: greenApply.type,
        sfzmhm: greenApply.IdCard,
        month: month
      }
      this.$axios.get(`${getGreenApply}?hphm=${requestData.hphm}&hpzl=${requestData.hpzl}&sfzmhm=${requestData.sfzmhm}&month=${requestData.month}`).then(data => {
        console.log(data.date)
        if (data.date) {
          this.loadDateArr.push(...data.date.ret)
        }
        this.loadDateMonthArr.push(month)
        this.zts = +data.zts
        this.showCalendar = true
      }).catch(error => {
        console.log(error)
        this.$toast({
          message: '日期不可用',
          position: 'middle'
        })
      })
    },
    // 提交
    handleConfirm () {
      if (this.selectArrTime.length === 0) {
        this.$toast({
          message: '没有选择日期',
          position: 'middle'
        })
        return false
      }
      this.confirmState = true
    },
    // 提交
    submit () {
      let greenApply = this.$store.state.greenApply
      let requestData = {
        sname: greenApply.name,
        sfzmhm: greenApply.IdCard,
        mobile: greenApply.tel,
        hphm: greenApply.car,
        hpzl: greenApply.type,
        sfbr: greenApply.isMySelf,
        lrly: 'WX',
        cdate: this.selectArrTime.join(),
        type: this.selectArrTimeType.join(),
        zts: this.zts
      }
      this.$axios.post(postGreenApply, requestData).then(data => {
        console.log(data)
        if (data.code === '0000') {
          this.$store.commit('saveSuccessInfo', {
            type: 3,
            businessType: '绿色出行',
            numberPlate: data.date.numberPlate,
            reserveNumber: data.date.reserveNumber,
            cryearNo: data.cryearNo
          })
          this.$router.push({path: '/submitSuccess', query: this.queryURL})
        } else {
          this.$toast({
            message: data.msg,
            position: 'bottom'
          })
        }
      })
    }
  },
  // 离开组件的时候的注销 greenApply 状态
  destroyed () {
    this.$store.unregisterModule('greenApply')
  }
}
</script>

<style lang="less">
@import 'style/greenTravel.less';
</style>
