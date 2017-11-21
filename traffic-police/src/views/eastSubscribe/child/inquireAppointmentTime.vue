<template>
  <div class="appointmentTime-box">
    <div class="appointmentTime-reason" v-if="reasonShow">
      <div class="appointmentTime-reason-content">
        <div class="reason-content-cancel"><img src="../../../images/reason-cancel.png" @click="reasonShow=false"/>
        </div>
        <div class="reason-content">
          <textarea placeholder="请填写取消原因" v-model="cancelReason"></textarea>
        </div>
        <div class="reason-content-confirm" @click="reasonConfirm">确认</div>
      </div>
    </div>
    <div class="appointmentTime-form">
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>车牌号码</span>
        </div>
        <div class="form-line-item div-select width-35">
          <span class="btn-select min-btn-select bgcolor-fff"
                @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
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
          <span class="btn-select bgcolor-fff" @click.stop="licenseSelectClick()"
                :data-type="licenseSelectType">{{ licenseSelectMassage }}</span>
          <div class="div-select-ul" v-if="licenseSelectShow">
            <ul>
              <li v-for="(item, index) in licenseSelectData" @click.stop="licenseSelectClick(item.str, index)">
                {{item.str}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-line padding-left-188">
        <div class="form-line-item item-name width-188">
          <span>车架号后四位</span>
        </div>
        <div class="form-line-item div-select width-100">
          <input maxlength="4" v-model="fourDigitsAfterTheEngine" class="text-input bgcolor-fff" type="text" name="" value=""
                 placeholder="车架号后四位">
        </div>
      </div>
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>手机号码</span>
        </div>
        <div class="form-line-item div-select width-100">
          <input v-model="mobilephone" class="text-input bgcolor-fff" type="tel" name="" value="" placeholder="请输入手机号码">
        </div>
      </div>
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>验证码</span>
        </div>
        <div class="form-line-item div-select width-50">
          <input maxlength="6" v-model="validateCode" class="text-input bgcolor-fff" type="tel" name="" value="" placeholder="请输入验证码">
        </div>
        <div class="form-line-item div-select width-46 float-right" @click="sendCode">
          <button class="blue-btn">点击发送验证码</button>
        </div>
      </div>
    </div>
    <div class="appointmentTime-bottom-btn" @click="btnClick">查 询</div>
    <div class="appointment-content" v-if="list.length">
      <div class="appointment-content-title">
        <div class="line"></div>
        <div class="appointment-title-color">预约结果</div>
        <div class="line"></div>
      </div>
      <div class="appointment-content-item" v-for="(item, index) in list">
        <div class="appointment-item-number group">
          <div class="appointment-item-number-ms">预约编号:</div>
          <div class="appointment-item-number-nr">{{item.apptId}}</div>
        </div>
        <div class="item-content">
          <div class="item-content-info">
            <!--<div class="item-content-info-ms">车牌号码: <span class="item-content-info-nr">{{abbreviationSelectMassage + carNumber.toLocaleUpperCase()}}</span></div>
            <div class="item-content-info-ms">手机号码: <span class="item-content-info-nr">{{mobilephone}}</span></div>-->
            <div class="item-content-info-ms">预约片区: <span
              class="item-content-info-nr">{{item.apptDistrict == 1 ? '梅沙片区' : '大鹏片区'}}</span></div>
          </div>
          <div class="item-content-time">
            <div class="item-content-time-ms">预约时间</div>
            <div class="item-content-time-nr">{{item.apptDate}} {{item.apptInterval == 1 ? '上午' : '下午'}}
            </div>
            <div class="item-content-time-nr">{{item.apptInterval == 1 ? '00:00~12:00' : '12:00~24:00'}}</div>
          </div>
        </div>
        <div class="item-cancel">
          <!--<div class="item-cancel-ms" style="background: #999999" v-if="item.apptStatus == 2">已取消</div>-->
          <a class="item-cancel-ms-left" href="tel:83333333" v-if="item.apptStatus == 0 || item.apptStatus == 6">拥堵报备</a>
          <div class="item-cancel-ms" @click="cancelSubscribe(index)"
               v-if="item.apptStatus == 0 || item.apptStatus == 6">取消预约
          </div>
          <div class="item-cancel-ms overdue" v-else>
            {{item.apptStatus == 2 ? '已取消' : (item.apptStatus == 3 ? '爽约' : (item.apptStatus == 1 ? '已到达' : (item.apptStatus == 4 ? '事后报备' : '临时预约')))}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {resultPost} from '../../../service/getData'
  import {Toast, MessageBox} from 'mint-ui'
  import {sendSMSVerificatioCode, getApptHistoryRecord, cancelNormalApptInfo} from '../../../config/baseUrl'
  export default {
    data () {
      return {
        selectedIndex: '',
        cancelObj: '',
        reasonShow: false,
        cancelReason: '',
        apptInterval: '',
        apptDate: '',
        apptDistrict: '',
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
        checkedData: '',            // 选中的预约信息
        /* eslint-disable */
        list: [/*{
         "apptDate": "10-06-17 00:00:00.0",
         "apptDistrict": "1",
         "apptId": "DB100000000144",
         "apptInterval": "1",
         "apptStatus": "0"
         },
         {
         "apptDate": "10-06-17 00:00:00.0",
         "apptDistrict": "1",
         "apptId": "DB100000000142",
         "apptInterval": "2",
         "apptStatus": "2"
         }*/
        ]
        /* eslint-enable */
      }
    },
    mounted () {

    },
    methods: {
      isLicenseNo (str) {  // 车牌号码校验
        return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6,7}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str)
      },
      /* eslint-disable */
      checkPhone (str) {
        return /^1[3|4|5|7|8]\d{9}$/.test(str)
      },
      /* eslint-enable */
      sendCode () {  // 发送验证码
        if (!this.checkPhone(this.mobilephone)) {
          Toast({
            message: '手机号码格式不正确',
            duration: '2000'
          })
          return
        }
        let obj = {
          mobilephone: this.mobilephone,
          businessType: 'easternReservation'
        }
        resultPost(sendSMSVerificatioCode, obj).then(json => {
//          console.log(json)
          Toast({
            message: json.data,
            duration: '2000'
          })
        })
      },
      cancelSubscribe (index) {    // 取消预约按钮 获取apptId 预约编号
        this.reasonShow = true
        this.selectedIndex = index
        this.cancelObj = {
          apptId: this.list[index].apptId,
          mobilePhone: this.mobilephone,
          cancelReason: ''
        }
      },
      confirmCancel () {
        MessageBox.confirm('确定取消预约?').then(action => {
          if (!this.checkPhone(this.mobilephone)) {
            Toast({
              message: '手机号码格式不正确',
              duration: '2000'
            })
            return
          }
          if (!this.cancelReason) {
            Toast({
              message: '请填写取消原因',
              duration: '2000'
            })
          }
          console.log(this.list)
          resultPost(cancelNormalApptInfo, this.cancelObj).then(json => {
            console.log(json)
            if (json.code === '0000') {
              this.reasonShow = false
              Toast({
                message: json.msg,
                duration: '2000'
              })
              var changeListInfo = this.list[this.selectedIndex]
              changeListInfo.apptStatus = '2'
              this.$set(this.list, this.selectedIndex, changeListInfo)
            } else {
              Toast({
                message: json.msg,
                duration: '3000'
              })
            }
          })
        }).catch(err => {
          console.log(err)
        })
      },
      reasonConfirm () {   // 原因确认
        this.cancelObj.cancelReason = this.cancelReason
        this.confirmCancel()
      },
      btnClick () {  // 获取查询预约信息
        let carNumbers = this.abbreviationSelectMassage + this.carNumber.toLocaleUpperCase()
        let isTrueCar = this.isLicenseNo(carNumbers)
        if (!isTrueCar) {
          Toast({
            message: '车牌号码格式不正确',
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
            message: '手机号码格式不正确',
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
        let reqData = {
          mobilePhone: this.mobilephone,
          validateCode: this.validateCode,
          plateNo: carNumbers,
          plateType: this.licenseSelectType,
          vinLastFour: this.fourDigitsAfterTheEngine
        }
//        console.log(reqData)
        resultPost(getApptHistoryRecord, reqData).then(json => {
          console.log(json)
          if (json.code === '0000') {
            this.list = json.data
          }
          if (json.code !== '0000') {
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .div-select-ul{
    top: 54px;
  }
  .appointmentTime-reason {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .7);
    z-index: 4;
  }

  .reason-content-cancel {
    height: 68px;
    img {
      width: 24px;
      height: 24px;
      float: right;
      margin-top: 22px;
    }
  }

  textarea {
    resize: none;
    width: 100%;
    height: 400px;
    padding: 24px;
    outline: none;
  }

  .appointmentTime-reason-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 300px;
    margin: 0 auto;
    width: 88%;
    height: 600px;
    padding: 0 5%;
    background: rgb(223, 239, 255);
    overflow: hidden;
    border-radius: 8px;
  }

  .appointment-content {
    margin-top: 75px;
    overflow: hidden;
  }

  .reason-content-confirm {
    width: 233px;
    height: 70px;
    border-radius: 8px;
    background: #1cac19;
    margin: 30px auto 0;
    line-height: 70px;
    color: white;
    text-align: center;
  }

  .line {
    background: #a7d9f9;
    width: 250px;
    height: 2px;
  }

  .appointment-content-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .appointment-title-color {
    color: #2696dd;
  }

  .width-46 {
    width: 46% !important;
  }

  .width-50 {
    width: 50% !important;
  }

  .width-100 {
    width: 100% !important;
  }

  .form-line {
    padding: 35px 0 0 130px;
    position: relative;
    line-height: 60px;
    vertical-align: middle;
    .form-line-item {
      display: inline-block;
      height: 60px;
      line-height: 60px;
      font-size: 28px;
      vertical-align: middle;
      span {
        vertical-align: super;
      }
      .text-input {
        vertical-align: middle;
      }
      .bgcolor-fff {
        background-color: #fff;
      }
      .blue-btn {
        width: 100%;
        line-height: 60px;
        background-color: #2696dd;
        color: #fff;
        font-size: 26px;
        border-radius: 8px;
        outline: none;
      }
    }
    .abs-p {
      position: absolute;
      top: 0;
      text-align: center;
      font-size: 22px;
      color: #999;
      line-height: 35px;
    }
  }

  .appointment-content-item {
    border: 1px solid #a7d9f9;
    background: white;
    margin-top: 30px;
    overflow: hidden;
  }

  .appointment-item-number {
    padding: 20px 32px;
    border-bottom: 1px solid #a7d9f9;
    font-weight: 600;
  }

  .group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .appointment-item-number-nr {
    color: #ff0000;
    margin-left: 20px;
  }

  .item-content {
    padding-left: 32px;
    padding-top: 20px;
  }

  .item-content-info-ms {
    height: 55px;
    line-height: 55px;
  }

  .item-content-info-nr {
    color: #333;
    font-weight: 600;
  }

  .item-content-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 46px;
  }

  .item-content-time-ms {
    margin-bottom: 12px;
  }

  .item-content-time-nr {
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    color: #333333;
  }

  .item-cancel {
    overflow: hidden;
    padding-right: 32px;
    padding-left: 32px;
    height: 160px;
    width: 100%;
  }

  .item-cancel-ms {
    float: right;
    width: 207px;
    height: 60px;
    margin-top: 60px;
    border-radius: 8px;
    background: #f95553;
    text-align: center;
    line-height: 60px;
    color: white;
  }
  .item-cancel-ms-left{
    display: block;
    float: left;
    width: 207px;
    height: 60px;
    margin-top: 60px;
    border-radius: 8px;
    background: rgb(38,151,221);
    text-align: center;
    line-height: 60px;
    color: white;
  }
  .overdue {
    color: #999999;
    background: white;
    border: 1px solid #2d2d2d;
  }

  .appointmentTime-bottom-btn {
    margin: 20px auto;
    text-align: center;
    width: 40%;
    line-height: 70px;
    height: 70px;
    background-color: #2696dd;
    color: #fff;
    font-size: 32px;
    border-radius: 8px;
  }

  .appointmentTime-box {
    position: relative;
    min-height: 1150px;
    background: url('../../../images/eastSubscribe-bottom.png') no-repeat center bottom #dfefff;
    background-size: contain;
    padding: 0 50px 480px;
    .appointmentTime-form {
      .form-line {
        padding: 35px 0 0 130px;
        position: relative;
        line-height: 60px;
        vertical-align: middle;
        .form-line-item {
          display: inline-block;
          height: 60px;
          line-height: 60px;
          font-size: 28px;
          vertical-align: middle;
          span {
            vertical-align: super;
          }
          .text-input {
            vertical-align: middle;
          }
          .bgcolor-fff {
            background-color: #fff;
          }
          .blue-btn {
            width: 100%;
            line-height: 60px;
            background-color: #2696dd;
            color: #fff;
            font-size: 26px;
            border-radius: 8px;
            outline: none;
          }
        }
        .abs-p {
          position: absolute;
          top: 0;
          text-align: center;
          font-size: 22px;
          color: #999;
          line-height: 35px;
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
    .float-right {
      float: right !important;
    }
    .padding-left-188 {
      padding-left: 188px !important;
    }
  }

  .option-item {
    overflow: hidden;
    width: 100%;
  }

  .bg-red {
    background: #fb4b68;
  }

  .bg-green {
    background: #2baf31;
  }

  .bg-yellow {
    background: yellow;
  }

  .bg-gray {
    background: rgb(161, 161, 161);
  }
</style>
