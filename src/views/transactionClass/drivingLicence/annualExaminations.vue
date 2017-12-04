<template>
<div class="annual-examinations">
  <g-input title="姓名" v-model="userName" placeholder="请输入姓名" disabled></g-input>
</div>
</template>

<script>
  import {GInput} from 'form'
  export default {
    data () {
      return {
        userName: ''
      }
    },
    components: {
      GInput
    }
  }
</script>

<style scoped>

</style>
