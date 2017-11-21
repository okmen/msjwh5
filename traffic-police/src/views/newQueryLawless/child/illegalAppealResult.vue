<template>
  <div id="illegalResult">
    <p class="illegal-title">共有<span>{{totalItem}}</span>条违法记录</p>
    <div class="illegal-box">
      <!-- 违法结果查询结果 -->
      <div v-for="(item, index) in AppealQueryData" class="illegal-list" :class="{ blue: item.checkAddBorder }">
        <div class="illegal-record">
          <p>通知书号：<span>{{item.billNo}}</span></p>
          <p>违法时间：<span>{{item.illegalTime}}</span></p>
          <p>执法单位：<span>{{item.illegalUnit}}</span></p>
          <p>违法行为：<span>{{item.illegalDesc}}</span></p>
          <p>违法地点：<span>{{item.illegalAddr}}</span></p>
        </div>
        <div class="illegal-query">
          <section class="illegal-score">
            <p class="illegal-score-num">{{item.punishScore}}</p>
            <p>违法记分</p>
          </section>
          <section class="illegal-score">
            <p class="illegal-score-num">{{item.punishAmt}}</p>
            <p>罚款金额</p>
          </section>
          <section class="illegal-appeal">
            <button :id="'illegalSelectRadio'+ index" 
                    :name="'illegalSelectRadio'+ index" 
                    v-model:checked="item.checkAddBorder" 
                    @click="inputClick(index)">
              {{btnHtml}}
            </button>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        AppealQueryData: '',
        btnHtml: '申诉',
        totalItem: ''        // 违法记录数
      }
    },
    created () {
      this.AppealQueryData = this.showAppealQuery
      this.totalItem = this.AppealQueryData.length
      console.log(this.showAppealQuery)
    },
    methods: {
      inputClick: function (index) {
        this.AppealQueryData.forEach((item) => {
          item.checkAddBorder = false
        })
        this.AppealQueryData[index].checkAddBorder = true
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
  background: #EEE;
  .illegal-title{
    height: 85px;
    background:#FFF;
    color: #333;
    font-size: 32px;
    line-height: 85px;
    margin-bottom: 10px;
    text-align: center;
    span{
      color: #2696DD;
      font-weight: bold;
    }
  }
  .illegal-box{
    padding:38px 50px 80px;
    width:100%;
    background:#FFF;
    box-sizing: border-box;
    .illegal-list{
      position:relative;
      padding:20px 40px;
      margin-bottom:86px;
      width:100%;
      box-sizing: border-box;
      border-radius:8px;
      border: 3px solid #D3D3D3;
      box-shadow: 0 0 0 0;
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
        display: block;
        width:100%;
        overflow: hidden;
        .illegal-score{
          float:left;
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
        .illegal-score:nth-of-type(2) {
          padding-left: 80px;
        }
        .illegal-appeal{
          float: right;
          button{
            margin-top: 10px;
            width: 192px;
            height: 72px;
            background: #2697DD;
            border-radius: 4px;
            color: #FFF;
            font-size: 32px;
            line-height: 72px;
            outline: none;
          }
        }
      }
    }
    .blue{
      border:3px solid #2696DD;
    }
  }
}
</style>