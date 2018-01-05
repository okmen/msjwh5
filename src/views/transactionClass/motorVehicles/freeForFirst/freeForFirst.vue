<template>
  <div class="moveCar">
    <mt-navbar class="navbar" v-model="selected">
      <mt-tab-item id="1">通过车辆查询</mt-tab-item>
      <mt-tab-item id="2">通过序列号查询</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <plate-number-full v-model="plateNumber"></plate-number-full>
        <g-select title="车辆类型" :data="licenseSelectData" v-model="licenseSelect"></g-select>
        <Verify :type="1" title="验证码" v-model="verifyCode" ref="callVerify"></Verify>
        <g-button text="查询" @click.native="vehicleSearch"></g-button>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <g-input title="交通违法序号" v-model="trafficNumber" placeholder="请输入违法序号"></g-input>
        <g-button text="查询" @click.native="numberSearch"></g-button>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import Verify from '@/components/Verify'
import { Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
import {GInput, GSelect, GButton} from 'form'
import PlateNumberFull from '@/components/PlateNumberFull'
  // import { iocomotiveCarChangeContact } from '@/config/baseURL.js'
  // import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  data () {
    return {
      selected: '1',
      plateNumber: '',
      licenseSelect: 'K31',
      trafficNumber: '',
      verifyCode: ''
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
  computed: {
    licenseSelectData () {
      return this.$store.state.cartype
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  methods: {
    vehicleSearch () {
      this.$refs.callVerify.checkCode()
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
  }
</style>
