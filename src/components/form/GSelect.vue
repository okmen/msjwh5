<!--
  props
  value：使用v-model绑定
  title: 左边的标题
  data：为数组，下拉的选项，数组的每一项为字符串或者对象 ,[{name: 'hello', value: '01'}]
-->
<template>
  <div class="g-select" :class="{ disabled: disabled, 'filled': classType === 'filled' }">
    <!--<div class="g-select-type" v-if="type">{{type}}</div>-->
    <div class="g-select-title" v-if="title">{{title}}</div>
    <div class="g-select-value" :class="{'center': center}" @click.stop="showSelectUl()">
      <span :class="{'placeholder': !currentName}">{{currentName || placeholder}}</span>
      <ul class="g-select-list" v-show="showUl">
        <li class="list-item" v-for="(item, index) in data" :key="index" @click.stop="selectedValue(item, index)">{{item instanceof Object ? item.name : item}}</li>
      </ul>
    </div>
  </div>
</template>

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
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      title: String,
      value: [String, Number],
      type: String,
      placeholder: String,
      disabled: Boolean,
      classType: String,
      center: Boolean
    },
    created () {
      this.init()
    },
    watch: {
      currentVal (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentVal = val
      },
      data () {
        this.init()
      }
    },
    methods: {
      init () {
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
      selectedValue (item, index) { // 点击下拉框的某一项
        if (item instanceof Object) {
          this.currentVal = item.value
          this.currentName = item.name
          this.$emit('getSelected', index)
        } else {
          this.currentVal = item
          this.currentName = item
        }
        this.showUl = false
      },
      showSelectUl () {
        if (this.disabled) {
          return false
        }
        let selectUl = document.getElementsByClassName('g-select-list')
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
      document.getElementById('app').addEventListener('click', this.disappearSelectUl)
    },
    destroyed () {
      document.getElementById('app').removeEventListener('click', this.disappearSelectUl)
    }
  }
</script>

<style lang="less">
  .g-select{
    display: flex;
    padding:10px 40px;
    box-sizing: border-box;
    align-items: center;
    .g-select-title{
      width: 30%;
    }
    .placeholder{
      color: #868686;
    }
    .g-select-value{
      width: 70%;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      height: 56px;
      font-size: 30px;
      line-height: 56px;
      padding-left: 20px;
      position: relative;
      background: white url("../../assets/images/select1.png") 95% center/22px 13px no-repeat;
      span{
        display: block;
        width: 90%;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .g-select-list {
      position: absolute;
      top: 60px;
      right: 0;
      background: white;
      width: 100%;
      border: 2px solid #eee;
      line-height: 55px;
      z-index: 999;
      max-height: 400px;
      overflow: auto;
      .list-item {
        padding-left: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .g-select.disabled {
    .g-select-value {
      background: #efeff4;
    }
    .center {
      text-align: center;
      padding-left: 0;
    }
  }
  .filled {
    flex-wrap: wrap;
    .g-select-title{
      width: 100%;
      margin-bottom: 20px;
    }
    .g-select-value {
      width: 100%;
    }
  }
</style>
