<template>
  <div class="">
    <form-template :formData="formData" :linkage="linkage" @getAlldata="getAlldata"></form-template>
  </div>
</template>
<style>

</style>
<script>
  import formTemplate from './src/formTemplate.vue'
  export default {
    data () {
      return {
        formData: [
          {
            type: 'select',
            content: {
              title: '业务内容',
              option: [
                {
                  'str': '蓝牌',
                  'id': '02'
                },
                {
                  'str': '黄牌',
                  'id': '01'
                }
              ]
            }
          },
          {
            type: 'select',
            changeOther: true,
            to: [2, 3],
            content: {
              title: '车牌号码',
              option: [
                {
                  'str': '蓝牌'
                },
                {
                  'str': '黄牌'
                }
              ]
            }
          },
          {
            type: 'input',
            content: {
              title: '姓名',
              palceholder: '请输入姓名',
              readonly: true,
              defaultValue: 'hello'
            }
          },
          {
            type: 'input',
            content: {
              title: '姓名',
              palceholder: '请输入姓名',
              readonly: true,
              defaultValue: 'hello'
            }
          },
          {
            type: 'verification',
            content: {
              title: '姓名',
              palceholder: '请输入姓名',
              url: ''
            }
          },
          {
            type: 'address',
            content: {
              title: '收件人地址',
              list: {
                title: '深圳市',
                option: [
                  {
                    'str': '皖'
                  },
                  {
                    'str': '粤'
                  },
                  {
                    'str': '沪'
                  },
                  {
                    'str': '京'
                  }
                ]
              }
            }
          },
          {
            type: 'plate',
            content: {
              title: '车牌号码',
              list: {
                option: [
                  {
                    'str': '皖'
                  },
                  {
                    'str': '粤'
                  },
                  {
                    'str': '沪'
                  },
                  {
                    'str': '京'
                  }
                ]
              }
            }
          },
          {
            type: 'textarea',
            content: {
              title: '请输入原因',
              palceholder: '请输入原因'
            }
          },
          {
            type: 'radio',
            content: {
              title: '车辆产地',
              option: [
                {'str': '进口', 'id': '0', 'choose': true},
                {'str': '国产', 'id': '1', 'choose': false}
              ]
            }
          }
        ],
        allData: [],
        linkage: {
          '2': {'蓝牌': '02', '黄牌': '01'},
          '3': {'蓝牌': '这是蓝牌', '黄牌': '这是黄牌'}
        }
      }
    },
    components: {
      formTemplate
    },
    methods: {
      getAlldata (val) {
        this.allData = val
        console.log(this.allData, 'index')
      }
    }
  }
</script>
