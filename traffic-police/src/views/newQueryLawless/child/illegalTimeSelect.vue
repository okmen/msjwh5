<template>
<div class="illegalTimeSelect-outer">
  <ul class="illegalTimeSelect-lists">
    <li class="illegalTimeSelect-item">
      <div class="illegalTimeSelect-name">
        <span>服务点</span>
      </div>
      <div class="div-select">
        <span class="btn-select" @click.stop="processClick()">{{processingPoint.cldbmmc}}</span>
        <div class="div-select-ul" v-if="processingPointShow">
          <ul>
              <li v-for="(item, index) in processingPointData" @click.stop="processClick(index+1)">{{item.cldbmmc}}</li>
            </ul>
        </div>
      </div>
    </li>
    <li class="illegalTimeSelect-item" v-if="processingPoint.cldlxdh">
      <div class="illegalTimeSelect-name">
        <span>电话</span>
      </div>
      <div class="illegalTimeSelect-list-text">
        <input type="text" class="text-input" v-model:value="processingPoint.cldlxdh" readonly>
      </div>
    </li>
    <li class="illegalTimeSelect-item" v-if="processingPoint.cldaddress">
      <div class="illegalTimeSelect-name">
        <span>地址</span>
      </div>
      <div class="illegalTimeSelect-list-text">
        <input type="text" class="text-input" v-model:value="processingPoint.cldaddress" readonly>
      </div>
    </li>
    <li class="illegalTimeSelect-item pad-0">
      <p>选择预约日期</p>
    </li>
    <li class="illegalTimeSelect-item pad-0 flex">
      <input type="text" class="text-input year" v-model:value="getYear" readonly v-if="years.length <= 1">
      <div class="div-select year" v-else="years.length <= 1">
        <span class="btn-select" @click.stop="yearClick()">{{getYear}}</span>
        <div class="div-select-ul" v-if="yearShow">
          <ul>
              <li v-for="item in years" @click.stop="yearClick(item)">{{item}}</li>
            </ul>
        </div>
      </div>
      年
      <input type="text" class="text-input month" v-model:value="getMonth" readonly v-if="months.length <= 1">
      <div class="div-select month" v-else="months.length <= 1">
        <span class="btn-select" @click.stop="monthClick()">{{getMonth}}</span>
        <div class="div-select-ul" v-if="monthShow">
          <ul>
              <li v-for="item in months" @click.stop="monthClick(item)">{{item}}</li>
            </ul>
        </div>
      </div>
      月
      <input type="text" class="text-input date" v-model:value="getDate" readonly v-if="dates.length <= 1">
      <div class="div-select date" v-else="dates.length <= 1">
        <span class="btn-select" @click.stop="dateClick()">{{getDate}}</span>
        <div class="div-select-ul" v-if="dateShow">
          <ul>
              <li v-for="item in dates" @click.stop="dateClick(item)">{{item}}</li>
            </ul>
        </div>
      </div>
      日
    </li>
  </ul>
  <ul class="illegalTimeSelect-detail">
    <li class="illegalTimeSelect-item" v-for="(item, index) in selectData" :class="{disabled: item.yy_zs - item.yy_yysl === 0, active: item.yy_zs - item.yy_yysl != 0 && tab == item.ccsjd}" @click.stop="select(item.ccsjd, index, item.yy_zs - item.yy_yysl === 0)">
      <p>{{item.ccsjd}}</p>
      <p v-if="item.yy_zs - item.yy_yysl === 0">已满</p>
      <p v-else="item.yy_zs - item.yy_yysl === 0">剩余名额<span class="yy_yysl">{{item.yy_zs - item.yy_yysl}}</span>位</p>
    </li>
  </ul>
  <div class="illegal-tip">
    <h3>温馨提示：</h3>
    <p>1、对于预约过没有来办理的,满3次系统自动锁定用户,不能进行预约。</p>
    <p>2、超过预约时间到违法处理点办理业务的群众,此次预约视为无效,需重新排队。</p>
    <p>3、预约成功的用户凭预约成功短信到窗口进行违章业务办理。</p>
    <p>4、成功预约后，如未能在预约时间段内前往办理的，须至少提前两个工作日，在网站预约申请界面进行撤销预约，否认视为失约。</p>
  </div>
  <button class="btn btn-blue" type="button" name="button" @click.stop="submit()">预 约</button>
</div>
</template>
<script>
import { processingPoint, subscribeSorts, changeSubscribe } from '../../../config/baseUrl'
import { resultGet, resultPost } from '../../../service/getData'
import { Toast, Indicator, MessageBox } from 'mint-ui'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      processingPoint: '',
      processingPointData: '',
      processingPointShow: false,
      timeData: '',
      year: '',
      yearShow: false,
      month: '',
      monthShow: false,
      date: '',
      dateShow: false,
      yydate: '',
      selectData: '',
      snm: '',
      cldbmid: '',
      newData: '',
      tab: '',
      cczb_id: '',
      years: [],
      months: [],
      dates: [],
      mobileNo: ''
    }
  },
  computed: {
    getYydate: function () {
      let yydate = `${this.year}-${this.month}-${this.date}`
      return yydate
    },
    getYear: function () {
      this.months = []
      for (let month in this.newData[this.year]) {
        this.months.push(month)
      }
      this.months.sort(function (a, b) { return a - b })
      this.month = this.months[0]
      return this.year
    },
    getMonth: function () {
      this.dates = []
      for (let date in this.newData[this.year][this.month]) {
        this.dates.push(date)
      }
      this.dates.sort(function (a, b) { return a - b })
      this.date = this.dates[0]
      return this.month
    },
    getDate: function () {
      this.selectData = this.newData[this.year][this.month][this.date].yydate_sjd.sditem
      return this.date
    },
    lawlessData: function () {
      return this.$store.state.newLawlessDeal
    },
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  methods: {
    init: function () {
      Indicator.open('正在加载...')
      resultGet(`${processingPoint}?sourceOfCertification=C`).then(json => {
        if (json.code === '0000') {
          this.processingPointData = json.data
          this.processingPoint = this.processingPointData[0]
          this.getDetailData()
        } else {
          MessageBox({
            title: '',
            message: json.msg
          })
        }
      })
    },
    getDetailData: function () {
      this.cldbmid = this.processingPoint.cldbmid
      Indicator.open('正在加载...')
      resultGet(`${subscribeSorts}?cldbmid=${this.cldbmid}&sourceOfCertification=C`).then(json => {
        Indicator.close()
        console.log(json)
        if (json.code === '0000') {
          this.timeData = json.data.data
          this.newData = {}
          for (let i = 0; i < this.timeData.length; i++) {
            let year = this.timeData[i].yydate.substr(0, 4)
            let month = this.timeData[i].yydate.substr(5, 2)
            let date = this.timeData[i].yydate.substr(8, 2)
            if (!this.newData[year]) {
              this.newData[year] = {}
            }
            if (!this.newData[year][month]) {
              this.newData[year][month] = {}
            }
            this.newData[year][month][date] = this.timeData[i]
          }
          this.years = []
          for (let year in this.newData) {
            this.years.push(year)
          }
          this.years.sort(function (a, b) { return a - b })
          this.year = this.years[0]

          console.log(this.newData)
          this.snm = json.data.snm
        } else {
          MessageBox({
            title: '',
            message: json.msg
          })
        }
      })
    },
    processClick: function (index) {
      if (index && this.processingPoint !== this.processingPointData[--index]) {
        this.processingPoint = this.processingPointData[index]
        this.getDetailData()
      }
      this.processingPointShow = !this.processingPointShow
      this.monthShow = false
      this.dateShow = false
      this.yearShow = false
    },
    yearClick: function (str) {
      if (str) {
        this.year = str
      }
      this.processingPointShow = false
      this.monthShow = false
      this.dateShow = false
      this.yearShow = !this.yearShow
    },
    monthClick: function (str) {
      if (str) {
        this.month = str
      }
      this.processingPointShow = false
      this.yearShow = false
      this.dateShow = false
      this.monthShow = !this.monthShow
    },
    dateClick: function (str) {
      if (str) {
        this.date = str
      }
      this.processingPointShow = false
      this.yearShow = false
      this.monthShow = false
      this.dateShow = !this.dateShow
    },
    select: function (str, index, isDisable) {
      if (isDisable) {
        return false
      } else {
        this.cczb_id = this.selectData[index].cczb_id
        this.tab = str
      }
    },
    submit: function () {
      let reqData = {
        snm: this.snm,
        cldbmid: this.cldbmid,
        cczb_id: this.cczb_id,
        sourceOfCertification: this.sourceOfCertification || 'C', // 来源
        custName: this.custName, // 用户姓名
        certificateNo: this.certificateNo, // 身份证号码
        drivingLicenceNo: this.certificateNo, // 驾驶证号码
        licensePlateNo: this.licensePlateNo, // 车牌号码
        licensePlateType: this.licensePlateType, // 车牌类型
        mobileNo: this.mobileNo, // 手机号码
        yydate: this.getYydate, // 预约日期
        ccsjd: this.tab, // 预约时间段
        cldbmmc: this.processingPoint.cldbmmc, // 服务点
        cldaddress: this.processingPoint.cldaddress, // 服务点地址
        cldlxdh: this.processingPoint.cldlxdh // 服务点电话
      }
      console.log(reqData)
      for (let key in reqData) {
        if (!reqData[key]) {
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      Indicator.open('正在提交...')
      resultPost(changeSubscribe, reqData).then(json => {
        Indicator.close()
        console.log(json)
        if (json.code === '0') {
          this.postAppoin({
            appoinNum: json.msg,
            appoinType: '违法预约处理'
          })
          this.isWeChat ? window.location.href = json.data : this.$router.push('/appointSuccess')
          // this.$router.push(/_WeChat/g.test(this.$route.name) ? '/appointSuccess_WeChat' : '/appointSuccess')
        } else {
          MessageBox({
            title: '',
            message: json.msg
          })
        }
      })
    },
    ...mapActions({
      postAppoin: 'postAppoin'
    })
  },
  mounted () {
    Indicator.open('正在加载...')
    document.addEventListener('click', (e) => {
      this.processingPointShow = false
      this.yearShow = false
      this.monthShow = false
      this.dateShow = false
    })
    this.init()
    console.log(this.lawlessData)
    this.custName = window.localStorage.getItem('userName') // 姓名
    this.certificateNo = window.localStorage.getItem('identityCard') // 身份证
    this.mobileNo = window.localStorage.getItem('mobilePhone') // 手机号码
    this.licensePlateNo = this.lawlessData.data.licensePlateNo // 车牌号码
    this.licensePlateType = this.lawlessData.data.licensePlateType // 车牌类型

    let ua = window.navigator.userAgent // 浏览器版本
    if (/MicroMessenger/i.test(ua)) {
      this.sourceOfCertification = 'C' // 微信
    } else if (/AlipayClient/i.test(ua)) {
      this.sourceOfCertification = 'Z' // 支付宝
    }
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>
