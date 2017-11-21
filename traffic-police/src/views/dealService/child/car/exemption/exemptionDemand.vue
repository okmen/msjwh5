<template>
  <div class="exemptionDemand">
    <div class="exemptionDemand-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>预约编号</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" value="" v-model="reservationNumber"/>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车牌号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input stylebackground" type="text" value="" v-model="vehicle"/>
          </div>
        </li>
      </ul>
      <button class="btn btns" @click.stop="submitClick()">查询及取消</button>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
import { resultPost } from '../../../../../service/getData'
import { getVehicleInspection } from '../../../../../config/baseUrl'
import { Toast } from 'mint-ui'
export default {
  name: 'exemptionDemand',
  data () {
    return {
      reservationNumber: '',
      vehicle: '',
      VehicleInspectionVO: {
        approveState: 0,
        bookNumber: 'P170802048',
        bookState: 1,
        businessType: '免检车核发检验标志',
        createDate: {
          class: 'sql-timestamp',
          content: '2017-08-02 11:54:23.614'
        },
        driveLicenseNumber: '822198502074110',
        effectiveDate: '2017-01-01',
        inform: 1,
        mobile: '15920071829',
        name: '开发测试',
        organization: '深圳市车管所',
        personType: 1,
        platNumber: '粤B6F7M1',
        postAddr: '11',
        postCode: '123456',
        recipientsMobile: '15920071829',
        recipientsName: '开发测试',
        terminationDate: '2017-12-12'
      }
    }
  },
  methods: {
    submitClick: function () {
      if (!this.reservationNumber) {
        Toast({message: '请输入预约编号', position: 'bottom', className: 'white'})
      } else if (!this.vehicle) {
        Toast({message: '请输入车牌号码', position: 'bottom', className: 'white'})
      } else {
        let exemptdata = {
          bookNumber: this.reservationNumber,
          numberPlate: this.vehicle,
          driveLicenseNumber: ''
        }
        resultPost(getVehicleInspection, exemptdata).then(json => {
          console.log(json)
          if (json.code === '0000') {
            let num = json.data
            let path = /_WeChat/g.test(this.$route.name) ? '/exemptionAbolish_WeChat' : '/exemptionAbolish'
            this.$router.push({path, query: { myNumberPlate: num }})
          } else {
            Toast({message: json.msg, position: 'bottom', className: 'white'})
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.exemptionDemand {
background-color: #fff;
padding: 20px 40px;
  .exemptionDemand-form {
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
  .btns{
    margin: 60px 0 30px 0;
    width: 100%;
  }
  .div-select-ul{
    font-size: 26px;
  }
  .stylebackground{
    background-color: #fff;
  }
}
</style>
