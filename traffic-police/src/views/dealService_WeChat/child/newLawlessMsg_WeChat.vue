<template lang="html">
  <div class="newLawlessMsg-WeChat">
    <new-lawless-msg></new-lawless-msg>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
export default {
  components: {
    'newLawlessMsg': require('../../newQueryLawless/child/newLawlessMsg.vue'),
    'pageBottom': require('../../../components/pageBottom.vue')
  }
}
</script>

<style lang="css">
.newLawlessMsg-WeChat{
  background: #fff;
}
</style>
