<template>
  <div class="carService-outer">
    <div class="query-link subscribeService" v-for ="item in smallClassData">
      <router-link :to="{ path: item.path, query: queryURL}">{{item.title}}</router-link>
    </div>
  </div>
</template>
<script>
export default {

  name: 'index',
  data () {
    return {
      smallClassData: [
        {
          title: '消分学习',
          path: 'userAgreement/xfNotice'
        },
        {
          title: '满分学习',
          path: 'userAgreement/mfNotice'
        },
        {
          title: 'A/B类驾驶人培训学习',
          path: 'userAgreement/abNotice'
        },
        {
          title: 'A/电动车学习',
          path: 'userAgreement/ddcNotice'
        },
        {
          title: '行人、非机动车安全学习',
          path: 'userAgreement/xrNotice'
        }
      ],
      queryURL: ''
    }
  },
  mounted () {
    this.queryURL = this.$store.getters.queryURL
    console.log(this.$store.getters.queryURL)
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/subscribeService';
</style>
