<template>
<div class="selectTip-outer">
  <div class="selectTip-content">
    <p>{{tipsText}}</p>
    <div class="selectTip-btns">
      <div class="selectTip-confirm-btn btn-center" @click.stop="btnConfirmClick()">是的</div>
      <div class="selectTip-cancle-btn btn-center" @click.stop="btnCancleClick()">取消</div>
    </div>
  </div>
</div>
</template>

<script>
export default{
  props: ['tipsText'],
  methods: {
    btnConfirmClick: function () {
      this.$emit('confirm')
    },
    btnCancleClick: function () {
      this.$emit('cancle')
    }
  }
}
</script>

<style lang="less">
.selectTip-outer{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 666;
  background-color: rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .selectTip-content{
    width: 65%;
    min-height: 300px;
    padding-bottom: 130px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 8px;
    position: relative;
    p{
      margin-top: 90px;
      color: #2696dd;
      font-size: 34px;
      font-weight: bold;
      text-align: center;
    }
  }
  .selectTip-btns{
    display: flex;
    justify-content: space-around;
    width: 85%;
    margin: 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 26px;
    line-height: 80px;
    text-align: center;
    .btn-center{
      width: 183px;
      height: 80px;
      border-radius: 8px;
      box-sizing: border-box;
    }
    .selectTip-confirm-btn{
      background: #09bb07;
      color: #fff;
    }
    .selectTip-cancle-btn{
      background: #fff;
      border: 1px solid #09bb07;
      color: #09bb07;
    }
  }
}
</style>