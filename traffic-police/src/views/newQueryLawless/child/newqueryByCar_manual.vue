<template>
  <div class="queryByCar-outer">
    <div class="queryByCar-from pad-side-50">
      <div id="queryByCar-hbs">
        <ul class="queryByCar-hbs-list">
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>车辆类型</span>
            </div>
            <div class="div-select">
              <span class="btn-select" @click.stop="licenseSelectClick()">{{ licenseSelectMassage }}</span>
              <div class="div-select-ul" v-if="licenseSelectShow">
                <ul>
                  <li v-for="item in licenseSelectData" @click.stop="licenseSelectClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="queryByCar-hbs-item clear">
            <div class="queryByCar-hbs-name">
              <span>车牌号码</span>
            </div>
            <div class="div-select width-25 left">
              <span class="btn-select min-btn-select" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
              <div class="div-select-ul" v-if="abbreviationSelectShow">
                <ul>
                  <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str)">{{item.str}}</li>
                </ul>
              </div>
            </div>
            <div class="queryByCar-hbs-text width-70 right">
              <input v-model="car_number" class="text-input" type="text" name="" value="" placeholder="请输入车牌号码">
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>车架号</span>
            </div>
            <div class="queryByCar-hbs-text">
              <input v-model="vehicleIdentifyNoLast4" class="text-input" type="text" maxlength="4" name="" value="" placeholder="请输入车架号后四位">
            </div>
          </li>
          <!-- <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>身份证</span>
            </div>
            <div class="queryByCar-hbs-text">
              <input v-model="identityCard" class="text-input" type="text" name="" value="" placeholder="请输入身份证号码">
            </div>
          </li>
          <li class="queryByCar-hbs-item">
            <div class="queryByCar-hbs-name">
              <span>手机号码</span>
            </div>
            <div class="queryByCar-hbs-text">
              <input v-model="mobilephone" class="text-input" type="text" name="" value="" placeholder="请输入手机号码">
            </div>
          </li> -->
          <li class="queryByCar-hbs-item clear" v-if="codeIfShow">
            <div class="queryByCar-hbs-name">
              <span>验证码</span>
            </div>
            <div class="queryByCar-hbs-text width-40 left">
              <input class="text-input" type="text" name="" maxlength="4" value="" placeholder="请输入验证码" id="inp">
            </div>
            <div class="left queryByCar-hbs-code" id="code"></div>
          </li>
        </ul>
      </div>
      <button class="btn" type="button" name="button" @click.stop="queryLawlessByCar()">查询</button>
      <router-link class="btn btn-light-green" to="newqueryByCard" v-if="codeIfShow">驾驶证查询</router-link>
      <div class="hint">
        <p>温馨提示：可查粤B牌车全国的违法及外地车深圳的违法</p>
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { queryLawlessByCar } from '../../../config/baseUrl'
  import { verifyCode } from '../../../config/verifyCode'
  import { Toast } from 'mint-ui'
  export default {
    name: 'queryByCar',
    data () {
      return {
        licensePlateNo: '',                   // 请求-车牌号
        cur_type_id: '02',                    // 请求-车牌类型（编号转换）
        car_number: '',                       // 请求-除去省字的车牌号
        vehicleIdentifyNoLast4: '',           // 请求-车架号后4位
        identityCard: '',                     // 请求-身份证号码
        mobilephone: '',                      // 请求-手机号码
        illegalData: [],                      // 返回-全部数据存入数组
        verifyCode: false,                    // 验证码验证
        codeIfShow: true,
        isMineCar: window.localStorage.myNumberPlate === 'undefined' ? false : window.localStorage.myNumberPlate,
        claimList: {
          '0': '直接缴款',
          '1': '需要打单',
          '2': '需要前往窗口办理'
        },       // 返回-是否需要打单（编号转换）
        myIllegalData: [],                    // 返回-查询我的违章
        licenseSelectShow: false,             // 车牌列表显示与否
        licenseSelectMassage: '小型汽车', // 默认车牌类型
        licenseSelectData: [
          {
            'id': '01',
            'str': '大型汽车'
          },
          {
            'id': '02',
            'str': '小型汽车'
          },
          {
            'id': '03',
            'str': '使馆汽车'
          },
          {
            'id': '04',
            'str': '领馆汽车'
          },
          {
            'id': '05',
            'str': '境外汽车'
          },
          {
            'id': '06',
            'str': '外籍汽车'
          },
          {
            'id': '07',
            'str': '普通摩托车'
          },
          {
            'id': '08',
            'str': '轻便摩托车'
          },
          {
            'id': '09',
            'str': '使馆摩托车'
          },
          {
            'id': '10',
            'str': '领馆摩托车'
          },
          {
            'id': '15',
            'str': '挂车'
          },
          {
            'id': '16',
            'str': '教练汽车'
          },
          {
            'id': '17',
            'str': '教练摩托车'
          },
          {
            'id': '18',
            'str': '实验汽车'
          },
          {
            'id': '19',
            'str': '实验摩托车'
          },
          {
            'id': '22',
            'str': '临时行驶车'
          },
          {
            'id': '23',
            'str': '警用汽车'
          },
          {
            'id': '24',
            'str': '警用摩托'
          },
          {
            'id': '20',
            'str': '临时入境车'
          },
          {
            'id': '51',
            'str': '新能源大型车'
          },
          {
            'id': '52',
            'str': '新能源小型车'
          }
        ],             // 车牌类型列表（编号转换）
        abbreviationSelectShow: false,        // 省字列表显示与否
        abbreviationSelectMassage: '粤',      // 默认省字
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
        ]         // 省字列表
        //        billNo: '',                      // 返回-违法编号
        //        illegalTime: '',                 // 违法时间
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.name === 'newLawlessMsg') {
          vm.car_number = vm.$store.state.newLawlessQuery.info.myNumberPlate.slice(1)
          vm.cur_type_id = vm.$store.state.newLawlessQuery.info.plateType
          vm.vehicleIdentifyNoLast4 = vm.$store.state.newLawlessQuery.info.behindTheFrame4Digits
        }
      })
    },
    mounted () {
      if (window.location.href.split('?')[1]) {
        this.codeIfShow = false
        this.verifyCode = true
        this.abbreviationSelectMassage = this.getQueryString('numberPlate').substring(0, 1)
        this.car_number = this.getQueryString('numberPlate').substring(1)
        this.cur_type_id = this.getQueryString('plateType')
        this.licenseSelectData.forEach(item => {
          if (item.id === this.cur_type_id) {
            console.log(item)
            this.licenseSelectMassage = item.str
          }
        })
        this.vehicleIdentifyNoLast4 = this.getQueryString('digits')
      }
      verifyCode(document.getElementById('inp'), document.getElementById('code'), (result, code) => {
        this.verifyCode = result
      })
    },
    methods: {
      getQueryString: function (name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        let href = window.location.href
        let r = href.substr(href.indexOf('?') + 1).match(reg)
        if (r !== null) return decodeURI(r[2])
        return false
      },
      licenseSelectClick: function (str, id) {
        if (str) {
          this.licenseSelectMassage = str
          this.cur_type_id = id
        }
        if (this.licenseSelectShow === true) {
          this.licenseSelectShow = false
        } else {
          this.licenseSelectShow = true
          this.typeSelectShow = false
          this.abbreviationSelectShow = false
        }
      },
      abbreviationSelectClick: function (str) {
        if (str) {
          this.abbreviationSelectMassage = str
        }
        if (this.abbreviationSelectShow === true) {
          this.abbreviationSelectShow = false
        } else {
          this.abbreviationSelectShow = true
          this.licenseSelectShow = false
          this.typeSelectShow = false
        }
      },
      queryLawlessByCar: function () {
        let platNo = this.abbreviationSelectMassage + this.car_number
        let reqData = {
          car_number: this.car_number.toLocaleUpperCase(),
          licensePlateNo: platNo.toLocaleUpperCase(),
          licensePlateType: this.cur_type_id,
          vehicleIdentifyNoLast4: this.vehicleIdentifyNoLast4
        }
        for (let key in reqData) {
          if (!reqData[key]) {
            console.log(key)
            Toast({
              message: '信息填写不完整',
              position: 'bottom',
              className: 'white'
            })
            return false
          }
        }
        if (this.$plateerification(platNo.toLocaleUpperCase())) {
          Toast({
            message: this.$plateerification(platNo.toLocaleUpperCase()),
            position: 'bottom',
            className: 'white'
          })
          return
        }
        if (!this.verifyCode) {
          Toast({
            message: '验证码输入错误',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
        resultPost(queryLawlessByCar, reqData).then(json => {
          if (json.code === '0000') {
            let lawlessData = {
              info: {
                behindTheFrame4Digits: reqData.vehicleIdentifyNoLast4,
                plateType: reqData.licensePlateType,
                myNumberPlate: reqData.licensePlateNo
              },
              data: json.data
            }
            this.$store.commit('saveNewLawlessQuery', lawlessData)
            let login = this.$route.query.type === 'nologin'
            this.$router.push(`newLawlessMsg?type=query&login=${login}`)
          } else {
            Toast({
              message: json.msg,
              position: 'middle',
              duration: 2000
            })
          }
        })
      }
    },
    created () {
      document.addEventListener('click', (e) => {
        this.typeSelectShow = false
        this.licenseSelectShow = false
        this.abbreviationSelectShow = false
      })
    }
  }
</script>
<style lang="less">
  .queryByCar-outer {
    font-size: 28px;
    color: #000;
    position: relative;
    background-color: white;
    .width-25 {
      width: 25% !important;
    }
    .width-70 {
      width: 70% !important;
    }
    .width-40 {
      width: 40% !important;
    }
    .queryByCar-from {
      background-color: #fff;
      #queryByCar-hbs {
        padding-bottom: 20px;
        .queryByCar-hbs-list {
          overflow: hidden;
          .queryByCar-hbs-item {
            margin-top: 24px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .queryByCar-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .queryByCar-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .queryByCar-hbs-code {
              margin-left: 40px;
              text-indent: 28px;
              width: 240px;
              height: 56px;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .queryResults {
      color: #333 !important;
      margin: 100px 0;
      .results-box {
        border: 1px solid #a7d9f9;
        background-color: #fff;
        border-radius: 4px;
        .box-header {
          height: 80px;
          line-height: 80px;
          border-bottom: 1px solid #a7d9f9;
          &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
          .header-item {
            font-size: 1rem;
            padding: 0 24px;
            font-weight: bold;
            &.order-print {
              color: #2696dd;
              text-decoration: underline;
            }
          }
        }
        .box-body {
          color: #333;
          padding: 0 24px 10px;
          position: relative;
          .body-left-side {
            width: 80%;
            .left-number {
              font-size: 0.95rem;
              font-weight: bold;
              height: 80px;
              line-height: 80px;
              i {
                color: #f46263;
                margin-left: 30px;
              }
            }
            .left-line {
              padding: 8px 0;
              font-size: 0.9rem;
              &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
              span {
                display: inline-block;
                width: 50px;
                text-align: center;
                position: absolute;
              }
              p {
                display: inline-block;
                position: relative;
                left: 70px;
                vertical-align: middle;
              }
              i {
                display: inline-block;
                width: 34px;
                height: 34px;
                background-image: url("./../../../images/A.png");
                background-size: 100%;
                vertical-align: middle;
                &.time {
                  background-image: url("./../../../images/time_2.png");
                }
                &.car {
                   background-image: url("./../../../images/car.png");
                   background-repeat: no-repeat;
                   width: 40px;
                 }
                &.punish {
                   background-image: url("./../../../images/punish.png");
                   background-repeat: no-repeat;
                   width: 36px;
                   height: 38px;
                 }
                &.local {
                  background-image: url("./../../../images/local.png");
                  width: 32px;
                  height: 40px;
                }
                &.warn {
                  background-image: url("./../../../images/warn.png");
                  width: 36px;
                  height: 38px;
                }
              }
            }
          }
          .body-right-side {
            position: absolute;
            top: 50%;
            right: 20px;
            margin-top: -20px;
            display: block;
            width: 20px;
            height: 40px;
            background-image: url("./../../../images/login-right.png");
            background-size: cover;
          }
        }
      }
    }
    .btn{
      background-color: #2696dd;
    }
    .btn-light-green {
      margin-top: 20px;
      border: 1px solid #2696dd;
      color: #2696dd;
      background-color: #fbfafc;
      display: block;
      width: 100%;
      height: 2.5rem;
      border-radius: 0.3125rem;
      font-size: 1rem;
      outline: none;
      text-align: center;
      line-height: 2.5rem;
    }
  }
</style>
