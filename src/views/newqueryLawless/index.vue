<template>
  <div class="newqueryLawless">
    <mt-cell v-for="(item, index) in personalData" :title="item.title" :to="{ path: item.link, query: queryURL }" :key="index" is-link></mt-cell>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
      personalData: [
        {
          title: '交通违法查询',
          link: '/newqueryByCar'
        },
        {
          title: '交通违法',
          link: '/newPayLawless'
        }
      ]
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  components: {
    Cell
  }
}
</script>

<style lang="less" scoped>
  .newqueryLawless {
    .mint-cell {
      border-bottom: 1px solid #ddd;
    }
  }
</style>
