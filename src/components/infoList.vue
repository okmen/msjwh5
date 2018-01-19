<template>
<div class="infoList">
  <!-- <slot name="infoList"> -->
    <ul class="freeByCarUl" v-if="resultListShow" v-for="(results, index) in resultList" :key="index">
      <li class="freeByCarLi" v-for="(item, key) in results" :key="key">
        <div class="liDiv-title">{{keyListObj[key]}}</div>
        <div class="liDiv-text">{{key === 'numberPlate' ? plateType[item] : item}}</div>
      </li>
    </ul>
  <!-- </slot> -->
</div>
</template>

<script>
export default {
  name: 'info-list',
  data () {
    return {
      keyListObj: {
        'serialNumber': '流水号',
        'carNumber': '车牌号码',
        'numberPlate': '车牌类型',
        'businessType': '业务类型',
        'carCode': '车辆识别代号',
        'ownerIDcard': '车主身份证号',
        'ownerName': '车主姓名',
        'mainContractNo': '主合同号',
        'mortgageContactNo': '抵押合同号',
        'state': '状态',
        'sourceOfCertification': '录入来源',
        'applyTime': '申办时间'
      }
    }
  },
  props: {
    resultList: {},
    resultListShow: Boolean
  },
  computed: {
    plateType () {
      return this.$store.state.carSelectData
    }
  }
}
</script>

<style scoped lang="less">
.infoList {
  .freeByCarUl{
    display: block;
    width: 90%;
    margin: 30px auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    .freeByCarLi{
      display: flex;
      line-height: 60px;
      justify-content: left;
      border-bottom: 1px solid #ccc;
      vertical-align: middle;
      .liDiv-title{
        text-indent: 20px;
        flex: 1;
      }
      .liDiv-text{
        padding-right: 20px;
        width: 65%;
        word-wrap: break-word;
      }
    }
    .freeByCarLi:last-of-type{
      border-bottom: none;
    }
  }
}
</style>
