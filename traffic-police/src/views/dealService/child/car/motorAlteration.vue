<template>
  <div class="motorAlteration">
    <div class="motorAlteration-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车主姓名</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" value="" v-model="name"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件种类</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="varietyID()">{{ variety }}</span>
            <div class="div-select-ul" v-if="varietyShow">
              <ul>
                <li v-for="item in varietyData" @click.stop="varietyID(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" v-model="IDcard" type="text" value="" placeholder="请输入证件号码"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车牌号码</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="vehiclePlate()">{{ vehicle }}</span>
            <div class="div-select-ul" v-if="vehicleShow">
              <ul>
                <li v-for="item in cars" @click.stop="vehiclePlate(item)">{{item.myNumberPlate}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车辆类型</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="" v-model="carSelectData[vehType]" readonly/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>户籍所在地</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="domicileFn()">{{ domicile }}</span>
            <div class="div-select-ul" v-if="domicileShow">
              <ul>
                <li v-for="item in domicileData" @click.stop="domicileFn(item.str, item.id, item.index)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车架号</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="" v-model="vehicleFlapper" readonly/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>手机号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="" v-model="mobilephone" readonly/>
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
      <div class="upload-photo">
        <div class="">请按示例图上传以下证件照片</div>
        <div class="upload-all-img">
          <div class="upload-item-img">
            <label class="upload-item-img-one" for="file1">
              <input id="file1" type="file" accept="image/*" >
              <img :src="imgOne1" />
            </label>
            <div class="upload-item-text-one">身份证(正面)</div>
          </div>
          <div class="upload-item-img">
            <label class="upload-item-img-one" for="file2">
              <input id="file2" type="file" accept="image/*" >
              <img :src="imgOne2" />
            </label>
            <div class="upload-item-text-one">身份证(反面)</div>
          </div>
          <div class="upload-item-img">
            <label class="upload-item-img-one" for="file3">
              <input id="file3" type="file" accept="image/*" >
              <img :src="imgOne3" />
            </label>
            <div class="upload-item-text-one">机动车行驶证</div>
          </div>
        </div>
      </div>
      <button class="btn btns" v-if="this.Plate.length !== 0" @click.stop="submitClick()">确认信息</button>
      <button class="btn btns" style="background: gray" v-if="this.Plate.length === 0">确认信息</button>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
  import { iocomotiveCarChangeContact } from '../../../../config/baseUrl'
  import UploadFile from '../../../../service/uploadFile'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'motorAlteration',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    components: {
      'pageBottom': require('../../../../components/pageBottom.vue')
    },
    data () {
      return {
        imgOne1: require('../../../../images/IDcard-front.png'),
        imgOne2: require('../../../../images/IDcard-back.png'),
        imgOne3: require('../../../../images/drivinglicense.png'),
        vehType: '',
        name: window.localStorage.getItem('userName'),
        vehicleFlapper: '',
        IDcardFront: '',                             // 身份证正面
        IDcarfBack: '',                              // 身份证反面
        registerCredential: '',                      // 机动车登记证书
        outBoard: '',                                // 境外人员临住表
        IDcard: window.localStorage.getItem('identityCard'),
        mailingAddress: '',                          // 详细地址
        varietyShow: false,
        variety: '居民身份证',
        cur_card_id: 'A',                             // 默认证件类型id A为身份证
        varietyData: [
          {
            'id': 'A',
            'str': '居民身份证'
          },
          {
            'id': 'B',
            'str': '组织机构代码书'
          },
          {
            'id': 'C',
            'str': '军官证'
          },
          {
            'id': 'E',
            'str': '军官离退休证'
          },
          {
            'id': 'D',
            'str': '士兵证'
          },
          {
            'id': 'F',
            'str': '境外人员身份证明'
          },
          {
            'id': 'G',
            'str': '外交人员身份证明'
          },
          {
            'id': 'H',
            'str': '居民户口簿'
          },
          {
            'id': 'J',
            'str': '单位注销证明'
          },
          {
            'id': 'K',
            'str': '居住暂住证明'
          },
          {
            'id': 'L',
            'str': '驻华机构证明'
          },
          {
            'id': 'M',
            'str': '临时居民身份证'
          }
        ],
        vehicleShow: false,
        vehicle: '',                         // 车牌下拉
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
        domicile: '深户',
        domicileShow: false,
        domicileId: '1',
        showIndex: '0',
        domicileData: [
          {
            'id': '1',
            'index': '0',
            'str': '深户'
          },
          {
            'id': '0',
            'index': '1',
            'str': '非深户'
          },
          {
            'id': '0',
            'index': '2',
            'str': '外籍户口'
          }
        ],
        mobilephone: '',
        cars: {}
      }
    },
    created () {
      this.Plate = JSON.parse(window.localStorage.getItem('cars'))
      if (this.Plate.length === 0) {
        MessageBox('温馨提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
      }
    },
    mounted: function () {
      document.addEventListener('click', (e) => {
        this.varietyShow = false
        this.vehicleShow = false
        this.vehicleTypeShow = false
        this.areaSelectShow = false
        this.plateNumberShow = false
      })
      this.uploadImg()
      this.cars = JSON.parse(window.localStorage.getItem('cars'))
      if (this.cars.length === 0) return
      this.vehType = this.cars[0].plateType
      this.vehicle = this.cars[0].myNumberPlate
      this.mobilephone = this.cars[0].mobilephone
      this.vehicleFlapper = this.cars[0].behindTheFrame4Digits
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
          this.vehicle = item.myNumberPlate
          this.vehicleFlapper = item.behindTheFrame4Digits
          this.mobilephone = item.mobilephone
          this.vehicleShow = false
        }
      },
      // 证件种类下拉框
      varietyID: function (str, id) {
        if (str) {
          this.variety = str
          this.cur_card_id = id
          if (this.cur_card_id === 'A') {
            this.IDcard = window.localStorage.getItem('identityCard')
          } else {
            this.IDcard = ''
          }
        }
        if (this.varietyShow === true) {
          this.varietyShow = false
        } else {
          this.varietyShow = true
        }
      },
      // 户籍所在地下拉框
      domicileFn: function (str, id, index) {
        if (str) {
          this.domicile = str
          this.domicileId = id
          this.showIndex = index
        }
        if (this.domicileShow === true) {
          this.domicileShow = false
        } else {
          this.domicileShow = true
        }
      },
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
      uploadImg () {
        UploadFile.upload({
          id: 'file1',
          callback: (res) => {
            this.imgOne1 = res.imgUrl
            this.IDcardFront = res.imgUrl
          }
        })
        UploadFile.upload({
          id: 'file2',
          callback: (res) => {
            this.imgOne2 = res.imgUrl
            this.IDcarfBack = res.imgUrl
          }
        })
        UploadFile.upload({
          id: 'file3',
          callback: (res) => {
            this.imgOne3 = res.imgUrl
            this.registerCredential = res.imgUrl
          }
        })
      },
      submitClick: function () {
        if (!this.IDcard) {
          Toast({message: '请输入身份证', position: 'bottom', className: 'white'})
        } else if (!this.mailingAddress) {
          Toast({message: '请输入收件人详细地址', position: 'bottom', className: 'white'})
        } else if (!this.IDcardFront) {
          Toast({message: '请上传身份证正面', position: 'bottom', className: 'white'})
        } else if (!this.IDcarfBack) {
          Toast({message: '请上传身份证反面', position: 'bottom', className: 'white'})
        } else if (!this.registerCredential) {
          Toast({message: '请上传机动车行驶证', position: 'bottom', className: 'white'})
        } else {
          this.dataFn()
        }
      },
      dataFn: function () {
        let dataList = {
          type: '机动车变更联系方式',
          url: iocomotiveCarChangeContact,
          textObj: {
            'name': this.name,                               // 车主姓名
            'identificationNO': this.cur_card_id,            // 证件种类
            'identificationNum': this.IDcard,                // 证件号码
            'numberPlate': this.vehicle,                     // 车牌号码
            'cartype': this.vehType,                         // 车辆类型
            'mobilephone': this.mobilephone,                 // 手机号码
            'placeOfDomicile': this.domicileId,               // 户籍所在地
            'showIndex': this.showIndex,
            'behindTheFrame4Digits': this.vehicleFlapper,    // 车架号
            'receiverAddress': `深圳市${this.areaSelectMassage}${this.mailingAddress}`    // 收件人地址
          },
          imgObj: {
            'PHOTO9': this.IDcardFront.split(',')[1],
            'PHOTO10': this.IDcarfBack.split(',')[1],
            'JDCXSZ': this.registerCredential.split(',')[1]
          }
        }
        this.$store.commit('saveMotorVehicleHandling', dataList)
        this.$router.push(this.isWeChat ? '/affirmInfo_WeChat' : '/affirmInfo')
      }
    }
  }
</script>
<style lang="less" scoped>
.motorAlteration {
background-color: #fff;
position: absolute;
left: 0;
right: 0;
padding: 20px 40px;
  .motorAlteration-form {
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
        &.sex {
          text-align: center;
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
    margin: 60px 0 30px 0;
    width: 100%;
  }
  .div-select-ul{
    font-size: 26px;
  }
  .upload-all-img{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .stylebackground{
    background-color: #fff;
  }
  .upload-photo{
    margin-top: 30px;
    display: block;
    .upload-item-text-one{
      margin-top: 10px;
      margin-bottom: 30px;
      color: #7e7e7e;
      text-align: center;
    }
    .upload-item-img-one{
      width: 194px;
      height: 194px;
      border: 2px solid #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      input{
        display: none;
      }
      img{
        max-height: 90%;
        max-width: 90%;
      }
    }
  }
}
</style>
