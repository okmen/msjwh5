<template>
  <div class="earlyLawless-outer">
    <div class="earlyLawless-from pad-side-50">
      <div id="earlyLawless-hbs">
        <ul class="earlyLawless-hbs-list">
          <li class="earlyLawless-hbs-item">
            <div class="earlyLawless-hbs-name">
              <span>车辆类型</span>
            </div>
            <div class="div-select">
              <span v-model="licensePlateType" class="btn-select" @click.stop="licenseSelectClick()">{{ licenseSelectMassage }}</span>
              <div class="div-select-ul" v-if="licenseSelectShow">
                <ul>
                  <li v-for="item in licenseSelectData" @click.stop="licenseSelectClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </li>
          <li class="earlyLawless-hbs-item clear">
            <div class="earlyLawless-hbs-name">
              <span>车牌号码</span>
            </div>
            <div class="div-select width-120 left">
              <span class="btn-select min-btn-select" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
              <div class="div-select-ul" v-if="abbreviationSelectShow">
                <ul>
                  <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str)">{{item.str}}</li>
                </ul>
              </div>
            </div>
            <div class="earlyLawless-hbs-text width-70 right">
              <input v-model="car_number" class="text-input" type="text" name="" value="" placeholder="请输入车牌号码">
            </div>
          </li>
          <li class="earlyLawless-hbs-item">
            <div class="earlyLawless-hbs-name">
              <span>驾驶证号</span>
            </div>
            <div class="earlyLawless-hbs-text">
              <input  v-model="drivingLicenceNo" class="text-input" type="text" name="" value="" placeholder="请输入驾驶证号">
            </div>
          </li>
          <li class="earlyLawless-hbs-item">
            <div class="earlyLawless-hbs-name">
              <span>手机号码</span>
            </div>
            <div class="earlyLawless-hbs-text">
              <input v-model="mobilephone" class="text-input" type="tel" name="" maxlength="11" value="" placeholder="请输入您的手机号码">
            </div>
          </li>
          <li class="earlyLawless-hbs-item">
            <div class="earlyLawless-hbs-name">
              <span>车架号</span>
            </div>
            <div class="earlyLawless-hbs-text">
              <input v-model="vehicleIdentifyNoLast4" class="text-input" type="text" maxlength="4" name="" value="" placeholder="请输入车架号后四位">
            </div>
          </li>
          <li class="earlyLawless-hbs-item clear">
            <div class="earlyLawless-hbs-name">
              <span>验证码</span>
            </div>
            <div class="earlyLawless-hbs-text width-40 left">
              <input class="text-input" type="text" name="" value="" maxlength="4" placeholder="请输入验证码" id="inp">
            </div>
            <div class="left earlyLawless-hbs-code" id="code"></div>
          </li>
        </ul>
      </div>
      <button class="btn btn-blue" type="button" name="button" @click.stop="queryEarlyLawless()">查询</button>
      <div class="hint">
        <h4>温馨提示：</h4>
        <p>1.本系统不处理现场交通民警当场执法、深圳市车辆在本省其他城市、外省车辆的交通违法确认业务。</p>
        <p>2.系统对2013年1月1日之后发生的交通违法行为进行积分。</p>
        <p>3.请填写本人的驾驶证号，以确保违法的顺利处理。</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { queryLawlessByCar } from '../../../config/baseUrl'
  import { verifyCode } from '../../../config/verifyCode'
  import { Toast, MessageBox, Indicator } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'earlyLawless',
    data () {
      return {
        licensePlateType: '',       // 请求-车牌类型（编号转换）
        car_number: '',             // 请求-除去省字的车牌号码
        mobilephone: '',            // 请求-手机号码
        cur_id: '02',               // 请求-车牌类型编号
        licenseSelectShow: false,
        verifyCode: false,                    // 验证码验证
        licenseSelectMassage: '小型汽车',
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
        ],
        abbreviationSelectShow: false,
        abbreviationSelectMassage: '粤',
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
        vehicleIdentifyNoLast4: '',
        drivingLicenceNo: ''
      }
    },
    mounted () {
      verifyCode(document.getElementById('inp'), document.getElementById('code'), (result, code) => {
        this.verifyCode = result
      })
    },
    methods: {
      licenseSelectClick: function (str, id) {
        if (str) {
          this.licenseSelectMassage = str
          this.cur_id = id
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
      queryEarlyLawless: function () {
        const that = this
        let platNo = this.abbreviationSelectMassage + this.car_number
        let reqData = {
          licensePlateType: this.cur_id,
          licensePlateNo: platNo.toLocaleUpperCase(),
          mobilephone: this.mobilephone,
          vehicleIdentifyNoLast4: this.vehicleIdentifyNoLast4,
          drivingLicenceNo: this.drivingLicenceNo,
          identityCard: this.drivingLicenceNo
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
        if (!this.verifyCode) {
          Toast({
            message: '验证码输入错误',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
        Indicator.open()
        resultPost(queryLawlessByCar, reqData).then(json => {
          if (json.code === '0000') {
            this.reserveList = json.data
            if (json.data.length === 0) {
              MessageBox('提示', '该车辆暂无预约信息')
            } else {
              json.data.forEach((item, index) => { // 循环dataList 给每个item上面添加 check关联属性
                item.checkAddBorder = false
              })
              console.log(that)
              that.postAppealQuery(json.data)
              Indicator.close()
              that.$router.push('/illegalOrderDeal')
            }
          } else {
            MessageBox('提示', json.msg)
          }
        })
      },
      ...mapActions({
        postAppealQuery: 'postAppealQuery'
      })
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
.earlyLawless-outer {
  font-size: 28px;
  color: #000;
  position: relative;
  background-color: white;
  .width-120 {
    width: 120px !important;
  }
  .width-70 {
    width: 70% !important;
  }
  .width-40{
    width: 40% !important;
  }
  .earlyLawless-select {
    background-color: #fff;
    padding-bottom: 24px;
    position: relative;
    p {
      color: #666;
      line-height: 68px;
    }
  }
  .earlyLawless-from {
    background-color: #fff;
    #earlyLawless-hbs {
      padding-bottom: 20px;
      .earlyLawless-hbs-list {
        overflow: hidden;
        .earlyLawless-hbs-item {
          margin-top: 24px;
          padding-left: 180px;
          position: relative;
          line-height: 56px;
          .earlyLawless-hbs-name {
            width: 180px;
            position: absolute;
            left: 0;
          }
          .earlyLawless-hbs-text {
            width: 100%;
            display: inline-block;
          }
          .earlyLawless-hbs-radio {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
          .earlyLawless-hbs-code {
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
}
</style>
