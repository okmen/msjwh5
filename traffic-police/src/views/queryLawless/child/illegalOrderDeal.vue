<template>
  <div id="illegalResult">
    <div class="illegal-box">
      <!-- 违法结果查询结果 -->
      <div v-for="(item, index) in AppealQueryData" class="illegal-list" :class="{ green: item.checkAddBorder }">
        <div class="illegal-record">
          <p>违法时间：<span>{{item.illegalTime}}</span></p>
          <p>执法单位：<span>{{item.illegalUnit}}</span></p>
          <p>违法行为：<span>{{item.illegalDesc}}</span></p>
          <p>违法地点：<span>{{item.illegalAddr}}</span></p>
          <p>处理方式：<span>{{claimList[item.isNeedClaim]}}</span></p>
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
          <section v-if="isIllegalImgBtnShow(item.imgQueryCode)" class="illegal-query-img" @click="illegalImgBtn(item.imgQueryCode)" >查看违法图片</section>
        </div>
        <!-- <div class="illegal-img">
          <div class="illegal-img-box" v-for="imgList in item.illegalImgs"  >
            <img :src="'data:image/png;base64,' + imgList" alt="">
          </div>
        </div> -->
        <div class="illegal-select" v-if="item.isNeedClaim == 2">
          <input type="checkbox" :id="'illegalSelectRadio'+ index" :name="'illegalSelectRadio'+ index" v-model:checked="item.checkAddBorder" @click="inputClick(index)">
          <label :for="'illegalSelectRadio'+ index"></label>
        </div>
        <div class="illegal-free" v-if="item.description">
          <p @click="punishFreeDesc(item.description)">首违免罚介绍</p>
        </div>
      </div>
      <div class="illegal-btn" @click="btnSubmitIllegal()">预约</div>
    </div>
      <popupImg
        @cancel="passCancel"
        v-if="popupImgShow"
        :data="imgBase">
      </popupImg>
  </div>
</template>
<script>
  import { resultPost } from './../../../service/getData'
  import { illegalPictureQuery } from './../../../config/baseUrl'
  import popupImg from './../../../components/popupImg'
  import { mapGetters, mapActions } from 'vuex'
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
        appealContent: '', // 申诉内容
        imgBase: '',
        popupImgShow: false,
        claimList: {
          '0': '直接缴款',
          '1': '需要打单',
          '2': '需要前往窗口办理',
          '3': '可好易处理(需持有广东驾驶证)',
          '4': '必须好易处理(需持有广东驾驶证)',
          '5': '违法地处理',
          '6': '强制措施窗口处理'
        }       // 返回-是否需要打单（编号转换）
      }
    },
    components: {
      popupImg
    },
    created () {
      this.AppealQueryData = this.showAppealQuery
    },
    methods: {
      isIllegalImgBtnShow: function (code) { // 判断是否有imgCode 和是否是登录状态
        if (code && window.localStorage.isLogin === 'true') {
          return true
        } else {
          return false
        }
      },
      passCancel: function () { // 点击通过弹窗的取消按钮
        this.popupImgShow = false // 隐藏通过弹窗
      },
      illegalImgBtn: function (imgCode) {
        resultPost(illegalPictureQuery, {imgQueryCode: imgCode}).then(json => {
          this.popupImgShow = true
          this.imgBase = json.data[0]
        })
      },
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
      punishFreeDesc: function (msg) {
        MessageBox('提示', msg)
      },
      btnSubmitIllegal: function () {
        let checkedItem = ''
        this.AppealQueryData.forEach((item, index) => {
          if (item.checkAddBorder) {
            checkedItem = item
          }
        })
        if (!checkedItem) {
          MessageBox('提示', '至少选中一个违法进行预约')
          return false
        }
        if (checkedItem.carOwner !== window.localStorage.getItem('userName')) {
          MessageBox('提示', '此功能只能预约本人车辆').then(action => {
            this.$router.push('/')
          })
          return false
        }
        this.postAppealQuery(checkedItem)
        this.$router.push('/illegalTimeSelect')
      },
      ...mapActions({
        postAppealQuery: 'postAppealQuery'
      })
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
        display: flex;
        overflow: hidden;
        justify-content: space-around;
        align-items: center;
        section{
          margin: 0;
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
        .illegal-query-img{
          font-size: 28px;
          color: #fff;
          padding: 0 30px;
          background-color: #2696dd;
          line-height: 70px;
          height: 70px;
          border-radius: 6px;
        }
      }
      .illegal-img{
        display: flex;
        padding-top: 20px;
        justify-content: space-around;
        .illegal-img-box{
          width: 30%;
          height: 120px;
          overflow: hidden;
        }
        img{
          width: 100%;
          display: block;
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
      .illegal-free {
        font-size: 0.8rem;
        margin-top: 28px;
        &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
        p {
          color:#2696dd;
          float:right;
          text-decoration: underline;
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
