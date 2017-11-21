<template>
  <div class="freeByCode-outer">
    <div class="freeByCode-from pad-side-50">
      <div id="freeByCode-hbs">
        <ul class="freeByCode-hbs-list">
          <li class="freeByCode-hbs-item">
            <div class="freeByCode-hbs-name">
              <span>交通违法序号</span>
            </div>
            <div class="freeByCode-hbs-text">
              <input class="text-input" type="text" name="" value="" v-model="lawlessCode" placeholder="请输入违法序号">
            </div>
          </li>

          <li class="freeByCode-hbs-item clear">
            <div class="freeByCode-hbs-name">
              <span>验证码</span>
            </div>
            <div class="freeByCode-hbs-text width-40 left">
              <input class="text-input" type="text" name="" maxlength="4" value="" v-model="verification" placeholder="请输入验证码" id="inp">
            </div>
            <div class="left freeByCode-hbs-code" id="code"></div>
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
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { verifyCode } from '../../../../../config/verifyCode'
  import { resultPost } from '../../../../../service/getData'
  import { getResultOfFirstIllegalImpunity } from '../../../../../config/baseUrl'
  import { Toast } from 'mint-ui'
  export default {
    name: 'freeByCode',
    data () {
      return {
        freeUlShow: false,
        verification: '', // 验证码
        lawlessCode: '',
        verifyCode: false,
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
        ],            // 车牌类型列表（编号转换
        freeData: {},
        keyListObj: {
          'id': '记录ID',
          'numberPlate': '号牌号码',
          'plateType': '号牌种类',
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
      demandClick: function () {
        if (!this.lawlessCode) {
          Toast({message: '请输入违法序号', position: 'bottom', className: 'white'})
        } else if (!this.verification) {
          Toast({message: '请输入验证码', position: 'bottom', className: 'white'})
        } else if (this.verifyCode === false) {
          Toast({message: '请输入正确验证码', position: 'bottom', className: 'white'})
        } else {
          this.referFn()
        }
      },
      referFn: function () {
        let freeByCarData = {
          queryType: '2',
          illegalNumber: this.lawlessCode,  // 违法编号
          numberPlate: '',   // 车牌号码
          plateType: ''      // 车牌种类
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
    }
  }
</script>
<style lang="less">
  .freeByCode-outer {
    font-size: 28px;
    color: #000;
    position: relative;
    background-color: white;
    .width-40 {
      width: 40% !important;
    }
    .freeByCode-from {
      background-color: #fff;
      #freeByCode-hbs {
        padding-bottom: 20px;
        .freeByCode-hbs-list {
          .freeByCode-hbs-item {
            margin-top: 24px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .freeByCode-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .freeByCode-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .freeByCode-hbs-code {
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
  }
</style>
