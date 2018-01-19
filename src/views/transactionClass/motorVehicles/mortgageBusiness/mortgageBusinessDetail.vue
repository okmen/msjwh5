<template>
  <div id="mortgageBusinessDetail">
    <info-list :result-list="dataList" :result-list-show="true"></info-list>
  </div>
</template>
<script>
import axios from '@/utils/axios'
import { queryCarMortgage } from '@/config/baseURL'
import infoList from '@/components/infoList'
export default {
  data () {
    return {
      urlJsonData: this.urlToJson(window.location.href),
      dataList: {}
    }
  },
  components: {
    infoList
  },
  methods: {
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
    }
  },
  mounted () {
    this.JsonDataInfo = this.urlJsonData
    let reqData = {
      loginUser: this.JsonDataInfo.loginUser,
      sqlx: this.JsonDataInfo.sqlx
    }
    axios.post(queryCarMortgage, reqData).then(json => {
      if (json.code === '0000') {
        this.dataList = json.data
      } else {
        this.$toast({message: json.msg, position: 'middle', duration: 3000})
      }
    })
  }
}
</script>
