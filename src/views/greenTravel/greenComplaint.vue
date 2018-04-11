<!--
  描述：绿色出行-查询【暂时废弃】
  时间：2017-07-20
  作者：猪不乐意
  联系：914230482
-->
<template>
  <div>
    <div class="m-form">
      <div class="item">
        <label>姓名</label>
        <div class="box">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </div>
      </div>
      <div class="item">
        <label>身份证</label>
        <div class="box">
          <el-input v-model="form.IdCard" placeholder="请输入身份证号码"></el-input>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click.native="submit">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button } from 'element-ui'
import { Toast } from 'mint-ui'
export default {
  components: {
    'el-input': Input,
    'el-button': Button
  },
  data () {
    return {
      form: {
        name: '',
        IdCard: ''
      }
    }
  },
  methods: {
    submit () {
      for (let key in this.form) {
        if (!this.form[key]) {
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
      if (!/^\d{17}[\d|x]|\d{15}$/.test(this.form.IdCard)) {
        Toast({
          message: '身份证格式错误',
          position: 'bottom'
        })
        return false
      }
      this.$router.push({
        name: 'greenItem'
      })
    }
  }
}
</script>

<style lang="less">
@import '~src/style/form.less';
</style>
