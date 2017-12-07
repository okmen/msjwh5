<template>
    <div class="g-radio">
      <div class="g-radio-title">
        {{title}}
      </div>
      <div class="g-radio-item" v-for="(item, index) in data" @click="selectRadio(index)">
        <div class="g-radio-circle">
          <div class="g-radio-point" v-if="item.choose"></div>
        </div>
        <div class="g-radio-name">{{item.name}}</div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'g-radio',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      title: String,
      value: [String, Number]
    },
    data () {
      return {
        selectedVal: ''
      }
    },
    computed: {
      thisOpt () {
        return this.data
      }
    },
    watch: {
      selectedVal (val) {
        this.$emit('input', val)
      },
      thisOpt: {
        handler (val) {
          val.map(item => {
            if (item.choose === true) {
              this.selectedVal = item.value
            }
          })
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

<style lang="less" scoped>
  .g-radio{
    display: flex;
    padding:10px 40px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    .g-radio-title{
      flex: 1;
    }
    .g-radio-item{
      display: flex;
      width: 25%;
      align-items: center;
    }
    .g-radio-circle{
      height: 26px;
      width: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid #989898;
      margin-right: 10px;
      .g-radio-point{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #7e7e7e;
      }
    }
  }
</style>
