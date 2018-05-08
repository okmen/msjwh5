<template>
  <div class="takePicturesInform">
    <g-input title="违法时间" v-model="mtDateTimeMsg" @click.native="datetimePick" placeholder="请输入违法时间" readonly></g-input>
    <g-input title="违法路段" v-model="informRoad" v-on:input="btnGetRoad" placeholder="请输入违法路段(例如深南大道)"></g-input>
     <ul class="take-ul" v-if="showSelectRoad">
      <li v-for="(roadSelect, index) in roadSelectLists" @click="roadLiClick(index)">{{roadSelect.wfdd}}</li>
    </ul>
    <plate-number-full v-model="plateNumber"></plate-number-full>
    <g-select title="车牌类型" :data="plateTypeData" v-model="plateType" ref="vehicleType"></g-select>
    <group title="上传图片">
      <div class="upload-group">
        <g-uploads text="身份证(正面)" id="file1" :bg="imgOne1" v-model="imgOne"></g-uploads>
        <g-uploads text="身份证(反面)" id="file2" :bg="imgOne2" v-model="imgTwo"></g-uploads>
        <g-uploads text="机动车行驶证" id="file3" :bg="imgOne3" v-model="imgThree"></g-uploads>
      </div>
    </group>
    <g-textarea title="违法行为" v-model="informIntroWhy" placeholder="请认真填写被举报车辆的违法项目"></g-textarea>
    <g-input title="举报人" v-model="informName" readonly></g-input>
    <g-input title="身份证号" v-model="informIdNumber" readonly></g-input>
    <g-input title="联系电话" v-model="informTel" readonly></g-input>
    <g-button text="确认提交" @click.native="drivingLicenseEnquiry"></g-button>
    <mt-datetime-picker
      ref="picker"
      v-model="informTime"
      @confirm="handleTime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hour-format="{value} 时"
      minute-format="{value} 分"
    ></mt-datetime-picker>
  </div>
</template>

<script>
import { GTextarea, GUploads } from 'form'
import { getRoad, takePictures } from '@/config/baseURL.js'
import PlateNumberFull from '@/components/PlateNumberFull'
import wx from 'weixin-js-sdk'
export default {
  name: 'takePicturesInform',
  data () {
    return {
      informTime: this.currentTime(),                                 // 违法时间
      imgOne1: require('@/assets/images/tpInformAngle.png'),
      imgOne2: require('@/assets/images/tpInformAngle.png'),
      imgOne3: require('@/assets/images/tpInformAngle.png'),
      imgOne: '',    // 第一张
      imgTwo: '',    // 第二张
      imgThree: '',  // 第三张
      mtDateTimeMsg: '',
      informRoad: '',
      showSelectRoad: false,
      plateType: '02',
      informIntroWhy: '',
      plateNumber: '',
      roadSelectLists: '',
      informRoads: '',
      informName: '',
      informTel: '',
      informIdNumber: '',
      gpsx: '',                                                        // 经度
      gpsy: '',                                                        // 纬度
      WxGPSLatitude: '',                                               // 微信定位纬度
      WxGPSLongitude: ''                                              // 微信定位经度
    }
  },
  computed: {
    plateTypeData () {
      return this.$store.state.plateType
    }
  },
  components: {
    GTextarea, PlateNumberFull, GUploads
  },
  mounted () {
    let val = this.$store.state.user
    this.informName = val.userName
    this.informIdNumber = val.identityCard
    this.informTel = val.mobilePhone
    this.location()
    let getTime = this.currentTime()
    this.mtDateTimeMsg = getTime
  },
  methods: {
    // 确认提交
    drivingLicenseEnquiry () {
      console.log(this.imgOne)
      console.log(this.imgTwo)
      console.log(this.imgThree)
      let imgArr = [this.imgOne, this.imgTwo, this.imgThree].filter(x => x !== '')
      console.log(imgArr)
      if (!this.informRoad) {
        this.$toast('请输入违法路段')
      } else if (this.$verification.plateVerification(this.plateNumber)) {
        // this.$toast({message: this.$plateerification(this.plateNumber)})
        this.$toast('请输入正确的车牌号码')
      } else if (imgArr.length < 2) {
        this.$toast('举报图片不得少于两张')
      } else if (!this.informIntroWhy) {
        this.$toast('请输入情况说明')
      } else if (this.WxGPSLatitude && this.WxGPSLongitude) {
        this.gpsx = this.WxGPSLongitude           // 经度
        this.gpsy = this.WxGPSLatitude            // 纬度
        this.subFn()
        return true
      } else if (this.imgOne.GPSLatitude && this.imgOne.GPSLongitude) {
        this.gpsx = this.imgOne.GPSLongitude           // 经度
        this.gpsy = this.imgOne.GPSLatitude            // 纬度
        this.subFn()
        return true
      } else if (this.imgTwo.GPSLatitude && this.imgTwo.GPSLongitude) {
        this.gpsx = this.imgTwo.GPSLongitude           // 经度
        this.gpsy = this.imgTwo.GPSLatitude            // 纬度
        this.subFn()
        return true
      } else if (this.imgThree.GPSLatitude && this.imgThree.GPSLongitude) {
        this.gpsx = this.imgThree.GPSLongitude           // 经度
        this.gpsy = this.imgThree.GPSLatitude            // 纬度
        this.subFn()
        return true
      } else {
        this.$MessageBox({
          title: '温馨提示',
          message: '无法从上传图片提取到位置信息，此次举报不予受理。请尝试拍照时打开手机定位功能！'
        }).then(action => {
          console.log('提交失败')
        })
      }
    },
    subFn () {
      console.log(122222)
      let informData = {
        gpsx: this.gpsx,                              // 经度
        gpsy: this.gpsy,                              // 纬度
        illegalTime: this.mtDateTimeMsg,                        // 违法时间
        illegalSections: this.informItem,                       // 违法路段
        reportImgOne: !this.imgOne.imgUrl ? '' : this.imgOne.imgUrl.split(',')[1],                // 上传照片
        reportImgOneT1: this.imgOne.dateTime || '',
        reportImgTwo: !this.imgTwo.imgUrl ? '' : this.imgTwo.imgUrl.split(',')[1],
        reportImgOneT2: this.imgTwo.dateTime || '',
        reportImgThree: !this.imgThree.imgUrl ? '' : this.imgThree.imgUrl.split(',')[1],
        reportImgOneT3: this.imgThree.dateTime || '',
        licensePlateType: this.plateType,               // 车牌类型
        licensePlateNumber: this.plateNumber,
        illegalActivitieOne: this.informIntroWhy,               // 违法行为
        inputManName: this.informName,                          // 举报人
        identityCard: this.informIdNumber,                      // 身份证号
        inputManPhone: this.informTel                          // 电话号码
      }
      console.log(informData)
      this.$axios.post(takePictures, {}).then(json => { // 调取随手拍举报接口
        if (json.code === '0000') {
          this.postInform({
            takePicturesRecord: json.data.recordNumber,
            takePicturesPassword: json.data.queryPassword
          })
          this.isWeChat ? this.$router.push('/takePicturesSuccess_Wechat') : this.$router.push('/takePicturesSuccess')
        } else {
          this.$toast(json.msg)
        }
      })
    },
    // 获取微信定位
    location: function () {
      let _this = this
      // 微信定位
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          console.log(res)
          // let cp = new window.Careland.GbPoint(res.latitude, res.longitude))
          _this.WxGPSLatitude = res.latitude                  // 微信定位纬度
          _this.WxGPSLongitude = res.longitude                // 微信定位经度
        },
        fail: function () {
          console.log('定位失败')
          // MessageBox({
          //   title: '温馨提示',
          //   message: '为了保证信息的可靠性，请开启GPRS定位'
          // }).then(action => {
          //   console.log('123')
          // })
        }
      })
    },
    btnGetRoad: function () {  // 点击选择交通路段
      clearTimeout(this.t)
      if (this.informRoads !== this.informRoad) {
        this.t = setTimeout(() => {
          if (this.informRoad === '') { // 判断输入为空时不显示下拉列表
            this.showSelectRoad = false
          } else {
            this.showSelectRoad = true
          }
          let getRoadData = {
            keyword: this.informRoad
          }
          let that = this
          this.$axios.post(getRoad, getRoadData).then(json => {
            if (json.data) {
              let roadLists = json.data.list
              let roadArry = []
              if (roadLists.length >= 2) {
                roadLists.forEach((item, index) => {
                  let roadObj = {
                    'wfdd': item.wfdd.split('---')[1],
                    'type': item.wfdd.split('---')[0],
                    'roadLi': item.wfdd
                  }
                  roadArry.push(roadObj)
                  that.roadSelectLists = roadArry
                })
              }
            } else {
              this.$toast('请输入正确的路段，不用太详细')
            }
          })
        }, 2000)
      }
    },
    datetimePick: function (picker) {
      console.log(this.$refs.picker.open())
      this.$refs.picker.open()
    },
    roadLiClick: function (index) { // Li的点击事件
      this.informRoad = this.roadSelectLists[index].wfdd
      this.informRoads = this.roadSelectLists[index].wfdd
      this.informType = this.roadSelectLists[index].type
      this.informItem = this.roadSelectLists[index].roadLi
      this.showSelectRoad = false
    },
    handleTime: function (informTime) {
      this.formatTime = this.format(this.informTime.toString(), 'yyyy-MM-dd HH:mm:ss')
      this.mtDateTimeMsg = this.formatTime
      console.log(this.mtDateTimeMsg)
    },
    currentTime: function () {  // 获取时间
      let now = new Date()
      let year = now.getFullYear()       // 年
      let month = now.getMonth() + 1     // 月
      let day = now.getDate()            // 日
      let hh = now.getHours()            // 时
      let mm = now.getMinutes()          // 分
      let ss = now.getSeconds()          // 秒
      let clock = year + '-'
      if (month < 10) {
        clock += '0'
      }
      clock += month + '-'
      if (day < 10) {
        clock += '0'
      }
      clock += day + ' '
      if (hh < 10) {
        clock += ' '
      }
      clock += hh + ':'
      if (mm < 10) {
        clock += '0'
      }
      clock += mm + ':'
      if (ss < 10) {
        clock += '0'
      }
      clock += ss
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
    }
  }
}
</script>

<style lang="less" scoped>
  .takePicturesInform {
    position:relative;
    padding: 40px 0;
    .upload-group{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .take-ul {
      position:absolute;
      overflow:hidden;
      overflow-y:auto;
      width:710px;
      padding-left: 240px;
      height:520px;
      z-index:999;
      li{
        width:100%;
        height:50px;
        background:#999;
        border-bottom:1px solid #efeff4;
        font-size:26px;
        line-height:50px;
        text-align:center;
        z-index:999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
