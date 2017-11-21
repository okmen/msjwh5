<template>
  <div id="illegalResult">
    <div class="illegal-box">
      <!-- 违法结果查询结果 -->
      <div v-for="(item, index) in AppealQueryData" class="illegal-list" :class="{ green: item.checkAddBorder }">
        <div class="illegal-record">
          <p>通知书号：<span>{{item.billNo}}</span></p>
          <p>违法时间：<span>{{item.illegalTime}}</span></p>
          <p>执法单位：<span>{{item.illegalUnit}}</span></p>
          <p>违法行为：<span>{{item.illegalDesc}}</span></p>
          <p>违法地点：<span>{{item.illegalAddr}}</span></p>
        </div>
        <div class="illegal-query">
          <section class="illegal-query-score">
            <p class="illegal-score-num">{{item.punishScore}}</p>
            <p>违法记分</p>
          </section>
          <section class="illegal-query-score">
            <p class="illegal-score-num">{{item.punishAmt}}</p>
            <p>罚款金额</p>
          </section>
        </div>
        <div class="illegal-select">
          <input type="checkbox" :id="'illegalSelectRadio'+ index" :name="'illegalSelectRadio'+ index" v-model:checked="item.checkAddBorder" @click="inputClick(index)">
          <label :for="'illegalSelectRadio'+ index"></label>
        </div>
      </div>
      

      <!-- 提交申诉表单 -->
      <div class="illegal-form">
        <div class="illegal-address">
          <p>联系地址</p>
          <input type="text" name="address" placeholder="请输入您的联系地址" v-model="claimantAddress">
        </div>
        <div class="illegal-address">
          <p>联系电话</p>
          <input type="text" name="address" placeholder="请输入您的联系电话" v-model="claimantPhone">
        </div>
        <div class="illegal-type">
          <p>申诉类型</p>
          <p class="btn-select" @click.stop="selectInformType()">{{selectInformTypeMsg}}</p>
          <div class="div-select-ul" v-if="illegalSelectShow">
            <ul>
              <li v-for="item in illegalSelectData" @click.stop="selectInformType(item.str)">{{item.str}}</li>
            </ul>
          </div>
        </div>
        <div class="illegal-content">
          <p class="illegal-con-color">申诉内容</p>
          <textarea placeholder="请输入..." v-model="appealContent"></textarea>
        </div>
      </div>
      <div class="illegal-btn" @click="btnSubmitIllegal()">提交</div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { resultPost } from '../../../service/getData'
  import { illegalAppeal } from '../../../config/baseUrl'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        illegalSelectShow: false,   // 是否显示申诉下拉列表
        selectInformTypeMsg: '记录的机动车号牌信息错误的', // 申诉类型
        illegalSelectData: [
          {
            'str': '记录的机动车号牌信息错误的'
          },
          {
            'str': '违法行为系统记录重复的'
          },
          {
            'str': '有证据证明救助危难或紧急避险造成'
          },
          {
            'str': '因交通信号指示不一致造成的'
          },
          {
            'str': '交通技术监控设备收集的违法行为记录材料包括车辆类型、违法时间、违法地点不准确的'
          }
        ],
        AppealQueryData: '',
        claimantPhone: '', // 申诉联系电话
        claimantAddress: '', // 申诉联系地址
        appealContent: '' // 申诉内容
      }
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
      inputClick: function (index) {
        this.AppealQueryData.forEach((item) => {
          item.checkAddBorder = false
        })
        this.AppealQueryData[index].checkAddBorder = true
      },
      btnSubmitIllegal: function () {
        let checkedItem = ''
        this.AppealQueryData.forEach((item, index) => {
          if (item.checkAddBorder) {
            checkedItem = item
          }
        })
        if (!checkedItem) {
          MessageBox('提示', '至少选中一个违法进行申诉')
          return false
        }
        let reqData = {
          billNo: checkedItem.billNo, // 违法书单编号
          illegalTime: checkedItem.illegalTime, // 违法时间
          illegalAddress: checkedItem.illegalAddr, // 违法地点
          illegalDesc: checkedItem.illegalDesc, // 违法行为
          punishAmount: checkedItem.punishAmt, // 罚款金额
          punishScore: checkedItem.punishScore, // 罚分
          agency: checkedItem.illegalUnit, // 执法单位
          claimant: checkedItem.carOwner, // 申诉人姓名
          claimantAddress: this.claimantAddress, // 申诉联系地址
          claimantPhone: this.claimantPhone, // 申人联系电话
          appealType: '1', // 申诉类型
          appealContent: this.appealContent, // 申诉内容
          licensePlateNo: checkedItem.licensePlateNo,
          identityCard: window.localStorage.getItem('identityCard'),
          sourceOfCertification: 'C',
          userCode: ''
        }
        resultPost(illegalAppeal, reqData).then(json => {
          MessageBox('提示', json.msg)
        })
      }
    },
    computed: {
      ...mapGetters([
        'showAppealQuery'
      ])
    }
  }
</script>
<style lang="less">
#illegalResult{
  width:100%;
  background:#FFF;
  .illegal-box{
    padding:38px 50px 80px;
    width:100%;
    box-sizing: border-box;
    .illegal-list{
      position:relative;
      padding:20px 40px;
      margin-bottom:86px;
      width:100%;
      box-sizing: border-box;
      border-radius:8px;
      box-shadow:0 0 18px rgba(0,0,0,.3);
      .illegal-record{
        width:100%;
        p{
          color:#333;
          font-size:24px;
          font-weight:bold;
          line-height:50px;
          span{
            color:#666;
            font-weight:normal;
          }
        }
      }
      .illegal-query{
        width:100%;
        overflow: hidden;
        section{
          float:left;
          margin-left:100px;
          margin-top:20px;
          text-align:center;
          .illegal-score-num{
            color:#666;
            font-size:44px;
            font-weight:bold;
          }
          p{
            color:#333;
            font-size:24px;
            font-weight:bold;
          }
        }
      }
      .illegal-select{
        float:left;
        position:absolute;
        margin:4px 20px 0 0;
        width:40px;
        height:40px;
        top:30px;
        right:40px;
        input[type=checkbox]{
          visibility: hidden;
        }
        label{
          position:absolute;
          width:40px;
          height:40px;
          top:0;
          left:0;
          background:#dfdfdf;
          -webkit-border-radius:20px;
          -moz-border-radius:20px;
          border-radius:20px;
          cursor:pointer;
        }
        label:after{
          opacity:0.2;
          content:'';
          position:absolute;
          width:16px;
          height:8px;
          background:transparent;
          top:10px;
          left:10px;
          border:4px solid #FFF;
          border-top:none;
          border-right:none;
          -webkit-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
        label::after{
          opacity:1;
        }
        input[type=checkbox]:checked + label{
          background:#33c532;
        }
      }
    }
    .green{
      border:3px solid #33c532;
    }
    .illegal-form{
      width:100%;
      p{
        margin-bottom:18px;
        color:#232323;
        font-size:28px;
      }
      input{
        margin-bottom:28px;
        padding-left:24px;
        width:100%;
        height:58px;
        background:#efeff4;
        border:1px solid #e2e2e7;
        border-radius:10px;
        color:#666;
        font-size:24px;
        outline:none;
      }
      .illegal-type{
        position:relative;
        .btn-select{
          padding:0 50px 0 24px;
          margin-bottom:0;
          width:100%;
          height:58px;
          background:#efeff4;
          border:1px solid #e2e2e7;
          border-radius:10px;
          color:#666;
          line-height:58px;
          font-size:24px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        ul{
          position:absolute;
          padding:10px;
          width:100%;
          height:260px;
          top:104px;
          left:0;
          background:#FFF;
          border:1px solid #e2e2e7;
          li{
            width:100%;
            height:50px;
            color:#666;
            font-size:24px;
            line-height:40px;
            z-index:999;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .illegal-content{
        margin-top:28px;
        width:100%;
        .illegal-con-color{
          color:#33c532;
        }
        textarea{
          padding-top:10px;
          padding-left:24px;
          width:100%;
          height:190px;
          background:#efeff4;
          border:1px solid #e2e2e7;
          border-radius:10px;
          color:#666;
          font-size:24px;
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
}
</style>