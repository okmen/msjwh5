<template>
  <div class="make-appointment-box">
    <div class="appointmentTime-form">
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>车牌号码</span>
        </div>
        <div class="form-line-item div-select width-35">
          <span class="btn-select min-btn-select bgcolor-fff" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
          <div class="div-select-ul" v-if="abbreviationSelectShow">
            <ul>
              <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str)">
                {{item.str}}
              </li>
            </ul>
          </div>
        </div>
        <div class="form-line-item width-60 right">
          <input v-model="carNumber" class="text-input bgcolor-fff" type="text" name="" value="" placeholder="请输入车牌号码">
        </div>
      </div>
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>车牌类型</span>
        </div>
        <div class="form-line-item div-select width-100">
          <span class="btn-select bgcolor-fff" @click.stop="licenseSelectClick()" :data-type="licenseSelectType">{{ licenseSelectMassage }}</span>
          <div class="div-select-ul" v-if="licenseSelectShow">
            <ul>
              <li v-for="(item, index) in licenseSelectData" @click.stop="licenseSelectClick(item.str, index)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>车辆类型</span>
        </div>
        <div class="form-line-item div-select width-100">
          <span class="btn-select bgcolor-fff" @click.stop="carSelectClick()" :data-type="carSelectType">{{ carSelectMassage }}</span>
          <div class="div-select-ul" v-if="carSelectShow">
            <ul>
              <li v-for="(item, index) in carSelectData" @click.stop="carSelectClick(item.str, index)">{{item.str}}</li>
            </ul>
          </div>
        </div>
        <p class="abs-p">温馨提示：九座以下的除黄牌的车都要预约</p>
      </div>
      <div class="form-line padding-left-188">
        <div class="form-line-item item-name width-188">
          <span>车架号后四位</span>
        </div>
        <div class="form-line-item div-select width-100">
          <input v-model="fourDigitsAfterTheEngine" maxlength="4" class="text-input bgcolor-fff" type="text" name="" value="" placeholder="车架号后四位">
        </div>
      </div>
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>手机号码</span>
        </div>
        <div class="form-line-item div-select width-100">
          <input v-model="mobilephone" maxlength="11" class="text-input bgcolor-fff" type="tel" name="" value="" placeholder="请输入手机号码">
        </div>
      </div>
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>验证码</span>
        </div>
        <div class="form-line-item div-select width-50">
          <input v-model="validateCode" maxlength="6" class="text-input bgcolor-fff" type="tel" name="" value="" placeholder="请输入验证码">
        </div>
        <div class="form-line-item div-select width-46 float-right" @click="sendCode">
          <button class="blue-btn">点击发送验证码</button>
        </div>
      </div>
    </div>
    <div class="appointmentTime-select">
      <div class="appointmentTime-select-top">
        <p>选择预约时间</p>
        <span>温馨提示:绿色为充裕,黄色为良好,红色为紧张,灰色为不可预约。</span>
      </div>
      <div class="appointmentTime-select-option">
        <div class="option-item" v-for="(item, index) in optionData" @click="optionClick(index)" :class="{ active: item.isElect }" >
          <div class="option-item-text group">
            <p class="option-item-p">{{ item.apptDistrict == 1 ? '梅沙片区' : '大鹏片区' }}</p>
            <p class="option-item-p">{{ item.apptDate }}</p>
            <p class="option-item-p">{{ item.apptInterval == 1 ? '上午(00:00~12:00)' : '下午(12:00~24:00)' }}</p>
          </div>
          <div class="option-item-Mask" :style="{width: item.remainingPercentage + '%',backgroundColor: item.bgColor}" ></div>
        </div>
      </div>
      <div class="appointmentTime-select-bottom">
        <div class="appointmentTime-bottom-text">
          <p class="appointmentTime-bottom-text-h3">温馨提示：</p>
          <p>1、网络预约在法定节假日开始前7个自然日开启，可预约最近1个法定节假日、休息日内任1天（如5月21日起可预约端午假期5月28日至5月30日中任何1天）。</p>
          <p>2、网络预约区域分为梅沙片区和大鹏新区，允许同时预约两个景区。</p>
          <p>3、网络预约只预约到达日期，离开不受限制，车辆离开东部景区后隔日重新返回东部景区，需要重新预约，在景区内部行驶不受限制。</p>
          <p>4、1年内累计有3次预约成功后未履约前往情形的，取消当年预约资格（预约手机号和预约车牌均不得预约）。预约上午到达的游客可在9点前取消，预约下午到达的游客可在14点前取消，反复取消后重新预约3次的，取消此次节假日的预约资格。</p>
          <p>5、因交通拥堵未在预约时间内抵达的，通过<a href="tel:83333333">83333333</a>电话报备，不视为违约，免于处罚。但不得超过预约时间12个小时。</p>
        </div>
        <button class="appointmentTime-bottom-btn" @click="btnClick()">预 约</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { getTempApptDistrictAndTime, addTempApptInfo, sendSMSVerificatioCode } from '../../../config/baseUrl'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'appointmentTime',
    data () {
      return {
        carSelectShow: false,
        carSelectMassage: '小型汽车',
        carSelectType: '02',                          // 车辆类型
        carSelectData: [
          {
            'type': '01',
            'str': '大型汽车'
          },
          {
            'type': '02',
            'str': '小型汽车'
          },
          {
            'type': '03',
            'str': '使馆汽车'
          },
          {
            'type': '04',
            'str': '领馆汽车'
          },
          {
            'type': '05',
            'str': '境外汽车'
          },
          {
            'type': '06',
            'str': '外籍汽车'
          },
          {
            'type': '07',
            'str': '普通摩托车'
          },
          {
            'type': '08',
            'str': '轻便摩托车'
          },
          {
            'type': '09',
            'str': '使馆摩托车'
          },
          {
            'type': '10',
            'str': '领馆摩托车'
          },
          {
            'type': '15',
            'str': '挂车'
          },
          {
            'type': '16',
            'str': '教练汽车'
          },
          {
            'type': '17',
            'str': '教练摩托车'
          },
          {
            'type': '18',
            'str': '实验汽车'
          },
          {
            'type': '19',
            'str': '实验摩托车'
          },
          {
            'type': '22',
            'str': '临时行驶车'
          },
          {
            'type': '23',
            'str': '警用汽车'
          },
          {
            'type': '24',
            'str': '警用摩托'
          },
          {
            'type': '20',
            'str': '临时入境车'
          },
          {
            'type': '51',
            'str': '新能源大型车'
          },
          {
            'type': '52',
            'str': '新能源小型车'
          }
        ],
        licenseSelectShow: false,
        licenseSelectMassage: '蓝牌',
        licenseSelectType: '02',                      // 号牌类型
        licenseSelectData: [
          {
            'str': '蓝牌',
            'type': '02'
          },
          {
            'str': '黄牌',
            'type': '01'
          },
          {
            'str': '黑牌',
            'type': '06'
          },
          {
            'str': '个性牌',
            'type': '02'
          },
          {
            'str': '小型新能源车号牌',
            'type': '52'
          },
          {
            'str': '大型新能源车号牌',
            'type': '51'
          }
        ],
        abbreviationSelectShow: false,
        abbreviationSelectMassage: '粤',              // 车牌号简称
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
        ],
        carNumber: '',                                // 车牌号码
        fourDigitsAfterTheEngine: '',                 // 车架号后四位
        mobilephone: '',                              // 手机号码
        validateCode: '',                             // 验证码
        checkedData: '',                              // 选中的预约信息
        /* eslint-disable */
        optionData: [
         /* {
            "apptDate": "2017-06-10",
            "apptDistrict": "1",
            "leftQuota": "12999",
            "totalQuota": "13000",
            "apptInterval": "1"
          },
          {
            "apptDate": "2017-06-10",
            "apptDistrict": "2",
            "leftQuota": "13000",
            "totalQuota": "13000",
            "apptInterval": "2"
          }
*/
        ]
        /* eslint-enable */
      }
    },
    methods: {
      isLicenseNo (str) {  // 车牌号码校验
        return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str)
      },
      checkPhone (str) {   // 手机号码校验
        return /^1[3|4|5|7|8]\d{9}$/.test(str)
      },
      optionClick: function (index) {
        console.log(index)
        this.optionData.forEach(item => {
          item.isElect = false
        })
        if (this.optionData[index].leftQuota === 0) {
          this.optionData[index].isElect = false
          this.checkedData = ''
          Toast({
            message: '该时间段预约已满',
            duration: '2000'
          })
        } else {
          this.optionData[index].isElect = true
          this.checkedData = this.optionData[index]
          console.log(this.checkedData)
        }
      },
      btnClick: function () {
        let carNumbers = this.abbreviationSelectMassage + this.carNumber.toLocaleUpperCase()
        let isTrueCar = this.isLicenseNo(carNumbers)
        let reqData = {
          plateNo: carNumbers,
          plateType: this.licenseSelectType,
          vehicleType: this.carSelectType,
          vinLastFour: this.fourDigitsAfterTheEngine,
          mobilePhone: this.mobilephone,
          apptInterval: this.checkedData.apptInterval,
          apptDate: this.checkedData.apptDate,
          apptDistrict: this.checkedData.apptDistrict,
          validateCode: this.validateCode
        }
        if (!isTrueCar) {
          Toast({
            message: '车牌号码不正确',
            duration: '2000'
          })
          return
        }
        if (!this.fourDigitsAfterTheEngine) {
          Toast({
            message: '请输入车架号后四位',
            duration: '2000'
          })
          return
        }
        if (!this.checkPhone(this.mobilephone)) {
          Toast({
            message: '请输入正确手机号码',
            duration: '2000'
          })
          return
        }
        if (!this.validateCode) {
          Toast({
            message: '请输入验证码',
            duration: '2000'
          })
          return
        }
        if (!this.checkedData) {
          Toast({
            message: '请选择预约片区',
            duration: '2000'
          })
          return
        }
        resultPost(addTempApptInfo, reqData).then(json => {
          console.log(reqData)
          console.log(json)
          if (json.code === '0000') {
            MessageBox('提示', json.msg)
          } else {
            Toast({
              message: json.msg,
              duration: '2000'
            })
          }
        })
      },
      licenseSelectClick: function (str, index) {
        if (str) {
          this.licenseSelectMassage = str
          this.licenseSelectType = this.licenseSelectData[index].type
        }
        if (this.licenseSelectShow === true) {
          this.licenseSelectShow = false
        } else {
          this.licenseSelectShow = true
          this.abbreviationSelectShow = false
          this.carSelectShow = false
        }
      },
      carSelectClick: function (str, index) {
        if (str) {
          this.carSelectMassage = str
          this.carSelectType = this.carSelectData[index].type
        }
        if (this.carSelectShow === true) {
          this.carSelectShow = false
        } else {
          this.carSelectShow = true
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
          this.carSelectShow = false
        }
      },
      getInitData: function () {
        let obj = {}
        resultPost(getTempApptDistrictAndTime, obj).then(json => {
          console.log(json)
          if (json.code === '0000') {
            this.optionData = json.data
            console.log(this.optionData)
            this.optionData.map(item => {
//              this.$set(item, 'time', this.getTimeSlot())
              this.$set(item, 'isElect', false)
              this.$set(item, 'remainingPercentage', this.getRemainingPercentage(item.leftQuota, item.totalQuota, 'P'))
              this.$set(item, 'bgColor', this.getRemainingPercentage(item.leftQuota, item.totalQuota, 'C'))
            })
          } else {
            MessageBox('提示', json.msg)
          }
        })
      },
      getTimeSlot: function () {
        let now = new Date()
        let hours = now.getHours()
        return hours > 12 ? '2' : '1'
      },
      getRemainingPercentage: function (a, b, c) {
        let percent = parseInt((a / b) * 100)
        if (c === 'P') {
          return percent
        } else {
          if (percent > 80) {
            return '#84dd83'
          } else if (percent < 40) {
            return '#f95553'
          } else {
            return '#ffde7f'
          }
        }
      },
      sendCode () { // 发送验证码
        if (!this.checkPhone(this.mobilephone)) {
          Toast({
            message: '请输入正确手机号码',
            duration: '2000'
          })
          return
        }
        let obj = {
          mobilephone: this.mobilephone,
          businessType: 'easternReservation'
        }
        resultPost(sendSMSVerificatioCode, obj).then(json => {
          console.log(json)
          Toast({
            message: json.data,
            duration: '2000'
          })
        })
      }
    },
    mounted () {
      this.getInitData()
      console.log(this.getTimeSlot())
    }
  }
</script>
<style lang="less" scoped>
  .div-select-ul{
    top: 54px;
  }
  .group{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .make-appointment-box {
    position: relative;
    min-height: 1050px;
    background: url('../../../images/eastSubscribe-bottom.png') no-repeat center bottom #dfefff;
    background-size: contain;
    padding: 0 50px 480px;
    .appointmentTime-form {
      .form-line {
        padding: 35px 0 0 130px;
        position: relative;
        line-height: 60px;
        vertical-align:middle;
        .form-line-item {
          display: inline-block;
          height: 60px;
          line-height: 60px;
          font-size: 28px;
          vertical-align:middle;
          span {
            vertical-align: super;
          }
          .text-input{
            vertical-align: middle;
          }
          .bgcolor-fff{
            background-color: #fff;
          }
          .blue-btn{
            width: 100%;
            line-height: 60px;
            background-color: #2696dd;
            color: #fff;
            font-size: 26px;
            border-radius: 8px;
            outline: none;
          }
        }
        .abs-p{
          position: absolute;
          top: 0;
          text-align: center;
          font-size: 22px;
          color: #999;
          line-height: 35px;
        }
      }
    }
    .appointmentTime-select{
      .appointmentTime-select-top{
        p{
          font-size: 28px;
          color: #000;
          line-height: 60px;
        }
        span{
          font-size: 22px;
          color: #999;
        }
      }
      .appointmentTime-select-option{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        .option-item{
          width: 100%;
          height: 160px;
          position: relative;
          text-align: center;
          margin-top: 20px;
          border: 1px solid #999;
          background-color: #fff;
          border-radius: 8px;
          .option-item-text{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            .option-item-p{
              color: #666;
              font-size: 24px;
              line-height: 48px;
            }
            .option-item-p28{
              font-size: 28px;
            }
          }
          .option-item-Mask{
            position: absolute;
            z-index: 0;
            height: 100%;
            top: 0;
            right: 0;
            background-color: #84dd83;
          }
          &.active{
            border: 6px solid #2696dd;
          }
        }
      }
      .appointmentTime-select-bottom{
        .appointmentTime-bottom-text{
          padding-bottom: 55px;
          .appointmentTime-bottom-text-h3{
            font-size: 28px;
            color: #2696dd;
            line-height: 70px;
          }
          p{
            font-size: 26px;
            color: #666;
            line-height: 35px;
          }
        }
        .appointmentTime-bottom-btn{
          width: 100%;
          line-height: 80px;
          background-color: #2696dd;
          color: #fff;
          font-size: 32px;
          border: none;
          outline: none;
          border-radius: 8px;
        }
      }
    }
    .width-35 {
      width: 35% !important;
    }
    .width-60 {
      width: 60% !important;
    }
    .width-100 {
      width: 100% !important;
    }
    .width-50 {
      width: 50% !important;
    }
    .width-46 {
      width: 46% !important;
    }
    .width-188 {
      width: 188px !important;
    }
    .float-right{
      float: right !important;
    }
    .padding-left-188 {
      padding-left: 188px !important;
    }
  }
</style>
