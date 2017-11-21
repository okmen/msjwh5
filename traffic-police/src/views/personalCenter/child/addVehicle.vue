<template>
<div class="addVehicle-outer">
  <div class="addVehicle-bindType pad-side-50">
    <p>请选择操作类型</p>
    <div class="div-select">
      <span class="btn-select" @click.stop="bindTypeClick()">{{bindType.str}}</span>
      <div class="div-select-ul" v-if="bindTypeShow">
        <ul>
          <li v-for="(item, index) in bindTypeData" @click.stop="bindTypeClick(index+1)">{{item.str}}</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="addVehicle-form pad-side-50">
    <div id="addVehicle-hbs">
      <ul class="addVehicle-hbs-list">
        <li class="addVehicle-hbs-item">
          <div class="addVehicle-hbs-name">
            <span>车牌类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="vehicleTypeClick()">{{vehicleType.str}}</span>
            <div class="div-select-ul" v-if="vehicleTypeShow">
              <ul>
                <li v-for="(item, index) in vehicleTypeData" @click.stop="vehicleTypeClick(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="addVehicle-hbs-item clear">
          <div class="addVehicle-hbs-name">
            <span>车牌号码</span>
          </div>
          <div class="div-select width-120 left">
            <span class="btn-select min-btn-select" @click.stop="plateTypeClick()">{{plateType.str}}</span>
            <div class="div-select-ul" v-if="plateTypeShow">
              <ul>
                <li v-for="(item, index) in plateTypeData" @click.stop="plateTypeClick(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
          <div class="addVehicle-hbs-text width-70 right">
            <input class="text-input" type="text" v-model:value="licensePlateNumber" maxlength="8" placeholder="请输入车牌号码" style="text-transform:uppercase;">
          </div>
        </li>
        <li class="addVehicle-hbs-item">
          <div class="addVehicle-hbs-name">
            <span>车架号码</span>
          </div>
          <div class="addVehicle-hbs-text">
            <input class="text-input" type="text" placeholder="请输入车架号后4位" v-model:value="frameNumber" maxlength="4">
          </div>
        </li>
        <li class="addVehicle-hbs-item">
          <div class="addVehicle-hbs-name">
            <span>车主姓名</span>
          </div>
          <div class="addVehicle-hbs-text">
            <input  class="text-input"type="text" :placeholder="nameTip" :readonly="nameReadOnly" v-model:value="ownerName">
          </div>
        </li>
        <li class="addVehicle-hbs-item">
          <div class="addVehicle-hbs-name">
            <span>身份证号</span>
          </div>
          <div class="addVehicle-hbs-text">
            <input class="text-input" type="text" :placeholder="idCardTip" :readonly="idCardReadOnly" v-model:value="ownerIdCard">
          </div>
        </li>
      </ul>
      <div class="addVehicle-upload" :class="{height0: bindType.code==1}">
        <p>请按提示上传以下证件照片</p>
        <div id="container" class="addVehicle-upload-inner">
          <label id="idCardImgPositive" class="addVehicle-upload-left addVehicle-upload-box" for="idCardImgPositiveInput">
            <input type="file" id="idCardImgPositiveInput" accept="image/*">
            <img :src="idCardImgPositive" v-if="idCardImgPositive">
            <div class="box" v-else="idCardImgPositive">
              <em></em>
              <span>车主身份证(正面)</span>
            </div>
          </label>
          <label id="idCardImgNegative" class="addVehicle-upload-center addVehicle-upload-box" for="idCardImgNegativeInput">
            <input type="file" id="idCardImgNegativeInput" accept="image/*">
            <img :src="idCardImgNegative" v-if="idCardImgNegative">
            <div class="box" v-else="idCardImgNegative">
              <em></em>
              <span>车主身份证(反面)</span>
            </div>
          </label>
          <label id="idCardImgHandHeld" class="addVehicle-upload-right addVehicle-upload-box" for="idCardImgHandHeldInput">
            <input type="file" id="idCardImgHandHeldInput" accept="image/*">
            <img :src="idCardImgHandHeld" v-if="idCardImgHandHeld">
            <div class="box" v-else="idCardImgHandHeld">
              <em></em>
              <span>车主手持身份证</span>
            </div>
          </label>
        </div>
      </div>
      <button class="btn" type="button" name="button" @click.stop="submitClick()">提交</button>
    </div>
  </div>
  <div v-wechat-title="$route.meta.title"></div>
</div>
</template>
<script>
import UploadFile from '../../../service/uploadFile'
import { addVehicle } from '../../../config/baseUrl'
import { resultPost } from '../../../service/getData'
import { Toast, Indicator } from 'mint-ui'
// import uploadImgFun from '../../../service/uploadImg'
export default{
  name: 'addVehicle',
  data () {
    return {
      /* 身份证输入提示 */
      idCardTip: '外籍人士请在证件号前加F',
      idCardReadOnly: true,
      /* 姓名输入提示 */
      nameTip: '请输入车主姓名',
      nameReadOnly: true,
      /* 类型选择 */
      bindTypeData: [
        {
          'code': 1,
          'str': '绑定个人车辆信息'
        },
        {
          'code': 0,
          'str': '绑定他人车辆'
        }
      ],
      bindType: {
        'code': 1,
        'str': '绑定个人车辆信息'
      },
      bindTypeShow: false,
      /* 车辆类型 */
      vehicleTypeData: [
        {
          'code': '02',
          'str': '蓝牌'
        },
        {
          'code': '01',
          'str': '黄牌'
        },
        {
          'code': '06',
          'str': '黑牌'
        },
        {
          'code': '02',
          'str': '个性牌'
        },
        {
          'code': '52',
          'str': '小型新能源车号牌'
        },
        {
          'code': '51',
          'str': '大型新能源车号牌'
        }
      ],
      vehicleType: {
        'code': '02',
        'str': '蓝牌'
      },
      vehicleTypeShow: false,
      /* 车牌号码 */
      plateTypeData: [
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
      plateType: {
        'str': '粤'
      },
      plateTypeShow: false,
      licensePlateNumber: '',
      frameNumber: '',
      ownerName: window.localStorage.getItem('userName'),
      identityCard: '',
      ownerIdCard: window.localStorage.getItem('identityCard'), // 车主身份证号
      mobilephone: '',
      idCardImgPositive: '',
      idCardImgNegative: '',
      idCardImgHandHeld: ''
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
    //     selfId: 'idCardImgPositive',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.idCardImgPositive = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    //   uploadImgFun({
    //     selfId: 'idCardImgNegative',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.idCardImgNegative = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    //   uploadImgFun({
    //     selfId: 'idCardImgHandHeld',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.idCardImgHandHeld = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    // },
    init: function () {
      UploadFile.upload({
        id: 'idCardImgPositiveInput',
        callback: (res) => {
          console.log(res)
          this.idCardImgPositive = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'idCardImgNegativeInput',
        callback: (res) => {
          console.log(res)
          this.idCardImgNegative = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'idCardImgHandHeldInput',
        callback: (res) => {
          console.log(res)
          this.idCardImgHandHeld = res.imgUrl
        }
      })
    },
    /* 类型选择 */
    bindTypeClick: function (index) {
      if (index) {
        index--
        this.bindType = this.bindTypeData[index]
        console.log(this.bindType)
      }
      /* 身份证提示 */
      if (this.bindType.code === 1) {
        this.idCardTip = '外籍人士请在证件号前加F'
        this.idCardReadOnly = true
        this.ownerIdCard = window.localStorage.getItem('identityCard')
        this.nameTip = '请输入车主姓名'
        this.nameReadOnly = true
        this.ownerName = window.localStorage.getItem('userName')
      } else {
        this.idCardTip = '(车主身份证)外籍人士请在证件号前加F'
        this.idCardReadOnly = false
        this.ownerIdCard = ''
        this.nameTip = '请输入车主姓名'
        this.nameReadOnly = false
        this.ownerName = ''
      }
      this.vehicleTypeShow = false
      this.plateTypeShow = false
      this.bindTypeShow = !this.bindTypeShow
    },
    /* 车辆类型 */
    vehicleTypeClick: function (index) {
      if (index) {
        index--
        this.vehicleType = this.vehicleTypeData[index]
      }
      this.bindTypeShow = false
      this.plateTypeShow = false
      this.vehicleTypeShow = !this.vehicleTypeShow
    },
    /* 车牌号码 */
    plateTypeClick: function (index) {
      if (index) {
        index--
        this.plateType = this.plateTypeData[index]
      }
      this.vehicleTypeShow = false
      this.bindTypeShow = false
      this.plateTypeShow = !this.plateTypeShow
    },
    /* 提交 */
    submitClick: function () {
      let numbers = `${this.plateType.str}${this.licensePlateNumber.toLocaleUpperCase()}`
      if (this.$plateerification(numbers)) {
        Toast({
          message: this.$plateerification(numbers),
          position: 'bottom',
          className: 'white'
        })
        return
      }
      let reqData = {}
      let plateNum = this.licensePlateNumber
      if (this.bindType.code === 1) {
        reqData = {
          // bindType: this.bindType.code,
          // vehicleType: this.vehicleType.str,
          // plateType: this.plateType.str,
          // licensePlateNumber: this.licensePlateNumber,
          // frameNumber: this.frameNumber,
          // ownerName: this.ownerName,
          // identityCard: this.identityCard,
          // mobilephone: this.mobilephone

          bindType: this.bindType.code, // 绑定类型
          licensePlateType: this.vehicleType.code, // 号牌种类
          licensePlateNumber: plateNum.toLocaleUpperCase(), // 车牌号码
          frameNumber: this.frameNumber, // 车架号码
          ownerName: this.ownerName, // 车主姓名
          provinceAbbreviation: this.plateType.str, // 省简称
          userIdCard: this.identityCard, // 当前登录用户身份证
          certifiedSource: window.localStorage.getItem('sourceOfCertification') ? window.localStorage.getItem('sourceOfCertification') : 'C' // 绑定类型
        }
      } else {
        reqData = {
          bindType: this.bindType.code, // 绑定类型
          licensePlateType: this.vehicleType.code, // 号牌种类
          licensePlateNumber: plateNum.toLocaleUpperCase(), // 车牌号码
          frameNumber: this.frameNumber, // 车架号码
          ownerName: this.ownerName, // 车主姓名
          ownerIdCard: this.ownerIdCard, // 车主身份证号
          provinceAbbreviation: this.plateType.str, // 省简称
          userIdCard: this.identityCard, // 当前登录用户身份证
          certifiedSource: window.localStorage.getItem('sourceOfCertification') ? window.localStorage.getItem('sourceOfCertification') : 'C', // 绑定类型
          idCardImgPositive: this.idCardImgPositive.split(',')[1], // 车主身份证正面照
          idCardImgHandHeld: this.idCardImgHandHeld.split(',')[1] // 车主身份证手持照
        }
        Indicator.open('正在上传...')
      }
      // 非空验证
      for (let key in reqData) {
        if (reqData[key] === '' || !reqData[key] && key !== 'bindType') {
          console.log(key)
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      if (this.ownerIdCard) {
        if (/[（*|）*]/g.test(this.ownerIdCard)) {
          Toast({
            message: '请使用英文状态下的括号',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      reqData.businessType = this.$root.$router.businessType || '' // 城市服务区分业务
      console.log(reqData)
      resultPost(addVehicle, reqData).then(json => {
        console.log(json)
        Indicator.close()
        if (json.code === '0000') {
          if (this.$root.$router.isWeChat) {
            window.location.href = json.msg
            return true
          }
          console.log(json)
          console.log('跳转预约申办成功页')
          this.$router.push('/appointSuccess')
        } else {
          Toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        }
      })
    }
  },
  created () {
    document.addEventListener('click', (e) => {
      this.bindTypeShow = false
      this.vehicleTypeShow = false
      this.plateTypeShow = false
    })
    this.identityCard = window.localStorage.getItem('identityCard')
  },
  mounted () {
    // this.getToken()
    this.init()
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>
<style lang="less">
.addVehicle-outer{
  font-size: 26px;
  color: #000;
  .width-120 {
    width: 120px !important;
  }
  .width-70 {
    width: 70% !important;
  }
  .height0{
    height: 0;
    overflow: hidden;
  }
  .addVehicle-bindType{
    background: #fff;
    padding-bottom: 24px;
    position: relative;
    p{
      color: #666;
      line-height: 68px;
    }
  }
  .addVehicle-form{
    background: #fff;
    margin-top: 12px;
    #addVehicle-hbs{
      .addVehicle-hbs-list{
        overflow: hidden;
        .addVehicle-hbs-item{
          margin-top: 24px;
          padding-left: 130px;
          position: relative;
          line-height: 56px;
          .addVehicle-hbs-name{
            position: absolute;
            left: 0;
          }
        }
      }
      .addVehicle-upload{
        p{
          font-size: 28px;
          margin: 34px 0;
        }
        .addVehicle-upload-inner{
          display: flex;
          justify-content: space-between;
          .addVehicle-upload-box {
            display: block;
            width: 190px;
            height: 190px;
            input[type=file]{
              display: none;
            }
            .box{
              width: 190px;
              height: 190px;
              background-color: #efeff4;
              border: 2px solid #dddde1;
              border-radius: 15px;
              color: #666;
              font-size: 22px;
              text-align: center;
              em {
                display: inline-block;
                width: 162px;
                height: 111px;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              span {
                display: block;
              }
            }
            img{
              width: 100%;
              height: 100%;
            }
          }
          .addVehicle-upload-left {
            em {
              background-image: url('../../../images/ID-front.png');
              background-size: cover;
            }
          }
          .addVehicle-upload-center {
            em {
              background-image: url('../../../images/ID-rear.png');
              background-size: cover;
            }
          }
          .addVehicle-upload-right {
            em {
              background-image: url('../../../images/ID-hand.png');
              background-size: cover;
            }
          }
        }
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
