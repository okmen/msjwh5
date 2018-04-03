<template>
  <div class="bindCar">
    <div class="bindCar-head">
      <div class="bindCar-car" :class="{'click-color':currentClick}" @click="bindCalick(true)">本人车辆</div>
      <div class="xian"></div>
      <div class="bindCar-car" :class="{'click-color':!currentClick}" @click="bindCalick(false)">他人车辆</div>
    </div>
    <div class="bindCar-nav">
      <mt-cell v-if="currentClick" v-for="(item, index) in selfData" :title="item.myNumberPlate" key="index" @click.native="carFn(item.myNumberPlate)" is-link></mt-cell>
      <mt-cell v-if="!currentClick" v-for="(item, index) in othersData" :title="item.myNumberPlate" key="index" @click.native="carFn(item.myNumberPlate)" is-link></mt-cell>
    </div>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
export default {

  name: 'bindCar',

  data () {
    return {
      currentClick: true,
      selfData: [],    // 本人车辆
      othersData: []    // 他人车辆
    }
  },
  components: {
    Cell
  },
  methods: {
    bindCalick (str) {
      this.currentClick = str
    },
    init () {
      let cars = this.$store.state.user.cars
      cars.map((item) => {
        if (+item.isMySelf === 0) {
          this.selfData.push({myNumberPlate: item.myNumberPlate})
        }
        if (+item.isMySelf === 1) {
          this.othersData.push({myNumberPlate: item.myNumberPlate})
        }
      })
    },
    carFn (item) {
      let mobilePhone = this.$store.state.user.mobilePhone
      let userName = this.$store.state.user.userName
      window.location.href = `http://m.yjysos.com/thr/save?phone=${mobilePhone}&contact=${userName}&car_no=${item}`
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .bindCar {
    .bindCar-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      .bindCar-car {
        width: 50%;
        line-height: 100px;
        text-align: center;
      }
      .click-color {
        color:#127ede;
        border-bottom: 4px solid #2696dd;
      }
      .xian{
        justify-content: space-between;
        width: 3px;
        height: 75px;
        background: #dbdbdb; 
      }
    }
    .bindCar-nav {
      .mint-cell {
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>