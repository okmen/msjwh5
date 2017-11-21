
<template>
  <div class="form-temp placeExamineDemand-success" >
    <div class="placeExamineDemand-success-content" v-for="(value, index) in dataInfo">
      <div class="item" v-for="(val, key) in value" v-if="keyListObj[key]">
        <span class="bid-item-key">{{ keyListObj[key] }}</span>
          ：<span :class="{red: key === 'SBZT'}" >{{ valListObj[key] ? valListObj[key][val] : val }}</span>
      </div>
    </div>  
  </div>
</template>

<script>
  import { resultPost } from 'service/getData'
  import { Toast } from 'mint-ui'
  import { inspectionDeclarationQuery } from 'config/baseUrl'
  export default {
    name: 'placeExamineDemand',
    // 获取数据
    data () {
      return {
        dataInfo: '',
        keyListObj: {
          HPHM: '车牌号码',
          HPZL: '车牌类型',
          CLSYQ: '车辆所有权',
          SYR: '使用人',
          SFZMHM: '车主身份证',
          STJG: '受托机构',
          // LSH: '流水号',
          LRZHLX: '申报方式',
          YJ_SJRXM: '收件人名字',
          YJ_LXDH: '收件人联系电话',
          YJ_TDDZ: '收件人地址',
          SQSJ: '申请时间',
          SBZT: '审核状态',
          FKFS: '付款方式'
        },
        valListObj: {
          CLSYQ: {
            '0': '个人',
            '1': '单位'
          },
          LRZHLX: {
            'A': '移动APP',
            'C': '微信',
            'Z': '支付宝',
            'E': '邮政'
          },
          SBZT: {
            '0': '待审',
            '1': '初审',
            '2': '复核',
            '3': '通知书已接收',
            '4': '快递已寄出',
            'CT': '车管申办失败',
            'YT': '邮政申办失败',
            'QT': '个人取消申请',
            'QQ': '群众业务退办',
            'CC': '车管业务退办'
          },
          FKFS: {
            '0': '到付',
            '1': '已付款'
          },
          HPZL: {
            '02': '蓝牌',
            '01': '黄牌',
            '06': '黑牌'
          }
        }
      }
    },
    methods: {
      cancelReverse () {
        let requestData = {
          proposerIdentityCard: window.localStorage.getItem('identityCard'),
          sourceOfCertification: window.localStorage.getItem('sourceOfCertification')
        }
        resultPost(inspectionDeclarationQuery, requestData).then(json => {
          if (json.code === '0000') {
            // this.dataInfo = JSON.parse(json.data).ROW
            this.dataInfo = JSON.parse(json.data)
            console.log(this.dataInfo)
          } else {
            Toast({message: json.msg, position: 'bottom', className: 'white'})
          }
        })
      }
    },
    mounted () {
      this.cancelReverse()
    }
  }
</script>

<style lang="less">
  .form-temp{
    width: 94%;
    margin: 30px auto;
  }
  .cancel-btn{
    background: #ccc!important;
    color: #fff!important;
  }
  .placeExamineDemand-success-content{
    border:2px solid #ccc;
    border-radius: 8px;
    margin-top: 30px;
    .item{
      height:80px;
      font-size: 32px;
      line-height: 80px;
      padding-left: 20px;
      .red{
        color: red;
      }
    }
  }
  .exempTu{
    margin-top:60px !important;
  }
</style>
