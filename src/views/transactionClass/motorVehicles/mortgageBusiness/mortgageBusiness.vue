<template>
  <div class="mortgageBusiness">
    <mt-navbar class="navbar" v-model="selected">
      <mt-tab-item id="1">业务登记</mt-tab-item>
      <mt-tab-item id="2">查询</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="changeCard-top">
          <g-select class="changeCard-type" title="业务类型" :data="businessTypeData" v-model="businessType"></g-select>
        </div>
        <div class="caption">基础信息</div>
        <g-input title="主合同号" v-if="contractShow" v-model="mainContractNo" placeholder="请输入主合同号"></g-input>
        <g-input title="抵押合同号" v-if="contractShow" v-model="mortgageContactNo" placeholder="请输入抵押合同号"></g-input>
        <g-input title="登记证书编号" v-model="registrationNO" placeholder=" 请输入登记证书编号"></g-input>
        <plate-number-full v-model="plateNumber" type="mortgageBusiness" disabled center></plate-number-full>
        <g-select title="号牌种类" :data="plateTypeData" v-model="plateSelect"></g-select>
        <g-input title="车辆识别号" v-model="carCode" placeholder="请输入车辆识别号"></g-input>
        <g-input title="车主联系电话" v-model="ownerPhone" placeholder="请输 入车主联系电话"></g-input>
        <div class="caption">抵押权人信息</div>
        <g-input title="姓名" v-model="mortgageeName" readonly></g-input>
        <g-radio title="性别" :data="mortgagedSexList" v-model="mortgagedSex"></g-radio>
        <g-input title="身份证号" v-model="mortgageeIDcard" readonly></g-input>
        <g-input title="联系地址" v-model="mortgageeAddr" placeholder="请输入抵押权人联系地址"></g-input>
        <div class="caption">抵押人信息</div>
        <g-select title="车辆所有人" :data="ownerVehicle" v-model="selectOwnerVehicle"></g-select>
        <g-input title="姓名/单位名称" v-model="mortgagerName" placeholder="请输入抵押人姓名/单位名称"></g-input>
        <g-input title="身份证号/组织机构代码" v-model="mortgagerIDcard" placeholder="请输入身份证号或组织机构代码"></g-input>
        <g-radio title="性别" v-show="this.selectOwnerVehicle==='0'" :data="mortgagorSexList" v-model="mortgagorSex"></g-radio>
        <g-input title="联系地址" v-model="mortgagerAddr" placeholder="请输入抵押人联系地址"></g-input>
        <div class="caption">取件人信息</div>
        <g-input title="姓名" v-model="recipientName" placeholder="请输入取件人姓名"></g-input>
        <g-input title="电话" v-model="recipientPhone" placeholder="请输入取件人电话"></g-input>
        <g-input title="邮政编码" v-model="recipientCode" placeholder="请输入取件邮政编码"></g-input>
        <g-input title="联系地址" v-model="recipientAddr" placeholder="请输入取件地址"></g-input>
        <div class="caption">邮寄收件人信息</div>
        <g-input title="姓名" v-model="receiverName" placeholder="请输入收件人姓名"></g-input>
        <g-input title="电话" v-model="receiverPhone" placeholder="请输入收件人电话"></g-input>
        <g-input title="邮政编码" v-model="receiverCode" placeholder="请输入收件邮政编码"></g-input>
        <g-input title="联系地址" v-model="receiverAddr" placeholder="请输入收件地址"></g-input>
        <g-button text="提交" @click.native="submitInfo"></g-button>
      </mt-tab-container-item>
      <mt-tab-container-item class="pt-20" id="2">
        <g-input title="身份证号码" v-model="IDNumber" placeholder="请输入身份证号码"></g-input>
        <g-button text="查询" @click.native="search"></g-button>
        <info-list :result-list="dataList" :result-list-show="isShow"></info-list>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne, GRadio} from 'form'
import infoList from '@/components/infoList'
import { Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
import PlateNumberFull from '@/components/PlateNumberFull'
import axios from '@/utils/axios'
import { applyOrCancleCarMortgage, queryCarMortgage } from '@/config/baseURL'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  name: 'mortgageBusiness',
  data () {
    return {
      selected: '1',
      businessType: 'A', // 业务类型
      businessTypeData: [
        {
          name: '个人抵押登记',
          value: 'A'
        },
        {
          name: '个人解除抵押登记',
          value: 'B'
        }
      ],
      contractShow: true, // 是否显示主合同号和抵押合同号
      mainContractNo: '', // 主合同号
      mortgageContactNo: '', // 抵押合同号
      carCode: '', // 车辆识别代号
      registrationNO: '', // 登记证书编号
      ownerPhone: '', // 车主电话
      mortgageeName: '', // 抵押权人姓名
      mortgageeIDcard: '', // 抵押权人身份证号
      mortgageeAddr: '', // 抵押权人联系地址
      mortgagerIDcard: '', // 抵押人身份证号/组织机构证
      mortgagerName: '', // 抵押人姓名/单位名称
      mortgagerAddr: '', // 抵押人联系地址
      recipientName: '', // 取件人姓名
      recipientPhone: '', // 取件人电话
      recipientAddr: '', // 取件人地址
      recipientCode: '', // 取件人邮政编码
      receiverName: '', // 收件人姓名
      receiverPhone: '', // 收件人电话
      receiverAddr: '', // 收件人地址
      receiverCode: '', // 收件人邮政编码
      plateNumber: '', // 车牌号码
      plateSelect: '02', // 号牌种类
      selectOwnerVehicle: '1', // 车辆所有人
      ownerVehicle: [
        {
          name: '单位',
          value: '1'
        },
        {
          name: '个人',
          value: '0'
        }
      ],
      mortgagedSexList: [
        {name: '男', choose: true, value: '男'},
        {name: '女', choose: false, value: '女'}
      ],
      mortgagorSexList: [
        {name: '男', choose: true, value: '男'},
        {name: '女', choose: false, value: '女'}
      ],
      mortgagedSex: '男',
      mortgagorSex: '男',
      IDNumber: '',
      dataList: {},
      isShow: false
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    GSelectOne,
    GRadio,
    PlateNumberFull,
    infoList,
    mtNavbar: Navbar,
    mtTabItem: TabItem,
    mtTabContainer: TabContainer,
    mtTabContainerItem: TabContainerItem
  },
  mixins: [beforeSubmit],
  computed: {
    plateTypeData () {
      return this.$store.state.moveCarData
    },
    user () {
      return Object.assign({}, this.$store.state.user)
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  watch: {
    businessType (val) {
      this.contractShow = !this.contractShow
    }
  },
  methods: {
    submitInfo: function () {
      let obj = {
        registrationNO: '请输入登记证书编号',
        ownerPhone: '请输入车主联系电话',
        plateNumber: '请输入车牌号码',
        carCode: '请输入车辆识别号',
        mortgageeAddr: '请输入抵押权人联系地址',
        mortgagerIDcard: '请输入身份证号或组织机构代码',
        mortgagerName: '请输入抵押人姓名/单位名称',
        mortgagerAddr: '请输入抵押人联系地址',
        recipientName: '请输入取件人姓名',
        recipientPhone: '请输入取件人电话',
        recipientAddr: '请输入取件地址',
        recipientCode: '请输入取件邮政编码',
        receiverName: '请输入收件人姓名',
        receiverPhone: '请输入收件人电话',
        receiverAddr: '请输入收件地址',
        receiverCode: '请输入收件邮政编码'
      }
      if (this.businessType === 'A') {
        obj.mainContractNo = '请输入主合同号'
        obj.mortgageContactNo = '请输入抵押合同号'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      let reqData = {
        'businessType': this.businessType,
        'sqlx': '31',
        'mainContractNo': this.mainContractNo || '',
        'mortgageContactNo': this.mortgageContactNo || '',
        'carNumber': 'B' + this.plateNumber.substr(1),
        'numberPlate': this.plateSelect,
        'carCode': this.carCode,
        'registrationNO': this.registrationNO,
        'ownerPhone': this.ownerPhone,
        'mortgageeIDcard': this.mortgageeIDcard,
        'mortgageeName': this.mortgageeName,
        'mortgageeSex': this.mortgagedSex,
        'mortgageeAddr': this.mortgageeAddr,
        'carType': this.selectOwnerVehicle,
        'mortgagerIDcard': this.mortgagerIDcard,
        'mortgagerName': this.mortgagerName,
        'mortgagerSex': this.mortgagorSex || '',
        'mortgagerAddr': this.mortgagerAddr,
        'recipientName': this.recipientName,
        'recipientPhone': this.recipientPhone,
        'recipientAddr': this.recipientAddr,
        'recipientCode': this.recipientCode,
        'receiverName': this.receiverName,
        'receiverPhone': this.receiverPhone,
        'receiverAddr': this.receiverAddr,
        'receiverCode': this.receiverCode
      }
      axios.post(applyOrCancleCarMortgage, reqData).then(json => {
        if (json.code === '0000') {
          console.log(json.msg)
          let waterNumber = json.msg.split('：')[1]
          let sendData = {
            type: 1,
            waterNumber: waterNumber
          }
          this.$store.commit('saveSuccessInfo', sendData)
          let source = this.$route.query.source
          this.$router.push({path: '/submitSuccess', query: {source: source}})
        } else {
          this.$MessageBox('提示', json.msg).then(action => {})
        }
      })
    },
    search () {
      if (this.$_myMinxin_beforeSubmit({IDNumber: '请输入身份证号码'})) return
      let reqData = {
        loginUser: this.IDNumber,
        sqlx: '31'
      }
      axios.post(queryCarMortgage, reqData).then(json => {
        if (json.code === '0000') {
          this.dataList = json.data
          this.isShow = true
        } else {
          this.$toast({message: json.msg, position: 'middle', duration: 3000})
        }
      })
    }
  },
  mounted () {
    this.mortgageeName = this.user.userName
    this.mortgageeIDcard = this.user.identityCard
  }
}
</script>

<style lang="less">
.mortgageBusiness {
  padding-bottom: 40px;
  .changeCard-top {
    border-bottom: 0;
  }
  .caption {
    padding: 10px 40px;
    background-color: #f1f1f1;
    color: #666;
    font-size: 26px;
  }
  .mint-tab-item-label {
    font-size: 26px;
  }
  .navbar {
    border-bottom: 1px solid #dbdbdb;
    &>a.is-selected {
      margin-bottom: 0;
    }
  }
  .pt-20 {
    padding-top: 20px;
  }
}
</style>
