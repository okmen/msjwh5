<template>
  <div class="earlyQuery-outer">
    <div class="earlyQuery-from pad-side-50">
      <div id="earlyQuery-hbs">
        <ul class="earlyQuery-hbs-list">
          <li class="earlyQuery-hbs-item">
            <div class="earlyQuery-hbs-name">
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
          <li class="earlyQuery-hbs-item clear">
            <div class="earlyQuery-hbs-name">
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
            <div class="earlyQuery-hbs-text width-70 right">
              <input v-model="car_number" class="text-input" type="text" name="" value="" placeholder="请输入车牌号码">
            </div>
          </li>
          <li class="earlyQuery-hbs-item">
            <div class="earlyQuery-hbs-name">
              <span>手机号码</span>
            </div>
            <div class="earlyQuery-hbs-text">
              <input v-model="mobilephone" class="text-input" type="text" maxlength="11" name="" value="" placeholder="请输入手机号码">
            </div>
          </li>
          <li class="earlyQuery-hbs-item clear">
            <div class="earlyQuery-hbs-name">
              <span>验证码</span>
            </div>
            <div class="earlyQuery-hbs-text width-40 left">
              <input class="text-input" type="text" name="" maxlength="4" value="" placeholder="请输入验证码" id="inp">
            </div>
            <div class="left earlyQuery-hbs-code" id="code"></div>
          </li>
        </ul>
      </div>
      <button class="btn btn-blue" type="button" name="button" @click.stop="earlyQuery()">查询</button>
    </div>
    <!--结果块(循环)-->
    <div v-for="(reserve, index) in reserveList" class="queryResults pad-side-50">
      <div class="results-box">
        <div class="box-header">
          <div class="header-item">预约结果</div>
        </div>
        <div class="box-body">
            <div class="left-line">
              预约编号:
              <p>{{ reserve.yylsh }}</p>
            </div>
            <div class="left-line">
              车牌号码:
              <p>{{ reserve.hphm }}</p>
            </div>
            <div class="left-line">
              手机号码:
              <p>{{ reserve.sjhm }}</p>
            </div>
            <div class="left-line">
              服务点&nbsp;&nbsp;&nbsp;:
              <p>{{ reserve.cldbmmc }}</p>
            </div>
            <div class="left-line">
              预约时间:
              <p>{{ reserve.yydate }} {{ reserve.yydate_sjd }}</p>
            </div>
            <div class="left-line" v-if="reserve.zt == '正常'">
              <div class="cancel" @click.stop="CancelConfirm(reserve.yylsh, index)">
                取消预约
              </div>
            </div>
            <div class="left-line" v-if="reserve.zt == '取消'">
              <div class="cancel canceled">
                已取消
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { earlyQuery, earlyCancel } from '../../../config/baseUrl'
  import { verifyCode } from '../../../config/verifyCode'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'earlyQuery',
    data () {
      return {
        mobilephone: '',
        licensePlateNo: '',                   // 请求-车牌号
        cur_type_id: '02',                    // 请求-车牌类型（编号转换）
        car_number: '',                       // 请求-除去省字的车牌号
        verifyCode: false,                    // 验证码验证
        reserveList: [],                      // 返回-全部数据存入数组
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
    mounted () {
      verifyCode(document.getElementById('inp'), document.getElementById('code'), (result, code) => {
        this.verifyCode = result
      })
    },
    methods: {
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
      earlyQuery: function () {
        let platNo = this.abbreviationSelectMassage + this.car_number
        let reqData = {
          car_number: this.car_number.toLocaleUpperCase(),
          licensePlateNo: platNo.toLocaleUpperCase(),
          licensePlateType: this.cur_type_id,
          mobilephone: this.mobilephone
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
        if (!this.verifyCode) {
          Toast({
            message: '验证码输入错误',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
        resultPost(earlyQuery, reqData).then(json => {
          console.log(json)
          if (json.code === '0000') {
            this.reserveList = json.data
            if (json.data.length === 0) {
              MessageBox('提示', '该车辆暂无预约信息')
            }
          } else {
            MessageBox('提示', json.msg)
          }
          console.log(json)
        })
      },
      CancelConfirm: function (subscribeNo, index) {
        MessageBox({
          title: '',
          message: '确定要取消预约吗？',
          showCancelButton: true,
          confirmButtonText: '是的'
        }).then(action => {
          action === 'confirm' && this.earlyCancel(subscribeNo, index)
        })
      },
      earlyCancel: function (subscribeNo, index) {
        let data = this.reserveList[index]
        let yydate = data.yydate // 预约日期
        let ccsjd = data.yydate_sjd // 预约时间段
        let cldbmmc = data.cldbmmc // 预约处理点
        let reqData = {
          subscribeNo: subscribeNo, // 预约编号
          businessName: '违法处理预约', // 业务名称
          yydate, // 预约日期
          ccsjd, // 预约时间段
          cldbmmc // 处理点
        }
        resultPost(earlyCancel, reqData).then(json => {
          if (json.code === '0') {
            this.earlyQuery() // 重新查询
            Toast({
              message: json.msg,
              position: 'middle',
              className: 'white',
              duration: 3000
            })
          } else {
            Toast({
              message: json.msg,
              position: 'middle',
              className: 'white',
              duration: 3000
            })
          }
        })
      },
      getVerification: function () {}
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
  .earlyQuery-outer {
    padding-top: 4px;
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
    .earlyQuery-from {
      background-color: #fff;
      #earlyQuery-hbs {
        padding-bottom: 20px;
        .earlyQuery-hbs-list {
          .earlyQuery-hbs-item {
            margin-top: 24px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .earlyQuery-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .earlyQuery-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .earlyQuery-hbs-code {
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
        padding: 0 20px;
        border: 1px solid #a7d9f9;
        background-color: #fff;
        border-radius: 4px;
        .box-header {
          height: 80px;
          line-height: 80px;
          border-bottom: 1px solid #a7d9f9;
          .header-item {
            font-size: 1rem;
            padding: 0 24px;
            font-weight: bold;
            text-align: center;
          }
        }
        .box-body {
          color: #333;
          padding: 0 24px 10px;
          position: relative;
          .left-line {
            font-size: 0.8rem;
            font-weight: bold;
            height: 60px;
            line-height: 60px;
            /*&:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }*/
            p {
              color:#666666;
              font-weight: normal;
              display: inline-block;
              position: relative;
              vertical-align: middle;
              left: 20px;
            }
          }
          .cancel {
            position: absolute;
            right:0;
            bottom:20px;
            width: 120px;
            height: 40px;
            line-height: 40px;
            background: red;
            color:#fff;
            text-align: center;
            border-radius: 6px;
            &.canceled {
              background: #09bb07;
            }
          }
        }
      }
    }
  }
</style>
