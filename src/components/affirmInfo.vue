<template>
<div id="affirmInfo-body">
  <div class="affirmInfo-text">
    <ul class="affirmInfo-text-content">
      <li class="affirmInfo-text-item" v-for="(value, key) in dataList.textObj" v-if="keyListObj[key]">
        <span class="affirmInfo-text-item-key">{{ keyListObj[key] }}</span>
        <span class="affirmInfo-text-item-val">{{ valListObj[key] ?  valListObj[key][value] : value }}</span>
      </li>
    </ul>
  </div>
  <div class="affirmInfo-img">
    <p v-if="dataList.imgObj">请按示例图上传以下证件照片</p>
    <div class="affirmInfo-img-content">
      <dl class="affirmInfo-img-item" v-for="(value, key) in dataList.imgObj" v-if="value">
        <dt class="affirmInfo-img-item-val"><img :src="'data:image/jpeg;base64,' + value" alt=""></dt>
        <dd class="affirmInfo-img-item-key">{{ keyListObj[key] }}</dd>
      </dl>
    </div>
  </div>
<!--   <div class="affirmInfo-btn">
    <button id="affirmInfo-btn" @click="affirmInfoBtn">提 交</button>
  </div> -->
  <g-button text="提交" @click.native="affirmInfoBtn"></g-button>
</div>
</template>
<script>
import { GButton } from 'form'
// import { resultPost } from '../service/getData'
import axios from '../utils/axios'
import { MessageBox } from 'mint-ui'
export default {
  name: 'affirmInfo',
  data () {
    return {
      keyListObj: {
        plateType: '车牌类型',
        plateTypeStr: '车牌类型',
        cartype: '车辆类型',
        abbreviation: '车牌简称',
        numberPlate: '车牌号码',
        behindTheFrame4Digits: '车架号',
        name: '车主姓名', // 机动车所有人
        userName: '用户姓名',
        gender: '性别',
        mobilephone: '手机号码',
        applyDate: '申请日期',
        remarks: '备注',
        identityCard: '身份证号码',
        driverLicense: '驾驶证号码',
        proposerIdentityCard: '申请人身份证号码',
        carOwnerIdentityCard: '车主身份证号码',
        bookerIdentityCard: '预约人身份证号码',
        cartModels: '车辆型号',
        engineNumber: '发动机号',
        carOrigin: '车辆产地',
        placeOfDomicile: '户籍所在地',
        showIndex: '户籍所在地',
        receiverName: '收件人姓名',
        receiverNumber: '收件人号码',
        receiverAddress: '收件人地址',
        photoReturnNumberString: '照片回执码',
        address: '住所地址',
        personType: '申请人类型',
        driveLicenseNumber: '行驶证编号',
        fileNumber: '档案编号',
        identificationNO: '证件种类',
        identificationNum: '证件号码',
        delayDate: '延期日期',
        delayReason: '延期原因',
        telno: '固定号码',
        postCode: '邮政编码',
        effectiveDate: '保险生效日期',
        terminationDate: '保险终止日期',
        inform: '受理结果告知方式',
        bookerName: '预约人',
        bookerType: '预约方式',
        bookNumber: '预约流水号',
        proprietorship: '车辆所有权',
        associatedAgency: '委托机构',
        associatedAgencyMsg: '委托机构', // 委托机构全称
        issuingLicenceAuthority: '发证机关',
        issuingLicenceAuthorityMsg: '发证机关', // 发证机关全称
        PHOTO26: '购置发票图片',
        PHOTO27: '交强险单据',
        PHOTO9: '身份证(正面)',
        PHOTO10: '身份证(反面)',
        PHOTO28: '机动车合格证',
        PHOTO31: '境外人员临住表',
        PHOTO29: '进口货物证明书',
        JZZA: '居住证正面',
        JZZB: '居住证反面',
        DJZSFYJ: '机动车登记证书',
        JDCXSZ: '机动车行驶证照片',
        XSZZP: '车辆45度照片',
        JSZZP: '驾驶证照片',
        YQZMZP: '延期证明照片',
        SHJYPXB: '审核教育培训表',
        STTJSQB: '身体条件申请表'
      },
      valListObj: {
        cartype: {
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
          '52': '新能源小型车',
          'K31': '小型普通客车',
          'K32': '小型越野客车',
          'K33': '小型轿车',
          'K34': '小型专用客车',
          'K41': '微型普通客车',
          'K42': '微型越野客车',
          'K43': '微型轿车',
          'K38': '小型专用校车'
        },
        showIndex: {
          '0': '深户',
          '1': '非深户',
          '2': '外籍'
        },
        plateType: {
          '02': '蓝牌',
          '06': '黑牌',
          '01': '黄牌'
        },
        carOrigin: {
          'A': '国产车',
          'B': '进口车'
        },
        placeOfDomicile: {
          '1': '深户',
          '0': '外籍户口',
          '2': '港澳台籍',
          '3': '外国籍',
          '4': '其他'
        },
        personType: {
          '1': '机动车所有人',
          '2': '代理人'
        },
        bookerType: {
          '0': '本人'
        },
        gender: {
          '1': '男',
          '2': '女'
        },
        proprietorship: {
          '0': '个人',
          '1': '单位'
        },
        inform: {
          '1': '互联网查询',
          '2': '短信告知',
          '3': '非移动电话告知'
        },
        identificationNO: {
          'A': '居民身份证',
          'B': '组织机构代码书',
          'C': '军官证',
          'D': '士兵证',
          'E': '军官离退休证',
          'F': '境外人员身份证明',
          'G': '外交人员身份证明',
          'H': '居民户口簿',
          'J': '单位注销证明',
          'K': '居住暂住证明',
          'L': '驻华机构证明',
          'M': '临时居民身份证'
        }
      }
    }
  },
  components: {
    GButton
  },
  computed: {
    dataList: function () {
      return this.$store.state.passByValue
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  created () {
    if (this.dataList.textObj.hasOwnProperty('showIndex')) {
      delete this.keyListObj.placeOfDomicile
      delete this.valListObj.placeOfDomicile
    }
    if (this.dataList.textObj.hasOwnProperty('plateTypeStr')) {
      delete this.keyListObj.plateType
    }
  },
  mounted () {
    this.initScorllTop()
  },
  methods: {
    affirmInfoBtn: function () {
      let reqData = Object.assign({}, this.dataList.textObj, this.dataList.imgObj, this.dataList.invisibleObj)
      axios.post(this.dataList.url, reqData).then(json => {
        if (json.code === '0000') {
          let sendData = {
            title: this.$store.state.passByValue.title,
            type: 1,
            waterNumber: json.data.waterNumber || json.data
          }
          this.$store.commit('saveSuccessInfo', sendData)
          this.$router.push({path: '/submitSuccess', query: this.$store.getters.queryURL})
        } else {
          MessageBox('提示', json.msg).then(action => {
            // this.$router.push('/')
          })
        }
      })
    },
    initScorllTop: function () {
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style lang="less">
  #affirmInfo-body{
    padding-bottom: 40px;
    position: relative;
    font-size: 30px;
    color: #333;
    background-color: #fff;
    .affirmInfo-text{
      position: relative;
      padding: 30px;
      .affirmInfo-text-content{
        border: 1px solid #ccc;
        border-radius: 6Px;
        line-height: 92px;
        .affirmInfo-text-item{
          display: flex;
          position: relative;
          border-bottom: 1px solid #ccc;
          .affirmInfo-text-item-key{
            min-width: 200px;
            color: #666;
            text-indent: 15px;
            height: 100%;
          }
          .affirmInfo-text-item-val{
            text-indent: 54px;
          }
        }
        .affirmInfo-text-item:last-child{
          border-bottom: none;
        }
      }
    }
    .affirmInfo-img{
      position: relative;
      /*padding: 50px;*/
      padding: 0 50px;
      padding-top: 0;
      p{
        line-height: 75px;
      }
      .affirmInfo-img-content{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        .affirmInfo-img-item{
          width: 305px;
          .affirmInfo-img-item-val{
            width: 100%;
            height: 305px;
            position: relative;
            img{
              display: block;
              max-width: 100%;
              max-height: 100%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%)
            }
          }
          .affirmInfo-img-item-key{
            text-align: center;
            line-height: 75px;
            color: #666;
            font-size: 28px;
          }
        }
      }
    }
    .affirmInfo-btn{
      padding: 0 60px;
      width: 100%;
      box-sizing: border-box;
      button{
        width: 100%;
        color: #fff;
        background-color: #09bb07;
        line-height: 80px;
        font-size: 32px;
        outline: none;
        border-radius: 4Px;
      }
    }
  }
</style>
