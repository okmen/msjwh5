<template>
  <div class="insuranceBills-outer">
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'commerce'}" @click="cur_tab = 'commerce'">商业险</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'constraint'}" @click="cur_tab = 'constraint'">交强险</div>
    </div>
    <commerce v-if="cur_tab == 'commerce'"></commerce>
    <constraint v-else></constraint>
  </div>
</template>
<script>
  export default {
    name: 'insuranceBills',
    data () {
      return {
        cur_tab: 'constraint',
        diu: ''
      }
    },
    components: {
      'commerce': require('./commerce.vue'),
      'constraint': require('./constraint.vue')
    }
  }
</script>
<style lang="less">
  .insuranceBills-outer {
    .nav{
      font-size: 0;
      background-color:#fff;
      border-bottom:1px solid #dbdbdb;
      .nav-tab {
        font-size: 1rem;
        display: inline-block;
        width: 50%;
        text-align: center;
        height: 100px;
        line-height: 100px;
      &.active {
         color: #2696dd;
         border-bottom: 6px solid #2696dd;
       }
      }
    }
  }
</style>

