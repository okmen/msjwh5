<template>
<div class="facility-outer">
<div v-wechat-title="$route.meta.title"></div>
  <common :typeData='typeData' :reportingMatters="reportingMatters" @submit="submit" @showMap="showMap" :mapObj="mapObj"></common>
</div>
</template>
<script>
import common from './common'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import { resultPost } from '../../../service/getData'
import { facility } from '../../../config/baseUrl'
export default {
  name: 'facility',
  data () {
    return {
      typeData: [
        {
          'str': '交通信号灯',
          'id': 1001,
          'subTypeData': [
            {
              'str': '手控坏',
              'id': 101
            },
            {
              'str': '异常闪烁',
              'id': 102
            },
            {
              'str': '一直亮绿灯',
              'id': 103
            },
            {
              'str': '一直亮红灯',
              'id': 104
            },
            {
              'str': '一直闪黄灯',
              'id': 105
            },
            {
              'str': '黄灯不亮',
              'id': 106
            },
            {
              'str': '红灯不亮',
              'id': 107
            },
            {
              'str': '绿灯不亮',
              'id': 108
            },
            {
              'str': '红黄绿一起闪',
              'id': 109
            },
            {
              'str': '红绿一起亮',
              'id': 110
            },
            {
              'str': '全亮红灯',
              'id': 111
            },
            {
              'str': '全亮绿灯',
              'id': 112
            },
            {
              'str': '异常黄闪',
              'id': 113
            },
            {
              'str': '灭灯',
              'id': 114
            },
            {
              'str': '停电',
              'id': 115
            },
            {
              'str': '烧灯芯',
              'id': 116
            },
            {
              'str': '机动车倒计时故障',
              'id': 117
            },
            {
              'str': '行人倒计时故障',
              'id': 118
            },
            {
              'str': '信号灯设备脱落',
              'id': 119
            },
            {
              'str': '行人灯坏',
              'id': 120
            },
            {
              'str': '灯杆倾斜',
              'id': 121
            },
            {
              'str': '行人过街按钮故障',
              'id': 122
            },
            {
              'str': '信号灯被撞',
              'id': 123
            },
            {
              'str': 'Smooth中央系统异常',
              'id': 124
            },
            {
              'str': '脱机',
              'id': 125
            },
            {
              'str': '下载绿冲突检测错误',
              'id': 126
            },
            {
              'str': '下载获取控制数据丢失或有误',
              'id': 127
            },
            {
              'str': '通讯故障',
              'id': 128
            },
            {
              'str': '控制异常',
              'id': 129
            },
            {
              'str': '车检器故障',
              'id': 130
            },
            {
              'str': '其他现象',
              'id': 131
            },
            {
              'str': '绿冲突',
              'id': 132
            }
          ]
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
      resultPost(facility, reqData).then(json => {
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