<!-- 查询进度结果 -->
<template lang="html">
  <section class="queryResult" :class="[getClassName]">
    <h3 class="title" v-if="data.businessTitle">{{data.businessTitle}}</h3>
    <span class="status">{{data.statusStr}}</span>
    <p v-if="data.userName">姓名：{{data.userName}}</p>
    <p v-if="data.identityCard">身份证号：{{data.identityCard}}</p>
    <p v-if="data.applicationTime">申请时间：{{data.applicationTime}}</p>
    <p v-if="data.vehicleNumber">车辆号码：{{data.vehicleNumber}}</p>
    <p>受理时间：{{data.receptionTime ? data.receptionTime : '暂无'}}</p>
  </section>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    getClassName: function () {
      let className = ''
      switch (this.data.statusStr) {
        case '待初审': // 待初审
          className = 'trial'
          break
        case '退办': // 退办
          className = 'reject'
          break
        case '已制证': // 已制证
        case '审核通过': // 审核通过
          className = 'success'
          break
      }
      return className
    }
  }
}
</script>

<style lang="less">
.queryResult{
  border-left: 6px solid #999;
  padding: 20px 31px 20px 42px;
  box-sizing: border-box;
  position: relative;
  background: #fff;
  .title{
    font-size: 28px;
    color: #000;
    margin-bottom: 25px;
  }
  .status{
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 24px;
    color: #999;
  }
  &.trial{
    border-color: #ff7e00;
    .status{color: #ff7e00;}
  }
  &.reject{
    border-color: #999;
    .status{color: #999;}
  }
  &.success{
    border-color: #09bb07;
    .status{color: #09bb07;}
  }
  p{
    font-size: 24px;
    line-height: 50px;
    padding-left: 14px;
    color: #666;
  }
}
</style>
