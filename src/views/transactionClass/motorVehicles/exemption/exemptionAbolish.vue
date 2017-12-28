<template>
  <div class="exemptionAbolish-success">
    <div class="exemptionAbolish-success-content">
      <div class="item" v-for="(value, key) in dataInfo" :key="key" v-if="keyListObj[key]">
        <span class="bid-item-key">{{ keyListObj[key] }}</span>
        ：<span >{{ valListObj[key] ? valListObj[key][value] : value }}</span>
      </div>
    </div>
    <g-button text="取消预约" @click.native="cancelReverse" v-if="this.dataInfo.yyzt == 1"></g-button>
    <g-button text="取消预约" v-else type="gray"></g-button>
  </div>
</template>

<script>
  import {GButton} from 'form'
  import axios from '@/utils/axios'
  import { MessageBox } from 'mint-ui'
  import { cancelVehicleInspection } from '@/config/baseURL.js'
  export default {
    name: 'exemptionAbolish',
    computed: {
    },
    // 获取数据
    data () {
      return {
        dataInfo: {},
        keyListObj: {
          yyh: '预约编号',
          organization: '受理单位名称',
          businessType: '业务类型名称',
          xm: '姓名',
          cphm: '车牌号码',
          personType: '人员类型',
          driveLicenseNumber: '行驶证编号',
          postCode: '邮政编码',
          recipientsName: '收件人',
          recipientsMobile: '收件人电话',
          postAddr: '收件人地址',
          appointmentTime: '申请时间',
          sjhm: '手机号码',
          telno: '固定电话',
          bxsxrq: '保险生效日期',
          terminationDate: '保险终止日期',
          slgzfs: '受理告知方式',
          cjrq: '创建日期',
          yyzt: '预约状态',
          shzt: '审核状态',
          slyjnr: '受理意见内容',
          shjg: '审核结果'
        },
        valListObj: {
          yyzt: {
            '1': '预约中',
            '2': '预约完成',
            '3': '失约',
            '4': '预约取消'
          },
          shzt: {
            '0': '待审核',
            '2': '已审核'
          },
          personType: {
            '1': '机动车所有人',
            '2': '代理人'
          },
          slgzfs: {
            '1': '互联网查询',
            '2': '短信告知',
            '3': '非移动电话告知'
          },
          shjg: {
            '1': '同意',
            '0': '不同意'
          }
        }
      }
    },
    components: {
      GButton
    },
    methods: {
      // 取消预约
      /*eslint-disable*/
      cancelReverse () {
        MessageBox.confirm('确定取消预约?').then(action => {
          let requestData = {
            bookNumber: this.dataInfo.yyh,
            numberPlate: this.dataInfo.cphm
          }
          axios.post(cancelVehicleInspection, requestData).then(json => {
            if (json.code === '0000') {
              this.$MessageBox.alert('取消预约成功').then(action => {
                this.$router.push({ path: '/dealService', query: this.$store.getters.queryURL })
              })
            } else {
              this.$MessageBox.alert(json.msg).then(action => {
                this.$router.push({ path: '/dealService', query: this.$store.getters.queryURL })
              })
            }
          })
        }).catch(() => {})
      },
      urlToJson: function (url) {
        if (!url.split('?')[1]) {
          return false
        }
        let urlJson = {}
        let arr = url.split('?')[1].split('&')
        arr.map(item => {
          urlJson[item.split('=')[0]] = decodeURIComponent  (item.split('=')[1])
        })
        return urlJson
      }
    },
    mounted () {
      this.dataInfo = this.urlToJson(window.location.href)
      console.log(this.dataInfo)
    }
  }
</script>

<style lang="less" scoped>
  .exemptionAbolish-success{
    padding: 20px 40px 40px;
    .g-button {
      padding: 0;
    }
  }
  .exemptionAbolish-success-content{
    border:2px solid #ccc;
    border-radius: 8px;
    .item{
      // height:80px;
      font-size: 32px;
      line-height: 80px;
      padding-left: 20px;
    }
  }
</style>
