<template>
  <div class="dieseDemand-outer">
    <g-select title="申请类型" :data="typelicenseSelectData" v-model="typeMassage"></g-select>
    <plate-number-full v-model="plateNumber"></plate-number-full>
    <g-button text="查询" @click.native="demandClick"></g-button>
  </div>
</template>
<script>
  import { queryInformationCollection } from '@/config/baseURL'
  import PlateNumberFull from '@/components/PlateNumberFull'
  export default {
    name: 'dieseDemand',
    data () {
      return {
        plateNumber: '', // 车牌号码
        typeMassage: '单位车辆',         // 默认车牌类型
        typelicenseSelectData: ['单位车辆', '个人车辆(含挂靠)']
      }
    },
    components: {
      PlateNumberFull
    },
    mounted () {
      this.subFnOne = this.$route.query.subFnOne   // 获取数据
    },
    methods: {
      demandClick: function () {
        if (!this.plateNumber) {
          this.$toast({message: '请输入车牌号码', position: 'bottom', className: 'white'})
        } else {
          this.referFn()
        }
      },
      // 接口查询
      referFn: function () {
        let freeByCarData = {
          licenseNumber: this.plateNumber,      // 车牌号码
          loginUser: window.localStorage.getItem('identityCard'),       // 星级用户身份证
          numberPlate: '02'                      // 车牌种类
        }
        this.$axios.post(queryInformationCollection, freeByCarData).then(json => {
          if (json.code === '0000') {
            let typeMassage = {
              typeMassage: this.typeMassage,
              subFnOne: this.subFnOne
            }
            let num = json.data
            this.$router.push({path: 'dieseInquire', query: { myNumberPlate: JSON.stringify(num), typeMassage: JSON.stringify(typeMassage), ...this.queryURL }})
          } else {
            this.$toast({message: json.msg, position: 'bottom', className: 'white'})
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .dieseDemand-outer {
    padding: 40px 0 40px 0;
  }
</style>
