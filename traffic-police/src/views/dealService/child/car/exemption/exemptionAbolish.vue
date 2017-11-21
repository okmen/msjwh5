<template>
  <div class="form-template exemptionAbolish-success">
    <div class="exemptionAbolish-success-content">
      <div class="item" v-for="(value, key) in dataInfo" v-if="keyListObj[key]">
        <span class="bid-item-key">{{ keyListObj[key] }}</span>
        ：<span >{{ valListObj[key] ? valListObj[key][value] : value }}</span>
      </div>
    </div>
    <div class="form-template-submit exempTu " @click="cancelReverse" v-if="this.dataInfo.bookState == 1 ">取消预约</div>
    <div class="form-template-submit exempTu cancel-btn" v-else>取消预约</div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>

<script>
  import { resultPost } from 'service/getData'
  import { MessageBox } from 'mint-ui'
  import { cancelVehicleInspection } from 'config/baseUrl'
  export default {
    name: 'exemptionAbolish',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    components: {
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    // 获取数据
    data () {
      return {
        dataInfo: {},
        keyListObj: {
          bookNumber: '预约编号',
          organizationName: '受理单位名称',
          businessTypeName: '业务类型名称',
          name: '姓名',
          platNumber: '车牌号码',
          personType: '人员类型',
          driveLicenseNumber: '行驶证编号',
          postCode: '邮政编码',
          recipientsName: '收件人',
          recipientsMobile: '收件人电话',
          appointmentTime: '申请时间',
          mobile: '手机号码',
          telno: '固定电话',
          effectiveDate: '保险生效日期',
          terminationDate: '保险终止日期',
          inform: '受理告知方式',
          createDate: '创建日期',
          bookState: '预约状态',
          approveState: '审核状态',
          approveInfo: '受理意见内容',
          approveFlag: '审核结果'
        },
        valListObj: {
          bookState: {
            '1': '预约中',
            '2': '预约完成',
            '3': '失约',
            '4': '预约取消'
          },
          approveState: {
            '0': '待审核',
            '2': '已审核'
          },
          personType: {
            '1': '机动车所有人',
            '2': '代理人'
          },
          inform: {
            '1': '互联网查询'
          },
          approveFlag: {
            '1': '同意',
            '0': '不同意'
          }
        }
      }
    },
    methods: {
      // 取消预约
      /*eslint-disable*/
      cancelReverse () {
        console.log(this.dataInfo)
        MessageBox.confirm('确定取消预约?').then(action => {
          let requestData = {
            bookNumber: this.dataInfo.bookNumber,
            numberPlate: this.dataInfo.platNumber
          }
          resultPost(cancelVehicleInspection, requestData).then(json => {
            console.log(json, '预约信息')
            MessageBox.alert(json.msg).then(action => {
              this.$router.push('/')
            });
          })
        })
      }
    },
    mounted () {
      let myNumberPlate = this.$route.query.myNumberPlate   // 获取数据
      this.dataInfo = myNumberPlate
    }
  }
</script>

<style lang="less">
  .exemptionAbolish-success{
    .tp-bottom{
      margin-top: 28px;
    }
  }
  .cancel-btn{
    background: #ccc!important;
    color: #fff!important;
  }
  .exemptionAbolish-success-content{
    border:2px solid #ccc;
    border-radius: 8px;
    .item{
      height:80px;
      font-size: 32px;
      line-height: 80px;
      padding-left: 20px;
    }
  }
  .exempTu{
    margin-top:60px !important;
  }
</style>
