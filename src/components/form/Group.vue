<template>
  <div class="g-group">
    <div class="title">{{title}}</div>
    <slot/>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['title']
  }
</script>

<style scoped>
.g-group{
  padding: 10px 40px;
}
</style>
