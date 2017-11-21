<template>
  <div class="navv">
    <ul class="nav-outer">
      <li class="nav-outer-center" v-for="(list, index) in listData">
        <router-link :to="testData[index].name">
          <p>{{list.classroomName}}</p>
        </router-link>
      </li>
    </ul>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'

export default {
  name: 'wschool',
  data () {
    return {
      classroomId: 0,
      listData: [{
        classroomName: '消分学习'
      }, {
        classroomName: '满分学习'
      }, {
        classroomName: 'AB类驾驶人学习'
      }, {
        classroomName: '电动车学习'
      }, {
        classroomName: '行人、非机动车安全学习'
      }],
      testData: [{
        name: '/userAgreement/xfNotice'
      }, {
        name: '/userAgreement/mfNotice'
      }, {
        name: '/userAgreement/abNotice'
      }, {
        name: '/userAgreement/ddcNotice'
      }, {
        name: '/userAgreement/xrNotice'
      }]
    }
  },
  mounted () {
    let isLogin = window.localStorage.getItem('isLogin') // 是否登录
    if (isLogin === 'false') {
      MessageBox('提示', '请先登录,才可以进入学习').then(() => {
        this.$router.push(`login`)
      })
    }
  }
}
</script>
<style lang="less">
.nav-outer {
  width: 100%;
}

.nav-outer-center {
  width: 100%;
  line-height: 90px;
  font-size: 26px;
  border-bottom: 1px solid #dbdbdb;
  background: url('../../images/space.png') no-repeat;
  background-position: 96% center;
}

.nav-outer-center p {
  margin-left: 46px;
}
</style>
