<template>
  <div class="motorVehicle" @click.stop="subTypeSelectShow=false,typeSelectShow=false">
    <div class="ip-inform-item">
      <div class="ip-inform-title">申请类型</div>
      <div class="ip-inform-content">
        <input type="text" class="ip-inform-only" readonly value="机动车信息单" style="background: #efeff4">
      </div>
    </div>
    <div class="ip-inform-item">
      <div class="ip-inform-title">姓名</div>
      <div class="ip-inform-content">
        <input type="text" class="ip-inform-only" readonly :value="userName" style="background: #efeff4">
      </div>
    </div>
    <div class="ip-inform-item">
      <div class="ip-inform-title">身份证号</div>
      <div class="ip-inform-content">
        <input type="text" class="ip-inform-only" readonly :value="IDcard" style="background: #efeff4">
      </div>
    </div>
    <div class="ip-inform-item">
      <div class="ip-inform-title">联系号码</div>
      <div class="ip-inform-content">
        <input type="text" class="ip-inform-only" readonly :value="phoneNumber" style="background: #efeff4">
      </div>
    </div>
    <div class="ip-inform-item">
      <div class="ip-inform-title">车牌号码</div>
      <div class="ip-inform-content">
        <div class="div-select flex">
          <span class="btn-select hidden"
                @click.stop="subTypeSelectShow=!subTypeSelectShow">{{currentPlate || '无'}}</span>
          <div class="div-select-ul" style="top: 30px;" v-if="subTypeSelectShow&&myNumberPlate.length">
            <ul>
              <li class="scroll-y" v-for="item in myNumberPlate" @click.stop="selectPlate(item)">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="ip-inform-item">
      <div class="ip-inform-title">车牌类型</div>
      <div class="ip-inform-content">
        <div class="div-select flex">
          <span class="btn-select hidden" @click.stop="typeSelectShow=!typeSelectShow">{{plateType || '请选择车牌类型'}}</span>
          <div class="div-select-ul" style="top: 30px;" v-if="typeSelectShow">
            <ul>
              <li class="scroll-y" v-for="item in plateTypes" @click.stop="selectType(item)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="submit" @click="submit">
      提 &nbsp交
    </div>
    <div class="warm-prompt">
      <div class="warm-prompt-title">温馨提示：</div>
      <div class="warm-prompt-content">进度查询请前往“个人中心”的“我的业务”</div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<style lang="less" scoped>
  .warm-prompt {
    padding-top: 40px;
    margin-left: 50px;
    margin-right: 50px;
  }

  .warm-prompt-title {
    font-size: 30px;
    color: #333;
    line-height: 60px;
  }

  .warm-prompt-content {
    font-size: 26px;
    color: #666;
    text-indent: 2em;
  }

  .submit {
    margin: 68px 50px 0px;
    height: 80px;
    width: 650px;
    background: rgb(38, 150, 221);
    text-align: center;
    line-height: 80px;
    color: white;
    font-size: 30px;
    border-radius: 10px;
  }

  .motorVehicle {
    background: white;
    height: 100%;
    padding-top: 30px;
  }

  input {
    color: gray;
  }

  .ip-inform-title {
    font-size: 30px;
    width: 135px;
  }

  .ip-inform-content {
    width: 485px;
    display: flex;
    justify-content: space-between;
  }

  .ip-inform-item {
    height: 96px;
    display: flex;
    margin-left: 50px;
    margin-right: 50px;
    justify-content: space-between;
    align-items: center;
  }

  .ip-inform-only {
    width: 100%;
    height: 60px;
    border-radius: 8px;
    padding: 0 22px;
  }

  .div-select {
    width: 504px;
    height: 62px;
    border-radius: 8px;
  }

  .btn-select, .scroll-y {
    color: #1f1f1f;
    font-weight: normal;
    font-size: 24px;
  }

  .div-select .btn-select {
    background-color: white;
  }
</style>
<script>
  import {resultPost} from '../../../service/getData'
  import {Toast, MessageBox} from 'mint-ui'
  import {submitApplicationForMotorVehicleInformation} from '../../../config/baseUrl'
  export default {
    data () {
      return {
        subTypeSelectShow: false,
        myNumberPlate: [],
        plateTypes: '',
        plateType: '',
        IDcard: '',
        userName: '',
        phoneNumber: '',
        typeSelectShow: false,
        currentPlate: '',
        currentVal: ''
      }
    },
    methods: {
      selectType (item) {
        this.plateType = item.str
        this.typeSelectShow = !this.typeSelectShow
        this.currentVal = item.type
      },
      selectPlate (item) {
        this.currentPlate = item
        this.subTypeSelectShow = !this.subTypeSelectShow
      },
      getUserInfo () {
        let cars = JSON.parse(window.localStorage.getItem('cars')) || []
        cars.map(item => {
          if (item.isMySelf === 0) {
            this.myNumberPlate.push(item.myNumberPlate)
          }
        })
        if (this.myNumberPlate.length) {
          this.currentPlate = this.myNumberPlate[0]
        }
        this.plateTypes = this.$store.state.licenseSelectData
        this.IDcard = window.localStorage.getItem('identityCard')
        this.userName = window.localStorage.getItem('userName')
        this.phoneNumber = window.localStorage.getItem('mobilePhone')
      },
      submit () {
        if (!this.myNumberPlate.length) {
          Toast({
            message: '你还没绑定本人车辆，请先绑定',
            duration: 2000
          })
          return
        }
        if (!this.currentPlate) {
          Toast({
            message: '你选择车牌号码',
            duration: 2000
          })
          return
        }
        if (!this.plateType) {
          Toast({
            message: '请选择车牌类型',
            duration: 2000
          })
          return
        }
        let obj = {
          applyType: '1',
          applyName: this.userName,
          identityCard: this.IDcard,
          applyPhone: this.phoneNumber,
          licensePlateNumber: this.currentPlate,
          plateType: this.currentVal
        }
        resultPost(submitApplicationForMotorVehicleInformation, obj).then(json => {
          console.log(obj)
          console.log(json)
          if (json.code === '0000') {
            let appoinSuccess = this.$store.state.appoinSuccess
            appoinSuccess.appoinType = '机动车信息单'
            appoinSuccess.appoinNum = json.msg.replace(/[^0-9]/ig, '')
            this.$router.push('/appointSuccess')
          } else if (json.code === '0001') {
            MessageBox({
              title: '提示',
              message: json.msg
            }).then(action => {
              this.$router.push('/')
            })
          }
        })
      }
    },
    mounted () {
      this.getUserInfo()
    }
  }
</script>
