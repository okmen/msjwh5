<template>
  <div class="moveCar">
    <mt-navbar class="navbar" v-model="selected">
      <mt-tab-item id="1">通过车辆查询</mt-tab-item>
      <mt-tab-item id="2">通过序列号查询</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <plate-number-full v-model="plateNumber"></plate-number-full>
        <g-select title="车牌类型" :data="licenseSelectData" v-model="plateSelect" ref="plateSelectName"></g-select>
        <Verify :type="1" title="验证码" v-model="verifyCode" ref="callVerify"></Verify>
        <g-button text="查询" @click.native="vehicleSearch"></g-button>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <g-input title="交通违法序号" v-model="trafficNumber" placeholder="请输入违法序号"></g-input>
        <Verify :type="1" title="验证码" v-model="verifyCode" ref="callVerifyByCode"></Verify>
        <g-button text="查询" @click.native="codeSearch"></g-button>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="tp-look-tips">
      <router-link :to="{path: '/freeAbstract'}">首违免罚介绍</router-link>
    </div>
    <ul class="freeByCarUl" v-if="freeUlShow" v-for="(freeDataList, index) in freeData" :key="index">
      <li class="freeByCarLi" v-for="(item, key) in freeDataList" :key="key">
        <div class="liDiv-title">{{keyListObj[key]}}</div>
        <div class="liDiv-text">{{key === 'plateType' ? plateType[item] : item}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import Verify from '@/components/Verify'
import { Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
import {GInput, GSelect, GButton} from 'form'
import PlateNumberFull from '@/components/PlateNumberFull'
import { getResultOfFirstIllegalImpunity } from '@/config/baseURL.js'
import axios from '@/utils/axios'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  data () {
    return {
      freeUlShow: false, // 车牌列表 显示-true 隐藏-false
      selected: '1',
      plateNumber: '', // 车牌号码
      trafficNumber: '',
      verifyCode: '', // 验证码
      plateSelect: '02', // 车牌类型
      freeData: {},
      keyListObj: {
        'id': '记录ID',
        'numberPlate': '车牌号码',
        'plateType': '车牌类型',
        'illegalTime': '违法时间',
        'illegalAddress': '违法地址',
        'illegalSite': '违法地点',
        'sectionsCode': '路段代码',
        'illegalAction': '违法行为',
        'illegalContent': '违法内容',
        'illegalMoney': '罚款金额',
        'illegalCore': '违法记分数',
        'inputTime': '录入时间',
        'foundAuthority': '发现机关',
        'foundAuthorityName': '发现机关名称',
        'illegalNumber': '违法序号',
        'productiveTime': '运算时间',
        'updateTime': '更新时间'
      },
      plateType: {
        '02': '蓝牌',
        '06': '黑牌',
        '01': '黄牌'
      },
      reqData: {}
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    PlateNumberFull,
    Verify,
    mtNavbar: Navbar,
    mtTabItem: TabItem,
    mtTabContainer: TabContainer,
    mtTabContainerItem: TabContainerItem
  },
  mixins: [beforeSubmit],
  computed: {
    licenseSelectData () {
      return this.$store.state.plateType
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  methods: {
    refresh () {
      this.freeUlShow = false
      this.freeData = {}
    },
    vehicleSearch () {
      if (!this.$refs.callVerify.checkCode()) {
        return
      }
      if (this.$_myMinxin_beforeSubmit({plateNumber: '请输入车牌号码'})) return
      this.reqData = {
        queryType: '1',
        illegalNumber: '',
        'numberPlate': this.plateNumber,   // 车牌号码
        'plateType': this.plateSelect      // 车牌种类
      }
      this.subData()
    },
    codeSearch () {
      if (!this.$refs.callVerifyByCode.checkCode()) {
        return
      }
      if (this.$_myMinxin_beforeSubmit({trafficNumber: '请输入违法序号'})) return
      this.reqData = {
        queryType: '2',
        illegalNumber: this.trafficNumber,
        'numberPlate': '',
        'plateType': ''
      }
      this.subData()
    },
    subData () {
      axios.post(getResultOfFirstIllegalImpunity, this.reqData).then(json => {
        if (json.code === '0000') {
          this.freeData = json.data
          this.freeUlShow = true
        } else {
          this.$toast({message: json.msg, position: 'middle', duration: 3000})
        }
        this.$refs.callVerify.refresh()
      })
    }
  },
  watch: {
    selected: function (val) {
      this.refresh()
    }
  }
}
</script>

<style lang="less">
  .moveCar {
    .mint-tab-container {
      overflow: visible;
    }
    .mint-tab-item-label {
      font-size: 26px;
    }
    .navbar {
      border-bottom: 1px solid #dbdbdb;
      margin-bottom: 20px;
      &>a.is-selected {
        margin-bottom: 0;
      }
    }
    .tp-look-tips{
      width:100%;
      padding: 20px 0 40px 40px;
      a{
        font-size:26px;
        color:#174ed0;
        text-decoration:underline;
      }
    }
    .freeByCarUl{
      display: block;
      width: 90%;
      margin: 30px auto;
      border: 1px solid #ccc;
      border-radius: 8px;
      .freeByCarLi{
        display: flex;
        line-height: 60px;
        justify-content: left;
        border-bottom: 1px solid #ccc;
        vertical-align: middle;
        .liDiv-title{
          text-indent: 20px;
          flex: 1;
        }
        .liDiv-text{
          flex:2;
          padding-right: 20px;
        }
      }
      .freeByCarLi:last-of-type{
        border-bottom: none;
      }
    }
  }
</style>
