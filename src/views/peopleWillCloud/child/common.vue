<template>
<!-- 设施损坏、安全隐患通报公用组件 -->
<div class="common-outer">
  <div class="common-form">
    <ul class="common-form-list padding-right-43">
      <g-input title="详细地址" v-model="mapObj.showAdd" placeholder="点击右侧按钮选择地址" readonly>
        <div class="common-list-location right" @click.stop='getLocation()'></div>
      </g-input>
      <g-input title="发现人姓名" v-model="userName" readonly></g-input>
      <g-input title="发现人手机" v-model="mobilephone" readonly></g-input>
      <g-radio title="紧急程度" :data="emergencyGroup" v-model="emergency"></g-radio>
      <g-select title="类型选择" :data="typeData" v-model="typeDataOne"></g-select>
      <g-select title="子类型选择" :data="subTypeData" v-model="subTypeDataOne"></g-select>
      <!-- <li class="common-form-item">
        <div class="common-list-name">
          <span>类型选择</span>
        </div>
        <div class="div-select flex">
          <span class="btn-select hidden" @click.stop="btnTypeSelect()">{{typeSelectData.str}}</span>
          <div class="div-select-ul top-56" v-if="typeSelectShow">
            <ul>
              <li class="scroll-y" v-for="(item, index) in typeData" :key="index" @click.stop="btnTypeSelect(index+1)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </li>
      <li class="common-form-item">
        <div class="common-list-name">
          <span>子类型选择</span>
        </div>
        <div class="div-select flex">
          <span class="btn-select hidden" @click.stop="btnSubTypeSelect()">{{subTypeSelectData.str}}</span>
          <div class="div-select-ul top-56" v-if="subTypeSelectShow">
            <ul>
              <li class="scroll-y" v-for="(item, index) in subTypeData" :key="index" @click.stop="btnSubTypeSelect(index+1)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </li> -->
      <li class="common-form-item">
        <div class="common-list-name">
          <span>现场描述</span>
        </div>
        <div class="common-list-text">
          <textarea class="text-input textarea" name="localeDescript" id="localeDescript" placeholder="简要对现场进行描述" v-model="description" maxlength="100"></textarea>
        </div>
      </li>
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
import { GUpload } from 'form'

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
      subTypeDataOne: 101
    }
  },
  methods: {
    getLocation: function () {
      this.$emit('showMap')
      console.log('获取位置')
    },
    btnTypeSelect: function (index) {
      if (index && index !== this.typeIndex + 1) {
        index--
        this.typeIndex = index
        this.subTypeIndex = 0
        this.typeSelectData = this.typeData[this.typeIndex]
        this.subTypeData = this.typeSelectData.subTypeData
        this.subTypeSelectData = this.subTypeData[this.subTypeIndex]
      }
      this.subTypeSelectShow = false
      this.typeSelectShow = !this.typeSelectShow
    },
    btnSubTypeSelect: function (index) {
      if (index && index !== this.subTypeIndex + 1) {
        index--
        this.subTypeIndex = index
        this.subTypeSelectData = this.subTypeData[this.subTypeIndex]
      }
      this.typeSelectShow = false
      this.subTypeSelectShow = !this.subTypeSelectShow
      this.$emit('select')
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
        selectTypeId: this.typeSelectData.id, // 选择类型Id
        selectType: this.typeSelectData.str, // 选择类型
        subTypeId: this.subTypeSelectData.id, // 子类型选择Id
        subType: this.subTypeSelectData.str, // 子类型选择
        description: this.description, // 现场描述
        sceneImg: this.sceneImg, // 现场图片
        imgTime: this.imgTime || ''
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
    GUpload
  },
  created () {
    document.addEventListener('click', (e) => {
      this.typeSelectShow = false
      this.subTypeSelectShow = false
    })
    this.typeSelectData = this.typeData[this.typeIndex] // 选择类型
    this.subTypeSelectData = this.typeData[this.typeIndex].subTypeData[this.subTypeIndex] // 选择子类型
    this.subTypeData = this.typeSelectData.subTypeData
    this.userName = window.localStorage.getItem('userName') || '' // 用户姓名
    this.mobilephone = window.localStorage.getItem('mobilePhone') || '' // 用户手机号码
    this.identityCard = window.localStorage.getItem('identityCard') || '' // 用户身份证号码
    this.isReadonly = window.localStorage.getItem('isLogin') === 'true'
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
}
</style>