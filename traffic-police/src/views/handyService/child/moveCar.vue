<template>
  <mymap v-if="mapShow" @submit="submitMap"></mymap>
  <div class="moveCar-outer pad-side-50" v-else="mapShow">
    <p class="title">填写以下表单申请挪车：</p>
    <ul class="moveCar-list">
      <li class="moveCar-item clear">
        <div class="moveCar-item-name">
          <span>车牌号码</span>
        </div>
        <div class="div-select left width-146">
          <span class="btn-select min-btn-select" @click.stop="abbreviationSelectClick()">{{abbreviation}}</span>
          <div class="div-select-ul" v-if="abbreviationSelectShow">
            <ul>
              <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str)">{{item.str}}</li>
            </ul>
          </div>
        </div>
        <div class="moveCar-item-text right width-67">
          <input class="text-input" type="text" name="" v-model:value="numberPlate" placeholder="请输入车牌号码" style="text-transform:uppercase;" maxlength="10">
        </div>
      </li>
      <li class="moveCar-item">
        <div class="moveCar-item-name">
          <span>车辆类型</span>
        </div>
        <div class="div-select">
          <span class="btn-select" @click.stop="carTypeSelectClick()">{{carType.str}}</span>
          <div class="div-select-ul" v-if="carTypeSelectShow">
            <ul>
              <li v-for="(item, index) in carTypeSelectData" @click.stop="carTypeSelectClick(index+1)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </li>
      <li class="moveCar-item clear">
        <div class="moveCar-item-name">
          <span>挪车地址</span>
        </div>
        <div class="common-list-text left width-90">
          <input class="text-input" type="text" name="" v-model:value="showAdd" placeholder="点击右侧按钮选择地址" readonly>
        </div>
        <div class="common-list-location right" @click.stop='getLocation()'></div>
      </li>
      <button class="btn" type="button" name="button" @click.stop="submit()">发送短信</button>
    </ul>
    <div class="moveCar-tip">
      <p class="moveCar-tip-titlte">拨打专线通知挪车：</p>
      <p class="moveCar-tip-content">深圳交警全新推出电话挪车服务，星级用户如遇见正常停车后被其他车辆堵住，可拨打专线电话，交警将联系对方车主移车；或者提交表单发起挪车需求，交警将发起挪车需求，交警将发送提示短信通知对方车主移车。对方拒绝移车且违法停放的，交警将依法处罚。</p>
      <button class="btn btn-blue" type="button" name="button"><a href="tel:83333333">拨打专线</a></button>
    </div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
import { resultPost } from '../../../service/getData'
import { moveCar } from '../../../config/baseUrl'
import { MessageBox, Toast, Indicator } from 'mint-ui'
import mymap from '../../map/map.vue'
export default{
  name: 'moveCar',
  computed: {
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  data () {
    return {
      mapShow: false,
      abbreviationSelectShow: false,
      abbreviation: '粤',
      abbreviationSelectData: [
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
      numberPlate: '',
      carTypeSelectShow: false,
      carType: {
        'str': '小型汽车',
        'code': '02'
      },
      carTypeSelectData: [
        {
          'str': '大型汽车',
          'code': '01'
        },
        {
          'str': '小型汽车',
          'code': '02'
        },
        {
          'str': '使馆汽车',
          'code': '03'
        },
        {
          'str': '领馆汽车',
          'code': '04'
        },
        {
          'str': '境外汽车',
          'code': '05'
        },
        {
          'str': '外籍汽车',
          'code': '06'
        },
        {
          'str': '两、三轮摩托车',
          'code': '07'
        },
        {
          'str': '轻便摩托车',
          'code': '08'
        },
        {
          'str': '使馆摩托车',
          'code': '09'
        },
        {
          'str': '领馆摩托车',
          'code': '10'
        },
        {
          'str': '境外摩托车',
          'code': '11'
        },
        {
          'str': '外籍摩托车',
          'code': '12'
        },
        {
          'str': '农用运输车',
          'code': '13'
        },
        {
          'str': '拖拉机',
          'code': '14'
        },
        {
          'str': '挂车',
          'code': '15'
        },
        {
          'str': '教练汽车',
          'code': '16'
        },
        {
          'str': '教练摩托车',
          'code': '17'
        },
        {
          'str': '试验汽车',
          'code': '18'
        },
        {
          'str': '试验摩托车',
          'code': '19'
        },
        {
          'str': '临时入境汽车',
          'code': '20'
        },
        {
          'str': '试验摩托车',
          'code': '21'
        },
        {
          'str': '临时行驶车',
          'code': '22'
        },
        {
          'str': '警用汽车',
          'code': '23'
        },
        {
          'str': '警用摩托',
          'code': '24'
        },
        {
          'code': '51',
          'str': '新能源大型车'
        },
        {
          'code': '52',
          'str': '新能源小型车'
        }
      ],
      doodgenAddress: '',
      showAdd: ''
    }
  },
  components: {
    mymap,
    'pageBottom': require('../../../components/pageBottom.vue')
  },
  methods: {
    submitMap: function (obj) {
      this.mapShow = false
      this.doodgenAddress = obj.addressSite
      this.showAdd = obj.showAdd
      console.log(obj)
    },
    abbreviationSelectClick: function (str) {
      if (str) {
        this.abbreviation = str
      }
      this.carTypeSelectShow = false
      this.abbreviationSelectShow = !this.abbreviationSelectShow
    },
    carTypeSelectClick: function (index) {
      if (index) {
        index--
        this.carType = this.carTypeSelectData[index]
      }
      this.abbreviationSelectShow = false
      this.carTypeSelectShow = !this.carTypeSelectShow
    },
    getLocation: function () {
      this.mapShow = true
    },
    submit: function () {
      let numbers = `${this.abbreviation}${this.numberPlate.toLocaleUpperCase()}`
      if (this.$plateerification(numbers)) {
        Toast({
          message: this.$plateerification(numbers),
          position: 'bottom',
          className: 'white'
        })
        return
      }
      let reqData = {
        abbreviation: this.abbreviation, // 车牌简称
        numberPlate: this.numberPlate.toLocaleUpperCase(), // 车牌号码
        carType: this.carType.code, // 汽车种类
        doodgenAddress: this.doodgenAddress, // 挪车地址
        // doodgenAddress: '深圳', // 挪车地址
        identityCard: this.identityCard // 身份证
      }
      for (let key in reqData) {
        if (!reqData[key]) {
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      Indicator.open('正在提交...')
      resultPost(moveCar, reqData).then(json => {
        Indicator.close()
        console.log(json)
        if (json.code === '0000') {
          MessageBox({
            title: '温馨提示',
            message: '已在交警系统发出通知，请耐心等待！'
          })
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
  created: function () {
    document.addEventListener('click', (e) => {
      this.abbreviationSelectShow = false
      this.carTypeSelectShow = false
    })
    this.identityCard = window.localStorage.getItem('identityCard')
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>
<style lang="less">
.moveCar-outer{
  padding-top: 28px;
  line-height: 58px;
  .tp-bottom{
    margin-top: 28px;
  }
  .width-90{
    width: 90%;
  }
  background-color: #fff;
  .title{
    font-size: 24px;
    line-height: 30px;
  }
  .width-146{
    width: 146px !important;
  }
  .width-67{
    width: 67%;
  }
  .moveCar-list{
    margin-bottom: 90px;
    .moveCar-item{
      padding-left: 130px;
      margin-top: 31px;
      font-size: 28px;
      position: relative;
      .moveCar-item-name{
        position: absolute;
        left: 0;
      }
      .common-list-location{
        width: 32px;
        height: 56px;
        padding: 5px 0;
        box-sizing: border-box;
        background: url('../../../images/location.png') right no-repeat;
        background-size: contain;
      }
    }
  }
  .moveCar-tip{
    font-size: 24px;
    .moveCar-tip-titlte{
      line-height: 66px;
    }
    .moveCar-tip-content{
      line-height: 34px;
      color: #353535;
    }
    .btn{
      a{
        display: flex;
        width: 100%;
        height: 100%;
        color: #fff;
        align-items: center;
        justify-content: center;
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
