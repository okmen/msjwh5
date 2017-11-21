<template>
  <div class="myBusiness-outer">
    <div class="business-form">
      <div class="form-item">
        <div class="div-select">
          <span v-model="businessType" class="btn-select" @click.stop="businessSelectClick()">{{ businessSelectMassage }}</span>
          <div class="div-select-ul" v-if="businessSelectShow">
            <ul>
              <li v-for="item in businessSelectData" @click.stop="businessSelectClick(item.str, item.id)">{{ item.str }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="div-select">
          <span v-model="businessStatus" class="btn-select" @click.stop="statusSelectClick()">{{ statusSelectMassage }}</span>
          <div class="div-select-ul" v-if="statusSelectShow">
            <ul>
              <li v-for="item in statusSelectData" @click.stop="statusSelectClick(item.str, item.id)">{{ item.str }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-for="business in businessList" class="business-box" 
         :class="{ 'cancel': business.statusStr == '退办',
                   'first-review': business.statusStr == '待初审',
                   'success': business.statusStr == '已制证'||business.statusStr == '审核通过'}">
      <div class="box-header">
        {{ business.businessTitle }}
        <span class="service-status" 
              :class="{ 'cancel': business.statusStr == '退办',
                        'first': business.statusStr == '待初审',
                        'success': business.statusStr == '已制证'||business.statusStr == '审核通过'}">
          {{ business.statusStr }}
        </span>
      </div>
      <div class="box-line" v-if="business.userName">
        姓名: {{ business.userName }}
      </div>
      <div class="box-line" v-if="business.identityCard">
        身份证号: {{ business.identityCard }}
      </div>
      <div class="box-line" v-if="business.applicationTime">
        申请时间: {{ business.applicationTime }}
      </div>
      <div class="box-line" v-if="business.vehicleNumber">
        车辆号码: {{ business.vehicleNumber }}
      </div>
      <div class="box-line">
        受理时间: <span v-if="!business.receptionTime">暂无</span>{{ business.receptionTime }}
      </div>
    </div>
  </div>
</template>
<style lang="less">
  .myBusiness-outer {
    .business-form {
      height: 140px;
      background-color: #fff;
      font-size: 0;
      .form-item {
        font-size: 0.9rem;
        box-sizing: border-box;
        display: inline-block;
        padding: 40px;
        width: 50%;
        ul li {
          height:60px;
          line-height: 60px;
        }
        .btn-select {
          height: 60px;
          color: #2696dd;
        }
      }
    }
    .business-box {
      margin:40px 0;
      background-color: #fff;
      &.first-review {
        border-left: 6px solid #ff7e00;
       }
      &.second-review {
        border-left: 6px solid #ffbe00;
       }
      &.reviewed {
        border-left: 6px solid #09bb07;
       }
      &.cancel{
         border-left: 6px solid #999;
       }
      &.success {
         border-left: 6px solid #09bb07;
       }
       .box-header {
         padding:20px 30px 20px 40px;
         .service-status {
           float:right;
           font-size: 0.9rem;
           &.first {
              color:#ff7e00;
            }
           &.second {
              color:#ffbe00;
            }
           &.over{
              color:#09bb07;
            }
           &.cancel{
              color: #999;
            }
           &.success {
              color: #09bb07;
            }
         }
       }
       .box-line {
         padding-left: 60px;
         font-size: 0.9rem;
         color:#666;
         height: 80px;
         line-height: 80px;
       }
    }
  }
</style>
<script>
  import { bindBusiness } from '../../../config/baseUrl'
  import { resultPost } from '../../../service/getData'
  import { Indicator, Toast } from 'mint-ui'
  export default {
    name: 'myBusiness',
    data () {
      return {
        businessList: [],
        businessSelectShow: false,
        statusSelectShow: false,
        cur_business_id: '0',
        businessType: '0',
        businessSelectMassage: '全部',
        businessSelectData: [
          {
            'id': '0',
            'str': '全部'
          },
          {
            'id': '1',
            'str': '机动车业务'
          },
          {
            'id': '2',
            'str': '驾驶证业务'
          }
        ],
        cur_status_id: '0',
        businessStatus: '0',
        statusSelectMassage: '全部',
        statusSelectData: [
          {
            'id': '0',
            'str': '全部'
          },
          {
            'id': '1',
            'str': '办理中'
          },
          {
            'id': '2',
            'str': '已完结'
          }
        ]
      }
    },
    mounted () {
      Indicator.open()
      let reqData = {
        businessType: this.businessType,
        businessStatus: this.businessStatus,
        identityCard: window.localStorage.getItem('identityCard'),
        sourceOfCertification: 'C'
      }
      resultPost(bindBusiness, reqData).then(json => {
        Indicator.close()
        if (json.code === '0000') {
          this.businessList = json.data
        } else {
          Toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        }
        console.log(this.businessList)
      })
      this.$watch('businessSelectMassage', () => {
        Indicator.open()
      })
      this.$watch('statusSelectMassage', () => {
        Indicator.open()
      })
    },
    methods: {
      businessSelectClick: function (str, id) {
        if (str) {
          this.businessSelectMassage = str
          this.cur_business_id = id
          let reqData = {
            businessType: this.cur_business_id,
            businessStatus: this.cur_status_id,
            identityCard: window.localStorage.getItem('identityCard'),
            sourceOfCertification: 'C'
          }
          console.log(reqData)
          resultPost(bindBusiness, reqData).then(json => {
            this.businessList = json.data
            Indicator.close()
          })
        }
        if (this.businessSelectShow === true) {
          this.businessSelectShow = false
        } else {
          this.businessSelectShow = true
        }
      },
      statusSelectClick: function (str, id) {
        if (str) {
          this.statusSelectMassage = str
          this.cur_status_id = id
          let reqData = {
            businessType: this.cur_business_id,
            businessStatus: this.cur_status_id,
            identityCard: window.localStorage.getItem('identityCard'),
            sourceOfCertification: 'C'
          }
          console.log(reqData)
          resultPost(bindBusiness, reqData).then(json => {
            this.businessList = json.data
            Indicator.close()
          })
        }
        if (this.statusSelectShow === true) {
          this.statusSelectShow = false
        } else {
          this.statusSelectShow = true
        }
      }
    },
    created () {
      document.addEventListener('click', (e) => {
        this.businessSelectShow = false
        this.statusSelectShow = false
      })
    }
  }
</script>
