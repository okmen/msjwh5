<template lang="html">
  <div class="takePhoto-outer">
    <div class="takePhoto-content">
      <p class="takePhoto-hint">温馨提示：请在确保安全的情况下拍照</p>
      <div class="takePhoto-example">
        <img v-for="(src, index) in exampleImgs" :src="src" v-show="+activeIndex === index + 1">
      </div>
      <p class="example-hint">{{exampleHint}}</p>
      <div class="takePhoto-main pad-side-50">
        <ul class="takePhoto-preview">
          <li class="takePhoto-preview-item">
            <img :src="imgs" v-if="imgs" @click.stop="popupTicket(imgs)">
            <p v-if="!imgs">照片预览</p>
          </li>
        </ul>
        <div class="takePhoto-btns">
          <label for="takePhoto-button">
            <div class="btn btn-blue takePhoto-btn">拍照</div>
            <input type="file" id="takePhoto-button" accept="image/*" ref="takePhotoBtn" capture="camera">
          </label>
          <button class="btn" :disabled="!canSubmit" @click.stop="submit">提交</button>
        </div>
      </div>
    </div>
    <popup popup-transition="popup-fade" v-model="showImg">
      <img :src="popupImg">
    </popup>
    <div v-wechat-title="$route.meta.title"></div>
    <div class="m-confirm" :class="{ open: confirmStatus }">
      <div class="box">
        <div class="title">温馨提示</div>
        <div class="text">如您同意提交，即表示您违停车辆已驶离，并承诺遵守相关交通法规。</div>
        <div class="footer">
          <div class="cancel" @click="confirmCancel">取消</div>
          <div class="ok" @click="confirmSubmit">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Popup, Toast } from 'mint-ui'
import UploadFile from '../../service/uploadFile'
import { resultPost } from '../../service/getData'
import { reportingNoParking } from '../../config/baseUrl'
export default {
  computed: {
    illegalData: function () {
      return this.$store.state.illegalPark
    },
    exampleHint: function () {
      let exampleHint = ''
      switch (this.activeIndex) {
        case this.TIICKET:
          exampleHint = '请拍摄“违规停放机动车告知单”，注意拍摄的图片，字体要清晰可视，不要有遮挡物'
          break
        case this.DREGREE45:
          exampleHint = '距离车辆3～5米，拍摄车辆的45度照片。注意所拍照片需要包含车辆所停的环境场景'
          break
        case this.DREGREE0:
          exampleHint = '距离车辆3～5米，拍摄车头正面。注意所拍照片包含车辆所停的环境场景'
          break
        case this.DRIVE_AWAY:
          exampleHint = '把车辆驶离违停的区域，在距离原车辆违停位置的前方5米处，拍摄所停的环境场景'
          break
      }
      return exampleHint
    },
    canSubmit: function () {
      if (!this.imgs) {
        return false
      }
      return true
    }
  },
  components: {
    Popup
  },
  data () {
    return {
      confirmStatus: false,
      reqData: null,
      TIICKET: '1', // 违停告知单
      DREGREE45: '2', // 车身45度
      DREGREE0: '3', // 车头正面
      DRIVE_AWAY: '4', // 驾离
      activeIndex: '4', // 当前选中的tab页
      exampleImgs: [require('../../images/ticket_2.png'), require('../../images/degree_45.png'), require('../../images/degree_0.png'), require('../../images/drive_away.png')], // 示例图
      imgs: null, // [驾离后照片]
      showImg: false,
      popupImg: '' // 预览大图
    }
  },
  methods: {
    init: function () {
      UploadFile.upload({
        id: 'takePhoto-button',
        callback: (res) => {
          this.imgs = res.imgUrl
          if (this.activeIndex !== '4') {
            this.activeIndex = `${+this.activeIndex + 1}`
          }
          this.$refs.takePhotoBtn.value = ''
        }
      })
    },
    submit: function () { // 点击提交按钮
      if ((Date.now() - this.illegalData.entryTime) >= 10 * 60 * 1000) { // 超过十分钟
        MessageBox('提示', '你已经超时操作').then(action => {
          this.$router.push('/')
        })
        return false
      }
      let reqData = {
        numberPlateNumber: this.illegalData.licensePlateNo, // 车牌号码
        plateType: this.illegalData.licensePlateType, // 车牌种类
        IDcard: window.localStorage.getItem('identityCard') || '', // 星级用户身份证
        parkingSpot: this.illegalData.parkingAddr, // 停车地点
        scenePhoto: this.imgs.split(',')[1] // 驾离后照片
      }
      for (let key in reqData) {
        if (!reqData[key] && key !== 'parkingReason' && key !== 'scenePhoto3') {
          console.log(key)
          switch (key) {
            case 'numberPlateNumber':
              Toast({
                message: '车牌号码不能为空',
                duration: 2000
              })
              break
            case 'plateType':
              Toast({
                message: '车牌类型不能为空',
                duration: 2000
              })
              break
            case 'IDcard':
              Toast({
                message: '身份证号码不能为空',
                duration: 2000
              })
              break
            case 'parkingSpot':
              Toast({
                message: '停车地点不能为空',
                duration: 2000
              })
              break
            case 'scenePhoto':
              Toast({
                message: '驾离后照片不能为空',
                duration: 2000
              })
              break
          }
          return false
        }
      }
      this.confirmStatus = true
      this.reqData = reqData
      console.log('提交数据', this.reqData, this.confirmStatus)
    },
    // 确认取消
    confirmCancel () {
      console.log('取消提交')
      this.confirmStatus = false
    },
    // 确认提交
    confirmSubmit () {
      resultPost(reportingNoParking, this.reqData).then(obj => {
        if (obj.code === '0000') {
          let dataInfo = {
            type: 1,
            businessType: '违停免罚',
            subscribeNo: obj.data
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$router.push('/submitSuccess')
        } else {
          MessageBox('提示', obj.msg)
        }
      })
    },
    popupTicket: function (src) { // 显示弹窗大图
      this.popupImg = src
      this.showImg = true
    }
  },
  mounted () {
    let isLogin = window.localStorage.getItem('isLogin')
    if (isLogin !== 'true') { // 没有登陆的话需要跳转至登录页面
      this.$router.push('/login')
      return false
    }
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .takePhoto-outer{
    background: #fff;
    text-align: center;
    .takePhoto-nav{
      display: flex;
      height: 85px;
      box-sizing: border-box;
      border-bottom: 1px solid #dbdbdb;
      .nav-item{
        flex: 1;
        text-align: center;
        line-height: 84px;
        font-size: 28px;
        font-weight: bold;
        color: #b0b0b0;
        &.active{
          color: #2696dd;
          border-bottom: 5px solid #2696dd;
        }
      }
    }
    .takePhoto-hint{
      line-height: 70px;
      font-size: 26px;
      font-weight: bold;
      color: #c30000;
    }
    .takePhoto-example{
      width: 100%;
      height: 540px;
      img{
        max-width: 90%;
        height: 100%;
        object-fit: cover;
      }
    }
    .example-hint{
      margin: 25px auto;
      width: 73%;
      font-size: 26px;
      color: #333;
      line-height: 1.5em;
    }
    .takePhoto-preview{
      display: flex;
      justify-content: space-between;
      .takePhoto-preview-item{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;
        background: #eee;
        border: 2px dashed #ccc;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        p{
          width: 54px;
          line-height: 37px;
          font-size: 26px;
          color: #999;
        }
      }
    }
    .btn{
      margin-top: 30px;
    }
    .btn[disabled]{
      background: #dbdbdb;
    }
    .takePhoto-btn{
      line-height: 2.5rem;
    }
    #takePhoto-button{
      display: none;
    }
  }
</style>
