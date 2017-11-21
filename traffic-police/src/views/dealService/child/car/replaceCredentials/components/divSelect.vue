<template>
  <div class="replace-select">
    <div class="select-title">{{thisInfo.title}}</div>
    <div  class="selected-value"   @click.stop="showSelectUl">{{currentVal}}</div>
    <div class="div-select-ul" v-show="showUl">
      <ul>
        <li v-for="(item, index) in thisInfo.option" @click="selectedValue(item, index)">{{item.str}}</li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .replace-select{
    height: 65px;
    display: flex;
    justify-content: space-between;
    border: none;
    position: relative;
    line-height: 65px;
    .select-title{
        width: 33%;
    }
    .selected-value{
      width: 66%;
      padding-left: 10px;
      border: 2px solid #eee;
      border-radius: 8px;
      line-height: 65px;
      font-size: 30px;
      background: white url("../../../../../../images/select1.png") 95% center/22px 13px no-repeat;
    }
    .div-select-ul{
      position: absolute;
      top: 65px;
      right: 0;
      background: white;
      width: 66%;
      padding-left: 20px;
      border: 2px solid #eee;
      z-index: 999;
      max-height: 400px;
      overflow: auto;
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        showUl: false,
        currentId: '',
        currentVal: ''
      }
    },
    props: ['childInfo', 'defaultVal'],
    computed: {
      thisInfo () {
        return this.childInfo
      }
    },
    watch: {
      defaultVal (val) {
        this.currentVal = val
      }
    },
    methods: {
      selectedValue (item, index) {
        this.currentVal = item.str
        if (item.id) {
          this.currentId = item.id
          this.$emit('getSelected', this.currentId, index, this.currentVal)
        } else {
          this.currentId = item.str
          this.$emit('getSelected', this.currentId, index, this.currentVal)
        }
        this.showUl = false
      },
      showSelectUl () {
        let selectUl = document.getElementsByClassName('div-select-ul')
        Array.prototype.slice.call(selectUl).map(item => {
          item.style.display = 'none'
        })
        this.showUl = !this.showUl
      },
      disappearSelectUl () {
        this.showUl = false
      }
    },
    mounted () {
      this.currentVal = this.defaultVal
      document.getElementById('app').addEventListener('click', this.disappearSelectUl)
    },
    destroyed () {
      document.getElementById('app').removeEventListener('click', this.disappearSelectUl)
    }
  }
</script>
