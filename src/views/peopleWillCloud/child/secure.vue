<template>
<div class="secure-outer">
<div v-wechat-title="$route.meta.title"></div>
  <common :typeData='typeData' :reportingMatters="reportingMatters" @submit="submit" @showMap="showMap" :mapObj="mapObj"></common>
</div>
</template>
<script>
import common from './common'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import { secure } from '@/config/baseURL'
export default {
  name: 'facility',
  data () {
    return {
      typeData: [
        {
          'str': '设施',
          'id': 1001,
          'subTypeData': [
            {
              'str': '没有安装隔离护栏，或隔离护栏设置不完善、不合理',
              'id': 101
            },
            {
              'str': '没有交通标志标线，或交通标志标线设置不完善、不合理',
              'id': 102
            },
            {
              'str': '没有减速设施',
              'id': 103
            },
            {
              'str': '路口渠化不合理',
              'id': 104
            },
            {
              'str': '没有行人通过设施',
              'id': 105
            },
            {
              'str': '临崖、临水、急弯、陡坡、视距不良的路段没有完全防护设施，或安全防护设施不完善',
              'id': 106
            },
            {
              'str': '高速公路路肩宽度不符合国家标准且未按规定设置港湾式紧急停车带',
              'id': 107
            },
            {
              'str': '高速公路中央隔离栏、两侧防护网设置不完善',
              'id': 108
            }
          ]
        },
        {
          'str': '路灯照明',
          'id': 1002,
          'subTypeData': [
            {
              'str': '没有照明设施、不合理',
              'id': 101
            },
            {
              'str': '照明设施不能正常工作，或照明功率太低',
              'id': 102
            }
          ]
        },
        {
          'str': '绿化遮挡交通标志，或遮挡行车视线',
          'id': 1003,
          'subTypeData': [
            {
              'str': '绿化遮挡交通标志，或遮挡行车视线',
              'id': 101
            }
          ]
        },
        {
          'str': '占道施工存在安全隐患',
          'id': 1004,
          'subTypeData': [
            {
              'str': '占道施工存在安全隐患',
              'id': 101
            }
          ]
        },
        {
          'str': '容易发生水浸',
          'id': 1005,
          'subTypeData': [
            {
              'str': '容易发生水浸',
              'id': 101
            }
          ]
        },
        {
          'str': '居民、人群较为密集，交通秩序混乱',
          'id': 1006,
          'subTypeData': [
            {
              'str': '居民、人群较为密集，交通秩序混乱',
              'id': 101
            }
          ]
        }
      ]
    }
  },
  props: ['mapObj'],
  components: {
    common
  },
  methods: {
    showMap: function () {
      this.$emit('showMap')
    },
    submit: function (reqData) {
      this.$emit('submit')
      Indicator.open('正在提交...')
      this.$axios.post(secure, reqData).then(json => {
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
            this.$emit('submitSuccess')
          })
        }
      })
    }
  },
  created () {
    this.reportingMatters = 1002
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang='less'>
  
</style>