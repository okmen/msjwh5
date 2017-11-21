<template lang="html">
  <div class="newTimeSelect-WeChat">
    <illegal-time-select></illegal-time-select>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
export default {
  components: {
    'illegalTimeSelect': require('../../../views/newQueryLawless/child/illegalTimeSelect.vue'),
    'pageBottom': require('../../../components/pageBottom.vue')
  }
}
</script>

<style lang="css">
.newTimeSelect-WeChat{
  background: #fff;
}
</style>
