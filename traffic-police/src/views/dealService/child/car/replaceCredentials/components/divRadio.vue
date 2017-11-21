<template>
    <div class="radio">
      <div class="radio-item" v-for="(item, index) in thisOpt" @click="selectRadio(index)">
        <div class="radio-circle">
          <div class="radio-point" v-if="item.choose"></div>
        </div>
        <div class="radio-title">{{item.str}}</div>
      </div>
    </div>
</template>
<style lang="less" scoped>
  .radio{
    width: 66%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .radio-item{
      display: flex;
      align-items: center;
    }
    .radio-circle{
      height: 26px;
      width: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid #989898;
      margin-right: 10px;
      .radio-point{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #7e7e7e;
      }
    }
  }
</style>
<script>
  export default {
    props: ['optname'],
    data () {
      return {
        selectedVal: ''
      }
    },
    computed: {
      thisOpt () {
        return this.optname
      }
    },
    watch: {
      thisOpt: {
        handler (val) {
          val.map(item => {
            if (item.choose === true) {
              if (item.id) {
                this.selectedVal = item.id
              } else {
                this.selectedVal = item.str
              }
            }
          })
          this.$emit('getSelected', this.selectedVal)
        },
        deep: true
      }
    },
    methods: {
      selectRadio (index) {
        this.thisOpt.map(item => {
          item.choose = false
        })
        this.thisOpt[index].choose = true
      }
    }
  }
</script>
