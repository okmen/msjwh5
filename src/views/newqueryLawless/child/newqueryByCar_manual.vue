<template>
  <div class="newquery">
    <g-select title="车辆类型" :data="licenseSelectData" v-model="vehicleTypeOne" ref="vehicleType"></g-select>
    <plate-number-full v-model="plateNumber"></plate-number-full>
     <g-input title="车架号" v-model="vehicleIdentifyNoLast4" placeholder="请输入车架号"></g-input>
     <Verify title="验证码" v-model="verifyCode" ref="callVerifyByCode"></Verify>
     <g-button class="btnn" text="查询" @click.native="newqueryByCard"></g-button>
     <g-button class="btnn" text="驾驶证查询" @click.native="newqueryByCards"></g-button>
     <p class="hint">温馨提示：可查粤B牌车全国的违法及外地车深圳的违法</p>
  </div>
</template>

<script>
import { GInput, GSelect, GButton } from 'form'
import Verify from '@/components/Verify'
import { queryLawlessByCar } from '@/config/baseURL'
import beforeSubmit from '@/mixins/beforeSubmit'
import PlateNumberFull from '@/components/PlateNumberFull'
export default {
  name: 'newqueryByCar_manual',
  data () {
    return {
      vehicleTypeOne: '02',
      plateNumber: '',
      vehicleIdentifyNoLast4: '',
      verifyCode: '',
      licenseSelectData: [
        {
          value: '01',
          name: '大型汽车'
        },
        {
          value: '02',
          name: '小型汽车'
        },
        {
          value: '03',
          name: '使馆汽车'
        },
        {
          value: '04',
          name: '领馆汽车'
        },
        {
          value: '05',
          name: '境外汽车'
        },
        {
          value: '06',
          name: '外籍汽车'
        },
        {
          value: '07',
          name: '普通摩托车'
        },
        {
          value: '08',
          name: '轻便摩托车'
        },
        {
          value: '09',
          name: '使馆摩托车'
        },
        {
          value: '10',
          name: '领馆摩托车'
        },
        {
          value: '15',
          name: '挂车'
        },
        {
          value: '16',
          name: '教练汽车'
        },
        {
          value: '17',
          name: '教练摩托车'
        },
        {
          value: '18',
          name: '实验汽车'
        },
        {
          value: '19',
          name: '实验摩托车'
        },
        {
          value: '22',
          name: '临时行驶车'
        },
        {
          value: '23',
          name: '警用汽车'
        },
        {
          value: '24',
          name: '警用摩托'
        },
        {
          value: '20',
          name: '临时入境车'
        },
        {
          value: '51',
          name: '新能源大型车'
        },
        {
          value: '52',
          name: '新能源小型车'
        }
      ]
    }
  },
  components: {
    GInput, GSelect, GButton, PlateNumberFull, Verify
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mixins: [beforeSubmit],
  mounted () {
  },
  methods: {
    newqueryByCards () {
      this.$router.push({path: '/newqueryByCard', query: this.queryURL})
    },
    newqueryByCard () {
      let obj = {
        plateNumber: '请输入车牌号码',
        vehicleIdentifyNoLast4: '请输入车架号'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.plateVerification(this.plateNumber)) return
      if (!this.$refs.callVerifyByCode.checkCode()) return
      let newqueryByCardData = {
        car_number: this.plateNumber.substring(1).toLocaleUpperCase(),
        licensePlateNo: this.plateNumber.toLocaleUpperCase(),
        licensePlateType: this.vehicleTypeOne,
        vehicleIdentifyNoLast4: this.vehicleIdentifyNoLast4,
        sourceOfCertification: 'C'
      }
      this.$axios.post(queryLawlessByCar, newqueryByCardData).then(json => {
        if (json.code === '0000') {
          let lawlessData = {
            info: {
              behindTheFrame4Digits: newqueryByCardData.vehicleIdentifyNoLast4,
              plateType: newqueryByCardData.licensePlateType,
              myNumberPlate: newqueryByCardData.licensePlateNo
            },
            data: json.data
          }
          this.$store.commit('saveNewLawlessQuery', lawlessData)
          let login = this.$route.query.type === 'nologin'
          // this.$router.push(`newLawlessMsg?type=query&login=${login}`)
          let source = this.$route.query.source
          this.$router.push({path: '/newLawlessMsg', query: {source: source, type: 'query', login: login}})
        } else {
          this.$toast(json.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .newquery {
    margin-top: 30px;
    .hint {
      padding-left: 40px;
      font-size: 24px;
      color: #666
    }
  }
</style>