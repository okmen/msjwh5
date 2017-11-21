<template>
  <div class='appealQuery-outer'>
    <div class='appealForm'>
      <div class='form-item'>
        <div class='item-left'>姓名</div>
        <div class='item-right'>
          <input class='text-input' v-model='this.name'>
        </div>
      </div>
      <div class='form-item'>
        <div class='item-left'>联系方式</div>
        <div class='item-right'>
          <input class='text-input' maxlength="11" v-model='this.mobilePhone'>
        </div>
      </div>
      <div class='form-item'>
        <div class='item-left'>身份证号</div>
        <div class='item-right'>
          <input class='text-input' v-model='this.identityCard'>
        </div>
      </div>
      <div class='form-item'>
        <div class='item-left'>名下车辆</div>
        <div class='item-right div-select'>
          <span class='btn-select min-btn-select' @click.stop='bindCarSelect()'>{{ cur_bindCar }}</span>
          <div class='div-select-ul' v-if='bindCarListShow'>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          </div>
        </div>
      </div>
      <div class='form-item'>
        <div class='item-left'>车牌类型</div>
        <div class='item-right'>
          <input class='text-input' v-model='plateTypeList[plateType]'>
        </div>
      </div>
      <div class='form-item'>
        <div class='item-left'>车架号</div>
        <div class='item-right'>
          <input class='text-input' maxlength="4" v-model='this.vehicleIdentifyNoLast4'>
        </div>
      </div>
    </div>
    <button class='btn btn-blue' type='button' name='button' @click='btnClick()'>查询</button>
    <div class='hint'>
      <h4>温馨提示：</h4>
      <p>对交通安全违法行为记录有异议的（如已作出处罚决定，应该申请行政复议和提起行政诉讼），请详细填写申诉内容，我们会安排专人与您联系办理</p>
    </div>
  </div>
</template>
<style lang='less'>
  .appealQuery-outer {
    padding:0 50px;
    .appealForm {
      .form-item {
        height: 100px;
        line-height:100px;
        .item-left {
          display: inline-block;
          width: 25%;
        }
        .item-right {
          display: inline-block;
          width: 70%;
          &.div-select {
             .min-btn-select {
                background-position: 94% center !important;
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
  import { MessageBox } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'appealQuery',
    data () {
      return {
        name: window.localStorage.getItem('userName'),
        mobilePhone: window.localStorage.getItem('mobilePhone'),
        identityCard: window.localStorage.getItem('identityCard'),
        cur_bindCar: window.localStorage.getItem('myNumberPlate') === 'undefined' ? '无' : window.localStorage.getItem('myNumberPlate'),
        bindCarList: [],
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
    created () {
      if (!window.localStorage.getItem('myNumberPlate')) {
        MessageBox('提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆').then(action => {
          this.$router.push('/')
        })
      }
    },
    methods: {
      bindCarSelect: function (str) {
        if (str) {
          this.curCar = str
        }
        if (this.licenseSelectShow === true) {
          this.licenseSelectShow = false
        } else {
          this.licenseSelectShow = true
          this.typeSelectShow = false
          this.abbreviationSelectShow = false
        }
      },
      btnClick: function () {
        let reqData = {
          licensePlateNo: this.cur_bindCar,
          licensePlateType: this.plateType,
          vehicleIdentifyNoLast4: this.vehicleIdentifyNoLast4,
          identityCard: this.identityCard,
          sourceOfCertification: 'C',
          mobilephone: this.mobilePhone
        }
        if (window.localStorage.getItem('myNumberPlate') === 'undefined') {
          MessageBox('提示', '当前用户没有车辆信息')
          return false
        }

        resultPost(queryLawlessByCar, reqData).then(json => {
          console.log(json)
          if (json.code === '0000') {
            if (json.data.length !== '0') {
              json.data.forEach((item, index) => { // 循环dataList 给每个item上面添加 check关联属性
                item.checkAddBorder = false
              })
              this.postAppealQuery(json.data)
              this.$router.push('/illegalAppealResult')
            } else {
              MessageBox('提示', json.msg)
            }
          } else {
            MessageBox('提示', json.msg)
          }
        })
      },
      ...mapActions({
        postAppealQuery: 'postAppealQuery'
      })
    }
//    created () {
//      var userCar = window.localStorage.getItem('myNumberPlate')
//      if (!userCar) {
//        Toast({
//          message: '您还未绑定车辆',
//          position: 'middle',
//          className: 'white',
//          duration: 3000
//        })
//        window.location.href = 'personalCenter'
//      }
//    }
  }
</script>
