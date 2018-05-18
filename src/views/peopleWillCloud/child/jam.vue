<template>
  <div class="jam-outer">
    <div class="jam-form">
      <g-input class="address" title="地点" v-model="showAdd" placeholder="点击右侧按钮选择地址" readonly>
        <div slot="mark" class="common-list-location" @click.stop='getLocation()'></div>
      </g-input>
      <g-date-picker title="开始时间" timeSelect v-model="effectiveDate"></g-date-picker>
      <g-date-picker title="结束时间" timeSelect v-model="terminationDate"></g-date-picker>
      <g-select title="方向" :data="directionData" v-model="directionDataOne" ref="directionDataStr"></g-select>
      <g-select title="拥堵类型" :data="congestionTypeData" v-model="congestionTypeDataOne" ref="congestionTypeDataStr"></g-select>
      <g-select title="拥堵等级" :data="congestionGradeData" v-model="congestionGradeDataOne" ref="congestionGradeDataStr"></g-select>
      <g-select title="道路服务水平" :data="roadServiceLevelData" v-model="roadServiceLevelDataOne" ref="roadServiceLevelDataStr"></g-select>
      <g-select title="拥堵成因" :data="congestionReasonData" v-model="congestionReasonDataOne" ref="congestionReasonDataStr"></g-select>
      <g-textarea title="改善建议" v-model="improveAdvice" :maxlength="100" placeholder="请填写改善建议"></g-textarea>
      <g-button text="提交" @click.native="submit"></g-button>
    </div>
  </div>
</template>
<script>
import { jam } from '@/config/baseURL'
import { Indicator } from 'mint-ui'
import { GTextarea } from 'form'
export default {
  name: 'jam',
  data () {
    return {
      address: '',
      startTime: '',
      endTime: '',
      // 方向
      directionData: [ '东', '南', '西', '北' ],
      directionDataOne: '东',
      directionShow: false,
      // 拥堵类型
      congestionTypeData: [
        {
          value: 1001,
          name: '偶发性拥堵'
        },
        {
          value: 1002,
          name: '常态化拥堵'
        }
      ],
      congestionTypeDataOne: 1001,
      // 拥堵等级
      congestionGradeData: [
        {
          value: 1001,
          name: '缓行'
        },
        {
          value: 1002,
          name: '较拥堵'
        },
        {
          value: 1003,
          name: '拥堵'
        }
      ],
      congestionGradeDataOne: 1001,
      // 道路服务水平
      roadServiceLevelData: [
        {
          value: 1001,
          name: '排队起终点'
        },
        {
          value: 1002,
          name: '较以往同行延误时间'
        },
        {
          value: 1003,
          name: '经过几个信号周期通过'
        }
      ],
      roadServiceLevelDataOne: 1001,
      // 拥堵成因
      congestionReasonData: [
        {
          value: 1001,
          name: '车流过饱和'
        },
        {
          value: 1002,
          name: '交通违法'
        },
        {
          value: 1003,
          name: '交通事故'
        },
        {
          value: 1004,
          name: '交通秩序乱'
        },
        {
          value: 1005,
          name: '设施缺陷'
        },
        {
          value: 1006,
          name: '综合因素'
        },
        {
          value: 1007,
          name: '违法停车'
        },
        {
          value: 1008,
          name: '乱变线'
        },
        {
          value: 1009,
          name: '爬头加塞'
        },
        {
          value: 1010,
          name: '逆行'
        },
        {
          value: 1011,
          name: '轻微事故处理不及时'
        },
        {
          value: 1012,
          name: '重大事故道路封闭'
        },
        {
          value: 1013,
          name: '车辆交织冲突'
        },
        {
          value: 1014,
          name: '人车混行冲突'
        },
        {
          value: 1015,
          name: '道路空间利用不合理'
        },
        {
          value: 1016,
          name: '信号配时不合理'
        },
        {
          value: 1017,
          name: '安全防护设置不合理'
        }
      ],
      congestionReasonDataOne: 1001,
      improveAdvice: '',
      effectiveDate: '00:00',
      terminationDate: '00:00',
      showAdd: ''
    }
  },
  props: ['mapObj'],
  methods: {
    getLocation: function () {
      this.$emit('showMap')
      console.log('获取地理位置')
    },
    submit: function () {
      let reqData = {
        reportingMatters: this.reportingMatters, // 举报事项
        identityCard: this.identityCard, // 身份证号
        mobilephone: this.mobilephone, // 用户手机
        startTime: this.effectiveDate, // 开始时间
        endTime: this.terminationDate, // 结束时间
        direction: this.directionDataOne, // 方向
        congestionType: this.$refs.congestionTypeDataStr.currentName, // 拥堵类型
        congestionGrade: this.$refs.congestionGradeDataStr.currentName, // 拥堵等级
        roadServiceLevel: this.$refs.roadServiceLevelDataStr.currentName, // 道路服务水平
        congestionReason: this.$refs.roadServiceLevelDataStr.currentName, // 拥堵成因
        improveAdvice: this.improveAdvice, // 改善建议
        addressCode: this.mapObj.addressCode, // 站点代码
        address: this.mapObj.detailAddress // 主题地点描述
      }
      if (this.effectiveDate > this.terminationDate) {
        this.$toast({message: '请选择生效日期以后日期'})
        return
      }
      for (let key in reqData) {
        if (!reqData[key]) {
          console.log(key)
          this.$toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      this.$emit('submit')
      Indicator.open('正在提交...')
      this.$axios.post(jam, reqData).then(json => {
        Indicator.close()
        if (json.code !== '0000') {
          this.$toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        } else {
          this.$MessageBox({
            title: '温馨提示',
            message: '感谢您参与举报，我们会依次不断改进'
          }).then(action => {
            this.$emit('submitSuccess')
          })
        }
      })
    }
  },
  computed: {
    user () {
      return Object.assign({}, this.$store.state.user)
    }
  },
  created () {
    this.showAdd = this.mapObj.showAdd
    this.reportingMatters = 1003
    this.userName = this.user.userName || '' // 用户姓名
    this.mobilephone = this.user.mobilePhone || '' // 用户手机号码
    this.identityCard = this.user.identityCard || '' // 用户身份证号码
  },
  components: {
    GTextarea
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang='less'>
  .jam-outer{
    .address {
      .g-input-content input.input {
        width: 85%;
      }
    }
    .common-list-location {
      float: right;
      width: 32px;
      height: 56px;
      padding: 5px 0;
      box-sizing: border-box;
      background: url('../../../assets/images/location.png') right no-repeat;
      background-size: contain;
    }
  }
</style>