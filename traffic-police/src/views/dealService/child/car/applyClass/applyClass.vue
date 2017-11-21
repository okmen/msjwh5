<template>
  <div class="applyClass-outer">
    <div class="applyClass-from pad-side-50">
      <div id="applyClass-hbs">
        <ul class="applyClass-hbs-list">
          <li class="applyClass-hbs-item">
            <div class="applyClass-hbs-name">
              <span>业务类型</span>
            </div>
            <div class="div-select">
              <span class="btn-select" style="background-image: none">{{ licenseSelectMassage }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="appleyClass-from-child">
      <applyEveryMonth v-if="cur_type_id == '01'"></applyEveryMonth>
      <applyInterimCard v-else></applyInterimCard>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
  export default {
    name: 'applyClass',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        cur_type_id: '01',
        licenseSelectShow: false,
        licenseSelectMassage: '每月1天通行证业务申请',
        licenseSelectData: [
          {
            'id': '01',
            'str': '每月1天通行证业务申请'
          },
          {
            'id': '02',
            'str': '申请机动车临牌'
          }
        ]
      }
    },
    components: {
      'applyEveryMonth': require('./applyEveryMonth.vue'),
      'applyInterimCard': require('./applyInterimCard.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    mounted () {
      this.cur_type_id = this.$route.params.id
      if (this.$route.params.id === '01') {
        this.licenseSelectMassage = '每月1天通行证业务申请'
      } else {
        this.licenseSelectMassage = '申请机动车临牌'
      }
    },
    methods: {
      licenseSelectClick: function (str, id) {
        if (str) {
          this.licenseSelectMassage = str
          this.cur_type_id = id

          console.log(this.cur_type_id)
        }
        if (this.licenseSelectShow === true) {
          this.licenseSelectShow = false
        } else {
          this.licenseSelectShow = true
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .applyClass-outer {
    padding-top: 120px;
    font-size: 28px;
    color: #000;
    position: relative;
    .applyClass-from {
      background-color: #fff;
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      padding: 0 40px 24px;
      #applyClass-hbs {
        padding: 20px 0 0;
        .applyClass-hbs-list {
          .applyClass-hbs-item {
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .applyClass-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .applyClass-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .applyClass-hbs-code {
              margin-left: 40px;
              text-indent: 28px;
              width: 240px;
              height: 56px;
              text-decoration: underline;
            }
            .div-select {
              .div-select-ul {
                top:60px;
              }
            }
          }
        }
      }
    }
    .appleyClass-from-child{
      background: #FFF;
      padding:24px 40px 50px;
    }
    .tp-bottom{
      margin-top: 28px;
    }
  }
</style>
