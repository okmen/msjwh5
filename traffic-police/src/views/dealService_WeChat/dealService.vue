<template lang="html">
  <div class="dealService-WeChat">
    <deal-service></deal-service>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
export default {
  components: {
    'dealService': require('../dealService/dealService.vue'),
    'pageBottom': require('../../components/pageBottom.vue')
  }
}
</script>

<style lang="less" scoped>
  .dealService-WeChat{
    .dealService-outer{
      position: relative;
    }
    .tp-bottom{
      margin-top: 28px;
    }
  }
</style>
