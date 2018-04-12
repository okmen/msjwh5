<template>
  <div class="dieseDemand-outer">
    <div class="freeByCar-from pad-side-50 clear">
      <div id="freeByCar-hbs">
        <ul class="freeByCar-hbs-list">
          <li class="freeByCar-hbs-item">
            <div class="freeByCar-hbs-name">
              <span>申请类型</span>
            </div>
            <div class="div-select">
              <span class="btn-select" @click.stop="typeClick()">{{ typeMassage }}</span>
              <div class="div-select-ul" v-if="typeShow">
                <ul>
                  <li v-for="item in typelicenseSelectData" @click.stop="typeClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </li>
          <!-- <li class="freeByCar-hbs-item">
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
          </li> -->
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
              <input class="text-input" type="text" v-model="numberPlate" name="" value="" maxlength="5" placeholder="请输入车牌号码" >
            </div>
          </li>
          <!-- <li class="freeByCar-hbs-item clear">
            <div class="freeByCar-hbs-name">
              <span>车牌号码</span>
            </div>
            <div class="div-select left">
              {{abbreviationSelectMassage}}
            </div>
            <div class="div-select left abbreviationLeft">
              {{mold}}
            </div>
            <div class="width-80 right">
              <input class="text-input bg-colour" type="text" v-model="numberPlate" name="" maxlength="5" value="" placeholder="请输入车牌号码" >
            </div>
          </li> -->
        </ul>
      </div>
      <button class="btn btn-blue" type="button" name="button" @click.stop="demandClick()">查询</button>
    </div>
  </div>
</template>
<script>
  import { queryInformationCollection } from '@/config/baseURL'
  import { Toast } from 'mint-ui'
  export default {
    name: 'dieseDemand',
    data () {
      return {
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
        curid: '02',
        licenseSelectMassage: '蓝牌',
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
        ],
        freeUlShow: false,
        verification: '',                     // 验证码
        numberPlate: '',                      // 车牌号码
        cur_type_id: '02',                    // 请求-车牌类型（编号转换）
        vehicleIdentifyNoLast4: '',           // 请求-车架号后4位
        verifyCode: false,
        licenseSelectShow: false,             // 车牌列表显示与否// 验证码验证
        typeMassage: '单位车辆',         // 默认车牌类型
        typelicenseSelectData: [
          {
            'id': '0',
            'str': '单位车辆'
          },
          {
            'id': '1',
            'str': '个人车辆(含挂靠)'
          }
        ],            // 车牌类型列表（编号转换）
        freeData: {},
        typeShow: false
      }
    },
    mounted () {
      this.subFnOne = this.$route.query.subFnOne   // 获取数据
      document.addEventListener('click', (e) => {
        this.freeUlShow = false
        this.verifyCode = false
        this.licenseSelectShow = false
        this.moldShow = false
        this.typeShow = false
      })
    },
    methods: {
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
      typeClick: function (str, id) {
        if (str) {
          this.typeMassage = str
          this.curid = id
        }
        if (this.typeShow === true) {
          this.typeShow = false
        } else {
          this.typeShow = true
          this.abbreviationSelectShow = false
        }
      },
      demandClick: function () {
        if (!this.numberPlate) {
          Toast({message: '请输入车牌号码', position: 'bottom', className: 'white'})
        } else {
          this.referFn()
        }
      },
      // 接口查询
      referFn: function () {
        let freeByCarData = {
          licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`,      // 车牌号码
          loginUser: window.localStorage.getItem('identityCard'),       // 星级用户身份证
          numberPlate: '02'                      // 车牌种类
        }
        this.$axios.post(queryInformationCollection, freeByCarData).then(json => {
          if (json.code === '0000') {
            let typeMassage = {
              typeMassage: this.typeMassage,
              subFnOne: this.subFnOne
            }
            let num = json.data
            this.$router.push({path: 'dieseInquire', query: { myNumberPlate: JSON.stringify(num), typeMassage: JSON.stringify(typeMassage) }})
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
<style lang="less" scoped>
  .dieseDemand-outer {
    width: 100%;
    font-size: 28px;
    color: #000;
    position: relative;
    background-color: white;
    padding-bottom: 20px;
    .width-40 {
      width: 40% !important;
    }
    .freeByCar-from {
      #freeByCar-hbs {
        padding-bottom: 20px;
        .freeByCar-hbs-list {
            padding-top: 30px;
          .freeByCar-hbs-item {
            padding-top: 30px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
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
    .width-80 {
      width: 80% !important;
    }
    .abbreviationLeft{
      margin-left: 2%;
    }
    .btn-blue{
      margin-top:60px;
      background-color: #09bb07;
    }
    .bg-colour{
      background-color: #fff;
    }
  }
</style>
