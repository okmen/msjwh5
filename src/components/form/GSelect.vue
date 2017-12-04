<template>
  <div class="g-select">
    <div class="g-select-title">{{title}}</div>
    <div class="g-select-value" @click.stop="showSelectUl">
      {{currentName}}
      <ul class="g-select-list" v-show="showUl">
        <li class="list-item" v-for="(item, index) in data" :key="index" @click.stop="selectedValue(item, index)">{{item instanceof Object ? item.name : item}}</li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .g-select{
    display: flex;
    padding:10px 40px;
    box-sizing: border-box;
    align-items: center;
    .g-select-title{
      width: 30%;
    }
    .g-select-value{
      /*width: 70%;*/
      flex: 1;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      height: 56px;
      font-size: 30px;
      padding-left: 20px;
      line-height: 56px;
      position: relative;
      background: white url("../../assets/images/select1.png") 95% center/22px 13px no-repeat;
    }
    .g-select-list {
      position: absolute;
      top: 60px;
      right: 0;
      background: white;
      width: 100%;
      padding-left: 20px;
      border: 2px solid #eee;
      line-height: 55px;
      z-index: 999;
      max-height: 400px;
      overflow: auto;
      .list-item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        showUl: false,   // 显示下拉框的参数
        currentId: '',   // 返回父组件的值
        currentVal: '',
        currentName: ''
      }
    },
    props: ['data', 'title', 'value'],  // childInfo: 父组件传进来的值， defaultVal：默认值
    created () {
      for (let i = 0, len = this.data.length; i < len; i++) {
        if (this.data[i] instanceof Object) {
          if (this.data[i].value === this.value) {
            this.currentName = this.data[i].name
            break
          }
        } else {
          this.currentVal = this.value
          this.currentName = this.value
        }
      }
    },
    watch: {
      currentVal (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentVal = val
      }
    },
    methods: {
      selectedValue (item, index) { // 点击下拉框的某一项
        if (item instanceof Object) {
          this.currentVal = item.value
          this.currentName = item.name
        } else {
          this.currentVal = item
          this.currentName = item
        }
        this.showUl = false
      },
      showSelectUl () {
        this.$nextTick(() => {
          let selectUl = document.getElementsByClassName('g-select-list')
          Array.prototype.slice.call(selectUl).map(item => {
            item.style.display = 'none'
          })
          this.showUl = !this.showUl
        })
      },
      disappearSelectUl () {
        this.showUl = false
      }
    },
    mounted () {
      document.getElementById('app').addEventListener('click', this.disappearSelectUl)
      // if (!this.defaultVal && this.childInfo.option[0]) {       // 如果父组件没有传入默认显示值，则传入的对象中的第一项作为默认选项
      //   this.selectedValue(this.childInfo.option[0])
      // }
    },
    destroyed () {
      document.getElementById('app').removeEventListener('click', this.disappearSelectUl)
    }
  }
</script>
