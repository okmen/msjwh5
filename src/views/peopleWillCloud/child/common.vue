<template>
<!-- 设施损坏、安全隐患通报公用组件 -->
<div class="common-outer">
  <div class="common-form">
    <ul class="common-form-list padding-right-43">
      <g-input class="address" title="详细地址" v-model="showAdd" placeholder="点击右侧按钮选择地址" readonly>
        <div slot="mark" class="common-list-location right" @click.stop='getLocation()'></div>
      </g-input>
      <g-input title="发现人姓名" v-model="userName" readonly></g-input>
      <g-input title="发现人手机" v-model="mobilephone" readonly></g-input>
      <g-radio title="紧急程度" :data="emergencyGroup" v-model="emergency"></g-radio>
      <g-select title="类型选择" :data="typeData" v-model="typeDataOne" ref="typeDataStr"></g-select>
      <g-select title="子类型选择" :data="subTypeDataSelect" v-model="subTypeDataOne" ref="subTypeDataStr"></g-select>
      <g-textarea title="现场描述" v-model="description" :maxlength="100" placeholder="简要对现场进行描述"></g-textarea>
      <group title="请上传现场照片">
        <div class="upload-group">
          <g-upload id="file" :bg="require('@/assets/images/upload.png')" v-model="sceneImg"></g-upload>
        </div>
      </group>
    </ul>
    <g-button text="提交" @click.native="submit"></g-button>
  </div>
</div>
</template>
<script>
import { GUpload, GTextarea } from 'form'

export default{
  name: 'common',
  props: ['typeData', 'subTypeData', 'reportingMatters', 'mapObj'],
  data () {
    return {
      typeSelectShow: false, // 类型选择
      subTypeSelectShow: false, // 子类型选择
      typeSelectData: this.typeData[this.typeIndex],
      typeIndex: 0,
      subTypeIndex: 0,
      userName: '',
      mobilephone: '',
      detailAddress: '',
      emergency: '',
      description: '',
      sceneImg: '',
      imgTime: '',
      emergencyGroup: [
        {name: '紧急', choose: false, value: '紧急'},
        {name: '普通', choose: false, value: '普通'}
      ],
      typeDataOne: 1001,
      subTypeDataOne: 101,
      showAdd: ''
    }
  },
  methods: {
    getLocation: function () {
      this.$emit('showMap')
      console.log('获取位置')
    },
    getsubTypeDataType: function (val) {
      this.subTypeDataSelect = this.subTypeData[val]
    },
    submit: function () {
      let reqData = {
        userName: this.userName, // 用户姓名 获取微信用户信息
        mobilephone: this.mobilephone, // 用户手机 获取微信用户信息
        identityCard: this.identityCard, // 身份证号
        reportingMatters: this.reportingMatters, // 举报事项
        addressRegion: this.mapObj.addressRegion, // 暂无 地址-区域
        addressStreet: this.mapObj.addressStreet, // 暂无 地址-街道
        addressSite: this.mapObj.addressSite, // 暂无 地址-站点
        detailAddress: this.mapObj.detailAddress, // 详细地址
        emergency: this.emergency, // 紧急程度
        selectTypeId: this.typeDataOne, // 选择类型Id
        selectType: this.$refs.typeDataStr.currentName, // 选择类型
        subTypeId: this.subTypeDataOne, // 子类型选择Id
        subType: this.$refs.subTypeDataStr.currentName, // 子类型选择
        description: this.description, // 现场描述
        sceneImg: this.sceneImg, // 现场图片
        imgTime: this.imgTime || '',
        subTypeDataSelect: []
      }
      console.log(reqData)
      for (let key in reqData) {
        if (!reqData[key] && key !== 'imgTime') {
          this.$toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      this.$emit('submit', reqData)
    }
  },
  components: {
    GUpload,
    GTextarea
  },
  computed: {
    user () {
      return Object.assign({}, this.$store.state.user)
    }
  },
  watch: {
    typeDataOne: function (val) {
      this.getsubTypeDataType(val)
    }
  },
  created () {
    this.showAdd = this.mapObj.showAdd
    console.log(this.showAdd)
    this.userName = this.user.userName || '' // 用户姓名
    this.mobilephone = this.user.mobilePhone || '' // 用户手机号码
    this.identityCard = this.user.identityCard || '' // 用户身份证号码
    this.subTypeDataSelect = this.subTypeData[this.reportingMatters]
  }
}
</script>
<style lang='less'>
.common-outer {
  .upload-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .g-upload-img {
      width: 162px;
      height: 162px;
    }
  }
  .address {
    .g-input-content input.input {
      width: 85%;
    }
  }
  .common-list-location {
    float: right;
    width: 32px;
    height: 56px;
    padding: 5px 0;
    box-sizing: border-box;
    background: url('../../../assets/images/location.png') right no-repeat;
    background-size: contain;
  }
}
</style>