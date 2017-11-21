<template>
  <div class="renewing">
    <div class="alter-select pad-side-50">
      <div class="alter-chose"><span>业务类型</span></div>
      <div class="div-select alter-wd"><span>{{nametype}}</span></div>
    </div>
    <div class="renewingCollar">
      <div class="renewingCollar-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车主姓名</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" placeholder="请输入车主姓名" v-model="name"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件名称</span>
          </div>
          <div class="div-select">
            <span class="btn-select bg-colour" @click.stop="varietyID()">{{ variety }}</span>
            <div class="div-select-ul" v-if="varietyShow">
              <ul>
                <li v-for="item in varietyData" @click.stop="varietyID(item.name, item.id)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" placeholder="请输入证件号码" v-model="identificationNum"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>手机号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" placeholder="请输入手机号码" v-model="mobilephone"/>
          </div>
        </li>
        <li class="form-line">
            <div class="form-line-item item-name">
              <span>验证码</span>
            </div>
            <div class="form-line-item width-60">
              <input class="text-input bg-colour" type="text" v-model="identifying" name="" value="" maxlength="6" placeholder="请输入验证码">
            </div>
            <div class="form-line-item right width-35">
              <button class="btn browse-code" v-bind:class="{ 'show' : isShow}" :disabled="forbidden" @click="scanQRCode()">{{chronoScope}}</button>
            </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>预约地点</span>
          </div>
          <div class="div-select">
            <span class="btn-select bg-colour" @click.stop="subscribeClick()">{{ subscribe }}</span>
            <div class="div-select-ul" v-if="subscribeShow">
              <ul>
                <li v-for="item in businessData" @click.stop="subscribeClick(item.name, item.id, item.description)">{{item.name}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>预约日期</span>
          </div>
          <div class="div-select">
            <!-- <span class="btn-select bg-colour" @click.stop="dateType()">{{ date }}</span> -->
            <input class="btn-select bg-colour" placeholder="请选择预约日期" @click.stop="dateType()" v-model="date" type="text" name="" readonly>
            <div class="div-select-ul date-style" v-if="dateShow">
              <ul>
                <li v-for="item in dateData" @click.stop="dateType(item)">{{item}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>预约时间</span>
          </div>
          <div class="div-select">
            <!-- <span class="btn-select bg-colour" @click.stop="timeType()">{{ time }}</span> -->
             <input class="btn-select bg-colour" placeholder="请选择预约时间" @click.stop="timeType()" v-model="time" type="text" name="" readonly>
            <div class="div-select-ul date-style" v-if="timeShow">
              <ul>
                <li class="time-liOrder" v-for="item in surplusData" @click.stop="timeType(item.time, item.number)">
                  <span class="time-order">{{item.time}}</span>
                  <span class="time-one" v-if="item.number != 0">剩余名额<i class="renspan">{{item.number}}</i>位</span>
                  <span class="time-one" v-if="item.number == 0">已满</span>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <button class="btn btns typeCommon" @click="submitClick">预约</button>
    </div>
    </div>
  </div>
</template>

<script>
import { resultPost } from '../../../../../service/getData'
import { simpleSendMessage, getAppointmentDate, getAppTimes, getPageInit } from '../../../../../config/baseUrl.js'
import { specialCharacters } from '../../../../../service/regExp.js'
import { Toast, MessageBox } from 'mint-ui'
export default {
  name: 'renewingCollarCredential',
  data () {
    return {
      nametype: '',                     // 业务类型名称
      codeId: '',                       // 业务类型id
      name: '',                         // 车主姓名
      isShow: false,                    //  验证码样式
      forbidden: false,
      chronoScope: '获取验证码',
      identifying: '',                  // 验证码
      identificationNum: '',            // 证件号码
      mobilephone: '',                  // 手机号码
      employ: '',
      subscribe: '',                    // 预约地点
      subscribeId: '',                  // 预约地点id
      subscribeShow: false,
      businessData: [],
      varietyShow: false,
      variety: '',
      varietyData: [
      ],
      timeShow: false,
      timeData: [],
      time: '',
      dateShow: false,
      dateData: [],
      date: '',
      surplusData: [],
      description: '', // 预约地址
      tmentTime: ''   // 预约时间
    }
  },
  methods: {
    // 证件名称
    varietyID: function (str, id) {
      if (str) {
        this.variety = str
        this.cur_card_id = id
      }
      if (this.varietyShow === true) {
        this.varietyShow = false
      } else {
        this.varietyShow = true
      }
    },
    // 预约地点
    subscribeClick: function (str, id, description) {
      this.dateShow = false    // 预约日期
      this.timeShow = false    // 预约时间
      if (str) {
        this.subscribe = str
        this.subscribeId = id
        this.description = description
      }
      if (this.subscribeShow === true) {
        this.subscribeShow = false
      } else {
        this.subscribeShow = true
      }
    },
    // 预约日期
    dateType: function (item) {
      this.subscribeShow = false   // 预约地点
      this.timeShow = false        // 预约时间
      if (!this.date && !item) {
        this.getmentDate()
      }
      if (item) {
        this.date = item
      }
      if (this.dateShow === true) {
        this.dateShow = false
      } else {
        this.dateShow = true
      }
    },
    // 预约时间
    timeType: function (str, id) {
      this.subscribeShow = false  // 预约地点
      this.dateShow = false       // 预约日期
      if (!this.date) {
        Toast({message: '请先选择预约日期', className: 'white'})
        return
      }
      if (!this.time && !str) {
        this.getTimes()
      }
      if (str) {
        id === 0 ? Toast({message: '当前预约日期已满，请选择其它时间', className: 'white'}) : this.time = str
      }
      if (this.timeShow === true) {
        this.timeShow = false
      } else {
        this.timeShow = true
      }
    },
    // 获取验证码
    scanQRCode: function () {
      let mobilephone = this.mobilephone
      if (!(mobilephone)) {
        Toast({message: '请输入手机号', position: 'bottom', className: 'white'})
      } else if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.mobilephone))) {
        Toast({message: '请输入正确的手机号码', position: 'bottom', className: 'white'})
      } else {
        let name
        if (window.localStorage.getItem('userName')) {
          name = this.name === window.localStorage.getItem('userName') ? 0 : 1  // 0’非代办（或本人）‘1’普通代办‘2’专业代办（企业代办）
        } else {
          name = 0
        }
        let phonedata = {
          mobile: mobilephone,               // 手机号码
          idType: this.cur_card_id,          // 证件id
          lx: '1',                           // 业务类型
          bookerType: name,                  // 预约方式
          bookerName: this.name,             // 预约人名字
          bookerIdNumber: window.localStorage.getItem('identityCard') || this.identificationNum,
          idNumber: this.identificationNum,   // 预约人证件号码
          codes: this.code            // 业务类型id
        }
        resultPost(simpleSendMessage, phonedata).then(json => {
          if (json.code === '0000') {
            MessageBox('温馨提示', '验证码已发出').then(() => {
            })
            this.timePiece()
          } else {
            Toast({message: json.msg, position: 'bottom', className: 'white'})
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
    submitClick: function () {
      if (!this.name) {
        Toast({message: '请输入车主姓名', className: 'white', duration: 1500})
      } else if (specialCharacters(this.name)) {
        Toast({message: '车主姓名不能含有特殊字符', className: 'white', duration: 1500})
      } else if (!this.identificationNum) {
        Toast({message: '请输入证件号码', className: 'white', duration: 1500})
      } else if (!this.mobilephone) {
        Toast({message: '请输入手机号码', className: 'white', duration: 1500})
      } else if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.mobilephone))) {
        Toast({message: '请输入正确手机号码', className: 'white', duration: 1500})
      } else if (!this.date) {
        Toast({message: '请选择预约日期', className: 'white', duration: 1500})
      } else if (!this.time) {
        Toast({message: '请选择预约时间', className: 'white', duration: 1500})
      } else if (!this.identifying) {
        Toast({message: '请输入验证码', className: 'white', duration: 1500})
      } else if (this.identifying.length !== 6) {
        Toast({message: '请输入正确验证码', className: 'white', duration: 1500})
      } else {
        this.dataFn()
      }
    },
    dataFn: function () {
      let name
      if (window.localStorage.getItem('userName')) {
        name = this.name === window.localStorage.getItem('userName') ? 0 : 1  // 0’非代办（或本人）‘1’普通代办‘2’专业代办（企业代办）
      } else {
        name = 0
      }
      let renewingData = {
        'orgId': this.subscribeId,                       // 预约地点id
        'businessTypeId': this.codeId,                   // 业务id
        'name': this.name,                               // 车主姓名
        'idTypeId': this.cur_card_id,                    // 证件种类ID
        'idNumber': this.identificationNum,              // 证件号码
        'mobile': this.mobilephone,                      // 手机号码
        'msgNumber': this.identifying,                   // 验证码
        'appointmentDate': this.date,                    // 预约日期
        'appointmentTime': this.time,                    // 预约时间
        'bookerName': window.localStorage.getItem('userName') || this.name,          // 预约人名字
        'bookerIdNumber': window.localStorage.getItem('identityCard') || this.identificationNum,  // 预约人身份证号
        'bookerType': name,                                // 预约方式 ‘0’本人
        'orgName': this.subscribe,                         // 预约单位名称
        'orgAddr': this.description,                       // 预约单位地址
        'bookerMobile': this.mobilephone                   // 预约手机号码
      }
      this.$emit('submitClick', renewingData, this.subscribe)
    },
    // 获取预约日期
    getmentDate: function () {
      let getmentData = {
        orgId: this.subscribeId,     // 预约地点
        businessTypeId: this.codeId  // 业务类型
      }
      resultPost(getAppointmentDate, getmentData).then(json => {
        if (json.code === '0000') {
          this.dateData = json.data
        } else {
          Toast({message: json.msg, position: 'bottom', className: 'white'})
        }
      })
    },
    // 预约日期获取时间
    getTimes: function () {
      let getTimesData = {
        businessTypeId: this.codeId,  // 业务类型
        orgId: this.subscribeId,      // 预约地点
        date: this.date,              // 预约日期
        carTypeId: this.vehicleId    // 汽车类型ID
      }
      resultPost(getAppTimes, getTimesData).then(json => {
        if (json.code === '0000') {
          let timeData = []
          json.data.map(item => {
            timeData.push({'time': item.apptime, 'number': item.maxnumber - item.yetnumber})
          })
          this.surplusData = timeData
        } else {
          Toast({message: json.msg, position: 'bottom', className: 'white'})
        }
      })
    }
  },
  created () {
    document.addEventListener('click', (e) => {
      this.varietyShow = false      // 证件名称
      this.subscribeShow = false    // 预约地点
      this.dateShow = false         // 预约日期
      this.timeData = false         // 预约时间
    })
  },
  mounted () {
    this.code = this.$route.query.code
    this.codeId = this.$route.query.id
    this.nametype = this.$route.query.name
    let getBusinessData = {
      businessTypeId: this.$route.query.id,
      type: 0
    }
    resultPost(getPageInit, getBusinessData).then(json => {
      if (json.code === '0000') {
        for (let i in json.data.orgVOs) {
          json.data.orgVOs[i].description = json.data.orgVOs[i].description.replace(/<(?!\/?img.+?>)[^<>]*>/gi, '')
        }
        this.varietyData = json.data.idTypeVOs     // 初始化证件类型
        this.variety = this.varietyData[0].name    // 初始化证件类型名称
        this.cur_card_id = this.varietyData[0].id  // 初始化证件类型id
        this.businessData = json.data.orgVOs       // 初始化预约地点
        this.description = json.data.orgVOs[0].description
        this.subscribe = json.data.orgVOs[0].name  // 预约地点名称
        this.subscribeId = json.data.orgVOs[0].id  // 预约地点id
      } else {
        Toast({message: json.msg, position: 'bottom', className: 'white'})
      }
    })
  },
  watch: {
    subscribeId () { // 当预约地点改变的时候 清空预约日期和预约时间
      this.date = ''
      this.dateData = []
      this.time = ''
      this.surplusData = []
    },
    date () { // 当时间改变的时候清空预约时间
      this.time = ''
      this.surplusData = []
    }
  }
}
</script>
<style lang="less" scoped>
@import "./../../../../../style/replacementType";
</style>
