<!-- 申办成功 或者 预约成功 的组件

    跳转至该组件时，使用以下方法
    this.$store.commit('saveSuccessInfo', dataInfo)
    this.$router.push('/submitSuccess')

    dataInfo 需要加上 type 字段
    dataInfo.type
      1 : 申办成功 // 办理类
      2 : 预约成功 // 预约类
      3 : 绿色出行
      4 : 柴油轻型自卸货车
    接口返回的数据存至 dataInfo

    dataInfo = {
      type: 1,
      businessType: '预约违法处理',
      subscribeNo: '流水号码'
    }

    dataInfo = {
      type: 2,
      reserveNo: '预约编号',
      numberPlate: '车牌号码',
      mobilephone: '手机号码',
      reserveAddress: '服务点',
      reserveTime: '预约时间',
      reserveNumber: '申办天数'
    }
-->

<template>
  <div id="submitSuccess">
    <section class="appoint-img">
      <dl>
        <dd></dd>
        <dt>{{typeTitle[JsonDataInfo.type]}}成功</dt>
      </dl>
    </section>
    <!-- 申办成功的内容  -->
    <section class="bid-box appoint-box" v-if="JsonDataInfo.type == 1">
      <h3>申办结果</h3>
      <p v-if="!JsonDataInfo.noTip">{{ tip }}</p>
      <ul class="bid-ul appoint-margin">
        <li class="bid-item" v-for="(value, key) in JsonDataInfo" :key="key" v-if="keyListObj[key] && value">
          <span class="bid-item-key">{{ keyListObj[key] }}</span>
          ：<span :class="{red: key === 'subscribeNo' || key === 'waterNumber'}">{{ valListObj[key] ? valListObj[key][value] : value }}</span>
        </li>
      </ul>
    </section>
    <!-- 预约成功的内容 -->
    <section class="appoint-box" v-if="JsonDataInfo.type == 2">
      <h3>预约结果</h3>
      <!-- <p>{{ tip }}</p> -->
      <ul class="submitSuccess-ul">
        <li v-for="(value, key) in JsonDataInfo" :key="key" class="submitSuccess-item"  v-if="keyListObj[key]">
          <span class="submitSuccess-item-key">{{ keyListObj[key] }}</span>
          ：<span class="submitSuccess-item-value">{{ valListObj[key] ? valListObj[key][value] : value }}</span>
        </li>
      </ul>
    </section>
    <!-- 申报停驶 -->
    <section class="bid-box appoint-box" v-if="JsonDataInfo.type == 3">
      <h3>{{typeTitle[JsonDataInfo.type]}}结果</h3>
      <p>感谢您的参与，提交成功！<br>您在{{ (new Date()).getFullYear() }}年度申报绿色出行行动中，累计申报停驶了{{ JsonDataInfo.cryearNo }}天。</p>
      <ul class="bid-ul appoint-margin">
        <li class="bid-item" v-for="(value, key) in JsonDataInfo" :key="key" v-if="keyListObj[key] && key !== 'cryearNo'">
          <span class="bid-item-key">{{ keyListObj[key] }}</span>
          ：<span :class="{red: key === 'subscribeNo' || key === 'waterNumber'}">{{ valListObj[key] ? valListObj[key][value] : value }}</span>
        </li>
      </ul>
    </section>
    <section class="bid-box appoint-box" v-if="JsonDataInfo.type == 4">
      <h3>申办结果</h3>
      <p>您的信息已提交成功。请留意办证进度，审核通过5个工作日后可前往联系地址{{JsonDataInfo.areaSelectMassage}}交警大队领取安装电子行驶证（RFID).</p>
      <p>业务类型：柴油轻型自卸货车</p>
      <p v-if="JsonDataInfo.ownerid === '1'">申请类型：个人车辆(含挂靠)</p>
      <p v-if="JsonDataInfo.ownerid === '2'">申请类型：单位车辆</p>
      <p>车牌号码：{{JsonDataInfo.licenseNumber}}</p>
      <p>流水号：{{JsonDataInfo.JsonData}}</p>
    </section>
    <section class="appoint-box" v-if="JsonDataInfo.type == 5">
      <h3>申办结果</h3>
      <p>您的信息已成功提交，我们将会在3个工作日内告知您的审核结果，您还可以凭身份证信息在深圳交警微信号中查询审核。</p>
    </section>
<!--     <div class="btn-appoint-backword" @click="btnBackword" v-if="!urlJsonData && JsonDataInfo.type == 1">返回</div>
    <div class="btn-appoint-backword mt-60" @click="btnBackword"  v-if="!urlJsonData && JsonDataInfo.type != 1">好的</div> -->
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
export default {
  computed: {
    dataInfo: function () {
      return this.$store.state.successInfo
    }
  },
  data () {
    return {
      JsonDataInfo: '',
      urlJsonData: this.urlToJson(window.location.href),
      tip: '您的信息已成功提交，我们将会在3个工作日内告知您的审核结果。',
      typeTitle: {
        '1': '申办',
        '2': '预约',
        '3': '申报'
      },
      keyListObj: {
        businessType: '业务类型',
        subscribeNo: '流水号码',
        waterNumber: '流水号码',
        reserveNo: '预约编号',
        numberPlate: '车牌号码',
        vehicleType: '车辆类型',
        mobilephone: '手机号码',
        reserveAddress: '服务点',
        appointmentAddress: '预约地址',
        reserveTime: '预约时间',
        effectiveTime: '有效时间',
        plateType: '车牌类型',
        appointmentPerson: '预约人',
        bidDate: '申办时间',
        title: '业务类型',
        reserveNumber: '本次申报',
        appTime: '预约时间',
        orgName: '服务点',
        platNumber: '车牌号码',
        carTypeName: '车辆类型',
        orgAddr: '预约地址',
        appointmentDate: '预约日期',
        appointmentTime: '预约时间',
        name: '预约人',
        approveFlag: '审核结果',
        approveInfo: '受理意见内容'
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
        },
        title: {
          reauthentication: '星级用户重新认证',
          illegalAppointment: '违法预约处理',
          starUserAuth: '星级用户认证',
          addVehicle: '添加车辆',
          applyGatePass: '申请通行证',
          applyCarTemporaryLicence: '办理临时行驶车号牌',
          complementTheMotorVehicleDrivingLicense: '补领机动车行驶证',
          // createVehicleInspection: '六年免检预约',
          createVehicleInspection: '核发机动车检验合格标志',
          replaceInspectionMark: '核发机动车检验合格标志',
          inspectionDeclaration: '委托核发机动车检验合格标志',
          inspectionDeclarationQuery: '机动车委托异地定期检验申报查询',
          replaceMotorVehicleLicensePlate: '办理补证、换领机动车号牌',
          iocomotiveCarReplace: '换领机动车行驶证',
          iocomotiveCarChangeContact: '机动车变更联系方式',
          driverLicenseAnnualVerification: '机动车驾驶证年度审验',
          renewalDriverLicense: '驾驶证延期换证',
          driverLicenseInto: '驾驶证转入',
          driverLicenseVoluntaryDemotion: '驾驶证自愿降级',
          repairDriverLicense: '机动车驾驶证补办',
          replaceDriverLicense: '机动车驾驶证换证',
          driverChangeContact: '驾驶人联系方式变更',
          createDriveInfo_ZJ16: '临时机动车驾驶许可申领',
          createTemporaryLicenseVehicleInfo: '核发临牌',
          createVehicleInfo_JD27: '核发校车标牌',
          createVehicleInfo_JD37: '机动车抵押／解除抵押登记',
          createVehicleInfo_JD38: '机动车委托异地年审现场办理',
          createVehicleInfo_JD41: '转出、注销恢复',
          createDriveInfo_ZJ10: '满分学习考试',
          createDriveInfo_ZJ11: '持军队、武装警察部队机动车驾驶证申领',
          createDriveInfo_ZJ13: '香港机动车驾驶证免试换证',
          createDriveInfo_ZJ17: '持境外驾驶证申请换证',
          createDriveInfo_ZJ20: '其他业务(驾驶证)',
          createDriveInfo_ZJ21: '恢复驾驶资格（逾期一年以上未换证类）',
          createDriveInfo_ZJ22: '恢复驾驶资格（逾期一年以上未体检类）',
          createVehicleInfo_JD06: '换领机动车登记证书',
          createVehicleInfo_JD02: '补换机动车号牌',
          createVehicleInfo_JD36: '机动车变更登记（套牌车换证）',
          createVehicleInfo_JD13: '申领/补领机动车登记证书',
          createVehicleInfo_JD15: '转移登记（市内过户）',
          createVehicleInfo_JD18: '机动车注销登记',
          createVehicleInfo_JD17: '机动车注册登记',
          createVehicleInfo_JD35: '机动车变更登记（夫妻变更）',
          createVehicleInfo_JD19: '机动车转移登记（转入）',
          createVehicleInfo_JD24: '机动车变更登记（普通变更）',
          createVehicleInfo_JD01: '补换机动车行驶证',
          createVehicleInfo_JD29: '机动车打刻原车辆识别代号变更备案',
          createVehicleInfo_JD28: '机动车打刻原车发动机号码变更备案',
          createVehicleInfo_JD33: '档案更正',
          createVehicleInfo_JD48: '网约车使用性质变更',
          createVehicleInfo_JD30: '补换检验合格标志',
          applyOrCancleCarMortgage: '机动车个人抵押解押登记'
        },
        approveFlag: {
          '1': '同意',
          '0': '不同意'
        }
      }
    }
  },
  methods: {
    btnBackword: function () {
      this.$router.push('/')
    },
    urlToJson: function (url) {
      if (!url.split('?')[1]) {
        return false
      }
      let urlJson = {}
      let arr = url.split('?')[1].split('&')
      arr.map(item => {
        urlJson[item.split('=')[0]] = decodeURIComponent(item.split('=')[1])
      })
      return urlJson
    }
  },
  mounted () {
    if (this.$route.query.title) {
      this.JsonDataInfo = this.urlJsonData
    } else {
      this.JsonDataInfo = this.dataInfo
    }
  }
}
</script>
<style lang="less">
#submitSuccess{
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  width:100%;
  background:#FFF url('../assets/images/appointBack.png') bottom no-repeat;
  background-size:100% 32%;
  .tp-bottom{
    margin-top: 28px;
  }
  .appoint-img{
    width:100%;
    height:250px;
    dl{
      margin:0 auto;
      padding-top:74px;
      width:178px;
      height:100%;
      dd{
        width:100%;
        height:178px;
        background:url('../assets/images/appointSuccess.png') no-repeat;
        background-size:100%;
      }
      dt{
        line-height:72px;
        text-align:center;
      }
    }
  }
  .appoint-box{
    margin:100px auto 0;
    padding:0 20px 30px;
    width:550px;
    border:1px solid #a7d9f9;
    border-radius:8px;
    h3{
      margin-bottom:30px;
      width:100%;
      height:70px;
      border-bottom:1px solid #a7d9f9;
      text-align:center;
      line-height:70px;
      font-size:30px;
      font-weight:normal;
    }
    p{
      font-size:24px;
      line-height:40px;
    }
    .appoint-margin{
      margin-top:34px;
    }
    .bid-ul{
      font-size:24px;
      line-height:40px;
      .bid-item{
        white-space: nowrap;
        .bid-item-key{
          width: 100px;
        }
        .red{
          color: #F00;
        }
      }
    }
    .submitSuccess-ul{
      width: 100%;
      font-size: 22px;
      padding-left: 28px;
      font-weight: bold;
      .submitSuccess-item{
        line-height: 50px;
        .submitSuccess-item-key{
          display: inline-block;
          width: 114px;
        }
        .submitSuccess-item-value{
          font-weight: normal;
          color: #666;
        }
      }
    }
  }
  .bid-box{
    border-color: #969696;
    h3{
      border-color: #969696;
    }
  }
  .btn-appoint-backword{
    margin:20px auto 0;
    width:550px;
    height:82px;
    background:#2696dd;
    color:#FFF;
    font-size:30px;
    line-height:80px;
    text-align:center;
    border-radius:8px;
  }
  .mt-60{
    margin-top: 60px;
    margin-bottom: 60px;
  }
}
</style>
