<template>
  <div class="newqueryLawless">
    <mt-cell v-for="(item, index) in personalData" :title="item.title" :to="{ path: item.link, query: queryURL }" :key="index" is-link></mt-cell>
    <mt-cell :class="{'newqueryLawless-one': isShow}" title="交通违法在线处理" @click.native="onlinPprocessingClick" is-link></mt-cell>
    <mt-cell class="newqueryLawless-two" v-show="isShow" v-for="(item, index) in onlinPprocessing" :title="item.title" :to="{ path: item.link, query: queryURL }" :key="item.index" is-link></mt-cell>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
      isShow: false,
      personalData: [
        {
          title: '交通违法查询',
          link: '/newqueryByCar'
        },
        {
          title: '交通违法',
          link: '/newPayLawless'
        }
      ],
      onlinPprocessing: [
        {
          title: '交通违法在线确认',
          link: '/confirmLawless'
        },
        {
          title: '交通违法预约处理',
          link: '/newEarly'
        },
        {
          title: '交通违法申诉',
          link: '/appealEntry'
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
  },
  methods: {
    onlinPprocessingClick () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="less" scoped>
  .newqueryLawless {
    .mint-cell {
      border-bottom: 1px solid #ddd;
    }
    .newqueryLawless-one {
      color: #fff;
      background-color: #174ed0;
    }
    .newqueryLawless-two {
      background-color: #e9e9e9;
      padding-left: 40px;
    }
  }
</style>
