<template>
  <div class="illegalParking" @click.stop="subTypeSelectShow=false,typeSelectShow=false">
    <mymap v-if="showMap" @submit="submitMap" style="position: absolute"></mymap>
    <popup popup-transition="popup-fade" v-model="showImg">
      <img :src="popupImg" alt="">
    </popup>
    <div v-show="!showMap">
      <div style="height: 20px"></div>
      <div class="ip-inform-box">
        <div class="ip-inform-time">
          <div class="ip-inform-title">时间</div>
          <div class="ip-inform-content">
            <input type="text" class="ip-inform-only" readonly :value="currentDate" style="background: #efeff4">
          </div>
        </div>
        <div class="ip-inform-number">
          <div class="ip-inform-title">车牌号码</div>
          <div class="ip-inform-content">
            <div class="div-select flex">
            <span class="btn-select hidden"
                  @click.stop="subTypeSelectShow=!subTypeSelectShow" :class="{gray:!myNumberPlate.length}">{{currentPlate}}</span>
              <div class="div-select-ul" v-if="subTypeSelectShow&&myNumberPlate.length">
                <ul>
                  <li class="scroll-y" v-for="item in myNumberPlate" @click.stop="selectPlate(item)">{{item}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="ip-inform-kind">
          <div class="ip-inform-title">车牌类型</div>
          <div class="ip-inform-content">
            <div class="div-select flex">
            <span class="btn-select hidden"
                  @click.stop="typeSelectShow=!typeSelectShow">{{plateType || '蓝牌'}}</span>
              <div class="div-select-ul" v-if="typeSelectShow">
                <ul>
                  <li class="scroll-y" v-for="item in plateTypes" @click.stop="selectType(item)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="ip-inform-IDcard">
          <div class="ip-inform-title">身份证号</div>
          <div class="ip-inform-content">
            <input type="text" class="ip-inform-only" readonly v-model="IDcard" style="background: #efeff4">
          </div>
        </div>
        <div class="ip-inform-ticket">
          <div class="ip-inform-title">罚单单号</div>
          <div class="ip-inform-content">
            <input id="ticket" type="text" placeholder="请输入罚单单号" class="ip-inform-only" v-model="ticket">
          </div>
        </div>
        <div class="ip-inform-place">
          <div class="ip-inform-title">停车地点</div>
          <div class="ip-inform-content">
            <input type="text" class="ip-inform-local" :value="mapObj.showAdd" placeholder="点击右侧按钮选择地址" readonly
                   style="background:rgb(239, 239, 244);padding-left: 18px">
            <span class="ip-inform-local-img" @click.stop="showMap=!showMap">
            <img src="../../images/location-1.png"/>
          </span>
          </div>
        </div>
        <div class="ip-inform-reason">
          <div class="ip-inform-title">停车原因</div>
          <div class="ip-inform-content">
            <textarea id="reason" placeholder="请输入停车原因" class="ip-inform-park" v-model="reason"></textarea>
          </div>
        </div>
      </div>
      <div class="ip-photo-box">
        <div class="ip-photo-header">
          <span class="ip-photo-title">图片上传</span>
          <span class="ip-photo-check">点击名称查看图片案例</span>
        </div>
        <div class="ip-photo-content">
          <div class="ip-photo-top">
            <div class="ip-photo-item">
              <label class="ip-photo-img" for="ip-photo-ticket">
                <img :src="popupImgs[0]"/>
                <input type="file" id="ip-photo-ticket" accept="image/*">
              </label>
              <div class="ip-photo-remake" @click="popupTicket(0)">罚单</div>
            </div>
            <div class="ip-photo-item">
              <label class="ip-photo-img" for="ip-photo-bigscence1">
                <img :src="popupImgs[1]"/>
                <input type="file" id="ip-photo-bigscence1" accept="image/*">
              </label>
              <div class="ip-photo-remake" @click="popupTicket(1)">大场景1</div>
            </div>
            <div class="ip-photo-item">
              <label class="ip-photo-img" for="ip-photo-headstock">
                <img :src="popupImgs[2]"/>
                <input type="file" id="ip-photo-headstock" accept="image/*">
              </label>
              <div class="ip-photo-remake" @click="popupTicket(2)">大场景(含车头正面)
              </div>
            </div>
          </div>
          <div class="ip-photo-bottom">
            <div class="ip-photo-item">
              <label class="ip-photo-img" for="ip-photo-front5">
                <img :src="popupImgs[3]"/>
                <input type="file" id="ip-photo-front5" accept="image/*">
              </label>
              <div class="ip-photo-remake" @click="popupTicket(3)">前5米无车辆全景</div>
            </div>
            <div class="ip-photo-item">
              <label class="ip-photo-img" for="ip-photo-back5">
                <img :src="popupImgs[4]"/>
                <input type="file" id="ip-photo-back5" accept="image/*">
              </label>
              <div class="ip-photo-remake" @click="popupTicket(4)">后5米无车辆全景</div>
            </div>
          </div>
        </div>
      </div>
      <div class="submit" @click="submit" v-if="myNumberPlate.length">
        提 &nbsp交
      </div>
      <div class="submit" style="background: gray" v-if="!myNumberPlate.length">
        提 &nbsp交
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <div style="height: 40px"></div>
  </div>
</template>
<script>
  import {reportingNoParking} from '../../config/baseURL'
  import {resultPost} from '../../service/getData'
  import UploadFile from '../../service/uploadFile'
  import {Toast, Popup, MessageBox} from 'mint-ui'
  import mymap from '../map/map.vue'
  export default {
    data () {
      return {
        beforeDate: '',  // 进入页面时的时间戳
        currentDate: '',                        // 时间
        myNumberPlate: [],
        plateTypes: '',
        plateType: '',                          // 车牌雷星星
        IDcard: '',                             // 身份证号码
        currentPlate: '',                       // 车牌号码
        subTypeSelectShow: false,
        typeSelectShow: false,
        ticket: '',                             // 罚单单号
        showMap: '',
        mapObj: '',                             // 地点坐标
        imgTime: '',
        plateTypeValue: '02',
        showImg: false,
        popupImgs: [require('../../images/ticket.png'), require('../../images/bigscence1.png'), require('../../images/headstock.png'), require('../../images/front5.png'), require('../../images/back5.png')],
        popupImg: '',
        reason: '',        // 停车原因
        scenePhoto: '',    // 大场景1
        scenePhoto1: '',    // 大场景
        scenePhoto2: '',   // 前五米无车场景
        scenePhoto3: '',  // 后五米无车场景
        stopNoticePhoto: '',   // 罚单
        numberPlateToCard: {}
      }
    },
    components: {
      mymap,
      Popup
    },
    mounted () {
      this.getUserInfo()
      this.getNowFormatDate()
      this.init()
    },
    methods: {
      init: function () {
        UploadFile.upload({
          id: 'ip-photo-ticket',
          callback: (res) => {
            console.log(res)
            this.stopNoticePhoto = res.imgUrl
            this.$set(this.popupImgs, 0, res.imgUrl)
          }
        })
        UploadFile.upload({
          id: 'ip-photo-bigscence1',
          callback: (res) => {
            console.log(res)
            this.scenePhoto = res.imgUrl
            this.$set(this.popupImgs, 1, res.imgUrl)
          }
        })
        UploadFile.upload({
          id: 'ip-photo-headstock',
          callback: (res) => {
            console.log(res)
            this.scenePhoto1 = res.imgUrl
            this.$set(this.popupImgs, 2, res.imgUrl)
          }
        })
        UploadFile.upload({
          id: 'ip-photo-front5',
          callback: (res) => {
            console.log(res)
            this.scenePhoto2 = res.imgUrl
            this.$set(this.popupImgs, 3, res.imgUrl)
          }
        })
        UploadFile.upload({
          id: 'ip-photo-back5',
          callback: (res) => {
            console.log(res)
            this.scenePhoto3 = res.imgUrl
            this.$set(this.popupImgs, 4, res.imgUrl)
          }
        })
      },
      submitMap: function (obj) {
        this.showMap = false
        this.mapObj = obj
        console.log(this.mapObj)
      },
      selectType (item) {
        this.plateType = item.str
        this.plateTypeValue = item.type
        this.typeSelectShow = !this.typeSelectShow
      },
      selectPlate (item) {
        this.currentPlate = item
        this.IDcard = this.numberPlateToCard[this.currentPlate]
        this.subTypeSelectShow = !this.subTypeSelectShow
      },
      /* eslint-disable */
      updateUrl (url, key) {
        var key = (key || 't') + '='  // 默认是"t"
        var reg = new RegExp(key + '\\d+')  // 正则：t=1472286066028
        var timestamp = +new Date()
        if (url.indexOf(key) > -1) { // 有时间戳，直接更新
          return url.replace(reg, key + timestamp)
        } else {  // 没有时间戳，加上时间戳
          if (url.indexOf('\?') > -1) {
            var urlArr = url.split('\?')
            if (urlArr[1]) {
              return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1];
            } else {
              return urlArr[0] + '?' + key + timestamp;
            }
          } else {
            if (url.indexOf('#') > -1) {
              return url.split('#')[0] + '?' + key + timestamp + location.hash;
            } else {
              return url + '?' + key + timestamp;
            }
          }
        }
      },
      /* eslint-enable */
      getUserInfo () {
        let cars = JSON.parse(window.localStorage.getItem('cars')) || []
        if (cars.length) {
          cars.map(item => {
            this.myNumberPlate.push(item.myNumberPlate)
            this.numberPlateToCard[item.myNumberPlate] = item.identityCard
          })
          this.currentPlate = this.myNumberPlate[0]
        } else {
          MessageBox('温馨提示', '暂无车辆,你可以通过“民生警务个人中心”绑定车辆')
        }
        this.plateTypes = this.$store.state.licenseSelectData
        this.IDcard = this.numberPlateToCard[this.currentPlate]
      },
      submit () {
        let isSubmit = true
        var submitTime = new Date()
        if (submitTime - this.beforeDate > 600000) {
          isSubmit = false
          MessageBox('提示', '你已经超时操作').then(action => {
//            window.location.href = this.updateUrl(window.location.href)
            this.$router.push('/')
          })
        }
        if (!isSubmit) return
        if (!this.currentPlate) {
          Toast({
            message: '请选择车牌号码',
            duration: 2000
          })
          return
        }
        if (!this.plateTypeValue) {
          Toast({
            message: '请选择车牌类型',
            duration: 2000
          })
          return
        }
        if (!this.ticket) {
          Toast({
            message: '请输入罚单单号',
            duration: 2000
          })
          document.getElementById('ticket').focus()
          return
        }
        if (!this.mapObj.showAdd) {
          Toast({
            message: '请选择停车地点',
            duration: 2000
          })
          return
        }
        if (!this.reason) {
          Toast({
            message: '请输入停车原因',
            duration: 2000
          })
          document.getElementById('reason').focus()
          return
        }
        if (!this.stopNoticePhoto) {
          Toast({
            message: '请上传罚单照片',
            duration: 2000
          })
          return
        }
        if (!this.scenePhoto) {
          Toast({
            message: '请上传大场景1照片',
            duration: 2000
          })
          return
        }
        if (!this.scenePhoto1) {
          Toast({
            message: '请上传大场景(含车头正面)照片',
            duration: 2000
          })
          return
        }
        if (!this.scenePhoto2) {
          Toast({
            message: '请上传前5米无车辆全景照片',
            duration: 2000
          })
          return
        }
        if (!this.scenePhoto3) {
          Toast({
            message: '请上传后5米无车辆全景照片',
            duration: 2000
          })
          return
        }
        let reqData = {
          numberPlateNumber: this.currentPlate,     // 车牌号码
          plateType: this.plateTypeValue,                // 车牌类型
          IDcard: this.IDcard,                      // 身份证号
          ticketNo: this.ticket,                    // 罚单单号
          parkingSpot: this.mapObj.showAdd,         // 停车地点
          parkingReason: this.reason,               // 停车原因
          scenePhoto: this.scenePhoto,
          scenePhoto1: this.scenePhoto1,
          scenePhoto2: this.scenePhoto2,
          scenePhoto3: this.scenePhoto3,
          stopNoticePhoto: this.stopNoticePhoto
        }
        resultPost(reportingNoParking, reqData).then(data => {
          console.log(reqData)
          console.log(data)
          if (data.code === '0000') {
            let dataInfo = {
              type: 1,
              businessType: '违停免罚',
              subscribeNo: data.data
            }
            this.$store.commit('saveSuccessInfo', dataInfo)
            this.$router.push('/submitSuccess')
          } else {
            MessageBox('提示', data.msg)
          }
        })
      },
      getNowFormatDate () {
        /* eslint-disable */
        var date = new Date()
        this.beforeDate = date
        /* eslint-enable */
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        if (hours >= 0 && hours <= 9) {
          hours = '0' + hours
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = '0' + minutes
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = '0' + seconds
        }
        this.currentDate = `${date.getFullYear()}${seperator1}${month}${seperator1}${strDate} ${hours}${seperator2}${minutes}${seperator2}${seconds}`
      },
      popupTicket (item) {
        this.showImg = !this.showImg
        this.popupImg = this.popupImgs[item]
      }
    }
  }
</script>
<style lang="less" scoped>
  .mint-popup {
    width: 80%;
    max-height: 80%;
    img {
      width: 100%;
      display: block;
    }
  }

  input {
    outline: none;
  }

  #ticket {
    color: black;
  }

  .div-select {
    width: 504px;
    height: 62px;
    border-radius: 8px;
  }

  .btn-select, .scroll-y {
    color: black;
    font-weight: normal;
    font-size: 24px;
  }

  .div-select .btn-select {
    background-color: white;
    height: 100%;
  }
  .div-select .gray{
    background-color:rgb(239, 239, 244);
  }
  .illegalParking {
    background: white;
    .div-select-ul {
      top: 56px;
    }

  }
  .ip-inform-box > div {
    height: 96px;
    display: flex;
    margin-left: 50px;
    margin-right: 50px;
    justify-content: space-between;
    align-items: center;
  }

  input, textarea, select {
    border: 1px solid #e2e2e7;
    color: #999;
  }

  .ip-inform-title {
    font-size: 30px;
    width: 28%;
  }

  .ip-inform-only {
    width: 504px;
    height: 60px;
    border-radius: 8px;
    padding: 0 22px;
  }

  .ip-inform-content {
    width: 71%;
    display: flex;
    justify-content: space-between;
  }

  .ip-inform-province, .ip-inform-plate {
    height: 60px;
    width: 116px;
    padding: 0 22px;
    border-radius: 8px;
  }

  .ip-inform-plate {
    width: 345px;
  }

  .ip-inform-local {
    height: 60px;
    width: 436px;
    border-radius: 8px;
  }

  .ip-inform-park {
    width: 504px;
    height: 186px;
    resize: none;
    border-radius: 8px;
    padding: 18px 22px;
    color: black;
  }

  .ip-inform-box .ip-inform-reason {
    align-items: flex-start;
    height: 186px;
    margin-top: 12px;
  }

  .ip-inform-local-img {
    width: 70px;
    height: 41px;
    display: inline-block;
    margin-top: 10px;
    text-align: right;
  }

  .ip-inform-local-img img {
    height: 100%;
  }

  .ip-photo-title {
    margin-left: 50px;
  }

  .ip-photo-check {
    font-size: 26px;
    color: #9e9e9e;
    margin-left: 32px;
  }

  .ip-photo-box {
    margin-top: 64px;
  }

  .ip-photo-img {
    height: 192px;
    width: 192px;
    border: 2px solid #dddde1;
    border-radius: 10px;
  }

  .ip-photo-content {
    margin-left: 50px;
    margin-right: 50px;
  }

  .ip-photo-top, .ip-photo-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .ip-photo-bottom {
    justify-content: flex-start;
  }

  .ip-photo-item {
    margin-top: 30px;
  }

  .ip-photo-item img {
    max-height: 90%;
    max-width: 90%;
  }

  .ip-photo-bottom .ip-photo-item {
    margin-right: 34px;
    margin-top: 48px;
  }

  .ip-photo-remake {
    font-size: 23px;
    color: #666666;
    text-align: center;
    text-decoration: underline;
    margin-top: 18px;
  }

  .submit {
    margin: 68px 50px 0px;
    height: 80px;
    width: 650px;
    background: #09bb07;
    text-align: center;
    line-height: 80px;
    color: white;
    font-size: 30px;
    border-radius: 10px;
  }

  .ip-photo-img {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  #reason {
    outline: none;
    color: #000;
  }

  .ip-photo-img input {
    display: none;
  }
</style>
