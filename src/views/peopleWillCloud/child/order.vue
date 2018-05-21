<template>
  <div class="order-outer">
    <div class="order-form">
      <g-input class="address" title="地点" v-model="showAdd" placeholder="点击右侧按钮选择地址" readonly>
        <div slot="mark" class="common-list-location" @click.stop='getLocation()'></div>
      </g-input>
      <g-date-picker title="开始时间" timeSelect v-model="effectiveDate"></g-date-picker>
      <g-date-picker title="结束时间" timeSelect v-model="terminationDate"></g-date-picker>
      <g-select title="拥堵类型" :data="congestionTypeData" v-model="congestionTypeDataOne" ref="congestionTypeDataStr"></g-select>
      <g-textarea title="现场描述" v-model="description" :maxlength="100" placeholder="请填写改善建议"></g-textarea>
      <g-button text="提交" @click.native="submit"></g-button>
    </div>
  </div>
</template>
<script>
import { order } from '@/config/baseURL'
import { Indicator } from 'mint-ui'
import { GTextarea } from 'form'
export default {
  name: 'order',
  data () {
    return {
      address: '',
      startTime: '',
      endTime: '',
      congestionTypeData: [
        {
          value: 1001,
          name: '机动车违法停放'
        },
        {
          value: 1002,
          name: '机动车占用应急车道'
        },
        {
          value: 1003,
          name: '大货车、泥头车超载'
        },
        {
          value: 1004,
          name: '机动车不按规定安装、悬挂号牌'
        },
        {
          value: 1005,
          name: '机动车遮挡号牌'
        },
        {
          value: 1006,
          name: '机动车污损号牌'
        },
        {
          value: 1007,
          name: '机动车压导流线驾驶'
        },
        {
          value: 1008,
          name: '机动车路口压线变道'
        },
        {
          value: 1009,
          name: '机动车冲红灯'
        },
        {
          value: 1010,
          name: '大中型货车驶入禁行区域'
        },
        {
          value: 1011,
          name: '小型汽车驶入禁行区域'
        },
        {
          value: 1012,
          name: '机动车占用公交车专用道'
        },
        {
          value: 1013,
          name: '醉酒驾驶'
        },
        {
          value: 1014,
          name: '酒后驾驶'
        },
        {
          value: 1015,
          name: '机动车违反禁止标线行驶'
        },
        {
          value: 1016,
          name: '电动车、摩托车驶入禁行区域'
        },
        {
          value: 1017,
          name: '开超标电动力车'
        },
        {
          value: 1018,
          name: '电动车载客'
        },
        {
          value: 1019,
          name: '残疾人专用车载客、载物'
        },
        {
          value: 1020,
          name: '斑马线不礼让行人'
        }
      ],
      congestionTypeDataOne: 1001,
      description: '',
      showAdd: '',
      effectiveDate: '00:00',
      terminationDate: '00:00'
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
        congestionCode: this.congestionTypeDataOne, // 拥堵类型码
        congestionType: this.$refs.congestionTypeDataStr.currentName, // 拥堵类型
        description: this.description, // 现场描述
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
      this.$axios.post(order, reqData).then(json => {
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
        console.log(json)
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
    this.reportingMatters = 1004
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
  .order-outer{
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