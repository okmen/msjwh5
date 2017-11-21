<template>
  <div class="appointmentTime-box">
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
      <div class="form-line">
        <div class="form-line-item item-name">
          <span>车辆类型</span>
        </div>
        <div class="form-line-item div-select width-100">
          <span class="btn-select bgcolor-fff" @click.stop="carSelectClick()"
                :data-type="carSelectType">{{ carSelectMassage }}</span>
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
    <div class="appointmentTime-select">
      <div class="appointmentTime-select-top">
        <p>选择预约时间</p>
        <span>温馨提示:绿色为充裕,黄色为良好,红色为紧张,深灰色为不可预约。</span>
      </div>
      <div class="appointmentTime-select-option">
        <div class="option-item" v-for="(item, index) in optionData">
          <div class="option-item-only" style="float: left;margin-left: 6px" @click="amClick(index)">
            <div class="option-item-text" :class="{ active:item.amSelected}">
              <p class="option-item-p option-item-p28">{{ item.apptDistrict == 1 ? '梅沙片区' : '大鹏半岛片区' }}</p>
              <p class="option-item-p">{{ item.apptDate }}</p>
              <p class="option-item-p">上午(00:00~12:00)</p>
            </div>
            <div class="option-item-selected" :class="{'has-selected':item.amSelected}"></div>
          </div>
          <div class="option-item-only" style="float: right;margin-right: 6px" @click="pmClick(index)">
            <div class="option-item-text" :class="{ active: item.pmSelected }">
              <p class="option-item-p option-item-p28">{{ item.apptDistrict == 1 ? '梅沙片区' : '大鹏半岛片区' }}</p>
              <p class="option-item-p">{{ item.apptDate }}</p>
              <p class="option-item-p">下午(12:00~24:00)</p>
            </div>
            <div class="option-item-selected" :class="{'has-selected':item.pmSelected}"></div>
          </div>
          <div class="option-item-title" style="float: right;margin-top: -10px;">当日预约总量</div>
          <div class="option-item-progress" style="float: right">
            <div class="option-item-Mask"
                 :class="{'bg-gray':(item.leftQuota/item.totalQuota).toFixed(2)==0,'bg-red':(item.leftQuota/item.totalQuota).toFixed(2)<0.4&&(item.leftQuota/item.totalQuota).toFixed(2)>0,'bg-green':(item.leftQuota/item.totalQuota).toFixed(2)>0.8,'bg-yellow':(item.leftQuota/item.totalQuota).toFixed(2)<=0.8&&(item.leftQuota/item.totalQuota).toFixed(2)>=0.4}"
                 :style="{width:((item.totalQuota-item.leftQuota)/item.totalQuota * 100).toFixed(2) + '%'}"></div>
          </div>
        </div>
      </div>
      <div class="appointmentTime-select-bottom">
        <div class="appointmentTime-bottom-text">
          <p class="appointmentTime-bottom-text-h3">温馨提示：</p>
          <p>1、网络预约在法定节假日开始前7个自然日开启，可预约最近1个法定节假日、休息日内任1天（如5月21日起可预约端午假期5月28日至5月30日中任何1天）。</p>
          <p>2、网络预约区域分为梅沙片区和大鹏新区，允许同时预约两个景区。</p>
          <p>3、网络预约只预约到达日期，离开不受限制，车辆离开东部景区后隔日重新返回东部景区，需要重新预约，在景区内部行驶不受限制。</p>
          <p>
            4、1年内累计有3次预约成功后未履约前往情形的，取消当年预约资格（预约手机号和预约车牌均不得预约）。预约上午到达的游客可在9点前取消，预约下午到达的游客可在14点前取消，反复取消后重新预约3次的，取消此次节假日的预约资格。</p>
          <p>5、因交通拥堵未在预约时间内抵达的，通过<a href="tel:83333333">83333333</a>电话报备，不视为违约，免于处罚。但不得超过预约时间12个小时。</p>
        </div>
        <button class="appointmentTime-bottom-btn" @click="btnClick()">预 约</button>
      </div>
    </div>
  </div>
</template>
<script>
  import {resultPost} from '../../../service/getData'
  import {Toast} from 'mint-ui'
  import {getNormalApptDistrictAndTime, sendSMSVerificatioCode, addNormalApptInfo} from '../../../config/baseUrl'
  export default {
    data () {
      return {
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
        checkedData: '',                              // 选中的预约信息
        /* eslint-disable */
        optionData:  [
          /*{
            "apptDate": "2017-06-10",
            "apptDistrict": "1",
            "leftQuota": "100",
            "totalQuota": "13000"
          },
          {
            "apptDate": "2017-06-11",
            "apptDistrict": "1",
            "leftQuota": "1000",
            "totalQuota": "13000"
          },
          {
            "apptDate": "2017-06-10",
            "apptDistrict": "2",
            "leftQuota": "11001",
            "totalQuota": "13000"
          },
          {
            "apptDate": "2017-06-11",
            "apptDistrict": "2",
            "leftQuota": "13000",
            "totalQuota": "13000"
          }*/
        ]

        /* eslint-enable */
      }
    },
    mounted () {
      this.getInitData()
    },
    methods: {
      isLicenseNo (str) {  // 车牌号码校验
        return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6,7}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str)
      },
      checkPhone (str) {   // 手机号码校验
        return /^1[3|4|5|7|8]\d{9}$/.test(str)
      },
      sendCode () { // 发送验证码
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
          console.log(json)
          Toast({
            message: json.data,
            duration: '2000'
          })
        })
      },
      getInitData () {
        let obj = {}
        resultPost(getNormalApptDistrictAndTime, obj).then(json => {
          this.optionData = json.data
          this.optionData.map(item => {
            this.$set(item, 'amSelected', false)
            this.$set(item, 'pmSelected', false)
          })
        })
      },
      amClick (index) {
        this.optionData.forEach(item => {
          item.amSelected = false
          item.pmSelected = false
        })
        if (this.optionData[index].leftQuota === '0') {
          this.optionData[index].amSelected = false
          Toast({
            message: '该时间段预约已满',
            duration: '2000'
          })
          this.apptDistrict = ''
        } else {
          this.optionData[index].amSelected = true
          this.apptInterval = '1'
          this.apptDate = this.optionData[index].apptDate
          this.apptDistrict = this.optionData[index].apptDistrict
        }
      },
      pmClick (index) {
        this.optionData.forEach(item => {
          item.pmSelected = false
          item.amSelected = false
        })
        if (this.optionData[index].leftQuota === '0') {
          this.optionData[index].pmSelected = false
          Toast({
            message: '该时间段预约已满',
            duration: '2000'
          })
          this.apptDistrict = ''
        } else {
          this.optionData[index].pmSelected = true
          this.apptInterval = '2'
          this.apptDate = this.optionData[index].apptDate
          this.apptDistrict = this.optionData[index].apptDistrict
        }
      },
      btnClick: function () {
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
        if (!this.apptDistrict) {
          Toast({
            message: '请选择预约片区',
            duration: '2000'
          })
          return
        }
        let reqData = {
          mobilePhone: this.mobilephone,
          validateCode: this.validateCode,
          plateNo: carNumbers,
          plateType: this.licenseSelectType,
          vehicleType: this.carSelectType,
          vinLastFour: this.fourDigitsAfterTheEngine,
          apptInterval: this.apptInterval,
          apptDate: this.apptDate,
          apptDistrict: this.apptDistrict
        }
//        console.log(reqData)
        resultPost(addNormalApptInfo, reqData).then(json => {
          console.log(reqData)
          console.log(json)
          Toast({
            message: json.msg,
            duration: '2000'
          })
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .div-select-ul{
    top: 54px;
  }
  .appointmentTime-box {
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
    .appointmentTime-select {
      .appointmentTime-select-top {
        p {
          font-size: 28px;
          color: #000;
          line-height: 60px;
        }
        span {
          font-size: 22px;
          color: #999;
        }
      }
      .appointmentTime-select-option {
        background: white;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        padding: 0 20px;
        .option-item-progress {
          width: 100%;
          height: 20px;
          border-radius: 10px;
          background: #e5e5e5;
          margin: 20px 0;
          position: relative;
          padding: 3px;
          .option-item-Mask {
            height: 14px;
            border-radius: 7px;
          }
        }
        .option-item-title {
          width: 100%;
          text-align: center;
          color: #999;
          font-size: 24px;

        }
        .option-item-only {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          .option-item-text {
            box-shadow: 0 0 8px #8b8b8b;
            width: 284px;
            height: 160px;
            position: relative;
            text-align: center;
            margin-top: 20px;
            border: 2px solid #999;
            background-color: #fff;
            border-radius: 8px;
            .option-item-p {
              color: #666;
              font-size: 24px;
              line-height: 48px;
            }
            .option-item-p28 {
              font-size: 28px;
            }
          }
          .active {
            border-color: #2dc634;
          }
          .option-item-selected {
            margin-top: 12px;
            width: 32px;
            height: 32px;
            background: url("../../../images/eastNoSelected.png") no-repeat center/contain;
          }
          .has-selected {
            background-image: url("../../../images/eastSelected.png");
          }
          .option-item-Mask {
            position: absolute;
            z-index: 0;
            height: 100%;
            top: 0;
            right: 0;
            background-color: #84dd83;
          }
        }
      }
      .appointmentTime-select-bottom {
        .appointmentTime-bottom-text {
          padding-bottom: 55px;
          .appointmentTime-bottom-text-h3 {
            font-size: 28px;
            color: #2696dd;
            line-height: 70px;
          }
          p {
            font-size: 26px;
            color: #666;
            line-height: 35px;
          }
        }
        .appointmentTime-bottom-btn {
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
