<template>
  <div class="exemption">
    <div class="exemption-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车牌号码</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="vehiclePlate()">{{ vehicle }}</span>
            <div class="div-select-ul" v-if="vehicleShow">
              <ul>
                <li v-for="item in cars" @click.stop="vehiclePlate(item)" v-if="item.isMySelf == 0">{{item.myNumberPlate}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车主姓名</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="" v-model="name" readonly/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>申请人类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="applyClick()">{{ applyMassage }}</span>
            <div class="div-select-ul" v-if="applyShow">
              <ul>
                <li v-for="item in applyData" @click.stop="applyClick(item.longName, item.applyId)">{{item.longName}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>行驶证编号</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" v-model="drivingLicense" value="" placeholder="请输入行驶证编号" />
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>手机号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" v-model="mobile" value="" placeholder="请输入手机号码"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>验证码</span>
          </div>
          <div class="form-line-item width-60">
            <input class="text-input stylebackground" type="text" name="" v-model="identifying" value="" placeholder="请输入验证码">
          </div>
          <div class="form-line-item right width-35">
            <button class="btn browse-code" v-bind:class="{ 'show' : isShow}" :disabled="forbidden" @click="scanQRCode()">{{chronoScope}}</button>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>固定号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" value="" v-model="telno" placeholder="请输入固定号码(非必填)"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人姓名</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="" v-model="addresseeName" readonly />
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人电话</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="" v-model="addresseeMobile" readonly />
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>邮政编码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" v-model="postalcode" value="" placeholder="请输入邮政编码"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人地址</span>
          </div>
          <div class="form-line-item width-40 city">
            <span>深圳市</span>
          </div>
          <div class="div-select form-line-item width-50">
            <span class="btn-select stylebackground" @click.stop="areaSelectClick()">{{ areaSelectMassage }}</span>
            <div class="div-select-ul" v-if="areaSelectShow">
              <ul>
                <li v-for="item in areaSelectData" @click.stop="areaSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span></span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" v-model="mailingAddress" type="text" name="" value="" placeholder="请输入详细地址">
          </div>
        </li>
        <li class="form-li">
          <span>保险生效日期</span>
        </li>
        <li class="form-li">
          <div class="form-line-item text-input stylebackground subscript" @click="datetimePick('picker')">
            <span>{{mtDateTimeMsg}}</span>
          </div>
        </li>
        <li class="form-li">
          <span>保险终止日期</span>
        </li>
        <li class="form-li">
          <div class="form-line-item text-input stylebackground subscript" @click="terminationPick('pick')">
            <span>{{DateTimeMsg}}</span>
          </div>
        </li>
        <li class="form-li">
          <span>保险结果告知方式</span>
        </li>
        <li class="form-li">
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="placeSelectClick()">{{ placeSelectMassage }}</span>
            <div class="div-select-ul" v-if="placeSelectShow">
              <ul>
                <li v-for="item in placeSelectData" @click.stop="placeSelectClick(item.longName, item.shortName)">{{item.longName}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>预约人</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" v-model="appointment" value="" placeholder="请输入预约人姓名"/>
          </div>
        </li>
        <li class="form-li">
          <span>预约人身份证号</span>
        </li>
        <li class="form-li">
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" name="" v-model="appointmentID" value="" placeholder="请输入预约人身份证号">
          </div>
        </li>
        <li class="form-li">
          <span>预约方式</span>
        </li>
        <li class="form-li">
          <div class="form-line-item">
            <input class="text-input" type="text" name="" value="本人" readonly>
          </div>
        </li>
        <li class="form-annotation">注:只能申请本人名下车辆</li>
      </ul>
      <button class="btn btns" v-if="this.Plate" @click.stop="submitClick()">确认信息</button>
      <button class="btn btns" style="background: gray" v-if="!this.Plate">确认信息</button>
      <mt-datetime-picker ref="picker" type="date" v-model="informTime" @confirm="handleTime"></mt-datetime-picker>
      <mt-datetime-picker ref="pick" type="date" v-model="informTimes" @confirm="handleTimes"></mt-datetime-picker>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { resultPost } from '../../../../../service/getData'
import { sendSMS, verificatioCode, createVehicleInspection, getCarTypeId } from '../../../../../config/baseUrl'
import { Toast, MessageBox } from 'mint-ui'
export default {
  name: 'exemption',
  computed: {
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  components: {
    'pageBottom': require('../../../../../components/pageBottom.vue')
  },
  data () {
    return {
      name: window.localStorage.getItem('userName'),     // 所有人名字
      addresseeName: window.localStorage.getItem('userName'),  // 收件人名字
      addresseeMobile: window.localStorage.getItem('mobilePhone'),  // 收件人手机号码
      isShow: false,
      mtDateTimeMsg: '',                           // 保险生效时间进页面默认时间
      DateTimeMsg: '',                             // 保险终止时间进页面默认时间
      pickerValue: '',
      formatTime: '',                              // 使用mt组件后，时间是中国标准时间，格式转换
      informTime: this.currentTime(),              // 保险生效时间当前时间
      informTimes: this.currentTime(),             // 保险终止时间当前时间
      applyId: '1',                                // 申请人id
      cur_place_id: '1',                           // 保险告知方式
      cur_area_id: '01',                           // 默认区名id  01为福田
      placeSelectShow: false,
      placeSelectMassage: '互联网查询',            // 发证机默认第一条名称
      placeSelectData: [
        {
          'shortName': '1',
          'longName': '互联网查询'
        },
        {
          'shortName': '2',
          'longName': '短信告知'
        },
        {
          'shortName': '3',
          'longName': '非移动电话告知'
        }
      ],                                           // 发证机关列表 数据从接口查出
      vehicleShow: false,
      vehicle: window.localStorage.getItem('myNumberPlate'),                         // 车牌下拉
      applyShow: false,                            // 申请人类型样式
      applyMassage: '机动车所有人',
      applyData: [
        {
          'longName': '机动车所有人',
          'applyId': '1'
        },
        {
          'longName': '代理人',
          'applyId': '2'
        }
      ],
      areaSelectShow: false,
      areaSelectMassage: '福田区',
      areaSelectData: [
        {
          'id': '01',
          'str': '福田区'
        },
        {
          'id': '02',
          'str': '罗湖区'
        },
        {
          'id': '03',
          'str': '南山区'
        },
        {
          'id': '04',
          'str': '宝安区'
        },
        {
          'id': '05',
          'str': '龙岗区'
        },
        {
          'id': '06',
          'str': '盐田区'
        },
        {
          'id': '07',
          'str': '龙华新区'
        },
        {
          'id': '08',
          'str': '光明新区'
        },
        {
          'id': '09',
          'str': '坪山新区'
        },
        {
          'id': '10',
          'str': '大鹏新区'
        }
      ],
      telno: '',                                  // 固定号码
      mobile: '',                                 // 手机号码
      chronoScope: '获取验证码',
      forbidden: false,                           // 验证码按钮禁用设置
      drivingLicense: '',                         // 行驶证编码
      identifying: '',                            // 验证码
      postalcode: '',                             // 邮政编码
      mailingAddress: '',                         // 详细地址
      appointment: '',                            // 预约人
      appointmentID: '',                          // 预约人身份证
      bookerType: '0',                            // 预约方式
      cars: {},
      plateType: '',
      carTypeId: '',
      Plate: ''
    }
  },
  created () {
    this.Plate = window.localStorage.getItem('myNumberPlate')
    if (!this.Plate) {
      MessageBox('温馨提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
    }
  },
  mounted: function () {
    this.cars = JSON.parse(window.localStorage.getItem('cars'))
    let getTime = this.currentTime()
    let getTimes = this.currentTime('take')
    this.mtDateTimeMsg = getTime
    this.DateTimeMsg = getTimes
    this.plateType = this.cars[0].plateType  // 车辆类型
    document.addEventListener('click', (e) => {
      this.vehicleShow = false
      this.applyShow = false
      this.placeSelectShow = false
      this.areaSelectShow = false
      this.appointmentShow = false
    })
  },
  methods: {
    // 车牌下拉框
    vehiclePlate: function (item) {
      if (!item) {
        if (this.vehicleShow === true) {
          this.vehicleShow = false
        } else {
          this.vehicleShow = true
        }
      } else {
        this.vehicle = item.myNumberPlate
        this.name = item.name
        this.plateType = item.plateType
        this.vehicleShow = false
      }
    },
    // 申请人类型下拉框
    applyClick: function (str, id) {
      if (str) {
        this.applyMassage = str
        this.applyId = id
      }
      if (this.applyShow === true) {
        this.applyShow = false
      } else {
        this.applyShow = true
      }
    },
    // 保险告知方式下拉框
    placeSelectClick: function (str, id) {
      if (str) {
        this.placeSelectMassage = str
        this.cur_place_id = id
      }
      if (this.placeSelectShow === true) {
        this.placeSelectShow = false
      } else {
        this.placeSelectShow = true
      }
    },
    // 收件人地址
    areaSelectClick: function (str, id) {
      if (str) {
        this.areaSelectMassage = str
        this.cur_area_id = id
      }
      if (this.areaSelectShow === true) {
        this.areaSelectShow = false
      } else {
        this.areaSelectShow = true
      }
    },
    datetimePick: function (picker) {
      this.$refs.picker.open()
    },
    terminationPick: function (picker) {
      this.$refs.pick.open()
    },
    // 保险生效日期
    handleTime: function (informTime) {
      this.formatTime = this.format(this.informTime.toString(), 'yyyy-MM-dd')
      this.mtDateTimeMsg = this.formatTime
    },
    // 保险生效日期
    handleTimes: function (informTimes) {
      this.formatTimes = this.format(this.informTimes.toString(), 'yyyy-MM-dd')
      if (this.formatTimes < this.mtDateTimeMsg) {
        Toast({message: '请选择生效日期以后日期', position: 'bottom', className: 'white'})
      } else {
        this.DateTimeMsg = this.formatTimes
      }
    },
    currentTime: function (str) {  // 获取时间
      let now = new Date()
      let year = now.getFullYear()       // 年
      let month = now.getMonth() + 1     // 月
      let day = now.getDate()            // 日
      if (str === 'take') {
        let clock = year + 1 + '-'
        if (month < 10) {
          clock += '0'
        }
        clock += month + '-'
        if (day < 10) {
          clock += '0'
        }
        clock += day
        return (clock)
      } else {
        let clock = year + '-'
        if (month < 10) {
          clock += '0'
        }
        clock += month + '-'
        if (day < 10) {
          clock += '0'
        }
        clock += day
        return (clock)
      }
    },
    ...mapActions({
      postAppoin: 'postAppoin'
    }),
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
    // 获取验证码
    scanQRCode: function () {
      let mobile = this.mobile
      if (!(mobile)) {
        Toast({message: '请输入手机号', position: 'bottom', className: 'white'})
      } else if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.mobile))) {
        Toast({message: '请输入正确的手机号码', position: 'bottom', className: 'white'})
      } else {
        let phonedata = {
          mobilephone: this.mobile,
          businessType: 'szjj'
        }
        resultPost(sendSMS, phonedata).then(json => {
          if (json.code === '0000') {
            this.timePiece()
          } else {
            Toast({message: json.data, position: 'bottom', className: 'white'})
          }
        })
      }
    },
    // 验证码倒计时
    timePiece: function () {
      clearInterval(this.Timepiece)
      this.forbidden = true
      this.isShow = true
      var str = 60
      this.Timepiece = setInterval(() => {
        str = --str
        this.chronoScope = str + 's'
        if (this.chronoScope === 0 + 's') {
          clearInterval(this.Timepiece)
          this.chronoScope = '获取验证码'
          this.forbidden = false
          this.isShow = false
        }
      }, 1000)
    },
    dataFn: function () {
      let dataList = {
        type: '六年免检申请',
        url: createVehicleInspection,
        textObj: {
          'numberPlate': this.vehicle,                // 车牌号码
          'name': this.name,                          // 所有人
          'personType': this.applyId,                 // 申请人类型
          'driveLicenseNumber': this.drivingLicense,  // 行驶证编号
          'mobilephone': this.mobile,                 // 手机号码
          'telno': this.telno,                        // 固定号码
          'receiverName': this.addresseeName,         // 收件人姓名
          'receiverNumber': this.addresseeMobile,     // 收件人电话
          'postCode': this.postalcode,                // 邮政编码
          'receiverAddress': `深圳市${this.areaSelectMassage}${this.mailingAddress}`,    // 收件人地址
          'effectiveDate': this.mtDateTimeMsg,        // 保险生效日期
          'terminationDate': this.DateTimeMsg,        // 保险终止日期
          'inform': this.cur_place_id,                // 保险告知方式
          'bookerName': this.appointment,             // 预约人名字
          'bookerIdentityCard': this.appointmentID,   // 预约人身份证
          'bookerType': this.bookerType               // 预约方式
        },
        invisibleObj: {
          'carTypeId': this.carTypeId                             // 证件类型ID
        }
      }
      this.$store.commit('saveMotorVehicleHandling', dataList)
      this.$router.push(/_WeChat/g.test(this.$route.name) ? '/affirmInfo_WeChat' : '/affirmInfo')
    },
    // 验证码验证接口
    verificationFn: function () {
      let verificationData = {
        mobilephone: this.mobile,
        validateCode: this.identifying
      }
      resultPost(verificatioCode, verificationData).then(json => {
        if (json.code === '0000') {
          this.carIdFn()
        } else {
          Toast({message: json.data, position: 'bottom', className: 'white'})
        }
      })
    },
    submitClick: function () {
      if (!this.drivingLicense) {
        Toast({message: '请输入行驶证编号', position: 'bottom', className: 'white'})
      } else if (!this.mobile) {
        Toast({message: '请输入手机号码', position: 'bottom', className: 'white'})
      } else if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.mobile))) {
        Toast({message: '请输入正确的手机号码', position: 'bottom', className: 'white'})
      } else if (!this.postalcode) {
        Toast({message: '请输入邮政编码', position: 'bottom', className: 'white'})
      } else if (!this.mailingAddress) {
        Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
      } else if (!this.appointment) {
        Toast({message: '请输入预约人姓名', position: 'bottom', className: 'white'})
      } else if (!this.appointmentID) {
        Toast({message: '请输入预约人身份证号', position: 'bottom', className: 'white'})
      } else if (this.mtDateTimeMsg > this.DateTimeMsg) {
        Toast({message: '请选择生效日期以后日期', position: 'bottom', className: 'white'})
      } else if (!this.identifying) {
        Toast({message: '请输入验证码', position: 'bottom', className: 'white'})
      } else if (this.identifying.length !== 6) {
        Toast({message: '请输入正确验证码', position: 'bottom', className: 'white'})
      } else {
        this.verificationFn()
      }
    },
    // 获取证件类型ID
    carIdFn: function () {
      let carIdFnData = {
        arg0: '',
        arg1: '',
        code: this.plateType
      }
      resultPost(getCarTypeId, carIdFnData).then(json => {
        console.log(json)
        if (json.code === '0000') {
          this.carTypeId = json.data
          this.dataFn()
        } else {
          Toast({message: json.msg, position: 'bottom', className: 'white'})
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.exemption {
background-color: #fff;
position: absolute;
left: 0;
right: 0;
padding: 20px 40px;
  .exemption-form {
    background-color: #fff;
    padding-top:20px;
    .form-line {
      padding: 20px 0 0 180px;
      position: relative;
      line-height: 56px;
      .form-line-item {
        width: 100%;
        display: inline-block;
        height: 60px;
        line-height:60px;
        .photo-ex {
          color: #2696dd;
        }
        span {
          vertical-align: middle;
        }
        .browse-code {
          margin: 0;
          display: inline-block;
          height: 56px;
          width: 100%;
          line-height: 56px;
          border-radius: 10px;
          text-align: center;
          color:#fff;
          vertical-align:middle;
        }
        &.city {
          margin: 0 18px;
        }
      }
      .item-name {
        width: 180px;
        position: absolute;
        left: 0;
      }
      .div-select {
        font-size: 26px;
      }
    }
    .form-li{
      width: 100%;
      display: inline-block;
      height: 60px;
      line-height:60px;
      span{
        font-size: 26px !important;
      }
    }
    .form-annotation{
      padding-top: 16px;
      color: red;
      font-size: 26px !important;
    }
  }
  .width-40 {
    width: 40% !important;
  }
  .width-35 {
    width: 35% !important;
  }
  .width-50 {
    width: 50% !important;
  }
  .width-60 {
    width: 60% !important;
  }
  .btn {
    width: 280px;
    margin-top:30px;
    display: inline-block;
  }
  .btns{
    margin: 60px 0 30px 0;
    width: 100%;
  }
  .btn-select{
    height: 56px;
  }
  .div-select-ul{
    font-size: 26px;
  }
  .show{
    background: #999999;
  }
  .stylebackground{
    background-color: #fff;
  }
  .subscript{
    background: url(../../../../../images/select1.png) no-repeat;
    background-size: 18px;
    background-position: 96% center;
  }
/*  .exefont{
    font-size: 19px !important;
  }*/
}
</style>
