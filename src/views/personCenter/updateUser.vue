<template>
<div class="update-user">
  <g-input title="姓名" placeholder="请输入你的姓名" v-model="userName"></g-input>
  <g-input title="身份证号码" placeholder="请输入身份证号码" v-model="identityCard"></g-input>
  <g-input title="通讯地址" placeholder="请输入通讯地址" v-model="mailingAddress"></g-input>
  <group title="请按提示上传以下证件照片">
    <div class="upload-group">
      <g-upload text="身份证(正面)" id="file1" :bg="require('@/assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
      <g-upload text="身份证(反面)" id="file2" :bg="require('@/assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
      <g-upload text="手持身份证" id="file3" :bg="require('@/assets/images/ID-hand.png')" v-model="IDHand"></g-upload>
    </div>
  </group>
  <g-button text="提 交" @click.native="submitClick"></g-button>
</div>
</template>

<script>
  import {GInput, GUpload, Group, GButton} from 'form'
  import { updateUser } from '@/config/baseURL'
  import beforeSubmit from '@/mixins/beforeSubmit'
  export default {
    name: 'update-user',
    data () {
      return {
        IDCardFront: '',
        IDCardBack: '',
        IDHand: '',
        userName: '',
        identityCard: '',
        mailingAddress: ''
      }
    },
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    mixins: [beforeSubmit],
    components: {
      GInput, GUpload, Group, GButton
    },
    methods: {
      submitClick () {
        let verifyObj = {
          userName: '请输入你的姓名',
          identityCard: '请输入身份证号码',
          mailingAddress: '请输入通讯地址',
          IDCardFront: '请上传身份证(正面)',
          IDCardBack: '请上传身份证(反面)',
          IDHand: '请上传手持身份证'
        }
        if (this.$_myMinxin_beforeSubmit(verifyObj)) return
        let reqData = {
          tureName: this.userName, // 姓名
          identityCard: this.identityCard, // 身份证号码
          mailingAddress: this.mailingAddress, // 通讯地址
          idCardImgPositive: this.IDCardFront, // 身份证正面
          idCardImgNegative: this.IDCardBack, // 身份证反面
          idCardImgHandHeld: this.IDHand // 手持身份证
        }
        this.$axios.post(updateUser, reqData).then(data => {
          if (data.code === '0000') {
            this.$MessageBox('提示', '审核结果会以短信通知').then(() => {
              this.$router.push({path: '/personalCenter', query: this.queryURL})
            })
          } else {
            this.$MessageBox('提示', data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .update-user{
    padding: 40px 0;
  }
</style>
