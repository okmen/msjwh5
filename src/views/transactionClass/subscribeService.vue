<template>
  <div class="carService-outer">
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}" v-for="(item, index) in menuArr" v-if="item.name === '抵押/解押登记现场办理'">
      <a href="javascript:;" @click="routerLink(index)">{{ item.name }}</a>
    </div>
  </div>
</template>
<script>
  import { getBusinessTypes } from '@/config/baseURL.js'
  import axios from '@/utils/axios'
  export default {
    name: 'carService',
    data () {
      return {
        source: '',
        menuArr: []
      }
    },
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    methods: {
      initiate: function () {
        let reqData = {
          type: 1
        }
        if (window.sessionStorage.car) {
          console.log('22222222222')
          this.menuArr = JSON.parse(window.sessionStorage.car)
          return false
        }
        axios.post(getBusinessTypes, reqData).then(json => {
          if (json.code === '0000') {
            this.menuArr = json.data
            window.sessionStorage.setItem('car', JSON.stringify(json.data))
            this.$nextTick(() => {
              this.$emit('initSuccess')
            })
          }
        })
      },
      routerLink (index) {
        let codeName = this.menuArr[index].code
        this.$router.selfPush({path: '/userAgreement_precontract', query: {type: 'car', codeName}})
      }
    },
    mounted () {
      this.source = this.$store.state.core.source
      this.initiate()
    }
  }
</script>
<style lang="less" scopsd>
  @import '../../assets/style/subscribeService';
  .subscribeService {
    margin-left: 30px;
  }
</style>
