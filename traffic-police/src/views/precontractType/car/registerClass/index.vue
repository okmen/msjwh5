<template>
  <div class="register-class">
    <div class="form-template-item">
      <span class="form-template-item-left">业务类型</span>
      <div class="form-template-item-type ellipsis">{{currentBusinessType}}</div>
    </div>
    <div class="exchange-license-line"></div>
    <router-view :businessTypeId="businessTypeId" :achieveCode="achieveCode"></router-view>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<style lang="less" scoped>
  .register-class > div {
    margin: 0 40px 30px;
  }
  .form-template-item-type {
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    outline: none;
    height: 70px;
    font-size: 30px;
    padding-left: 15px;
    line-height: 70px;
    width: 68%;
  }

  .register-class {
    height: auto;
    background: white;
    position: relative;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .register-class .exchange-license-line {
    height: 10px;
    background: #eeeeee;
    margin-left: 0;
    margin-right: 0;
  }
</style>
<script>
  import {resultPost} from 'service/getData'
  import {MessageBox} from 'mint-ui'
  import {getPageInit} from 'config/baseUrl.js'
  export default {
    data () {
      return {
        achieveCode: '',
        currentBusinessType: '',
        businessType: {
          'transferRegistration': '转移登记(市内过户)',
          'intoRegister': '机动车转移登记(转入)',
          'enteringRegister': '机动车注册登记',
          'cancellationRegister': '机动车注销登记',
//          'changeRegister': '机动车变更登记',
          'generalChangeRegister': '机动车变更登记(普通变更)',
          'fakeLicensedEvidence': '机动车变更登记(套牌车换证)',
          'manWifeChange': '机动车变更登记(夫妻变更)'
//          'replaceLicense': '补换领机动车行驶证'
        },
        businessTypeStr: '',
        businessTypeToCode: {
          'transferRegistration': 'JD15',
          'intoRegister': 'JD19',
          'enteringRegister': 'JD17',
          'cancellationRegister': 'JD18',
//          'changeRegister': 'JD47',
          'fakeLicensedEvidence': 'JD36',
          'manWifeChange': 'JD35',
//          'replaceLicense': 'JD01',
          'generalChangeRegister': 'JD24'
        }
      }
    },
    created () {
      this.getBusinessTypeId()
    },
    computed: {
      businessTypeId () {
        return this.$route.query.id
      }
    },
    watch: {
      '$route': 'getBusinessTypeId'
    },
    components: {
      divSelect: require('components/divSelect.vue')
    },
    methods: {
      getBusinessTypeId () {
        this.businessTypeId = ''
        this.currentBusinessType = this.businessType[this.$route.name]
        this.achieveCode = this.businessTypeToCode[this.$route.name]
        resultPost(getPageInit, {businessTypeId: this.businessTypeId, type: 1}).then(json => {
          console.log(json, '页面初始化的数据')
          if (json.code === '0000') {
            for (let i in json.data.orgVOs) {
              json.data.orgVOs[i].description = json.data.orgVOs[i].description.replace(/<(?!\/?img.+?>)[^<>]*>/gi, '')
            }
            this.$store.commit('saveModelOfCar', json.data.carModelArray) // 车辆型号
            this.$store.commit('saveCarSelectData', json.data.carTypeVOs) // 车辆类型
            this.$store.commit('saveCredentialsName', json.data.idTypeVOs) // 证件名称
            this.$store.commit('savePointerType', json.data.indexTypeVos) // 指标类型
            this.$store.commit('saveAppointmentLocation', json.data.orgVOs) // 预约地点
            this.$store.commit('saveUseNature', json.data.useCharaters) // 预约地点
          } else {
            MessageBox('提示', json.msg)
          }
        })
      }
    }
  }
</script>
