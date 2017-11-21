<template lang="html">
  <div class="queryProgress">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="query('car')">机动车业务</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="query('card')">驾驶证业务</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'other'}" @click="query('other')">其他</div>
    </div>
    <div class="content" id="content" ref="content">
      <queryResult class="queryResult" v-for="item in dataList" :data="item"></queryResult>
      <page-bottom v-if="isWeChat"></page-bottom>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
import queryResult from './queryResult'
import { resultPost } from '../../../../service/getData'
import { bindBusiness, getIdentificationOfAuditResults } from '../../../../config/baseUrl'
import { Toast } from 'mint-ui'

export default {
  computed: {
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  data () {
    return {
      cur_tab: 'car',
      current_tab: '',
      identityCard: '', // 当前用户身份证
      dataList: []
    }
  },
  methods: {
    query: function (str) {
      if (str !== this.current_tab) {
        this.cur_tab = str
        this.current_tab = str
        let reqData = {
          businessType: 1, // 业务类型 0-全部 1-机动车业务 2-驾驶证业务
          businessStatus: 0, // 业务状态 0-全部 1-办理中 2-已完结
          identityCard: this.identityCard // 身份证
        }
        switch (str) {
          case 'car': // 查询机动车业务
            reqData.businessType = 1
            this.getBusiness(reqData)
            break
          case 'card': // 查询驾驶证业务
            reqData.businessType = 2
            this.getBusiness(reqData)
            break
          case 'other': // 查询其他业务
            resultPost(getIdentificationOfAuditResults, {identityCard: this.identityCard}).then(json => {
              if (json.code === '0000') {
                let datalist = []
                json.data.forEach(item => {
                  let status = ''
                  switch (item.sHZT) {
                    case '0':
                      status = '待审核'
                      break
                    case '1':
                      status = '审核通过'
                      break
                    case 'TB':
                      status = '退办'
                      break
                  }
                  datalist.push({
                    businessTitle: '星级用户认证', // 业务名称
                    statusStr: status, // 业务状态
                    receptionTime: item.sHSJ || '' // 受理时间
                  })
                })
                this.dataList = datalist
                this.$refs.content.scrollTop = 0
              } else {
                Toast({
                  message: json.msg,
                  duration: 2000
                })
              }
            })
            break
        }
      }
    },
    getBusiness: function (reqData) {
      resultPost(bindBusiness, reqData).then(json => {
        if (json.code === '0000') {
          this.dataList = json.data
          this.$refs.content.scrollTop = 0
        } else {
          Toast({
            message: json.msg,
            duration: 2000
          })
        }
      })
    }
  },
  mounted () {
    this.identityCard = window.localStorage.getItem('identityCard') || this.$router.currentRoute.query.identityCard || ''
    this.query('car')
  },
  components: {
    queryResult,
    'pageBottom': require('../../../../components/pageBottom.vue')
  }
}
</script>

<style lang="less" scoped>
.queryProgress{
  .nav{
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    font-size: 0;
    background-color: #FFF;
    border-bottom:1px solid #dbdbdb;
    z-index: 1;
    .nav-tab {
      flex: 1;
      font-size: 1rem;
      text-align: center;
      height: 100px;
      line-height: 100px;
      &.active {
        color: #2696dd;
        border-bottom: 6px solid #2696dd;
      }
    }
  }
  .content{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    padding-top: 106px;
    overflow-y: auto;
    -webkit-overflow-scrolling:touch;
    .tp-bottom{
      margin-top: 28px;
    }
    .queryResult{
      margin: 20px 0;
    }
  }
}
</style>
<style>
.mint-indicator-mask{
  z-index: 9999
}
</style>
