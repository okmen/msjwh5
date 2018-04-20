<!-- 申办成功 或者 预约成功 的组件

    跳转至该组件时，使用以下方法
    this.$store.commit('saveSuccessInfo', dataInfo)
    this.$router.push('/submitSuccess')

    dataInfo 需要加上 state 字段
    dataInfo.state
      1 : 提交成功（需要加上 tip 字段）
      2 : 已通过  （需要加上 message 字段）
      3 : 未通过  （需要加上 message 字段）
    接口返回的数据存至 dataInfo
-->

<template>
  <div id="submitSuccess">
    <section class="appoint-img">
      <dl>
        <dd :class="{ 'img-success': isActive, 'img-failure': !isActive}"></dd>
        <dt>{{typeTitle[JsonDataInfo.state]}}</dt>
      </dl>
    </section>
    <section class="bid-box appoint-box" v-if="JsonDataInfo.state === '1'">
      <p>{{ JsonDataInfo.tip }}</p>
      <ul class="bid-ul">
        <li class="bid-item" v-for="(value, key) in JsonDataInfo" :key="key" v-if="keyListObj[key] && value">
          <span class="bid-item-key">{{ keyListObj[key] }}</span>
          ：<span>{{ valListObj[key] ? valListObj[key][value] : value }}</span>
        </li>
      </ul>
    </section>
    <section class="bid-box appoint-box" v-else>
      <p>{{ messageList[JsonDataInfo.state] }}</p>
    </section>
    <div class="btn-appoint-backword mt-60" @click="btnBackword" v-if="!urlJsonData">好的</div>
  </div>
</template>
<script>
export default {
  computed: {
    dataInfo: function () {
      return this.$store.state.successInfo
    }
  },
  data () {
    return {
      JsonDataInfo: '',
      isActive: true,
      tip: '您的信息已提交成功，结果将另行通知',
      urlJsonData: this.urlToJson(window.location.href),
      typeTitle: {
        '1': '提交成功',
        '2': '已通过',
        '3': '未通过'
      },
      keyListObj: {
        businessType: '业务类型',
        licenseNumber: '车牌号码',
        rfId: 'RFID号码'
      },
      messageList: {
        '2': '您的电子通行证已经生效，车辆可以按照《深圳市公安局交通警察关于进一步加强轻型自卸货车交通管理的通告》通行，请遵守交通法律法规，留意交警部门新的通告变化。'
      },
      valListObj: {}
    }
  },
  methods: {
    btnBackword: function () {
      this.$router.push('/')
    },
    urlToJson: function (url) {
      if (!url.split('?')[1]) {
        return false
      }
      let urlJson = {}
      let arr = url.split('?')[1].split('&')
      arr.map(item => {
        urlJson[item.split('=')[0]] = decodeURIComponent(item.split('=')[1])
      })
      return urlJson
    },
    // 获取图片成功或失败状态
    getState: function () {
      if (this.JsonDataInfo.state === '3') {
        this.isActive = !this.isActive
      }
    }
  },
  mounted () {
    this.JsonDataInfo = this.urlJsonData ? this.urlJsonData : this.dataInfo
    this.getState()
    if (!this.JsonDataInfo.tip) {
      this.JsonDataInfo.tip = this.tip
    }
  }
}
</script>
<style lang="less" scoped>
#submitSuccess{
  height:100%;
  width:100%;
  background:#FFF url('../assets/images/appointBack.png') bottom no-repeat;
  background-size:100% 32%;
  .appoint-img{
    width:100%;
    height:250px;
    dl{
      margin:0 auto;
      padding-top:74px;
      width:178px;
      height:100%;
      dd{
        width:100%;
        height:178px;
      }
      dt{
        line-height:72px;
        text-align:center;
      }
    }
  }
  .img-success {
    background: url('../assets/images/appointSuccess.png') no-repeat;
    background-size: 178px;
  }
  .img-failure {
    background: url('../assets/images/appointFailure.png') no-repeat;
    background-size: 178px;
  }
  .appoint-box{
    margin:120px auto 0;
    padding:20px 20px 30px;
    width:550px;
    border:1px solid #a7d9f9;
    border-radius:8px;
    h3{
      margin-bottom:30px;
      width:100%;
      height:70px;
      border-bottom:1px solid #a7d9f9;
      text-align:center;
      line-height:70px;
      font-size:30px;
      font-weight:normal;
    }
    p{
      font-size:24px;
      line-height:40px;
    }
    .bid-ul{
      margin-top: 10px;
      font-size:24px;
      line-height:40px;
      .bid-item{
        white-space: nowrap;
        .bid-item-key{
          width: 100px;
        }
        .red{
          color: #F00;
        }
      }
    }
  }
  .bid-box{
    border-color: #969696;
    h3{
      border-color: #969696;
    }
  }
  .btn-appoint-backword{
    margin:40px auto 0;
    width:550px;
    height:82px;
    background:#2696dd;
    color:#FFF;
    font-size:30px;
    line-height:80px;
    text-align:center;
    border-radius:8px;
  }
}
</style>