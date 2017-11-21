<!--
* 违法申诉  查询入口
 -->
<template>
  <div class="appealQuery-outer">
    <div class="appealForm">
      <div class="form-item">
        <div class="item-left">姓名</div>
        <div class="item-right">
          <input class="text-input" v-model="name" readonly>
        </div>
      </div>
      <div class="form-item">
        <div class="item-left">联系方式</div>
        <div class="item-right">
          <input class="text-input" maxlength="11" v-model="mobilePhone" readonly>
        </div>
      </div>
      <div class="form-item">
        <div class="item-left">身份证号</div>
        <div class="item-right">
          <input class="text-input" v-model="identityCard" readonly>
        </div>
      </div>
      <div class="form-item">
        <div class="item-left">名下车辆</div>
        <div class="item-right div-select">
          <span class="btn-select min-btn-select" @click.stop="bindCarSelect()">{{ carJson.myNumberPlate }}</span>
          <div class="div-select-ul" v-if="bindCarListShow">
            <ul>
              <li v-for="item in bindCarList" @click="itemFn(item)">{{ item.myNumberPlate }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="item-left">车牌类型</div>
        <div class="item-right">
          <input class="text-input" v-model="plateTypeList[carJson.plateType]" readonly>
        </div>
      </div>
      <div class="form-item">
        <div class="item-left">车架号</div>
        <div class="item-right">
          <input class="text-input" maxlength="4" v-model="carJson.behindTheFrame4Digits" readonly>
        </div>
      </div>
    </div>
    <button class="btn btn-blue" type="button" name="button" @click="btnClick()">查询</button>
    <div class="hint">
      <h4>温馨提示：</h4>
      <p>对交通安全违法行为记录有异议的（如已作出处罚决定，应该申请行政复议和提起行政诉讼），请详细填写申诉内容，我们会安排专人与您联系办理</p>
    </div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<style lang="less">
.appealQuery-outer {
  background-color: #FFF;
  padding:25px 50px 50px;
  .tp-bottom{
    margin-top: 28px;
  }
  .appealForm {
    .form-item {
      height: 58px;
      line-height:58px;
      margin-bottom: 28px;
      .item-left {
        float:left;
        display: inline-block;
        width: 24%;
        font-size: 28px;
        line-height: 58px;
      }
      .item-right {
        display: inline-block;
        width: 76%;
        &.div-select {
           .min-btn-select {
              background-position: 94% center !important;
              font-size:26px;
           }
         }
        input {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
<script>
  import { resultPost } from '../../../service/getData'
  import { queryLawlessByCar } from '../../../config/baseUrl'
  import { MessageBox, Toast } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'appealQuery',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    components: {
      'pageBottom': require('../../../components/pageBottom.vue')
    },
    data () {
      return {
        name: window.localStorage.getItem('userName'),
        mobilePhone: window.localStorage.getItem('mobilePhone'),
        identityCard: window.localStorage.getItem('identityCard'),
        cur_bindCar: window.localStorage.getItem('myNumberPlate') === 'undefined' ? '无' : window.localStorage.getItem('myNumberPlate'),
        bindCarList: [],
        carJson: {},
        bindCarListShow: false,
        plateType: window.localStorage.getItem('plateType') === 'undefined' ? '99' : window.localStorage.getItem('plateType'),
        plateTypeList: {
          '02': '蓝牌',
          '01': '黄牌',
          '06': '黑牌',
          '99': '无'
        },
        vehicleIdentifyNoLast4: window.localStorage.getItem('behindTheFrame4Digits') === 'undefined' ? '无' : window.localStorage.getItem('behindTheFrame4Digits')
      }
    },
    methods: {
      itemFn (item) {
        this.carJson = item
        this.bindCarListShow = false
      },
      bindCarSelect: function () {
        if (this.bindCarListShow === true) {
          this.bindCarListShow = false
        } else {
          this.bindCarListShow = true
        }
      },
      btnClick: function () {
        let reqData = {
          licensePlateNo: this.carJson.myNumberPlate,
          licensePlateType: this.carJson.plateType,
          vehicleIdentifyNoLast4: this.carJson.behindTheFrame4Digits,
          identityCard: this.carJson.identityCard,
          mobilephone: this.carJson.mobilephone
        }
        if (window.localStorage.getItem('myNumberPlate') === 'undefined') {
          MessageBox('提示', '当前用户没有车辆信息')
          return false
        }

        resultPost(queryLawlessByCar, reqData).then(json => {
          if (json.code === '0000') {
            let lawlessData = {
              info: {
                behindTheFrame4Digits: reqData.vehicleIdentifyNoLast4,
                plateType: reqData.licensePlateType,
                myNumberPlate: reqData.myNumberPlate,
                mobilephone: reqData.mobilephone,
                identityCard: reqData.identityCard
              },
              data: json.data
            }
            this.$store.commit('saveNewLawlessQuery', lawlessData)
            this.$router.push(/_WeChat/g.test(this.$route.name) ? 'newLawlessMsg_WeChat' : 'newLawlessMsg')
          } else {
            Toast({
              message: json.msg,
              position: 'middle',
              duration: 2000
            })
          }
        })
      },
      ...mapActions({
        postAppealQuery: 'postAppealQuery'
      })
    },
    created () {
      let cars = JSON.parse(window.localStorage.cars)
      if (cars.length === 0) {
        MessageBox('提示', '当前用户没有车辆信息')
        return false
      }
      this.bindCarList = cars
      this.carJson = cars[0]
    }
  }
</script>
