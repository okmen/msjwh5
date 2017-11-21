<template>
  <div class="m-confirminfo">
    <div class="m-confirminfoCard">
      <div class="pic"><img :src="page.img" /></div>
      <div class="info">
        <div class="name">{{ page.userName }}</div>
        <div class="text">{{ page.text }}</div>
      </div>
    </div>
    <div class="btns">
      <div class="btn prev" @click="$router.go(-1)">上一步</div>
      <div class="btn submit" @click="submit">提交</div>
    </div>
    <div class="m-confirm" :class="{ open: confirmState }">
      <div class="box">
        <div class="title">温馨提示</div>
        <div class="text">是否确认提交？</div>
        <div class="footer">
          <div class="cancel" @click="confirmState = false">取消</div>
          <div class="ok" @click="confirmSubmit">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { goodOwners } from 'src/config/baseUrl.js'
import { resultPost } from 'src/service/getData'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      confirmState: false
    }
  },
  computed: {
    page () {
      return this.$store.state.pageRecord.data
    }
  },
  methods: {
    submit () {
      this.confirmState = true
    },
    confirmSubmit () {
      let requestData = {
        ownerName: this.page.userName,
        driverLicenseNum: this.page.identityCard,
        licenseNumber: this.page.carNumber,
        numberPlate: this.page.numberPlate,
        mobile: this.page.mobilePhone,
        securityDeclaration: this.page.text,
        RZZP: this.page.img.split(',')[1]
      }
      if (this.$route.query.type) {
        requestData.sourceOfCertification = this.$route.query.type
      }
      resultPost(goodOwners, requestData).then(data => {
        this.confirmState = false
        if (data.code === '0000') {
          // 提交成功存储本地弹窗状态
          let popupInfo = window.localStorage.getItem('goodOwners')
          if (popupInfo) {
            popupInfo = JSON.parse(popupInfo)
            popupInfo.status = true
          } else {
            popupInfo = {
              show: false,
              time: null,
              status: true
            }
          }
          window.localStorage.setItem('goodOwners', JSON.stringify(popupInfo))
          // 跳转页面
          this.$router.push(`/goodOwners/submitSuccess?name=${this.page.userName}&licenseNumber=${this.page.carNumber}&type=sq`)
          // 清除填写的数据
          this.$store.commit('savePageRecord', {})
        } else {
          Toast({
            message: data.msg,
            position: 'bottom'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import 'goodOwners.less';
</style>