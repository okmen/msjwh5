<template>
<div class="secure-outer">
  <common :typeData='typeData' :subTypeData='subTypeData' :reportingMatters="reportingMatters" @submit="submit" @showMap="showMap" :mapObj="mapObj"></common>
</div>
</template>
<script>
import common from './common'
import { Indicator } from 'mint-ui'
import { secure } from '@/config/baseURL'
export default {
  data () {
    return {
      typeData: [
        {
          name: '设施',
          value: 1001
        },
        {
          name: '路灯照明',
          value: 1002
        },
        {
          name: '绿化遮挡交通标志，或遮挡行车视线',
          value: 1003
        },
        {
          name: '占道施工存在安全隐患',
          value: 1004
        },
        {
          name: '容易发生水浸',
          value: 1005
        },
        {
          name: '居民、人群较为密集，交通秩序混乱',
          value: 1006
        }
      ],
      subTypeData: {
        1001: [
          {
            name: '没有安装隔离护栏，或隔离护栏设置不完善、不合理',
            value: 101
          },
          {
            name: '没有交通标志标线，或交通标志标线设置不完善、不合理',
            value: 102
          },
          {
            name: '没有减速设施',
            value: 103
          },
          {
            name: '路口渠化不合理',
            value: 104
          },
          {
            name: '没有行人通过设施',
            value: 105
          },
          {
            name: '临崖、临水、急弯、陡坡、视距不良的路段没有完全防护设施，或安全防护设施不完善',
            value: 106
          },
          {
            name: '高速公路路肩宽度不符合国家标准且未按规定设置港湾式紧急停车带',
            value: 107
          },
          {
            name: '高速公路中央隔离栏、两侧防护网设置不完善',
            value: 108
          }
        ],
        1002: [
          {
            name: '没有照明设施、不合理',
            value: 101
          },
          {
            name: '照明设施不能正常工作，或照明功率太低',
            value: 102
          }
        ],
        1003: [
          {
            name: '绿化遮挡交通标志，或遮挡行车视线',
            value: 101
          }
        ],
        1004: [
          {
            name: '占道施工存在安全隐患',
            value: 101
          }
        ],
        1005: [
          {
            name: '容易发生水浸',
            value: 101
          }
        ],
        1006: [
          {
            name: '居民、人群较为密集，交通秩序混乱',
            value: 101
          }
        ]
      }
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