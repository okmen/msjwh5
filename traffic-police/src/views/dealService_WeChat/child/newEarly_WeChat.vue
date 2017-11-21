<template lang="html">
  <div class="newEarly-WeChat">
    <new-early></new-early>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
export default {
  components: {
    'newEarly': require('../../newQueryLawless/child/early.vue'),
    'pageBottom': require('../../../components/pageBottom.vue')
  }
}
</script>

<style lang="less">
.newEarly-WeChat{
  background: #fff;
  .tp-bottom{
    margin-top: 28px;
  }
}
</style>
