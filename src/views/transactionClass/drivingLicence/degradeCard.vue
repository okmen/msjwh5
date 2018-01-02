<!--驾驶证降级-->
<template>
<div class="degrade-card">
  <g-input title="证件名称" value="居民身份证" readonly></g-input>
  <g-input title="证件号码" readonly></g-input>
  <g-input title="申请人证件号" readonly></g-input>
  <g-input title="申请人驾驶证号"readonly></g-input>
  <g-input title="申请人姓名" readonly></g-input>
  <g-select title="户籍所在地" ></g-select>
  <g-input title="收件人姓名" readonly></g-input>
  <g-input title="收件人号码" readonly></g-input>
  <g-select-one title="邮寄地址"></g-select-one>
  <group title="请按示例图上传以下证件照片">
    <div class="upload-group">
      <g-upload id="file1" text="身份证（正面）" :bg="require('../../../assets/images/IDcard-front.png')"></g-upload>
      <g-upload id="file2" text="身份证（反面）" :bg="require('../../../assets/images/IDcard-back.png')"></g-upload>
      <g-upload id="file3" text="驾驶证照片" :bg="require('../../../assets/images/drivinglicense.png')"></g-upload>
    </div>
  </group>
  <g-button text="确认信息"></g-button>
</div>
</template>

<script>
  export default {
    name: 'degrade-card',
    data () {
      return {}
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      loginUser () {
        return this.user.identityCard
      }
    }
  }
</script>

<style scoped lang="less">
.degrade-card{
  padding: 20px 0 40px;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
