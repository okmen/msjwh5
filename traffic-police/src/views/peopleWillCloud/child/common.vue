<template>
<!-- 设施损坏、安全隐患通报公用组件 -->
<div class="common-outer">
<div v-wechat-title="$route.meta.title"></div>
  <div class="common-form">
    <ul class="common-form-list padding-right-43">
      <li class="common-form-item clear">
        <div class="common-list-name">
          <span>详细地址</span>
        </div>
        <div class="common-list-text left width-90">
          <input class="text-input" type="text" name="" v-model:value="mapObj.showAdd" placeholder="点击右侧按钮选择地址" readonly>
        </div>
        <div class="common-list-location right" @click.stop='getLocation()'></div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>发现人姓名</span>
        </div>
        <div class="common-list-text">
          <input class="text-input" type="text" name="" v-model:value="userName" :readonly="isReadonly" placeholder="请输入您的姓名">
        </div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>发现人手机</span>
        </div>
        <div class="common-list-text">
          <input class="text-input" type="text" name="" v-model:value="mobilephone" :readonly="isReadonly" placeholder="请输入您的手机" minlength="11" maxlength="11">
        </div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>紧急程度</span>
        </div>
        <div class="common-list-radio">
          <div class="common-list-radio-box">
            <input type="radio" id="common-radio1" name="urgencyLevel" class='checked' value="紧急" v-model:checked="emergency">
            <label for="common-radio1">紧急</label>
          </div>
          <div class="common-list-radio-box">
            <input type="radio" id="common-radio2" name="urgencyLevel" class='checked' value="普通" v-model:checked="emergency">
            <label for="common-radio2">普通</label>
          </div>
        </div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>类型选择</span>
        </div>
        <div class="div-select flex">
          <span class="btn-select hidden" @click.stop="btnTypeSelect()">{{typeSelectData.str}}</span>
          <div class="div-select-ul top-56" v-if="typeSelectShow">
            <ul>
              <li class="scroll-y" v-for="(item, index) in typeData" @click.stop="btnTypeSelect(index+1)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>子类型选择</span>
        </div>
        <div class="div-select flex">
          <span class="btn-select hidden" @click.stop="btnSubTypeSelect()">{{subTypeSelectData.str}}</span>
          <div class="div-select-ul top-56" v-if="subTypeSelectShow">
            <ul>
              <li class="scroll-y" v-for="(item, index) in subTypeData" @click.stop="btnSubTypeSelect(index+1)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>现场描述</span>
        </div>
        <div class="common-list-text">
          <textarea class="text-input textarea" name="localeDescript" id="localeDescript" placeholder="简要对现场进行描述" v-model:value="description" maxlength="100"></textarea>
        </div>
      </li>
      <div id="container" class="common-upload">
        <p>请上传现场照片</p>
        <label id="upload" class="common-upload-inner" for="file">
          <input type="file" id="file" accept="image/*">
          <img class="img" :src="sceneImg" v-if="sceneImg">
          <em v-else="sceneImg"></em>
        </label>
      </div>
    </ul>
    <button class="btn" type="button" name="button" @click.stop="submit()">提交</button>
  </div>
</div>
</template>
<script>
import UploadFile from '../../../service/uploadFile'
// import uploadImgFun from '../../../service/uploadImg'
// import { resultGet } from '../../../service/getData'
// import { uploadImg } from '../../../config/baseUrl'
import { Toast } from 'mint-ui'

export default{
  name: 'common',
  props: ['typeData', 'reportingMatters', 'mapObj'],
  data () {
    return {
      typeSelectShow: false, // 类型选择
      subTypeSelectShow: false, // 子类型选择
      typeSelectData: this.typeData[this.typeIndex],
      typeIndex: 0,
      subTypeIndex: 0,
      userName: '',
      mobilephone: '',
      detailAddress: '',
      emergency: '',
      description: '',
      sceneImg: '',
      imgTime: ''
    }
  },
  methods: {
    // getToken: function () {
    //   resultGet(uploadImg).then(res => {
    //     res.code === '0000' && this.uploadImgFn(res.upToken)
    //   })
    // },
    // uploadImgFn: function (uptoken) {
    //   var that = this
    //   uploadImgFun({
    //     selfId: 'upload',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.sceneImg = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    // },
    init: function () {
      UploadFile.upload({
        id: 'file',
        callback: (res) => {
          console.log(res)
          this.sceneImg = res.imgUrl
          this.imgTime = res.dateTime
        }
      })
    },
    getLocation: function () {
      this.$emit('showMap')
      console.log('获取位置')
    },
    btnTypeSelect: function (index) {
      if (index && index !== this.typeIndex + 1) {
        index--
        this.typeIndex = index
        this.subTypeIndex = 0
        this.typeSelectData = this.typeData[this.typeIndex]
        this.subTypeData = this.typeSelectData.subTypeData
        this.subTypeSelectData = this.subTypeData[this.subTypeIndex]
      }
      this.subTypeSelectShow = false
      this.typeSelectShow = !this.typeSelectShow
    },
    btnSubTypeSelect: function (index) {
      if (index && index !== this.subTypeIndex + 1) {
        index--
        this.subTypeIndex = index
        this.subTypeSelectData = this.subTypeData[this.subTypeIndex]
      }
      this.typeSelectShow = false
      this.subTypeSelectShow = !this.subTypeSelectShow
      this.$emit('select')
    },
    submit: function () {
      let reqData = {
        userName: this.userName, // 用户姓名 获取微信用户信息
        mobilephone: this.mobilephone, // 用户手机 获取微信用户信息
        identityCard: this.identityCard, // 身份证号
        reportingMatters: this.reportingMatters, // 举报事项
        addressRegion: this.mapObj.addressRegion, // 暂无 地址-区域
        addressStreet: this.mapObj.addressStreet, // 暂无 地址-街道
        addressSite: this.mapObj.addressSite, // 暂无 地址-站点
        detailAddress: this.mapObj.detailAddress, // 详细地址
        emergency: this.emergency, // 紧急程度
        selectTypeId: this.typeSelectData.id, // 选择类型Id
        selectType: this.typeSelectData.str, // 选择类型
        subTypeId: this.subTypeSelectData.id, // 子类型选择Id
        subType: this.subTypeSelectData.str, // 子类型选择
        description: this.description, // 现场描述
        sceneImg: this.sceneImg.split(',')[1], // 现场图片
        imgTime: this.imgTime || ''
      }
      console.log(reqData)
      for (let key in reqData) {
        if (!reqData[key] && key !== 'imgTime') {
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      this.$emit('submit', reqData)
    }
  },
  created () {
    document.addEventListener('click', (e) => {
      this.typeSelectShow = false
      this.subTypeSelectShow = false
    })
    this.typeSelectData = this.typeData[this.typeIndex] // 选择类型
    this.subTypeSelectData = this.typeData[this.typeIndex].subTypeData[this.subTypeIndex] // 选择子类型
    this.subTypeData = this.typeSelectData.subTypeData
    this.userName = window.localStorage.getItem('userName') || '' // 用户姓名
    this.mobilephone = window.localStorage.getItem('mobilePhone') || '' // 用户手机号码
    this.identityCard = window.localStorage.getItem('identityCard') || '' // 用户身份证号码
    this.isReadonly = window.localStorage.getItem('isLogin') === 'true'
  },
  mounted () {
    // this.getToken()
    this.init()
  }
}
</script>
<style lang='less'>
.common-outer{
  font-size: 26px;
  padding-bottom: 40px;
  .width-90{
    width: 90%;
  }
  .top-56{
    left: 0;
    top: 56px !important;
  }
  .padding-right-43{
    padding-right: 43px;
  }
  .flex{
    display: flex;
  }
  .common-form-list{
    overflow: hidden;
    .hidden{
      height: 58px;
      padding-right: 45px;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .scroll-y{
      overflow-x: auto;
      white-space: nowrap;
    }
    .common-form-item{
      margin-top: 24px;
      padding-left: 140px;
      position: relative;
      line-height: 56px;
      .common-list-name{
        position: absolute;
        left: 0;
      }
      .common-list-radio{
        width: 100%;
        display: flex;
        align-items: center;
        .common-list-radio-box{
          margin-right: 50px;
        }
      }
      .common-list-location{
        width: 32px;
        height: 56px;
        padding: 5px 0;
        box-sizing: border-box;
        background: url('../../../images/location.png') right no-repeat;
        background-size: contain;
      }
      .textarea{
        height: 183px;
        resize: none;
      }
    }
  }
  .common-upload{
    line-height: 56px;
    .common-upload-inner{
      display: block;
      width: 190px;
      height: 190px;
      background-color: #efeff4;
      border: 2px solid #dddde1;
      border-radius: 15px;
      text-align: center;
      #file{
        display: none;
      }
      em{
        display: inline-block;
        width: 162px;
        height: 111px;
        margin-top: 40px;
        background-image: url('../../../images/upload.png');
        background-size: cover;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
.white{
  span{
    color: #fff;
  }
}
</style>