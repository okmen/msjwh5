<!--
* 公共部分
* 标星(*) 注释 为 接口所需参数
 -->
<template>
  <div class="order-alter-class" id="orderAlterClass">
    <!-- 列表 -->
    <div class="alter-hbs-list pad-side-50">
      <ul>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>车主姓名</span></div>
          <div class="alter-hbs-text">
            <input class="text-input bg-white" maxlength="10" v-model="carOwnerName" placeholder="请输入车主姓名">
          </div>
        </li>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>证件名称</span></div>
          <div class="div-select">
            <span class="btn-select bg-white" @click.stop="cardSelectClick()">{{ cardMassage }}</span>
            <div class="div-select-ul" v-if="cardSelectShow">
              <ul>
                <li v-for="(item, index) in cardSelectData" card-id="item.id"
                    @click.stop="cardSelectClick(item.name, item.id)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>证件号码</span></div>
          <div class="alter-hbs-text">
            <input class="text-input bg-white" type="text" maxlength="19" v-model="cardNum" placeholder="请输入证件号码">
          </div>
        </li>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>手机号码</span></div>
          <div class="alter-hbs-text">
            <input class="text-input bg-white" v-model="userTelphone" type="tel" maxlength="11"
                   placeholder="请输入您的手机号码">
          </div>
        </li>
        <li class="alter-hbs-item clear">
          <div class="alter-hbs-name"><span>验证码</span></div>
          <div class="alter-hbs-text width-60 left">
            <input class="text-input bg-white" type="tel" maxlength="6" v-model="validCode" placeholder="请输入验证码">
          </div>
          <div class="left alter-hbs-code">
            <button class="verifyButton" type="button" name="button" @click.stop="getVerification()"
              :class="{disabled: isdisabled}" :disabled="this.isdisabled">{{getValidCodeMsg}}
            </button>
          </div>
        </li>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>预约地点</span></div>
          <div class="div-select">
            <span class="btn-select bg-white" @click.stop="orderPlaceClick()">{{ orderPlaceValue }}</span>
            <div class="div-select-ul" v-if="orderPlaceShow">
              <ul>
                <li v-for="item in appointPlaceData" place-id="item.id"
                    @click.stop="orderPlaceClick(item.name, item.id, item.description)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>预约日期</span></div>
          <div class="div-select">
            <input class="btn-select bg-white" type="text" readonly placeholder="请选择预约日期"
                   @click.stop="dateClick()" v-model="orderAllDate">
            <div class="div-select-ul date-style" v-if="dateShow">
              <ul>
                <li v-for="(item, index) in orderAllDateData" @click.stop="dateClick(item, index)">{{item}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="alter-hbs-item">
          <div class="alter-hbs-name"><span>预约时间</span></div>
          <div class="div-select">
            <input class="btn-select bg-white" type="text" readonly placeholder="请选择预约时间"
                   @click.stop="selectOrderTime()" v-model="selectDetailTime">
            <div class="div-select-ul date-style" v-if="detailTimeShow">
              <ul>
                <li class="alter-detail-time" v-for="(item, index) in orderDetailsTime"
                    @click.stop="selectOrderTime(item.time, index, item.leftNum)"
                    :class="{'time-full': item.leftNum === 0, 'active': index === activeIndex && item.leftNum !== 0}">
                  <p>{{item.time}}</p>
                  <p v-if="item.leftNum === 0">已满</p>
                  <p v-else="item.leftNum !== 0">剩余名额<span class="yy_yysl">{{item.leftNum}}</span>位</p>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div class="alter-button-box">
        <button class="btn alterButton" @click="appointTaskClick">预 约</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../../../service/getData'
  import { isPhone, specialCharacters } from '../../../../../service/regExp.js'
  import { simpleSendMessage,
           getPageInit,
           getAppointmentDate,
           getAppTimes } from '../../../../../config/baseUrl'
  import { Toast } from 'mint-ui'
  export default {
    props: ['currentBusinessId', 'currentBusinessCode'],
    data () {
      return {
        carOwnerName: '',                   // * 车主姓名
        cardNum: '',                        // * 证件号码
        cardMassage: '',                    // 证件名称 选中值
        cardID: '',                         // * 证件名称 选中 id
        cardSelectShow: false,              // 是否显示 证件名称 ul列表
        cardSelectData: [],                 // 证件名称 li
        userTelphone: '',                   // * 手机号
        validCode: '',                      // * 验证码
        getValidCodeMsg: '获取验证码',
        isdisabled: false,
        orderPlaceValue: '',                // * 预约地点 选中值
        orderPlaceAddress: '',              // * 预约地点 address
        orderPlaceID: '',                   // * 预约地点 选中 id
        orderPlaceShow: false,              // 是否显示 预约地点 ul列表
        appointPlaceData: [],               // 预约地点 li
        dateShow: false,
        orderAllDate: '',                   // * 获取 年月日 值
        orderAllDateData: [],               // 获取 日期 li
        orderDetailsTime: [],               // 预约 具体时间 li
        detailTimeShow: false,
        activeIndex: '',                    // 当前点击时间的li
        selectDetailTime: '',               // * 选择的具体时间
        orderWay: ''                        // * 预约方式
      }
    },
    mounted () {
    },
    computed: {
      // 获取 预约日期 请求参数
      timeRequest () {
        return {
          businessTypeId: this.currentBusinessId,
          orgId: this.orderPlaceID   // 预约地点
        }
      },
      // 获取 具体时间 参数
      getTimesData () {
        return {
          businessTypeId: this.currentBusinessId,    // 业务类型
          orgId: this.orderPlaceID,                  // 预约地点
          date: this.orderAllDate                    // 预约日期
        }
      }
    },
    watch: {
      currentBusinessId (val) {
        console.log('业务ID', val)
        this.initData()
      },
      currentBusinessCode (val) {
        console.log('业务code', val)
      },
      orderPlaceID () {   // 当预约地点改变的时候 清空预约日期和预约时间
        this.orderAllDate = ''
        this.orderAllDateData = []
        this.selectDetailTime = ''
        this.orderDetailsTime = []
      },
      orderAllDate () {   // 预约日期改变的时候 清空预约时间
        this.selectDetailTime = ''
        this.orderDetailsTime = []
      }
    },
    methods: {
      // 初始化页面 证件，车辆类型，使用性质
      initData () {
        let init = {
          businessTypeId: this.currentBusinessId,
          type: '0'
        }
        resultPost(getPageInit, init).then(json => {
          console.log(json)
          if (json.code === '0000') {
            if (json.data) {
              for (let i in json.data.orgVOs) {
                json.data.orgVOs[i].description = json.data.orgVOs[i].description.replace(/<(?!\/?img.+?>)[^<>]*>/gi, '')
              }
              // 证件 id name
              this.cardSelectData = json.data.idTypeVOs
              this.cardMassage = this.cardSelectData[0].name
              this.cardID = this.cardSelectData[0].id
              console.log(this.cardMassage + this.cardID)
              // 预约地点 id name
              this.appointPlaceData = json.data.orgVOs
              this.orderPlaceValue = this.appointPlaceData[0].name
              this.orderPlaceID = this.appointPlaceData[0].id
              this.orderPlaceAddress = this.appointPlaceData[0].description
            }
          }
        })
      },

      // 证件名称 选择
      cardSelectClick: function (str, id) {
        if (str) {
          this.cardMassage = str
          this.cardID = id
          console.log('证件id', this.cardID)
        }
        if (this.cardSelectShow === true) {
          this.cardSelectShow = false
        } else {
          this.cardSelectShow = true
          this.orderPlaceShow = false       // 如果其它的下拉框是显示的，关闭
          this.dateShow = false
          this.detailTimeShow = false
        }
      },

      // 预约地点 选择
      orderPlaceClick: function (str, placeID, address) {
        if (str) {
          this.orderPlaceValue = str
          this.orderPlaceID = placeID
          this.orderPlaceAddress = address
          console.log('预约地点id', this.orderPlaceID)
        }
        if (this.orderPlaceShow === true) {
          this.orderPlaceShow = false
        } else {
          this.orderPlaceShow = true
          this.cardSelectShow = false
          this.dateShow = false
          this.detailTimeShow = false
        }
      },

      // 根据预约地点 获取预约日期
      getOrderDate () {
        resultPost(getAppointmentDate, this.timeRequest).then(json => {
          console.log(json, '时间获取成功')
          if (json.code === '0000') {
            this.orderAllDateData = json.data
            this.dateShow = true
          } else {
            Toast({message: json.msg, className: 'white', duration: 1500})
          }
        })
      },

      // 选择日期
      dateClick: function (item, index) {
        if (!item && !this.orderAllDate) {  // 当有日期的时候再点击选择日期 不调接口
          this.getOrderDate()
        }
        if (item) {
          this.orderAllDate = item
          console.log(this.orderAllDate)
        }
        if (this.dateShow === true) {
          this.dateShow = false
        } else if (this.dateShow === false && this.orderAllDate) {
          this.dateShow = true
          this.detailTimeShow = false
          this.orderPlaceShow = false
          this.cardSelectShow = false
        }
      },

      // 根据预约日期 获取 具体预约时间
      getDetailsTime: function () {
        resultPost(getAppTimes, this.getTimesData).then(json => {
          if (json.code === '0000') {
            let detailData = []
            json.data.map(item => {
              detailData.push({'time': item.apptime, 'leftNum': item.maxnumber - item.yetnumber})
            })
            this.orderDetailsTime = detailData
            this.detailTimeShow = true
          } else {
            this.orderDetailsTime = ''
            Toast({message: json.msg, className: 'white', duration: 1500})
          }
        })
      },

      // 选择预约时间
      selectOrderTime: function (time, index, leftNum) {
        if (!this.orderAllDate) {
          Toast({message: '请先选择预约日期', className: 'white', duration: 2000})
          return
        }
        if (leftNum === 0) {
          Toast({message: '当前预约日期已满，请选择其它时间', className: 'white', duration: 2000})
          return
        }
        if (!time && !this.selectDetailTime) {  // 当有时间的时候再点击选择日期 不调接口
          this.getDetailsTime()
        }
        if (time) {
          this.activeIndex = index
          this.selectDetailTime = time
          console.log(this.selectDetailTime)
        }
        if (this.detailTimeShow === true) {
          this.detailTimeShow = false
        } else if (this.detailTimeShow === false && this.selectDetailTime) {
          this.detailTimeShow = true
          this.dateShow = false
          this.orderPlaceShow = false
          this.cardSelectShow = false
        }
      },

      // 获取验证码
      getVerification: function () {
        this.orderType()
        let time = 60
        let phonedata = {
          mobile: this.userTelphone,         // 手机号码
          idType: this.cardID,               // 证件id
          lx: '1',                           // 业务类型 (驾驶证业务)
          bookerType: this.orderWay,         // 预约方式
          bookerName: this.carOwnerName,             // 预约人名字
          bookerIdNumber: window.localStorage.getItem('identityCard') || this.cardNum,  // 预约人身份证号码
          idNumber: this.cardNum,            // 本次预约业务填写的证件号码
          codes: this.currentBusinessCode    // 业务类型 code
        }
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.userTelphone))) {
          Toast({message: '请输入正确的手机号码', className: 'white'})
        } else {
          resultPost(simpleSendMessage, phonedata).then(json => {
            if (json.code === '0000') {
              this.getValidCodeMsg = `${time}s`
              this.isdisabled = true
              countDown(this)
              Toast({ message: '验证码已发送', className: 'white', duration: 1500 })
            } else {
              this.getValidCodeMsg = '发送验证码'
              Toast({ message: json.msg, className: 'white', duration: 1500 })
            }
          })
        }
        function countDown (that) {
          setTimeout(() => {
            if (time === 0) {
              that.isdisabled = false
              that.getValidCodeMsg = '发送验证码'
            } else {
              time--
              that.getValidCodeMsg = `${time}s`
              countDown(that)
            }
          }, 1000)
        }
      },

      // 预约 点击事件
      appointTaskClick () {
        if (this.judgeInput()) {
          this.orderType()
          let reqData = {
            businessTypeId: this.currentBusinessId, // 预约类型 id
            name: this.carOwnerName,                // 车主姓名
            idTypeId: this.cardID,                  // 证件种类 id
            idNumber: this.cardNum,                 // 证件号码
            mobile: this.userTelphone,              // 手机号
            msgNumber: this.validCode,              // 验证码
            orgId: this.orderPlaceID,               // 预约地点 id
            orgName: this.orderPlaceValue,          // 预约地点 name
            orgAddr: this.orderPlaceAddress,        // 预约地点 address
            appointmentDate: this.orderAllDate,     // 预约日期
            appointmentTime: this.selectDetailTime, // 预约具体时间
            bookerName: window.localStorage.getItem('userName') || this.carOwnerName,   // 预约车主姓名
            bookerIdNumber: window.localStorage.getItem('identityCard') || this.cardNum, // 预约人身份证号码
            bookerType: this.orderWay,              // 预约方式
            bookerMobile: this.userTelphone         // 获取验证码 手机号
          }
          this.$emit('appointTaskClick', reqData)
        }
      },

      // 预约方式
      orderType () {
        // 预约方式  0非代办（或本人） 1普通代办 2专业代办（企业代办）
        if (window.localStorage.getItem('userName')) {
          this.orderWay = this.carOwnerName === window.localStorage.getItem('userName') ? 0 : 1
        } else {
          this.orderWay = 0
        }
      },

      // 非空 or 错误判断
      judgeInput () {
        if (specialCharacters(this.carOwnerName)) {
          Toast({ message: '车主姓名不能含有特殊字符', className: 'white', duration: 1500 })
          return false
        } else if (!this.carOwnerName) {
          Toast({ message: '请输入车主姓名', className: 'white', duration: 1500 })
          return false
        } else if (!this.cardNum) {
          Toast({ message: '证件号码不能为空', className: 'white', duration: 1500 })
          return false
        } else if (!this.userTelphone) {
          Toast({ message: '手机号码不能为空', className: 'white', duration: 1500 })
          return false
        } else if (!isPhone(this.userTelphone)) {
          Toast({ message: '手机号码格式不正确', className: 'white', duration: 1500 })
          return false
        } else if (!this.validCode) {
          Toast({ message: '请输入验证码', className: 'white', duration: 1500 })
          return false
        } else if (!this.selectDetailTime) {
          Toast({ message: '请选择预约时间', className: 'white', duration: 1500 })
          return false
        }
        return true
      },

      // 不显示 select下拉框
      dontShowUL () {
        this.cardSelectShow = false
        this.abbreviationSelectShow = false
        this.useNatureShow = false
        this.orderPlaceShow = false
        this.carTypeShow = false
        this.typeSelectShow = false
      }
    },
    created () {
      document.addEventListener('click', this.dontShowUL)
    },
    destroyed () {
      document.removeEventListener('click', this.dontShowUL)
    }
  }
</script>
<style lang="less">
  @import '../../../../../style/orderAlter';
</style>
