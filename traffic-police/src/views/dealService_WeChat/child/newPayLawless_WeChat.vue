<template lang="html">
  <div class="newPayLawless-WeChat">
    <new-pay-lawless></new-pay-lawless>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
export default {
  components: {
    'newPayLawless': require('../../newQueryLawless/child/newPayLawless.vue'),
    'pageBottom': require('../../../components/pageBottom.vue')
  }
}
</script>

<style lang="less">
.newPayLawless-WeChat{
  background-color: #fff;
  .tp-bottom{
    margin-top: 28px;
  }
}
</style>
