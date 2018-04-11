<!--
  描述：绿色出行-查询结果【暂时废弃】
  时间：2017-07-20
  作者：猪不乐意
  联系：914230482
-->
<template>
  <div class="m-greenItem">
    <div class="item">
      <div class="title">爽约信息</div>
      <div class="box">
        <ul>
          <li><span class="l">申请编号</span><span class="r">123123123</span></li>
          <li><span class="l">申请编号</span><span class="r">123123123</span></li>
          <li><span class="l">申请编号</span><span class="r">123123123</span></li>
          <li><span class="l">申请编号</span><span class="r">123123123</span></li>
          <li><span class="l">申请编号</span><span class="r">123123123</span></li>
          <li><span class="l">申请编号</span><span class="r">123123123</span></li>
        </ul>
        <div class="btnbox">
          <el-button type="primary">爽约申诉</el-button>
          <el-button type="primary">查看图片</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from 'element-ui'
export default {
  components: {
    'el-button': Button
  }
}
</script>

<style lang="less">
@import 'style/greenTravel.less';
</style>
