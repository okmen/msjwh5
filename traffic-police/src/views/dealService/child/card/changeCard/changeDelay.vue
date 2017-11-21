<template>
  <!-- 延期换证组件 -->
  <div class="changeDelay-outer">
    <div class="changeDelay-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件名称</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="居民身份证" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="IDcard" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="name" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>驾驶证号</span>
          </div>
          <div class="form-line-item">
            <input v-model="driverLicense" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>档案编号</span>
          </div>
          <div class="form-line-item">
            <input v-model="fileNumber" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>延期日期</span>
          </div>
          <div class="form-line-item">
            <span class="btn-select" @click="datetimePick('picker')">{{ mtDateTimeMsg }}</span>
            <!-- <input class="text-input" type="text" name="" v-model=""  > -->
          </div>
        </li>

        <li class="form-line">
          <div class="form-line-item item-name">
            <span>延期原因</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="reasonSelectClick()">{{ reasonSelectMassage }}</span>
            <div class="div-select-ul" v-if="reasonSelectShow">
              <ul>
                <li v-for="item in reasonSelectData" @click.stop="reasonSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverName" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverNumber" class="text-input" type="tel" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>邮寄地址</span>
          </div>
          <div class="form-line-item width-40 city">
            <span>深圳市</span>
          </div>
          <div class="div-select form-line-item width-50">
            <span class="btn-select" @click.stop="areaSelectClick()">{{ areaSelectMassage }}</span>
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
            <input v-model="mailingAddress" class="text-input" type="text" placeholder="请输入详细地址">
          </div>
        </li>
      </ul>
    </div>
    <userUpload :idCard1="true" :idCard2="true" :license="true" :delay="true" @btnSureStar="btnSureStar()" ref="getImgUrl"></userUpload>
    <div v-wechat-title="$route.meta.title"></div>
    <mt-datetime-picker ref="picker" type="date" v-model="informTime" @confirm="handleTime"></mt-datetime-picker>
  </div>
</template>
<script>
  import { resultPost } from '../../../../../service/getData'
  import { changeDelay, getFileNumber } from '../../../../../config/baseUrl'
  import { Toast, MessageBox } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        mtDateTimeMsg: '',                                              // 一进来默认当前时间
        formatTime: '',                                                 // 使用mt组件后，时间是中国标准时间，格式转换
        informTime: this.currentTime(),                                 // 当前时间
        IDcard: window.localStorage.getItem('identityCard'),            // 身份证号
        name: window.localStorage.getItem('userName'),                  // 姓名
        driverLicense: window.localStorage.getItem('identityCard'),     // 驾驶证号 同身份证
        fileNumber: '',                                                 // 档案号 先从接口查询后填入
        receiverName: window.localStorage.getItem('userName'),          // 收件人姓名
        receiverNumber: window.localStorage.getItem('mobilePhone'),     // 收件人手机号
        cur_reason_id: '01',                                            // 默认延期理由id  01为服兵役
        cur_area_id: '01',                                              // 默认区名id  01为福田区
        reasonSelectShow: false,
        reasonSelectMassage: '服兵役',
        reasonSelectData: [
          {
            'id': '01',
            'str': '服兵役'
          },
          {
            'id': '02',
            'str': '出国（境）'
          },
          {
            'id': '03',
            'str': '其他'
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
        mailingAddress: ''                                              // 用户详细地址
      }
    },
    components: {
      'userUpload': require('../../userUpload.vue')
    },
    mounted: function () {
      let getTime = this.currentTime()
      this.mtDateTimeMsg = getTime
      // 以下通过接口查询用户档案号
      let reqData = {
        identityCard: window.localStorage.getItem('identityCard'),
        sourceOfCertification: 'C'
      }
      resultPost(getFileNumber, reqData).then(json => {
        console.log(json)
        if (json.code === '0000') {
          this.fileNumber = json.data.fileNumber
        }
      })
    },
    methods: {
      reasonSelectClick: function (str, id) {             // 延期理由下拉框选择
        if (str) {
          this.reasonSelectMassage = str
          this.cur_reason_id = id
        }
        if (this.reasonSelectShow === true) {
          this.reasonSelectShow = false
        } else {
          this.reasonSelectShow = true
        }
      },
      areaSelectClick: function (str, id) {               // 区域下拉框选择
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
      },              // 以下四个方法与时间相关
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
      btnSureStar: function () {                          // 确认提交按钮
        let idImgOne = this.$refs.getImgUrl.imgIDcard1
        let idImgTwo = this.$refs.getImgUrl.imgIDcard2
        let idImgThree = this.$refs.getImgUrl.imgLicense
        let idImgFour = this.$refs.getImgUrl.imgDelay

        let idImgOneIf = idImgOne.substr(0, 4) === 'data' || false
        let idImgTwoIf = idImgTwo.substr(0, 4) === 'data' || false
        let idImgThreeIf = idImgThree.substr(0, 4) === 'data' || false
        let idImgFourIf = idImgFour.substr(0, 4) === 'data' || false
        if (!this.mailingAddress) {
          Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
        } else if (!idImgOneIf || !idImgTwoIf) {
          Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
        } else if (!idImgThreeIf) {
          Toast({message: '请上传驾驶证照片', position: 'bottom', className: 'white'})
        } else if (!idImgFourIf) {
          Toast({message: '请上传延期说明图片', position: 'bottom', className: 'white'})
        } else {
          let reqData = {
            type: '驾驶证延期换证',
            url: changeDelay,
            textObj: {
              delayDate: this.mtDateTimeMsg,
              delayReason: this.reasonSelectMassage,
              driverLicense: this.driverLicense,
              fileNumber: this.fileNumber,
              identityCard: this.IDcard,
              userName: this.name,
              receiverName: this.receiverName,
              receiverNumber: this.receiverNumber,
              receiverAddress: '深圳市' + this.areaSelectMassage + this.mailingAddress
            },
            imgObj: {
              PHOTO9: idImgOne.split(',')[1] || '',
              PHOTO10: idImgTwo.split(',')[1] || '',
              JSZZP: idImgThree.split(',')[1] || '',
              YQZMZP: idImgFour.split(',')[1] || ''
            },
            invisibleObj: {
              loginUser: window.localStorage.getItem('identityCard'),
              userSource: 'C',
              identificationNO: 'A'
            }
          }
          console.log(reqData)
          this.$store.commit('saveMotorVehicleHandling', reqData)
          this.$router.push(/_WeChat/g.test(this.$route.name) ? '/affirmInfo_WeChat' : '/affirmInfo')
        }
      },
      beforeDestory () {
        Toast.close()
      },
      ...mapActions({
        postAppoin: 'postAppoin'
      })
    },
    created () {
      if (!window.localStorage.getItem('fileNumber')) {
        MessageBox('温馨提示', '您还没绑定驾驶证,请到星级用户中心绑定！')
      }
      document.addEventListener('click', (e) => {
        this.reasonSelectShow = false
        this.areaSelectShow = false
      })
    }
  }
</script>
<style lang="less" scoped>
  .changeDelay-outer {
    background-color: #fff;
    padding: 0 40px;
    .changeDelay-form {
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
          span {
            vertical-align: middle;
          }
          &.city {
            margin: 0 18px;
          }
          .btn-select {
            background: url('../../../../../images/select1.png') no-repeat scroll;
            background-position: 96% center;
            background-size: 18px;
            display: inline-block;
            width: 100%;
            text-indent: 18px;
            line-height: 54px;
            border: 1px solid #e2e2e7;
            background-color: #efeff4;
            border-radius: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 45px;
            box-sizing: border-box;
          }
        }
        .item-name {
          width: 180px;
          position: absolute;
          left: 0;
        }
        .div-select {
          font-size: 24px;
        }
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
  }

</style>
