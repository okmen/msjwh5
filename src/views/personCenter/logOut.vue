<template>
<div class="log-out">
  <g-button text="退出登录" @click.native="handleLogout"></g-button>
</div>
</template>

<script>
  import {GButton} from 'form'
  import { token, msjwURL } from '@/config/msjw.config'
  export default {
    name: 'log-out',
    components: {
      GButton
    },
    computed: {
      openid () {
        return window.localStorage.getItem('openid')
      }
    },
    methods: {
      handleLogout () {
        let nAxios = this.$axios.create({
          headers: {
            'Content-Type': 'application/json'
          }
        })
        nAxios.post(`${msjwURL}/govnetUserAuthProvider/services/userCenter/logout`, {
          openid: this.openid,
          token: token
        }).then(data => {
          if (data.data.code === '200') {
            window.location.reload()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
