<template>
  <div class="applyEveryMonth-outer">
    <div class="queryByCar-from">
      <div id="queryByCar-hbs">
        <ul class="queryByCar-hbs-list">
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>车牌类型</span>
            </div>
            <div class="div-select">
              <span class="btn-select" @click.stop="plateSelectClick()">{{ plateSelectMassage }}</span>
              <div class="div-select-ul" v-if="plateSelectShow">
                <ul>
                  <li v-for="item in plateSelectData" @click.stop="plateSelectClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>车辆类型</span>
            </div>
            <div class="div-select">
              <span class="btn-select" @click.stop="licenseSelectClick()">{{ licenseSelectMassage }}</span>
              <div class="div-select-ul" v-if="licenseSelectShow">
                <ul>
                  <li v-for="item in licenseSelectData" @click.stop="licenseSelectClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="queryByCar-hbs-item clear">
            <div class="queryByCar-hbs-name">
              <span>车牌号码</span>
            </div>
            <div class="div-select width-25 left">
              <span class="btn-select min-btn-select" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
              <div class="div-select-ul" v-if="abbreviationSelectShow">
                <ul>
                  <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str)">{{item.str}}</li>
                </ul>
              </div>
            </div>
            <div class="queryByCar-hbs-text width-70 right">
              <input v-model="car_number" maxlength="7" class="text-input" type="text" name="" value="" style="text-transform:uppercase;" placeholder="请输入车牌号码">
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>车架号</span>
            </div>
            <div class="queryByCar-hbs-text">
              <input v-model="vehicleIdentifyNoLast4" class="text-input" type="text" maxlength="4" name="" value="" placeholder="请输入车架号后四位">
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>车主姓名</span>
            </div>
            <div class="queryByCar-hbs-text">
              <input v-model="name" class="text-input" type="text"  placeholder="请按行驶证填写">
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>手机号码</span>
            </div>
            <div class="queryByCar-hbs-text">
              <input v-model="mobilephone" class="text-input" type="text" placeholder="请填写手机号码">
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>申请日期</span>
            </div>
            <div class="queryByCar-hbs-text">
              <p class="text-input" @click="datetimePick('picker')">{{ mtDateTimeMsg }}</p>
            </div>
          </li>
        </ul>
      </div>
      <button class="btn" type="button" name="button" @click.stop="btnFn()">确认信息</button>
    </div>
    <div class="hint">
      <h4>温馨提示：</h4>
      <p>1.每月只能申请一次，且只能申请第二天及下个月的日期。</p>
      <p>2.工作日限外的时间段为（早高峰7：00至9：00，晚高峰17：30至19：30）</p>
      <p>3.法定节假日不限外，请勿申请。</p>
    </div>
    <mt-datetime-picker ref="picker" type="date" v-model="informTime" @confirm="handleTime" :startDate="startTimeData" :endDate="endTimeData"></mt-datetime-picker>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui'
  import moment from 'moment'
  import { isPhone } from '../../../../../service/regExp.js'
  import { applyGatePass } from '../../../../../config/baseUrl.js'
  export default {
    name: 'applyEveryMonth',
    computed: {
      vuexData: function () {
        return this.$store.state.motorVehicleHandling
      }
    },
    data () {
      return {
        endTimeData: new Date(moment().add(1, 'months').endOf('month').format('YYYY-MM-DD')),
        startTimeData: new Date(moment().add(1, 'days').format('YYYY-MM-DD')),
        name: '', // 车主姓名
        mtDateTimeMsg: '',                                              // 一进来默认当前时间
        formatTime: '',                                                 // 使用mt组件后，时间是中国标准时间，格式转换
        informTime: moment().add(1, 'days').format('YYYY-MM-DD'),       // 明天的时间
        licensePlateNo: '',                   // 请求-车牌号
        cur_license_id: 'K31',                    // 请求-车牌类型（编号转换）
        cur_plate_id: '02',
        car_number: '',                       // 请求-除去省字的车牌号
        vehicleIdentifyNoLast4: '',           // 请求-车架号后4位
        mobilephone: '',                      // 请求-手机号码
        illegalData: [],                      // 返回-全部数据存入数组
        myIllegalData: [],                    // 返回-查询我的违章
        licenseSelectShow: false,             // 车牌列表显示与否
        licenseSelectMassage: '小型普通客车', // 默认车牌类型
        licenseSelectData: [
          {
            'id': 'K31',
            'str': '小型普通客车'
          },
          {
            'id': 'K32',
            'str': '小型越野客车'
          },
          {
            'id': 'K33',
            'str': '小型轿车'
          },
          {
            'id': 'K34',
            'str': '小型专用客车'
          },
          {
            'id': 'K41',
            'str': '微型普通客车'
          },
          {
            'id': 'K42',
            'str': '微型越野客车'
          },
          {
            'id': 'K43',
            'str': '微型轿车'
          },
          {
            'id': 'K38',
            'str': '小型专用校车'
          }
        ],             // 车牌类型列表（编号转换）
        abbreviationSelectShow: false,        // 省字列表显示与否
        abbreviationSelectMassage: '粤',      // 默认省字
        abbreviationSelectData: [
          {
            'str': '粤'
          },
          {
            'str': '鄂'
          },
          {
            'str': '豫'
          },
          {
            'str': '皖'
          },
          {
            'str': '赣'
          },
          {
            'str': '冀'
          },
          {
            'str': '鲁'
          },
          {
            'str': '浙'
          },
          {
            'str': '苏'
          },
          {
            'str': '湘'
          },
          {
            'str': '闽'
          },
          {
            'str': '蒙'
          },
          {
            'str': '京'
          },
          {
            'str': '辽'
          },
          {
            'str': '渝'
          },
          {
            'str': '沪'
          },
          {
            'str': '陕'
          },
          {
            'str': '川'
          },
          {
            'str': '黑'
          },
          {
            'str': '晋'
          },
          {
            'str': '桂'
          },
          {
            'str': '吉'
          },
          {
            'str': '宁'
          },
          {
            'str': '贵'
          },
          {
            'str': '琼'
          },
          {
            'str': '甘'
          },
          {
            'str': '青'
          },
          {
            'str': '津'
          },
          {
            'str': '云'
          },
          {
            'str': '藏'
          },
          {
            'str': '新'
          }
        ],         // 省字列表
        plateSelectShow: false,             // 车牌列表显示与否// 验证码验证
        plateSelectMassage: '蓝牌',         // 默认车牌类型
        plateSelectData: [
          {
            'id': '02',
            'str': '蓝牌'
          },
          {
            'id': '01',
            'str': '黄牌'
          },
          {
            'id': '06',
            'str': '黑牌'
          }
        ]             // 车牌类型列表（编号转换）
      }
    },
    mounted: function () {
      this.mtDateTimeMsg = moment().add(1, 'days').format('YYYY-MM-DD')
    },
    methods: {
      licenseSelectClick: function (str, id) {
        if (str) {
          this.licenseSelectMassage = str
          this.cur_license_id = id
        }
        if (this.licenseSelectShow === true) {
          this.licenseSelectShow = false
        } else {
          this.licenseSelectShow = true
          this.typeSelectShow = false
          this.abbreviationSelectShow = false
        }
      },
      plateSelectClick: function (str, id) {
        if (str) {
          this.plateSelectMassage = str
          this.cur_plate_id = id
        }
        if (this.plateSelectShow === true) {
          this.plateSelectShow = false
        } else {
          this.plateSelectShow = true
          this.abbreviationSelectShow = false
        }
      },
      abbreviationSelectClick: function (str) {
        if (str) {
          this.abbreviationSelectMassage = str
        }
        if (this.abbreviationSelectShow === true) {
          this.abbreviationSelectShow = false
        } else {
          this.abbreviationSelectShow = true
          this.licenseSelectShow = false
          this.typeSelectShow = false
        }
      },
      datetimePick: function (picker) {
        this.$refs.picker.open()
      },
      handleTime: function (informTime) {
        this.formatTime = this.format(this.informTime.toString(), 'yyyy-MM-dd')
        this.mtDateTimeMsg = this.formatTime
        console.log(this.mtDateTimeMsg)
      },
      currentTime: function () {  // 获取时间
        let now = new Date()
        let year = now.getFullYear()       // 年
        let month = now.getMonth() + 1     // 月
        let day = now.getDate()            // 日
        let clock = year + '-'
        if (month < 10) {
          clock += '0'
        }
        clock += month + '-'
        if (day < 10) {
          clock += '0'
        }
        clock += day + ' '
        return (clock)
      },
      format: function (time, format) {   // 中国标准时间转换为datetime格式
        var t = new Date(time)
        var tf = function (i) { return (i < 10 ? '0' : '') + i }
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
          switch (a) {
            case 'yyyy':
              return tf(t.getFullYear())
            case 'MM':
              return tf(t.getMonth() + 1)
            case 'mm':
              return tf(t.getMinutes())
            case 'dd':
              return tf(t.getDate())
            case 'HH':
              return tf(t.getHours())
            case 'ss':
              return tf(t.getSeconds())
          }
        })
      },
      btnFn: function () {
        let numbers = `${this.abbreviationSelectMassage}${this.car_number}`
        if (this.$plateerification(numbers)) {
          Toast({
            message: this.$plateerification(numbers),
            duration: 2000
          })
          return
        }
        if (!this.vehicleIdentifyNoLast4) {
          Toast({
            message: '请输入车架号',
            duration: 2000
          })
          return
        }
        if (!this.name) {
          Toast({
            message: '请输入车主姓名',
            duration: 2000
          })
          return
        }
        if (!isPhone(this.mobilephone)) {
          Toast({
            message: '请输入正确手机号',
            duration: 2000
          })
          return
        }
        let dataList = {
          type: '申请通行证',
          noTip: true,
          url: applyGatePass,
          textObj: {
            'plateType': this.cur_plate_id,   // 车牌类型
            'cartype': this.cur_license_id, // 车辆类型
            'abbreviation': this.abbreviationSelectMassage, // 车牌简称
            'numberPlate': this.car_number, // 车牌号码
            'behindTheFrame4Digits': this.vehicleIdentifyNoLast4,    // 车架号
            'name': this.name,  // 车主姓名
            'mobilephone': this.mobilephone,  // 手机号码
            'applyDate': this.mtDateTimeMsg  // 申请时间
          },
          invisibleObj: {
            'remarks': '' // 备注
          }
        }
        console.log(dataList)
        this.$store.commit('saveMotorVehicleHandling', dataList)
        this.$router.push(/_WeChat/g.test(this.$route.name) ? '/affirmInfo_WeChat' : '/affirmInfo')
      }
    },
    created () {
      console.log(moment().add(1, 'months').endOf('month').format('YYYY-MM-DD'))
      document.addEventListener('click', (e) => {
        this.typeSelectShow = false
        this.licenseSelectShow = false
        this.abbreviationSelectShow = false
      })
    }
  }
</script>
<style lang="less" scoped>
  .applyEveryMonth-outer {
    background-color: #fff;
    .width-25 {
      width: 25% !important;
    }
    .width-70 {
      width: 70% !important;
    }
    .width-40 {
      width: 40% !important;
    }
    .queryByCar-from {
      background-color: #fff;
      #queryByCar-hbs {
        padding-bottom: 20px;
        .queryByCar-hbs-list {
          .queryByCar-hbs-item {
            height: 80px;
            margin-top: 24px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .queryByCar-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .queryByCar-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .queryByCar-hbs-code {
              margin-left: 40px;
              text-indent: 28px;
              width: 240px;
              height: 56px;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .queryResults {
      color: #333 !important;
      margin: 100px 0;
      .results-box {
        border: 1px solid #a7d9f9;
        background-color: #fff;
        border-radius: 4px;
        .box-header {
          height: 80px;
          line-height: 80px;
          border-bottom: 1px solid #a7d9f9;
          &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
          .header-item {
            font-size: 1rem;
            padding: 0 24px;
            font-weight: bold;
            &.order-print {
              color: #2696dd;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .btn {
      margin: 0;
    }
    .hint {
      h4{
        color:#e64340;
      }
      p {
        color:#666;
      }
    }
  }
</style>
