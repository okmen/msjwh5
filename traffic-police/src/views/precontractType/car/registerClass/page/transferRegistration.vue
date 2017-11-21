<template>
  <common :businessTypeId="businessTypeId" :achieveCode="achieveCode"></common>
</template>

<script>
  export default {
    props: ['businessTypeId', 'achieveCode'],
    components: {
      common: require('../components/hasTarget.vue')
    }
  }
</script>
