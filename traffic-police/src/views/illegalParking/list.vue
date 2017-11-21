<template>
  <div>
    <dl class="wtmf-item" v-for="item in listData" v-if="listData.length > 0">
      <dt>十分钟违停免罚申请</dt>
      <dd>姓名：{{ username }}</dd>
      <dd>车辆号码：{{ item.numberPlateNumber }}</dd>
      <dd>申请时间：{{ item.reportTime }}</dd>
      <dd v-if="item.state === '2'">不通过原因：{{ item.parkingReason === 'null' ? '暂无' : item.parkingReason }}</dd>
      <div v-if="item.state === '1'">温馨提示：请您遵守相关交通法规</div>
      <dd :class="`status status${item.state}`">{{ stateText[item.state] }}</dd>
    </dl>
    <div v-if="listData.length === 0" class="wtmf-noData">没有查询到记录</div>
  </div>
</template>

<script>
import { queryReportingNoParking } from 'src/config/baseUrl'
import { resultPost } from 'src/service/getData'
export default {
  data () {
    return {
      username: window.localStorage.getItem('userName'),
      stateText: {
        '0': '未处理',
        '1': '已处理免罚',
        '2': '已处理未免罚'
      },
      listData: []
    }
  },
  created () {
    resultPost(queryReportingNoParking, {
      numberPlateNumber: this.$route.query.number,
      plateType: this.$route.query.type,
      sourceOfCertification: 'C'
    }).then(data => {
      if (data.code === '0000') {
        this.listData = data.data
      } else {
        console.log(data.msg)
      }
    })
  }
}
</script>

<style scoped lang="css">
.wtmf-item{
  position: relative;
  background: #fff; padding: 20px; margin-bottom: 10px; line-height: 1.4;
}
.wtmf-item dt, .wtmf-item dd{ color: #666; }
.wtmf-item dt{ font-size: 120%; }
.wtmf-item .status{ position: absolute; top: 20px; right: 20px; font-size: 120%; }
.wtmf-item .status0,.wtmf-item .status2{ color: #F2B02D; }
.wtmf-item .status1{ color: #1FB922; }
.wtmf-noData{ line-height: 3; text-align: center; }
</style>