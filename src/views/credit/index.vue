<template>
  <div class="carService-outer">
    <ul class="handyService-list">
      <li class="query-link" :class="{ 'subscribeService': source === 'M'}" v-for="(item, index) in list" :key="index">
        <router-link :to="{ path: item.path, query: queryURL }">
          <p>{{item.name}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        source: '',
        list: [
          {name: '驾驶人安全事故信用表', path: 'userAgreement/aqsgxyb'},
          {name: '无车证明', path: 'userAgreement/wczm'},
          {name: '驾驶人信息单', path: 'userAgreement/jsrxxd'},
          {name: '机动车信息单', path: 'userAgreement/jdcxxd'},
          {name: '电子回单', path: 'digByCar'}
        ]
      }
    },
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    mounted () {
      this.source = this.$store.state.core.source
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/style/subscribeService';
</style>
