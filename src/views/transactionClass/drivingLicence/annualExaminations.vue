<template>
<div class="annual-examinations">
  <g-input title="姓名" v-model="userName"></g-input>
  <g-input title="身份证号码" v-model="IDCard"></g-input>
  <g-input title="手机号码" v-model="mobilePhone"></g-input>
  <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
  <group title="请按示例图上传以下证件照片">
    <div class="upload-group">
      <g-upload text="身份证（正面)" id="file1" :bg="require('../../../assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
      <g-upload text="身份证（反面)" id="file2" :bg="require('../../../assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
      <g-upload text="审核教育绘制表" id="file3" :bg="require('../../../assets/images/edu-table.png')" v-model="eduTable"></g-upload>
    </div>
  </group>
 <g-button text="确认信息" @click.native="confirmInfo"></g-button>
</div>
</template>

<script>
  import {GInput, GSelect, GButton, GUpload, Group} from 'form'
  export default {
    data () {
      return {
        userName: '',
        IDCard: '',
        mobilePhone: '',
        IDCardFront: '',
        IDCardBack: '',
        eduTable: '',
        censusRegisterList: [
          {name: '深圳', value: 0}, {name: '港澳台籍', value: 1}, {name: '外国籍', value: 2}, {name: '其他', value: 3}
        ],
        censusRegisterOne: 1
      }
    },
    components: {
      GInput,
      GSelect,
      GButton,
      GUpload,
      Group
    },
    methods: {
      confirmInfo () {
        console.log(this.IDCardFront)
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
</style>
