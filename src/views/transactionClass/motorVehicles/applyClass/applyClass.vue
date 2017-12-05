<template>
  <div class="applyClass-outer">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="licenseSelectMassage" disabled></g-input>
    </div>
    <div class="appleyClass-from-child">
      <!-- <applyEveryMonth v-if="cur_type_id == '01'"></applyEveryMonth> -->
      <!-- <applyInterimCard v-else></applyInterimCard> -->
      <apply-interim-card></apply-interim-card>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <!-- <page-bottom v-if="isWeChat"></page-bottom> -->
  </div>
</template>

<script>
import {GInput, GSelect, GButton} from 'form'
import applyInterimCard from './applyInterimCard.vue'
export default {
  name: 'applyClass',
  computed: {
    isWeChat: function () {
      return /_WeChat/g.test(this.$route.name)
    }
  },
  data () {
    return {
      cur_type_id: '01',
      licenseSelectShow: false,
      licenseSelectMassage: '每月1天通行证业务申请',
      licenseSelectData: [
        {
          'id': '01',
          'str': '每月1天通行证业务申请'
        },
        {
          'id': '02',
          'str': '申请机动车临牌'
        }
      ]
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    applyInterimCard
  },
  mounted () {
    this.$nextTick(function () {
      this.cur_type_id = this.$route.params.id
      if (this.$route.params.id === '01') {
        this.licenseSelectMassage = '每月1天通行证业务申请'
      } else {
        this.licenseSelectMassage = '申请机动车临牌'
      }
    })
  },
  methods: {
    licenseSelectClick: function (str, id) {
      if (str) {
        this.licenseSelectMassage = str
        this.cur_type_id = id

        console.log(this.cur_type_id)
      }
      if (this.licenseSelectShow === true) {
        this.licenseSelectShow = false
      } else {
        this.licenseSelectShow = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
