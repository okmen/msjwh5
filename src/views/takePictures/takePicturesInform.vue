<template>
  <div class="takePicturesInform">
    <g-input title="违法时间" v-model="mtDateTimeMsg" @click.native="datetimePick" placeholder="请输入违法时间" readonly></g-input>
    <g-input title="违法路段" v-model="informRoad" v-on:input="btnGetRoad" placeholder="请输入违法路段(例如深南大道)"></g-input>
     <ul class="take-ul" v-if="showSelectRoad">
      <li v-for="(roadSelect, index) in roadSelectLists" @click="roadLiClick(index)" :key="index">{{roadSelect.wfdd}}</li>
    </ul>
    <plate-number-full v-model="plateNumber"></plate-number-full>
    <g-select title="车牌类型" :data="plateTypeData" v-model="plateType" ref="vehicleType"></g-select>
    <div>
      <div class="tp-photo-box">
        <div class="tp-photo-left">上传照片</div>
        <div class="tp-photo-right">
          <label class="tp-photo-1" for="file1">
            <input id="file1" type="file" accept="image/*" >
            <img :src="imgOne">
          </label>
          <label class="tp-photo-1" for="file2">
            <input id="file2" type="file" accept="image/*">
            <img :src="imgTwo">
          </label>
          <label class="tp-photo-1" for="file3">
            <input id="file3" type="file" accept="image/*">
            <img :src="imgThree">
          </label>
        </div>
      </div>
    </div>
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
import UploadFile from '@/utils/uploadFile'
import { getRoad, takePictures } from '@/config/baseURL.js'
import PlateNumberFull from '@/components/PlateNumberFull'
import wx from 'weixin-js-sdk'
export default {
  name: 'takePicturesInform',
  data () {
    return {
      informTime: this.currentTime(),                                 // 违法时间
      imgOne: '',                                                     // 上传照片
      imgOneTime: '',
      imgTwo: '',
      imgTwoTime: '',
      imgThree: '',
      imgThreeTime: '',
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
      imgOneGPSLatitude: '',                                           // 第一张图片纬度
      imgOneGPSLongitude: '',                                          // 第一张图片经度
      imgTwoGPSLatitude: '',                                           // 第二张图片纬度
      imgTwoGPSLongitude: '',                                          // 第二张图片经度
      imgThreeGPSLatitude: '',                                         // 第三张图片纬度
      imgThreeGPSLongitude: '',                                        // 第三张图片经度
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
  created () {
  },
  mounted: function () {
    this.init()
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
      let imgArr = [this.imgOne, this.imgTwo, this.imgThree].filter(x => x !== '')
      if (!this.informRoad) {
        this.$toast('请输入违法路段')
      } else if (this.$verification.plateVerification(this.plateNumber)) {
        this.$toast('请输入正确的车牌号码')
      } else if (imgArr.length < 2) {
        this.$toast('举报图片不得少于两张')
      } else if (!this.informIntroWhy) {
        this.$toast('请输入情况说明')
      } else if (this.WxGPSLatitude && this.WxGPSLongitude) {
        this.gpsx = this.WxGPSLongitude           // 经度
        this.gpsy = this.WxGPSLatitude            // 纬度
        this.subFn()
        return false
      } else if (this.imgOneGPSLatitude && this.imgOneGPSLongitude) {
        this.gpsx = this.imgOneGPSLongitude           // 经度
        this.gpsy = this.imgOneGPSLatitude            // 纬度
        this.subFn()
        return false
      } else if (this.imgTwoGPSLatitude && this.imgTwoGPSLatitude) {
        this.gpsx = this.imgTwoGPSLongitude           // 经度
        this.gpsy = this.imgTwoGPSLatitude            // 纬度
        this.subFn()
        return false
      } else if (this.imgThreeGPSLatitude && this.imgThreeGPSLongitude) {
        this.gpsx = this.imgThreeGPSLongitude         // 经度
        this.gpsy = this.imgThreeGPSLatitude          // 纬度
        this.subFn()
        return false
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
        reportImgOne: !this.imgOne.split(',')[1] ? '' : this.imgOne.split(',')[1],                // 上传照片
        reportImgOneT1: this.imgOneTime || '',
        reportImgTwo: !this.imgTwo.split(',')[1] ? '' : this.imgTwo.split(',')[1],
        reportImgOneT2: this.imgTwoTime || '',
        reportImgThree: !this.imgThree.split(',')[1] ? '' : this.imgThree.split(',')[1],
        reportImgOneT3: this.imgThreeTime || '',
        licensePlateType: this.plateType,               // 车牌类型
        licensePlateNumber: this.plateNumber,
        illegalActivitieOne: this.informIntroWhy,               // 违法行为
        userSource: 'M',
        inputManName: this.informName,                          // 举报人
        identityCard: this.informIdNumber,                      // 身份证号
        inputManPhone: this.informTel                          // 电话号码
      }
      console.log(informData)
      this.$axios.post(takePictures, informData).then(json => { // 调取随手拍举报接口
        if (json.code === '0000') {
          let source = this.$route.query.source
          this.$router.push({path: '/takePicturesSuccess', query: {source: source, takePicturesRecord: JSON.stringify(json.data.recordNumber), takePicturesPassword: JSON.stringify(json.data.queryPassword)}})
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
    init: function () {  // 上传图片
      UploadFile.upload({
        id: 'file1',
        callback: (res) => {
          console.log(res)
          this.imgOne = res.imgUrl
          this.imgOneTime = res.dateTime
          this.imgOneGPSLatitude = res.GPSLatitude     // 纬度
          this.imgOneGPSLongitude = res.GPSLongitude   // 经度
        }
      })
      UploadFile.upload({
        id: 'file2',
        callback: (res) => {
          console.log(res)
          this.imgTwo = res.imgUrl
          this.imgTwoTime = res.dateTime
          this.imgTwoGPSLatitude = res.GPSLatitude     // 纬度
          this.imgTwoGPSLongitude = res.GPSLongitude   // 经度
        }
      })
      UploadFile.upload({
        id: 'file3',
        callback: (res) => {
          console.log(res)
          this.imgThree = res.imgUrl
          this.imgThreeTime = res.dateTime
          this.imgThreeGPSLatitude = res.GPSLatitude     // 纬度
          this.imgThreeGPSLongitude = res.GPSLongitude   // 经度
        }
      })
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
        background:#d0d0d0;
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
    .tp-photo-box{
      overflow: hidden;
      margin:30px 40px;
      height:174px;
      .tp-photo-left{
        float:left;
        width:130px;
        height:100%;
        font-size:32px;
        color:#000;
        margin-right: 20px;
      }
      .tp-photo-right{
        float:left;
        width:520px;
        .tp-photo-1{
          position:relative;
          float:left;
          
          margin-right:8px;
          width:163px;
          height:163px;
          background:#FFF url("../../assets/images/tpInformAngle.png") center no-repeat;
          background-size:80%;
          border:1px solid #dddde1;
          -webkit-border-radius:8px;
          -moz-border-radius:8px;
          border-radius:8px;
          img{
            width:163px;
            height:163px;
            -webkit-border-radius:8px;
            -moz-border-radius:8px;
            border-radius:8px;
          }
          input{
            position:absolute;
            width:100%;
            height:100%;
            visibility:hidden;
            top:0;
            left:0;
            z-index:998;
          }
        }
        .tp-photo-1:last-child{
          margin-right:0;
          float:right;
        }
      }
    }
  }
</style>
