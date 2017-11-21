<!--
  描述：绿色出行-申报输入信息
  时间：2017-07-20
  作者：猪不乐意
  联系：914230482
-->
<template>
  <div class="m-greenApply">
    <header class="header"></header>
    <div class="m-form">
      <div class="item">
        <label>姓名</label>
        <div class="box">
          <el-input v-model="form.name" disabled placeholder="请输入姓名" size="small" />
        </div>
      </div>
      <div class="item">
        <label>名下车辆</label>
        <div class="box">
          <el-select v-model="selectCars" class="zly-select" size="small" @change="handleCarChange">
            <el-option
              v-for="(item, index) in cars"
              :key="index"
              :label="item.myNumberPlate"
              :value="item"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <label>车牌类型</label>
        <div class="box">
          <el-input :value="typeData[form.type]" disabled placeholder="请输入车牌类型" size="small" />
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="info">
        <el-checkbox v-model="reading"></el-checkbox>&nbsp;
        <span @click="reading = !reading">我已认真阅读并同意</span>
        <router-link to="/greenTravel">《申请加入“爱我深圳，停用少用，绿色出行”自愿停驶行动协议》</router-link>
      </p>
      <el-button type="primary" @click.native="submit" :disabled="!reading">下一步</el-button>
      <router-link class="greenApply-prize" to="/prize">
        <img src="../../images/prize.png">
        <p>奖励说明</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Input, Select, Option, Button, Checkbox } from 'element-ui'
import { Toast, MessageBox } from 'mint-ui'
import numberType from 'src/config/numberType'
export default {
  components: {
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-checkbox': Checkbox
  },
  // 判断是否是从下级或者协议页面返回并使用历史数据
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'greenTravel' || from.name === 'greenApplyDate' || from.name === 'prize') {
        vm.reading = vm.$store.state.pageRecord.data.reading || false
      }
    })
  },
  data () {
    return {
      isLogin: true,
      reading: false,
      typeData: numberType,
      cars: JSON.parse(window.localStorage.getItem('cars')),
      selectCars: window.localStorage.getItem('myNumberPlate') === 'undefined' ? '' : window.localStorage.getItem('myNumberPlate'),
      form: {
        name: window.localStorage.getItem('userName'),
        tel: window.localStorage.getItem('mobilePhone'),
        IdCard: window.localStorage.getItem('identityCard'),
        car: window.localStorage.getItem('myNumberPlate'),
        type: window.localStorage.getItem('plateType'),
        isMySelf: 0
      }
    }
  },
  watch: {
    reading () {
      this.$store.commit('savePageRecord', {
        reading: this.reading
      })
    }
  },
  methods: {
    // 动态注册 VUEX 状态模块
    registerModule () {
      this.$store.registerModule('greenApply', {
        state: this.form
      })
    },
    // 选择名下车辆
    handleCarChange (data) {
      this.form.car = data.myNumberPlate
      this.form.type = data.plateType
      this.form.isMySelf = data.isMySelf
    },
    // 提交表单
    submit () {
      let cars = JSON.parse(window.localStorage.cars) || []
      if (cars.length === 0) {
        Toast({
          message: '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆',
          position: 'bottom'
        })
        return false
      }
      if (!this.form.car.includes('粤B')) {
        Toast({
          message: '只允许粤B小型汽车申请',
          position: 'bottom'
        })
        return false
      }
      if (this.form.type !== '02' && this.form.type !== '06' && this.form.type !== '52') {
        Toast({
          message: '只允许小型汽车申请',
          position: 'bottom'
        })
        return false
      }
      if (this.form.name.length > 4) {
        Toast({
          message: '只允许个人绑定的车',
          position: 'bottom'
        })
        return false
      }
      // 验证完成，提交状态并跳转路由
      this.registerModule()
      this.$router.push({ name: 'greenApplyDate' })
    }
  },
  created () {
    this.isLogin = window.localStorage.getItem('isLogin')
    // 未登录状态跳转
    if (!this.isLogin) {
      this.$router.push({
        name: 'login'
      })
    }
    // 没有车辆跳转
    let cars = JSON.parse(window.localStorage.cars) || []
    if (cars.length === 0) {
      MessageBox('提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
    }
    // 名下没有车辆，但是车库里有车
    if (this.form.car === null && cars.length > 0) {
      this.selectCars = this.cars[0]
      this.handleCarChange(this.cars[0])
    }
  }
}
</script>

<style lang="less">
@import '~src/style/form.less';
@import 'style/greenTravel.less';
.m-greenApply .goodOwners {
  padding-top: 60px;
  margin: 0 -1rem;
  display: block;
  clear: both;
}
</style>
