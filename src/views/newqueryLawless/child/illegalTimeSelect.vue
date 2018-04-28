<template>
  <div class="newTimeSelect">
    <g-select title="服务点" :data="processingPointData" v-model="cldbmid" ref="name" @getSelected="processing"></g-select>
    <g-input title="电话" v-model="cldlxdh" readonly></g-input>
    <g-input title="地址" v-model="cldaddress" readonly></g-input>
    <p class="newTimeSelect-p">选择预约日期</p>
    <ul class="newTimeSelect-nav">
      <li class="form-line">
        <input type="text" class="text-input year" v-model:value="getYear" readonly v-if="years.length <= 1">
        <div class="div-select" v-else="years.length <= 1">
          <span class="btn-select bg-colour"  @click.stop="yearClick()">{{getYear}}</span>
          <div class="div-select-ul" v-if="yearShow">
            <ul>
              <li v-for="item in years" @click.stop="yearClick(item)">{{item}}</li>
            </ul>
          </div>
        </div>
      </li>
      <span class="form-Date">年</span>
      <li class="form-line">
        <div class="div-select">
          <span class="btn-select bg-colour" @click.stop="monthClick()">{{getMonth}}</span>
          <div class="div-select-ul" v-if="monthShow">
            <ul>
              <li v-for="item in months" @click.stop="monthClick(item)">{{item}}</li>
            </ul>
          </div>
        </div>
      </li>
      <span class="form-Date">月</span>
      <li class="form-line">
        <input type="text" class="text-input date" v-model:value="getDate" readonly v-if="dates.length <= 1">
        <div class="div-select">
          <span class="btn-select bg-colour" @click.stop="dateClick()">{{getDate}}</span>
          <div class="div-select-ul" v-if="dateShow">
            <ul>
              <li v-for="item in dates" @click.stop="dateClick(item)">{{item}}</li>
            </ul>
          </div>
        </div>
      </li>
      <span class="form-Date">日</span>
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
    <g-button text="预约" @click.native="submit"></g-button>
  </div>
</template>

<script>
import { processingPoint, subscribeSorts, changeSubscribe } from '@/config/baseURL'
import { mapActions } from 'vuex'
export default {
  name: 'newTimeSelect',
  data () {
    return {
      licensePlateNo: '',
      licensePlateType: '',
      cldbmmc: '',
      timeData: '',
      processingPointData: [],
      cldbmid: '',
      cldlxdh: '',
      cldaddress: '',
      newData: '',
      snm: '',
      selectData: '',
      month: '',
      year: '',
      date: '',
      tab: '',
      yydate: '',
      cczb_id: '',
      years: [],
      months: [],
      dates: [],
      yearShow: false,
      monthShow: false,
      dateShow: false
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
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  methods: {
    init () {
      this.$axios.get(`${processingPoint}?sourceOfCertification=C`).then(json => {
        if (json.code === '0000') {
          json.data.map(item => {
            this.processingPointData.push({name: item.cldbmmc, value: item.cldbmid, cldaddress: item.cldaddress, cldlxdh: item.cldlxdh})
          })
          this.cldbmmc = this.processingPointData[0].name
          this.cldbmid = this.processingPointData[0].value
          this.cldlxdh = this.processingPointData[0].cldlxdh
          this.cldaddress = this.processingPointData[0].cldaddress
          this.getDetailData()
        } else {
          this.$MessageBox(json.msg)
        }
      })
    },
    // 选择时间联动电话和地址
    processing: function (index) {
      // let name = this.$refs.name.currentName // 获取 name 值
      this.cldbmmc = this.$refs.name.currentName
      this.cldlxdh = this.processingPointData[index].cldlxdh
      this.cldaddress = this.processingPointData[index].cldaddress
      this.cldbmid = this.processingPointData[index].value
      this.getDetailData()
    },
    getDetailData: function () {
      this.$axios.get(`${subscribeSorts}?cldbmid=${this.cldbmid}&sourceOfCertification=C`).then(json => {
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
          this.$MessageBox(json.msg)
        }
      })
    },
    yearClick (str) {
      if (str) {
        this.year = str
      }
      this.monthShow = false
      this.dateShow = false
      this.yearShow = !this.yearShow
    },
    monthClick (str) {
      if (str) {
        this.month = str
      }
      this.yearShow = false
      this.dateShow = false
      this.monthShow = !this.monthShow
    },
    dateClick: function (str) {
      if (str) {
        this.date = str
      }
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
        sourceOfCertification: 'C', // 来源
        custName: this.custName, // 用户姓名
        certificateNo: this.certificateNo, // 身份证号码
        drivingLicenceNo: this.certificateNo, // 驾驶证号码
        licensePlateNo: this.licensePlateNo, // 车牌号码
        licensePlateType: this.licensePlateType, // 车牌类型
        mobileNo: this.mobileNo, // 手机号码
        yydate: this.getYydate, // 预约日期
        ccsjd: this.tab, // 预约时间段
        cldbmmc: this.cldbmmc, // 服务点
        cldaddress: this.cldaddress, // 服务点地址
        cldlxdh: this.cldlxdh // 服务点电话
      }
      console.log(reqData)
      for (let key in reqData) {
        if (!reqData[key]) {
          this.$toast('信息填写不完整')
          return false
        }
      }
      this.$axios.post(changeSubscribe, reqData).then(json => {
        console.log(json)
        if (json.code === '0') {
          this.postAppoin({
            appoinNum: json.msg,
            appoinType: '违法预约处理'
          })
          this.$router.push({path: '/appointSuccess', query: this.queryURL})
        } else {
          this.$MessageBox(json.msg)
        }
      })
    },
    ...mapActions({
      postAppoin: 'postAppoin'
    })
  },
  mounted () {
    this.init()
    this.custName = this.$store.state.user.userName // 姓名
    this.certificateNo = this.$store.state.user.identityCard // 身份证
    this.mobileNo = this.$store.state.user.mobilePhone // 手机号码
    this.licensePlateNo = this.lawlessData.data.licensePlateNo // 车牌号码
    this.licensePlateType = this.lawlessData.data.licensePlateType // 车牌类型
  }
}
</script>

<style lang="less" scoped>
  .newTimeSelect {
    padding-bottom: 40px;
    .newTimeSelect-p {
      padding-left: 36px;
      line-height: 60px;
    }
    .newTimeSelect-nav {
      display: flex;
      padding: 10px 36px;
      .form-line {
        flex: 1;
        /*padding: 10px 36px;*/
        position: relative;
        line-height: 56px;
        .div-select {
          width: 89%;
          font-size: 26px;
          text-align: center;
        }
      }
      .form-Date {
        padding-right: 20px;
        line-height: 60px;
      }
    }
    .illegalTimeSelect-detail{
      height: 420px;
      border: 1px solid #eaeaed;
      border-radius: 8px;
      overflow-x: hidden;
      overflow-y: scroll;
      margin: 10px 36px 55px;
      .disabled{
        padding: 0 80px 0 35px;
        background: #eaeaed;
      }
      .illegalTimeSelect-item{
        padding: 0 70px 0 35px;
        display: flex;
        justify-content: space-between;
        line-height: 80px;
        border: 2px solid #eaeaed;
        border-color: transparent;
        border-bottom-color: #eaeaed;
        .yy_yysl{
          margin: 0 10px 0 34px;
          color: #19d051;
        }
      }
      .active{
        border-color: #2696dd;
      }
    }
    .illegal-tip{
      padding: 10px 36px;
      h3{
        font-size: 28px;
        color: #2696dd;
        margin-bottom: 30px;
      }
      p{
        font-size: 24px;
        line-height: 34px;
        color: #666;
      }
    }
  }
</style>