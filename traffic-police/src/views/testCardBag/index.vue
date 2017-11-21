<template>
  <div class="test-card-bag">
    <button class="form-template-submit" style="width: 100%" @click="getData">
      测试卡包
    </button>
    <div>
      {{cardBagData}}
    </div>

  </div>
</template>
<script>
  import {resultPost} from '../../service/getData'
  import wx from 'weixin-js-sdk'
  export default {
    data () {
      return {
        cardBagData: ''
      }
    },
    methods: {
      testskipDate (data) {
        console.log(data)
      },
      testArrTime (data) {
        console.log(data)
      },
      getData () {
        var that = this
        let requestData = {
          cardId: 'pILMDwI0YyTv1ikElE4IOHDxU00I'
        }
        resultPost('http://testjava.chudaokeji.com/h5/cardConfig.html', requestData).then(data => {
          console.log(data)
          this.cardBagData = data
          let cardExt = {
            openid: window.localStorage.openId,
            timestamp: data.data.timestamp,
            signature: data.data.signature,
            nonce_str: data.data.noncestr
          }
          wx.addCard({
            cardList: [{
              cardId: data.data.cardId,
              cardExt: JSON.stringify(cardExt)
            }], // 需要添加的卡券列表
            success: function (res) {
//              var cardList = res.cardList // 添加的卡券列表信息
              that.cardBagData = JSON.stringify(res)
            }
          })
        })
      }
    }
  }
</script>
