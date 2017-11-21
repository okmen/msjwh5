<!--
  日期选择器组件
  @date: 2017-07-19
  @author: zhanshancheng
  父组件传递传递的数据:date 对象、carNum 车牌号

  返回选中日期的数组arrTime

-->
<template>
  <div>
    <div class="dp" v-show="show">
      <div class="dp-carNum">
        <span>{{ carInfo.hphm }}</span>
        <em>（当前已申报天数: {{ showZts }}天）</em>
      </div>
      <div class="dp-header">
        <!--<a class="dp-h-1" @click="pickYear(-1)">«</a>-->
        <a class="dp-h-2" @click="pickMonth(-1)">
          <上个月</a>
            <span class="dp-ym">{{y}}年 {{m}}月</span>
            <a class="dp-h-3" @click="pickMonth(1)">下个月></a>
            <!--<a class="dp-h-4" @click="pickYear(1)">»</a>-->
      </div>
      <table class="dp-table">
        <thead>
          <tr>
            <th v-for="day in days"><span>{{day}}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cell in data">
            <td v-for="item in cell" :class="{'dp-last': m!== item.month, 'dp-overdue': item.state.act === 0 || (item.state.act === 1 && item.state.state === '8' ), 'dp-select': isSelectClass(getDateState(item.data)), 'dp-yellow': isYellow(item.state), 'dp-red': item.state.state === '3' }">
              <div @click="pickDays(item.state)" class="box-out">
                <div class="box-int">
                  <span>{{ item.day }}</span>
                  <span v-show="item.state.act !== 0 || item.state.state === '2' || item.state.state === '3'" v-html="item.state.text"></span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="dp-popupBox" v-if="operation.state">
      <ul class="dp-popup">
        <template v-for="item in operation.data">
          <li>操作人姓名：{{ item.czr }}</li>
          <li>操作时间：{{ item.czsj }}</li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import moment from 'moment'
import { resultPost } from 'src/service/getData'
import { getGreenDays } from 'src/config/baseUrl.js'
export default {
  name: 'vueCalendar',
  props: ['date', 'carNum', 'selectedDate', 'loadDateArr', 'carInfo', 'zts'],
  data () {
    let days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    let d = ''
    let sel = ''
    let len = ('' + this.date).length
    if (!this.date || (len !== 13 && len !== 10)) {
      d = new Date()
    } else {
      d = len === 13 ? new Date(parseInt(this.date)) : new Date(this.date * 1000)
    }
    if (Object.prototype.toString.call(d) === '[object Date]') {
      if (isNaN(d.getTime())) {
        d = new Date()
      } else {
        sel = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      }
    } else {
      d = new Date()
    }
    if (!this.date) {
      sel = ''
    }
    let y = d.getFullYear()
    let m = d.getMonth() + 1
    let data = []
    return {
      days,
      cur: moment(new Date()).format('YYYYMMDD'), // 当前日期
      nDay: moment(new Date()).add(2, 'days').format('YYYYMMDD'), // 当前最大不可选日期
      sel,
      y,
      m,
      data,
      arrTime: [],
      arrCancel: [],
      show: true,
      operation: {
        data: [],
        state: false
      },
      defaultData: {
        act: '-1',
        text: '',
        state: '9',
        isSelect: false,
        isYellow: false,
        cdate: ''
      }
    }
  },
  computed: {
    showZts () {
      return +this.zts + +this.arrTime.length - +this.arrCancel.length
    }
  },
  created () {
    this.data = this.getCalendar(this.y, this.m)
  },
  watch: {
    loadDateArr: function () {
      this.data = this.getCalendar(this.y, this.m)
    }
  },
  methods: {
    getDateState (date) {
      // 默认返回数据
      let defaultData = this.defaultData
      if (this.loadDateArr.length === 0) {
        return defaultData
      } else if (date) {
        let theDate = moment(date).format('YYYYMMDD') // 格式化当前的日期
        // 日期状态
        let state = this.loadDateArr.find((key) => {
          return key.cdate === theDate
        })
        // 如果日期不存在，返回一个假数据
        if (!state) {
          return defaultData
        }
        state.text = {
          '0': '绿色<br>出行',
          '1': '绿色</br>出行',
          '2': '已</br>履诺',
          '3': '未</br>履诺',
          '4': '',
          '5': '',
          '6': '',
          '7': '绿色</br>出行',
          '8': '',
          '9': ''
        }[state.state]
        // 设置日期选择状态
        if (+theDate < +this.cur) {
          state.act = 0
        } else if (+theDate >= this.cur && theDate <= this.nDay) {
          state.act = 1
          // 取消状态
          if (+theDate > this.cur) {
            let isCancel = this.arrCancel.indexOf(theDate)
            if (state.state === '7' && isCancel >= 0) {
              state.text = ''
            }
          }
        } else {
          state.act = 2
          // 选择状态
          let isSelect = this.arrTime.indexOf(theDate)
          if (state.state === '0' && isSelect < 0) {
            state.text = ''
          }
          // 取消状态
          let isCancel = this.arrCancel.indexOf(theDate)
          if (state.state === '1' && isCancel >= 0) {
            state.text = ''
          }
        }
        return state
      } else {
        return defaultData
      }
    },
    pickDays (date) {
      console.log(date)
      if (date.state === '7' && +date.cdate > +this.cur) {
        console.log('点击日期', +date.cdate)
        console.log('当前日期', +this.cur)
        console.log('日期已过期，但是可以取消申请')
        // 如果日期已选择则删除日期
        let arrInd = this.arrCancel.indexOf(date.cdate)
        if (arrInd >= 0) {
          this.arrCancel.splice(arrInd, 1)
        // 如果日期未选择则添加日期
        } else {
          this.arrCancel.push(date.cdate)
        }
      }
      if (date.act === 0 && date.state !== '2' && date.state !== '3' || date.state === '8') {
        Toast({
          message: '该时间段不能选择',
          position: 'middle',
          duration: 2000
        })
        return false
      } else if (date.state === '2' || date.state === '3') {
        resultPost(getGreenDays, {
          hphm: this.carInfo.hphm,
          hpzl: this.carInfo.hpzl,
          sqrq: date.cdate
        }).then(data => {
          console.log(data)
          if (data.code === '0000') {
            let item = data.date.rec
            if (!isArray(item)) {
              item = [item]
            }
            this.operation = {
              data: item,
              state: true
            }
            window.setTimeout(() => {
              this.operation.state = false
            }, 2000)
          }
          function isArray (o) {
            return Object.prototype.toString.call(o) === '[object Array]'
          }
        })
        return false
      } else if (date.act === 2) {
        // 如果日期是可申请的
        if (date.state === '0') {
          // 如果日期已选择则删除日期
          let arrInd = this.arrTime.indexOf(date.cdate)
          if (arrInd >= 0) {
            this.arrTime.splice(arrInd, 1)
          // 如果日期未选择则添加日期
          } else {
            this.arrTime.push(date.cdate)
          }
        // 如果日期是已申请
        } else if (date.state === '1') {
          // 如果日期已选择则删除日期
          let arrInd = this.arrCancel.indexOf(date.cdate)
          if (arrInd >= 0) {
            this.arrCancel.splice(arrInd, 1)
          // 如果日期未选择则添加日期
          } else {
            this.arrCancel.push(date.cdate)
          }
        } else {
          return false
        }
      }
      this.$emit('arrTime', this.arrTime, this.arrCancel)
    },
    isYellow (date) {
      let item = date
      if (item.act === 0 && (item.state === '2' || item.state === '3')) {
        return true
      }
      if (item.act === 1 && item.state !== '8' && item.state !== '7') {
        return true
      } else if (item.state === '7' && item.cdate === this.cur) {
        return true
      } else if (item.act === 2 && (item.state === '2' || item.state === '3')) {
        return true
      }
    },
    isSelectClass (date) {
      let item = date
      // 如果在选择列表则添加Class
      if (this.arrTime.indexOf(item.cdate) >= 0) {
        return true
      }
      // 如果在取消列表则删除Class
      if (this.arrCancel.indexOf(item.cdate) >= 0) {
        return false
      }
      // 如果状态是已申请，则默认添加Class
      if (item.state === '1' && item.act === 2) {
        return true
      }
      // 如果是绿色出行，且已过期
      if (item.state === '7' && item.cdate > this.cur) {
        return true
      }
      return false
    },
    pickMonth (flag) {
      let nowM = moment(new Date())
      // let maxM = nowM.add(6, 'M')
      let minM = nowM.subtract(3, 'M')
      if (flag === -1 && nowM.subtract(1, 'M').millisecond() > minM.millisecond()) {
        console.log('最小')
      }
      if (flag === -1) {
        this.data = (this.m === 1) ? this.getCalendar(parseInt(this.y--), this.m = 12) : this.getCalendar(parseInt(this.y), parseInt(this.m += flag))
      } else {
        this.data = (this.m === 12) ? this.getCalendar(parseInt(this.y++), this.m = 1) : this.getCalendar(parseInt(this.y), parseInt(this.m += flag))
      }
      this.$emit('skipDate', this.m >= 10 ? `${this.y}${this.m}` : `${this.y}0${this.m}`)
    },
    pickYear (flag) {
      this.data = this.getCalendar(parseInt(this.y += flag), parseInt(this.m))
    },
    getCalendar (y, m) {
      console.log(y, m)
      y = parseInt(y)
      m = parseInt(m)
      let time = new Date(y, m - 1, 1)
      let lastDate
      let nextDate
      let lastMonth = m - 1 // 上个月
      let nextMonth = m + 1 // 下个月
      if (m === 1) {
        lastDate = `${y - 1}-12-`
        nextDate = `${y}-2-`
        lastMonth = 12
      } else if (m === 12) {
        lastDate = `${y}-11-`
        nextDate = `${y + 1}-1-`
        nextMonth = 1
      } else {
        lastDate = `${y}-${m - 1}-`
        nextDate = `${y}-${m + 1}-`
      }
      console.log('lastDate', lastDate)
      console.log('nextDate', nextDate)
      console.log('lastMonth', lastMonth)
      console.log('nextMonth', nextMonth)
      let maxNumber = 35
      let r1 = []
      let r2 = []
      let r3 = []
      let lastFix = time.getDay() - 1 // 月份1号星期几
      lastFix = lastFix < 0 ? lastFix + 7 : lastFix
      let lastMaxDate = new Date(y, m - 1, 0).getDate() // 上个月份最大天数
      let maxDate = new Date(y, m, 0).getDate() // 当前月份的最大天数
      let i
      let t
      let nextFix = maxNumber - maxDate - lastFix

      for (i = 0; i < lastFix; i++) { // 上个月份
        t = lastMaxDate - lastFix + i + 1
        r1[i] = {
          state: this.defaultData
          // month: lastMonth,
          // day: t,
          // data: lastDate + t
        }
      }
      for (i = 0; i < maxDate; i++) { // 当前月份的
        t = i + 1
        let nm = m < 10 ? '0' + m : m
        let nt = t < 10 ? '0' + t : t
        let state = this.getDateState(`${y}-${nm}-${nt}`)
        r2[i] = {
          month: nm,
          day: nt,
          data: `${y}-${nm}-${nt}`,
          state: state
        }
      }
      for (i = 0; i < nextFix; i++) { // 下个月份的
        t = i + 1
        r3[i] = {
          state: this.defaultData
          // month: nextMonth,
          // day: t,
          // data: nextDate + t
        }
      }
      let result = r1.concat(r2, r3)
      let ar = []
      for (i = 0; i <= 5; i++) {
        ar.push(result.splice(0, 7))
      }
      return ar
    }
  }
}
</script>
<style lang="less">
.dp {
  margin-top: 5px;
  padding-bottom: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.17);
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  z-index: 10;
  font-size: 16px;
  color: #666;
}

.dp-table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}

.dp-table th {
  padding: .5rem 0;
  border: 0;
}

.dp-table td {
  padding: 4px 0;
  line-height: 18px;
  border: 0;
}

.dp-table th span {
  display: block;
  font-weight: normal;
}

.dp-table td .box-out{
  width: 70px;
  height: 70px;
  border: 1px solid transparent;
  margin: 0 auto;
  transition: background 0.3s ease;
  border-radius: 4px;
  padding: 0;
  box-sizing: border-box;
  position: relative;
}

.dp-table td .box-out .box-int{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.dp-table td .box-out span{
  display: block;
  width: 50px;
  line-height: 22px;
}

.dp-table td .box-out:hover {
  cursor: pointer;
}

.dp-table .dp-last .box-out {
  color: #ccc;
}

.dp-table .dp-today .box-out {
  border-color: #2db7f5;
  font-weight: bold;
  color: #2db7f5;
}

.dp-table .dp-select .box-out {
  background: #00be00;
  color: #fff !important;
  border: 1px solid transparent;
}

.dp-table .dp-yellow .box-out {
  background: #f1dd33 !important;
  color: #fff !important;
  border: 1px solid transparent;
}
.dp-table .dp-red .box-out {
  background: #900 !important;
  color: #fff !important;
  border: 1px solid transparent;
}
.dp-table .dp-red .box-out span{ color: #fff; }
.dp-table .dp-select .box-out span{
  color: #fff !important;
}
.dp-table .dp-overdue .box-out {
  background: #d7d7d7;
  color: #333;
  border: 1px solid transparent;
}
.dp-table .box-out span{ color: #333; }
.dp-header {
  position: relative;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  border-bottom: 1px solid #e9e9e9;
}

.dp-header .dp-ym {
  font-weight: bold;
}

.dp-header a {
  color: #999;
  height: 2rem;
  line-height: 2rem;
  font-size: 16px;
  display: inline-block;
  padding: 0 5px;
  position: absolute;
}

.dp-header a:hover {
  color: #2db7f5;
  cursor: pointer;
}

.dp-header .dp-h-1 {
  left: 7px;
}

.dp-header .dp-h-2 {
  left: 29px;
}

.dp-header .dp-h-3 {
  right: 29px;
}

.dp-header .dp-h-4 {
  right: 7px;
}

.dp-footer {
  height: 34px;
  border-top: 1px solid #e9e9e9;
  text-align: center;
  position: relative;
}

.dp-footer a {
  display: inline-block;
  line-height: 34px;
  height: 34px;
  cursor: pointer;
}

.dp-footer span {
  position: absolute;
  right: 16px;
  top: 7px;
}

.dp .btn {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  white-space: nowrap;
  line-height: 1.5;
  padding: 1px 6px;
  font-size: 12px;
  border-radius: 6px;
  background-color: #2db7f5;
  outline: 0;
  opacity: 1;
  color: #fff;
}
.dp-carNum{
  border-bottom: 1px solid #D9D9D9;
  line-height: 75px;
  font-size: 32px;
  padding: 0 10px;
}
.dp-carNum span{
  color: #00be00;
  text-indent: 24px;
}
.dp-carNum em{
  color: #999;
  font-style: normal;
}
.dp-popupBox{
  position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; align-items: center;
}
.dp-popup{
  width: 60%; background: rgba(0, 0, 0, .8); color: #fff;
  padding: 20px; box-sizing: border-box; border-radius: 5px;
  line-height: 50px;
}
.dp-popup li{ color: #fff; }
</style>
