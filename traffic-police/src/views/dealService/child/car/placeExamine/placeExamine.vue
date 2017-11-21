<template>
    <div class="placeExamine">
      <div class="placeExamine-form">
        <ul>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车牌号码</span>
            </div>
            <div class="div-select">
              <span class="btn-select stylebackground" @click.stop="vehiclePlate()">{{ vehicle }}</span>
              <div class="div-select-ul" v-if="vehicleShow">
                <ul>
                  <li v-for="(item, index) in cars" @click.stop="vehiclePlate(item)" v-if="item.isMySelf == 0">{{item.myNumberPlate}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车辆类型</span>
            </div>
            <div class="form-line-item">
              <input class="text-input" v-model="carSelectData[vehType]" type="text" value="" readonly/>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>所有权</span>
            </div>
            <div class="div-select">
              <span class="btn-select stylebackground" @click.stop="ownerClick()">{{ ownerTimeMsg }}</span>
              <div class="div-select-ul" v-if="ownerShow">
                <ul>
                  <li v-for="item in ownerData" @click.stop="ownerClick(item.longName, item.id)">{{item.longName}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车架号</span>
            </div>
            <div class="form-line-item">
              <input class="text-input" v-model="carriageNumber" type="text" value="" readonly/>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车主身份证</span>
            </div>
            <div class="form-line-item">
              <input class="text-input stylebackground" v-model="identityCard" type="text" value="" />
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车主姓名</span>
            </div>
            <div class="form-line-item">
              <input class="text-input stylebackground"  v-model="name" type="text" value="" />
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>受托机构</span>
            </div>
            <div class="div-select">
              <span class="btn-select stylebackground" @click.stop="trusteeOrganisation()">{{ trusteeTimeMsg }}</span>
              <div class="div-select-ul" v-if="trusteeShow">
                <ul>
                  <li v-for="item in trusteeData" @click.stop="trusteeOrganisation(item.longName, item.shortName)">{{item.longName}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>收件人姓名</span>
            </div>
            <div class="form-line-item">
              <input class="text-input" v-model="addresseeName" type="text" value="" readonly/>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>联系电话</span>
            </div>
            <div class="form-line-item">
              <input class="text-input" type="text" v-model="mobile" value="" readonly/>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>验证码</span>
            </div>
            <div class="form-line-item width-60">
              <input class="text-input stylebackground" type="text" v-model="identifying" name="" value="" placeholder="请输入验证码">
            </div>
            <div class="form-line-item right width-35">
              <button class="btn browse-code" v-bind:class="{ 'show' : isShow}" :disabled="forbidden" @click="scanQRCode()">{{chronoScope}}</button>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>邮政编码</span>
            </div>
            <div class="form-line-item">
              <input class="text-input stylebackground" v-model="postalcode" type="text" value="" placeholder="请输入邮政编码"/>
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
        </ul>
        <button class="btn btns" v-if="this.Plate" @click.stop="submitClick()">确认信息</button>
        <button class="btn btns" style="background: gray" v-if="!this.Plate">确认信息</button>
      </div>
      <div v-wechat-title="$route.meta.title"></div>
      <page-bottom v-if="isWeChat"></page-bottom>
    </div>
</template>
<script>
import { resultGet, resultPost } from '../../../../../service/getData'
import { getIssuing, sendSMS, verificatioCode, inspectionDeclaration } from '../../../../../config/baseUrl'
import { Toast, MessageBox } from 'mint-ui'
export default {
  name: 'placeExamine',
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
      vehType: '',
      isShow: false,                           //  验证码
      vehicleShow: false,                      // 车牌下拉框
      vehicle: window.localStorage.getItem('myNumberPlate'),
      vehicleTypeShow: false,
      ownerShow: false,
      ownerid: '0',
      ownerTimeMsg: '个人',
      ownerData: [
        {
          'id': '0',
          'longName': '个人'
        },
        {
          'id': '1',
          'longName': '单位'
        }
      ],
      carSelectData: {
        '01': '大型汽车',
        '02': '小型汽车',
        '03': '使馆汽车',
        '04': '领馆汽车',
        '05': '境外汽车',
        '06': '外籍汽车',
        '07': '普通摩托车',
        '08': '轻便摩托车',
        '09': '使馆摩托车',
        '10': '领馆摩托车',
        '15': '挂车',
        '16': '教练汽车',
        '17': '教练摩托车',
        '18': '实验汽车',
        '19': '实验摩托车',
        '22': '临时行驶车',
        '23': '警用汽车',
        '24': '警用摩托',
        '20': '临时入境车',
        '51': '临时行驶车',
        '52': '新能源小型车'
      },
      trusteeShow: false,                    // 受托机构下拉框
      trusteeTimeMsg: '藏A:拉萨市公安局交通警察支队车辆管理所',
      cur_place_id: '藏A',                   // 默认受托机关字段
      trusteeData: '',
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
      carriageNumber: window.localStorage.getItem('behindTheFrame4Digits'),   // 车架号
      addresseeName: window.localStorage.getItem('userName'),                //  收件人名字
      mailingAddress: '',                     // 详细地址
      mobile: window.localStorage.getItem('mobilePhone'),                  // 手机号码
      chronoScope: '获取验证码',
      forbidden: false,                       // 验证码按钮禁用设置
      identityCard: window.localStorage.getItem('identityCard'),     // 身份证
      name: window.localStorage.getItem('userName'),   // 车主名字
      identifying: '',                        // 验证码
      postalcode: '',                         // 邮政编码
      cars: {}
    }
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
        this.vehType = item.plateType
        this.vehicle = item.myNumberPlate
        // this.identityCard = item.identityCard
        // this.name = item.name
        this.carriageNumber = item.behindTheFrame4Digits
        this.vehicleShow = false
      }
    },
    // 所有人下拉框
    ownerClick: function (str, id) {
      if (str) {
        this.ownerTimeMsg = str
        this.ownerid = id
      }
      if (this.ownerShow === true) {
        this.ownerShow = false
      } else {
        this.ownerShow = true
      }
    },
    // 受托机构下拉框
    trusteeOrganisation: function (str, id) {
      if (str) {
        this.trusteeTimeMsg = str
        this.cur_place_id = id
      }
      if (this.trusteeShow === true) {
        this.trusteeShow = false
      } else {
        this.trusteeShow = true
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
            Toast({message: json.msg, position: 'bottom', className: 'white'})
          }
        })
      }
    },
    // 验证码倒计时
    timePiece: function () {         //  验证码倒计时
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
        type: '机动车委托异地定期检验申报',
        url: inspectionDeclaration,
        textObj: {
          'numberPlate': this.vehicle,                       // 车牌号码
          'cartype': this.vehType,                           // 车辆类型
          'proprietorship': this.ownerid,                    // 所有权
          'behindTheFrame4Digits': this.carriageNumber,      // 车架号
          'carOwnerIdentityCard': this.identityCard,         // 车主身份证
          'name': this.name,                                 // 车主名字
          'associatedAgencyMsg': this.trusteeTimeMsg,        // 受托机构全称
          'receiverName': this.addresseeName,                // 收件人名字
          'receiverNumber': this.mobile,                     // 联系电话
          'postCode': this.postalcode,                       // 邮政编码
          'receiverAddress': `深圳市,${this.areaSelectMassage},${this.mailingAddress}`    // 收件人地址
        },
        invisibleObj: {
          'associatedAgency': this.cur_place_id,            // 受托机构
          'identityCard': window.localStorage.getItem('identityCard')  //  登录用户的身份证号码
        }
      }
      this.$store.commit('saveMotorVehicleHandling', dataList)
      this.$router.push(this.isWeChat ? '/affirmInfo_WeChat' : '/affirmInfo')
    },
    verificationFn: function () {
      let verificationData = {
        mobilephone: this.mobile,
        validateCode: this.identifying
      }
      resultPost(verificatioCode, verificationData).then(json => {
        if (json.code === '0000') {
          this.dataFn()
        } else {
          Toast({message: json.data, position: 'bottom', className: 'white'})
        }
      })
    },
    // 确认提交
    submitClick: function () {
      if (!this.identityCard) {
        Toast({message: '请输入身份证', position: 'bottom', className: 'white'})
      } else if (!this.name) {
        Toast({message: '请输入车姓名', position: 'bottom', className: 'white'})
      } else if (!this.postalcode) {
        Toast({message: '请输入邮政编码', position: 'bottom', className: 'white'})
      } else if (!this.mailingAddress) {
        Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
      } else if (!this.identifying) {
        Toast({message: '请输入验证码', position: 'bottom', className: 'white'})
      } else if (this.identifying.length !== 6) {
        Toast({message: '请输入正确验证码', position: 'bottom', className: 'white'})
      } else {
        this.verificationFn()
        // this.dataFn()
      }
    }
  },
  mounted: function () {
    this.cars = JSON.parse(window.localStorage.getItem('cars'))
    this.vehType = this.cars[0].plateType
    // this.vehicle = this.cars[0].myNumberPlate
    // this.carriageNumber = this.cars[0].behindTheFrame4Digits
    document.addEventListener('click', (e) => {
      this.ownerShow = false
      this.vehicleShow = false
      this.vehicleTypeShow = false
      this.areaSelectShow = false
      this.trusteeShow = false
    })
    resultGet(getIssuing).then(json => {        // 查询发证机关列表
      this.trusteeData = json.data
    })
  },
  created () {
    this.Plate = window.localStorage.getItem('myNumberPlate')
    if (!this.Plate) {
      MessageBox('温馨提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
    }
  }
}
</script>
<style lang="less" scoped>
.placeExamine {
background-color: #fff;
position: absolute;
left: 0;
right: 0;
padding: 20px 40px;
  .placeExamine-form {
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
        font-size: 26px;
      }
    }
    .form-annotation{
      color: red;
      font-size: 26px;
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
  .btn-select{
    height: 56px;
  }
  .btns{
    margin: 100px 0 30px 0;
    width: 100%;
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
}
</style>
