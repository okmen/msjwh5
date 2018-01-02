<template>
<div class="change-connect">
  <g-select title="证件名称"></g-select>
  <g-input title="证件号码" placeholder="请输入证件号码"></g-input>
  <g-input title="用户姓名" ></g-input>
  <g-radio title="用户性别" :data="sexList"></g-radio>
  <g-input title="驾驶证号码" readonly></g-input>
  <g-input title="手机号码" readonly></g-input>
  <g-select-one type="邮寄地址" title="深圳市" :data="cityArea" v-model="cityAreaOne" ref="cityAreaOneStr"></g-select-one>
  <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
  <group title="请按示例图上传以下证件照片">
    <div class="upload-group">
      <g-upload id="file1" text="身份证（正面）" :bg="require('../../../assets/images/IDcard-front.png')" v-model="cardFront"></g-upload>
      <g-upload id="file2" text="身份证（反面）" :bg="require('../../../assets/images/IDcard-back.png')" v-model="cardBack"></g-upload>
      <g-upload id="file3" text="驾驶证照片" :bg="require('../../../assets/images/drivinglicense.png')" v-model="drivinglicenseImg"></g-upload>
    </div>
  </group>
  <g-button text="确认信息" @click.native="confirmInfo"></g-button>
</div>
</template>

<script>
  export default {
    name: 'change-connect',
    data () {
      return {
        sexList: [
          {name: '男', choose: false, value: '1'},
          {name: '女', choose: false, value: '2'}
        ],
        cityAreaOne: '01',
        mailingAddress: '',
        cardFront: '',
        cardBack: '',
        drivinglicenseImg: ''
      }
    },
    computed: {
      cityArea () {
        return this.$store.state.cityArea
      }
    },
    methods: {
      confirmInfo () {
      }
    }
  }
</script>

<style scoped lang="less">
.change-connect{
  padding: 20px 0 40px;
}
</style>
