<template>
  <div class="dieselEngineTrucksDemand">
   <mt-cell class="dieCall" title="审核进度查询" @click.native="subFnOne" is-link></mt-cell>
   <!-- <mt-cell title="电子通行证" to="dieseDemand" is-link></mt-cell> -->
   <mt-cell title="RFID电子通行证资料查询" @click.native="subFnTwo" is-link></mt-cell>
  </div>
</template>

<script>
export default {
  name: 'dieselEngineTrucksDemand',

  data () {
    return {
    }
  },
  methods: {
    subFnOne: function () {
      this.$router.push({path: 'dieseDemand', query: { subFnOne: '1' }})
    },
    subFnTwo: function () {
      this.$router.push({path: 'dieseDemand', query: { subFnOne: '2' }})
    }
  }
}
</script>

<style lang="less">
.dieselEngineTrucksDemand{
  .mint-cell-wrapper{
    border-bottom: 1px solid #ccc;
  }
}
</style>
