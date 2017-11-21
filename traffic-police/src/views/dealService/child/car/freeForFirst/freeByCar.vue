<template>
  <div class="freeByCar-outer">
    <div class="freeByCar-from pad-side-50">
      <div id="freeByCar-hbs">
        <ul class="freeByCar-hbs-list">
          <li class="freeByCar-hbs-item">
            <div class="freeByCar-hbs-name">
              <span>车牌号码</span>
            </div>
            <div class="div-select left">
              <span class="btn-select width-45" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
              <div class="div-select-ul" v-if="abbreviationSelectShow">
                <ul>
                  <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
            <div class="div-select left abbreviationLeft">
              <span class="btn-select width-45" @click.stop="moldClick()">{{mold}}</span>
              <div class="div-select-ul" v-if="moldShow">
                <ul>
                  <li v-for="item in moldData" @click.stop="moldClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
            <div class="width-53 right">
              <input class="text-input" type="text" v-model="numberPlate" name="" value="" placeholder="请输入车牌号码" style="text-transform:uppercase;">
            </div>
          </li>
          <li class="freeByCar-hbs-item">
            <div class="freeByCar-hbs-name">
              <span>车牌类型</span>
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
          <li class="freeByCar-hbs-item clear">
            <div class="freeByCar-hbs-name">
              <span>验证码</span>
            </div>
            <div class="freeByCar-hbs-text width-40 left">
              <input class="text-input" type="text" name="" maxlength="4" value="" v-model="verification" placeholder="请输入验证码" id="inp">
            </div>
            <div class="left freeByCar-hbs-code" id="code"></div>
          </li>
        </ul>
      </div>
      <button class="btn btn-blue" type="button" name="button" @click.stop="demandClick()">查询</button>
    </div>
    <ul class="freeByCarUl" v-if="freeUlShow">
      <li class="freeByCarLi" v-for="(item, key) in freeData">
        <div class="liDiv-title">{{keyListObj[key]}}</div>
        <div class="liDiv-text">{{key === 'plateType' ? licenseSelectDataList[item] : item}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
  import { verifyCode } from '../../../../../config/verifyCode'
  import { resultPost } from '../../../../../service/getData'
  import { getResultOfFirstIllegalImpunity } from '../../../../../config/baseUrl'
  import { Toast } from 'mint-ui'
  export default {
    name: 'freeByCar',
    data () {
      return {
        freeUlShow: false,
        verification: '',                     // 验证码
        numberPlate: '',                      // 车牌号码
        cur_type_id: '02',                    // 请求-车牌类型（编号转换）
        vehicleIdentifyNoLast4: '',           // 请求-车架号后4位
        verifyCode: false,
        licenseSelectShow: false,             // 车牌列表显示与否// 验证码验证
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
        mold: 'B',
        moldShow: false,
        moldData: [
          {
            'str': 'A'
          },
          {
            'str': 'B'
          },
          {
            'str': 'C'
          },
          {
            'str': 'D'
          },
          {
            'str': 'E'
          },
          {
            'str': 'F'
          },
          {
            'str': 'G'
          },
          {
            'str': 'H'
          },
          {
            'str': 'I'
          },
          {
            'str': 'J'
          },
          {
            'str': 'K'
          },
          {
            'str': 'L'
          },
          {
            'str': 'N'
          },
          {
            'str': 'M'
          },
          {
            'str': 'O'
          },
          {
            'str': 'P'
          },
          {
            'str': 'Q'
          },
          {
            'str': 'R'
          },
          {
            'str': 'S'
          },
          {
            'str': 'T'
          },
          {
            'str': 'U'
          },
          {
            'str': 'V'
          },
          {
            'str': 'W'
          },
          {
            'str': 'X'
          },
          {
            'str': 'Y'
          },
          {
            'str': 'Z'
          }
        ],
        licenseSelectMassage: '蓝牌',         // 默认车牌类型
        licenseSelectDataList: {
          '02': '蓝牌',
          '01': '黄牌',
          '06': '黑牌'
        },
        licenseSelectData: [
          {
            'str': '蓝牌',
            'id': '02'
          },
          {
            'str': '黄牌',
            'id': '01'
          },
          {
            'str': '黑牌',
            'id': '06'
          },
          {
            'str': '个性牌',
            'id': '02'
          },
          {
            'str': '小型新能源车号牌',
            'id': '52'
          },
          {
            'str': '大型新能源车号牌',
            'id': '51'
          }
        ],            // 车牌类型列表（编号转换）
        freeData: {},
        keyListObj: {
          'id': '记录ID',
          'numberPlate': '车牌号码',
          'plateType': '车牌类型',
          'illegalTime': '违法时间',
          'illegalAddress': '违法地址',
          'illegalSite': '违法地点',
          'sectionsCode': '路段代码',
          'illegalAction': '违法行为',
          'illegalContent': '违法内容',
          'illegalMoney': '罚款金额',
          'illegalCore': '违法记分数',
          'inputTime': '录入时间',
          'foundAuthority': '发现机关',
          'foundAuthorityName': '发现机关名称',
          'illegalNumber': '违法序号',
          'productiveTime': '运算时间',
          'updateTime': '更新时间'
        }
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
          this.abbreviationSelectShow = false
        }
      },
      abbreviationSelectClick: function (str, id) {
        this.moldShow = false
        if (str) {
          this.abbreviationSelectMassage = str
        }
        if (this.abbreviationSelectShow === true) {
          this.abbreviationSelectShow = false
        } else {
          this.abbreviationSelectShow = true
        }
      },
      moldClick: function (str, id) {
        this.abbreviationSelectShow = false
        if (str) {
          this.mold = str
        }
        if (this.moldShow === true) {
          this.moldShow = false
        } else {
          this.moldShow = true
        }
      },
      demandClick: function () {
        let numbers = `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`
        if (this.$plateerification(numbers)) {
          Toast({message: this.$plateerification(numbers), position: 'bottom', className: 'white'})
        } else if (!this.verification) {
          Toast({message: '请输入验证码', position: 'bottom', className: 'white'})
        } else if (this.verifyCode === false) {
          Toast({message: '请输入正确的验证码', position: 'bottom', className: 'white'})
        } else {
          this.referFn()
        }
      },
      // 接口查询
      referFn: function () {
        let freeByCarData = {
          queryType: '1',
          illegalNumber: '',
          numberPlate: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`,   // 车牌号码
          plateType: this.cur_type_id      // 车牌种类
        }
        resultPost(getResultOfFirstIllegalImpunity, freeByCarData).then(json => {
          if (json.code === '0000') {
            this.freeData = json.data[0]
            this.freeUlShow = true
          } else {
            Toast({message: json.msg, position: 'bottom', className: 'white'})
          }
        })
      }
    },
    created () {
      document.addEventListener('click', (e) => {
        this.licenseSelectShow = false
        this.moldShow = false
        this.abbreviationSelectShow = false
      })
    }
  }
</script>
<style lang="less">
  .freeByCar-outer {
    font-size: 28px;
    color: #000;
    position: relative;
    background-color: white;
    .width-40 {
      width: 40% !important;
    }
    .freeByCar-from {
      background-color: #fff;
      #freeByCar-hbs {
        padding-bottom: 20px;
        .freeByCar-hbs-list {
          .freeByCar-hbs-item {
            margin-top: 24px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            height: 62px;
            .freeByCar-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .freeByCar-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .freeByCar-hbs-code {
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
    .freeByCarUl{
      display: block;
      width: 87%;
      margin: 30px auto;
      border: 1px solid #ccc;
      border-radius: 8px;

      .freeByCarLi{
        display: flex;
        line-height: 60px;
        justify-content: left;
        border-bottom: 1px solid #ccc;
        vertical-align: middle;
        .liDiv-title{
          text-indent: 20px;
          flex: 1;
        }
        .liDiv-text{
          flex:2;
          padding-right: 20px;
        }
      }
      .freeByCarLi:last-of-type{
        border-bottom: none;
      }
    }
    .width-25 {
      width: 25% !important;
    }
    .width-53 {
      width: 53% !important;
    }
    .abbreviationLeft{
      margin-left: 2%;
    }
  }
</style>
