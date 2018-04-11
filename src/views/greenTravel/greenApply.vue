<template>
  <div class="m-greenApply">
    <header class="header"></header>
    <div class="m-form">
      <g-input title="姓名" v-model="form.name" readonly></g-input>
      <g-select title="名下车辆" :data="plateNumberData" v-model="plateNumber" placeholder="请选择"></g-select>
      <g-input title="车牌类型" v-model="typeData[form.type]" readonly></g-input>
    </div>
    <div class="footer">
      <div class="tp-read">
        <div class="tp-read-checkbox">
          <input type="checkbox" id="informReadCheckbox" name="informReadCheckbox" v-model="reading">
          <label for="informReadCheckbox"></label>
        </div>
        <span @click="reading = !reading">我已认真阅读并同意</span>
        <router-link to="/greenTravel">《申请加入“爱我深圳，停用少用，绿色出行”自愿停驶行动协议》</router-link>
      </div>
      <g-button text="下一步" noMargin="true" @click.native="submit" type="gray" v-if="!reading"></g-button>
      <g-button text="下一步" noMargin="true" @click.native="submit" v-if="reading"></g-button>
      <router-link class="greenApply-prize" :to="{ path: '/prize', query: queryURL }">
        <img src="../../assets/images/prize.png">
        <p>奖励说明</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Checklist } from 'mint-ui'
import numberType from '@/config/numberType'
export default {
  // 判断是否是从下级或者协议页面返回并使用历史数据
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(from.name)
      if (from.name === 'greenTravel' || from.name === 'greenApplyDate' || from.name === 'prize') {
        vm.reading = vm.$store.state.pageRecord.data.reading || false
      }
    })
  },
  components: {
    'mt-checklist': Checklist
  },
  data () {
    return {
      isLogin: true,
      reading: false,
      plateNumber: '0',
      plateType: '',
      typeData: numberType,
      cars: JSON.parse(window.localStorage.getItem('cars')),
      form: {
        name: window.localStorage.getItem('userName'),
        tel: window.localStorage.getItem('mobilePhone'),
        IdCard: window.localStorage.getItem('identityCard'),
        car: window.localStorage.getItem('myNumberPlate'),
        type: window.localStorage.getItem('plateType'),
        isMySelf: 0
      },
      value: [],
      options: ['']
    }
  },
  computed: {
    plateNumberData () {
      var plateInfoList = []
      if (!this.cars) return plateInfoList
      this.cars.map((item, index) => {
        plateInfoList.push({'name': item.myNumberPlate, 'type': item.plateType, 'value': index + '', 'isMySelf': item.isMySelf})
      })
      return plateInfoList
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  watch: {
    value (val) {
      console.log(val)
      this.reading = val.length !== 0
    },
    reading () {
      this.$store.commit('savePageRecord', {
        reading: this.reading
      })
    },
    plateNumber (index) {
      this.form.type = this.plateNumberData[index].type
      this.form.isMySelf = this.plateNumberData[index].isMySelf
    }
  },
  methods: {
    // 动态注册 VUEX 状态模块
    registerModule () {
      this.$store.registerModule('greenApply', {
        state: this.form
      })
    },
    // 提交表单
    submit () {
      let cars = JSON.parse(window.localStorage.cars) || []
      if (cars.length === 0) {
        this.$toast({
          message: '暂无车辆,你可以通过“个人中心”绑定车辆',
          position: 'bottom'
        })
        return false
      }
      if (!this.form.car.includes('粤B')) {
        this.$toast({
          message: '只允许粤B小型汽车申请',
          position: 'bottom'
        })
        return false
      }
      if (this.form.type !== '02' && this.form.type !== '06' && this.form.type !== '52') {
        this.$toast({
          message: '只允许小型汽车申请',
          position: 'bottom'
        })
        return false
      }
      if (this.form.name.length > 4) {
        this.$toast({
          message: '只允许个人绑定的车',
          position: 'bottom'
        })
        return false
      }
      // 验证完成，提交状态并跳转路由
      this.registerModule()
      this.$router.push({name: 'greenApplyDate', query: this.queryURL})
    }
  },
  created () {
    // 没有车辆跳转
    let cars = JSON.parse(window.localStorage.cars) || []
    if (cars.length === 0) {
      this.$MessageBox('提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
    }
    // 名下没有车辆，但是车库里有车
    if (this.form.car === null && cars.length > 0) {
      this.form.type = this.plateNumberData[0].type
      this.form.isMySelf = this.plateNumberData[0].isMySelf
    }
  }
}
</script>

<style lang="less">
@import 'style/greenTravel.less';
.m-greenApply {
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // background-color: #F5F5F5;
  .footer {
    padding-top: 50px;
  }
  .tp-read{
    width:100%;
    height:106px;
    span, a {
      font-size: 26px;
    }
    .tp-read-checkbox{
      float:left;
      position:relative;
      margin:4px 20px 0 0;
      width:26px;
      height:26px;
      input[type=checkbox]{
        visibility: hidden;
      }
      label{
        margin-top: 3px;
        position:absolute;
        width:26px;
        height:26px;
        top:0;
        left:0;
        background:#FFF;
        border:1px dotted #6a6a6a;
        -webkit-border-radius:6px;
        -moz-border-radius:6px;
        border-radius:6px;
        cursor:pointer;
      }
      label:after{
        opacity:0.2;
        content:'';
        position:absolute;
        width:24px;
        height:8px;
        background:transparent;
        top:0;
        left:3px;
        border:4px solid #333;
        border-top:none;
        border-right:none;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
      label:hover::after{
        opacity:0.5;
      }
      input[type=checkbox]:checked + label:after{
        opacity:1;
      }
    }
  }
  .m-form {
    padding-top: 30px;
  }
}
</style>
