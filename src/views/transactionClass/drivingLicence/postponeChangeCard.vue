<template>
  <div class="postpone-change-card">
    <div class="changeCard-top">
      <g-input title="业务类型" value="驾驶证延期换证" readonly></g-input>
    </div>
    <g-input title="证件名称" value="居民身份证" readonly></g-input>
    <g-input title="证件号码" value="居民身份证" readonly></g-input>
    <g-input title="姓名" value="居民身份证" readonly></g-input>
    <g-input title="驾驶证号" value="居民身份证" readonly></g-input>
    <g-input title="档案编号" value="居民身份证" readonly></g-input>
    <g-select title="延期原因" :data="reasonSelectData"></g-select>
    <g-input title="收件人姓名" value="居民身份证" readonly></g-input>
    <g-input title="收件人号码" value="居民身份证" readonly></g-input>
    <g-select-one type="邮寄地址" title="深圳市" :data="cityArea" v-model="cityAreaOne" ref="cityAreaOneStr"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload id="file1" text="身份证（正面）" :bg="require('../../../assets/images/IDcard-front.png')" v-model="cardFront"></g-upload>
        <g-upload id="file2" text="身份证（反面）" :bg="require('../../../assets/images/IDcard-back.png')" v-model="cardBack"></g-upload>
        <g-upload id="file3" text="驾驶证照片" :bg="require('../../../assets/images/drivinglicense.png')" v-model="drivinglicenseImg"></g-upload>
        <g-upload id="file4" text="延期说明照片" :bg="require('../../../assets/images/newDelayIntro.png')" v-model="bodyTable"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
  export default {
    name: 'postpone-change-card',
    data () {
      return {
        mailingAddress: '',
        reasonSelectData: [
          {
            'value': '01',
            'name': '服兵役'
          },
          {
            'value': '02',
            'name': '出国（境）'
          },
          {
            'value': '03',
            'name': '其他'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  .postpone-change-card{
    padding: 20px 0 40px;
  }
</style>
