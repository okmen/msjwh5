<template>
  <div class="electricCar">
    <mt-cell v-for="(item, index) in handyData" :title="item.title" :to="{ path: item.link, query: queryURL }" key="index" is-link>
</mt-cell>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
      handyData: [
        {
          title: '电动车扫码',
          link: '/scancode'
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
  .electricCar {
    .mint-cell {
      border-bottom: 1px solid #ddd;
    }
  }
</style>
