<!--
  描述：绿色出行-非星级用户申报
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
          <el-input v-model="form.name" placeholder="请输入姓名" size="small" />
        </div>
      </div>
      <div class="item">
        <label>身份证号</label>
        <div class="box">
          <el-input v-model="form.IdCard" placeholder="请输入身份证号码" size="small" />
        </div>
      </div>
      <div class="item flex">
        <label>车牌号码</label>
        <div class="box">
          <el-select v-model="form.typeProvince" disabled class="zly-select" size="small" placeholder="请选择车牌种类" style="width: 6rem; margin-right: .5rem;">
            <el-option
              v-for="item in typeData"
              :key="item.str"
              :label="item.str"
              :value="item.str"
            ></el-option>
          </el-select>
          <el-input v-model="form.typeNumber" placeholder="请输入车牌号码" size="small" />
        </div>
      </div>
      <div class="item">
        <label>车辆类型</label>
        <div class="box">
          <el-select v-model="form.carType" disabled class="zly-select" size="small" placeholder="请选择车辆类型">
            <el-option
              v-for="item in carType"
              :key="item.id"
              :label="item.str"
              :value="item.id"
            ></el-option>
          </el-select>
          <div class="tips">温馨提示：大型汽车不予申请</div>
        </div>
      </div>
      <div class="item">
        <label>联系方式</label>
        <div class="box">
          <el-input v-model="form.tel" placeholder="请输入手机号码" size="small" />
        </div>
      </div>
      <div class="item">
        <label>验证码</label>
        <div class="box">
          <el-input v-model="form.code" placeholder="请输入验证码" id="inp" size="small"/>
        </div>
        <div class="right"><div id="code" class="button"></div></div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click.native="submit2">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { Input, Select, Option, Button } from 'element-ui'
import { verifyCode } from '../../config/verifyCode.js'
import { Toast, MessageBox } from 'mint-ui'
export default {
  components: {
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button
  },
  data () {
    return {
      typeData: [
        {
          'str': '粤B'
        }
      ],
      carType: [
        {
          'id': '02',
          'str': '小型汽车'
        }
      ],
      form: {
        name: '',
        tel: '',
        IdCard: '',
        typeProvince: '粤B',
        typeNumber: '',
        carType: '02',
        code: ''
      }
    }
  },
  methods: {
    // 动态注册 VUEX 状态模块
    registerModule () {
      this.$store.registerModule('greenApply', {
        state: this.form
      })
    },
    // 临时处理
    submit2 () {
      MessageBox('警告', '暂时不提供该接口')
    },
    // 提交表单
    submit () {
      for (let key in this.form) {
        if (this.form[key] === '') {
          Toast({
            message: '信息填写不完整',
            position: 'bottom'
          })
          return false
        }
      }
      if (!/^[A-Za-z\u4e00-\u9fa5]+$/.test(this.form.name)) {
        Toast({
          message: '真实姓名格式错误',
          position: 'bottom'
        })
        return false
      }
      if (!/^1\d{10}$/.test(this.form.tel)) {
        Toast({
          message: '手机号码格式错误',
          position: 'bottom'
        })
        return false
      }
      if (!/^\d{17}[\d|x]|\d{15}$/.test(this.form.IdCard)) {
        Toast({
          message: '身份证格式错误',
          position: 'bottom'
        })
        return false
      }
      // 验证完成，提交状态并跳转路由
      this.registerModule()
      this.$router.push({ name: 'greenApplyDate' })
    }
  },
  mounted () {
    // 挂载验证码，并注册验证回调函数
    verifyCode(document.querySelector('#inp input'), document.getElementById('code'), (result, code) => {
      if (!result) {
        Toast({
          message: '验证码错误',
          position: 'bottom'
        })
        return false
      }
      this.verifyCode = result
    })
  }
}
</script>

<style lang="less">
@import '~src/style/form.less';
@import 'style/greenTravel.less';
</style>
