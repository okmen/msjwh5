<template>
<div class="facility-outer">
  <common :typeData='typeData' :subTypeData='subTypeData' :reportingMatters="reportingMatters" @submit="submit" @showMap="showMap" :mapObj="mapObj"></common>
</div>
</template>
<script>
import common from './common'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import { facility } from '@/config/baseURL'
export default {
  name: 'facility',
  data () {
    return {
      typeData: [
        {
          name: '交通信号灯',
          value: 1001
        }
      ],
      subTypeData: [
        {
          name: '手控坏',
          value: 101
        },
        {
          name: '异常闪烁',
          value: 102
        },
        {
          name: '一直亮绿灯',
          value: 103
        },
        {
          name: '一直亮红灯',
          value: 104
        },
        {
          name: '一直闪黄灯',
          value: 105
        },
        {
          name: '黄灯不亮',
          value: 106
        },
        {
          name: '红灯不亮',
          value: 107
        },
        {
          name: '绿灯不亮',
          value: 108
        },
        {
          name: '红黄绿一起闪',
          value: 109
        },
        {
          name: '红绿一起亮',
          value: 110
        },
        {
          name: '全亮红灯',
          value: 111
        },
        {
          name: '全亮绿灯',
          value: 112
        },
        {
          name: '异常黄闪',
          value: 113
        },
        {
          name: '灭灯',
          value: 114
        },
        {
          name: '停电',
          value: 115
        },
        {
          name: '烧灯芯',
          value: 116
        },
        {
          name: '机动车倒计时故障',
          value: 117
        },
        {
          name: '行人倒计时故障',
          value: 118
        },
        {
          name: '信号灯设备脱落',
          value: 119
        },
        {
          name: '行人灯坏',
          value: 120
        },
        {
          name: '灯杆倾斜',
          value: 121
        },
        {
          name: '行人过街按钮故障',
          value: 122
        },
        {
          name: '信号灯被撞',
          value: 123
        },
        {
          name: 'Smooth中央系统异常',
          value: 124
        },
        {
          name: '脱机',
          value: 125
        },
        {
          name: '下载绿冲突检测错误',
          value: 126
        },
        {
          name: '下载获取控制数据丢失或有误',
          value: 127
        },
        {
          name: '通讯故障',
          value: 128
        },
        {
          name: '控制异常',
          value: 129
        },
        {
          name: '车检器故障',
          value: 130
        },
        {
          name: '其他现象',
          value: 131
        },
        {
          name: '绿冲突',
          value: 132
        }
      ]
    }
  },
  components: {
    common
  },
  props: ['mapObj'],
  methods: {
    showMap: function () {
      this.$emit('showMap')
    },
    submit: function (reqData) {
      this.$emit('submit')
      Indicator.open('正在提交...')
      this.$axios.post(facility, reqData).then(json => {
        Indicator.close()
        if (json.code !== '0000') {
          Toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        } else {
          MessageBox({
            title: '温馨提示',
            message: '感谢您参与举报，我们会依次不断改进'
          }).then(action => {
            console.log(this)
            this.$emit('submitSuccess')
          })
        }
      })
    }
  },
  created () {
    this.reportingMatters = 1001
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang='less'>
  
</style>