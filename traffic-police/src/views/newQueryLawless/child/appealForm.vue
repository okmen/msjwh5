<!-- 
* 违法申诉 提交表单
 -->
<template>
  <div id="appealForm">
    <!-- 提交申诉表单 -->
    <div class="illegal-form clear">
      <div class="illegal-type">
        <p>申诉类型</p>
        <div class="div-select">
          <span class="btn-select" @click.stop="selectInformType()">{{selectInformTypeMsg}}</span>
          <div class="div-select-ul" v-if="illegalSelectShow">
            <ul>
              <li v-for="item in illegalSelectData" @click.stop="selectInformType(item.str)">{{item.str}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="illegal-address">
        <p>联系地址</p>
        <div class="address-add">
          <div-select :childInfo="liveDistrict" @getSelected="getLiveDistrict"></div-select>
        </div>
      </div>
      <div class="illegal-address-input">
        <input type="text" name="address" placeholder="请输入详细地址" v-model="claimantAddress">
      </div>
      <div class="illegal-address">
        <p>联系电话</p>
        <input type="text" name="address" placeholder="请输入您的联系电话" v-model="claimantPhone">
      </div>
      <div class="illegal-content">
        <p class="illegal-con-color">申诉内容</p>
        <textarea placeholder="请输入申诉理由" v-model="appealContent"></textarea>
      </div>
    </div>
    <div class="illegal-btn" @click="btnSubmitIllegal()">提 交</div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { illegalAppeal } from '../../../config/baseUrl'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        illegalSelectShow: false,   // 是否显示申诉下拉列表
        selectInformTypeMsg: '记录的机动车号牌信息错误的', // 申诉类型
        illegalSelectData: [
          { 'str': '记录的机动车号牌信息错误的' },
          { 'str': '违法行为系统记录重复的' },
          { 'str': '有证据证明救助危难或紧急避险造成' },
          { 'str': '因交通信号指示不一致造成的' },
          { 'str': '交通技术监控设备收集的违法行为记录材料包括车辆类型、违法时间、违法地点不准确的' }
        ],
        claimantPhone: '',          // 申诉联系电话
        claimantAddress: '',        // 申诉联系地址
        appealContent: '',          // 申诉内容
        selectDistrict: '',
        liveDistrict: {
          title: '深圳市',
          option: [
            { 'str': '福田区' },
            { 'str': '罗湖区' },
            { 'str': '南山区' },
            { 'str': '宝安区' },
            { 'str': '龙岗区' },
            { 'str': '盐田区' },
            { 'str': '龙华新区' },
            { 'str': '光明新区' },
            { 'str': '坪山新区' },
            { 'str': '大鹏新区' }
          ]
        }
      }
    },
    computed: {
      lawlessData: function () {
        return this.$store.state.newLawlessDeal
      }
    },
    components: {
      divSelect: require('components/divSelect.vue')
    },
    created () {
      this.AppealQueryData = this.showAppealQuery
    },
    methods: {
      selectInformType: function (str) {  // li的点击事件
        if (str) {
          this.selectInformTypeMsg = str
        }
        if (this.illegalSelectShow === true) {
          this.illegalSelectShow = false
        } else {
          this.illegalSelectShow = true
        }
      },
      getLiveDistrict (val) {   // 选择居住区
        this.selectDistrict = val
      },
      btnSubmitIllegal: function () {
        let reqData = {
          billNo: this.lawlessData.data.billNo, // 违法书单编号
          illegalTime: this.lawlessData.data.illegalTime, // 违法时间
          illegalAddress: this.lawlessData.data.illegalAddr, // 违法地点
          illegalDesc: this.lawlessData.data.illegalDesc, // 违法行为
          punishAmount: this.lawlessData.data.punishAmt, // 罚款金额
          punishScore: this.lawlessData.data.punishScore, // 罚分
          agency: this.lawlessData.data.illegalUnit, // 执法单位
          claimant: window.localStorage.userName, // 申诉人姓名
          claimantAddress: this.claimantAddress, // 申诉联系地址
          claimantPhone: this.claimantPhone, // 申人联系电话
          appealType: '1', // 申诉类型
          appealContent: this.appealContent, // 申诉内容
          licensePlateNo: this.lawlessData.data.licensePlateNo,
          identityCard: window.localStorage.getItem('identityCard'),
          userCode: ''
        }
        resultPost(illegalAppeal, reqData).then(json => {
          MessageBox('提示', json.msg)
        })
      }
    }
  }
</script>
<style lang="less">
#appealForm{
  width:100%;
  padding:25px 50px 50px;
  background:#FFF;
  .illegal-form{
    width:100%;
    .illegal-address{
      margin-bottom:28px;
      height: 58px;
      p{
        margin-bottom:18px;
        float: left;
        width: 24%;
        color:#232323;
        line-height: 58px;
        font-size:28px;
      }
      input{
        float: left;
        width: 76%;
        height:58px;
        background:#efeff4;
        border:1px solid #e2e2e7;
        border-radius:10px;
        color:#666;
        font-size:26px;
        outline:none;
        text-indent: 24px;
      }
    }
    .illegal-type{
      margin-bottom:28px;
      height: 58px;
      p{
        float: left;
        width: 24%;
        color:#232323;
        line-height: 58px;
        font-size:28px;
      }
      .div-select{
        float: left;
        width: 76%;
        font-size: 26px;
      }
    }
    .illegal-address-input{
      margin-bottom:28px;
      margin-left: 155px;
      box-sizing: border-box;
      input{
        width: 100%;
        height:58px;
        background:#efeff4;
        border:1px solid #e2e2e7;
        border-radius:10px;
        color:#666;
        font-size:26px;
        outline:none;
        text-indent: 24px;
      }
    }
    .illegal-content{
      margin-top:28px;
      width:100%;
      .illegal-con-color{
        width: 24%;
        float: left;
        font-size: 28px;
      }
      textarea{
        float: left;
        width: 76%;
        padding-top:10px;
        padding-left:24px;
        height:190px;
        background:#efeff4;
        border:1px solid #e2e2e7;
        border-radius:10px;
        color:#666;
        font-size:26px;
        resize:none;
        outline:none;
      }
    }
  }
  .illegal-btn{
    margin-top:50px;
    width:100%;
    height:80px;
    background:#2696dd;
    border-radius:8px;
    color:#FFF;
    font-size:30px;
    line-height:80px;
    text-align:center;
  }
}  
</style>
<style lang="less">
#appealForm{
  .address-add{
    font-size: 28px;
    .replace-select{
      height: 58px;
      font-size: 26px;
      line-height: 58px;
    }
    .selected-value{
      height: 58px;
      background-color: #EFEFF4;
      background-position: 93.5% center;
      background-size: 18px;
      font-size: 26px;
      line-height: 58px;
    }
  }
}
</style>
