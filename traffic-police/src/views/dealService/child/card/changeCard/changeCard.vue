<template>
  <!-- 补换证业务头部下拉导航 -->
  <div class="changeCard-outer">
    <div class="changeCard-from pad-side-50">
      <div id="changeCard-hbs">
        <ul class="changeCard-hbs-list">
          <li class="changeCard-hbs-item">
            <div class="changeCard-hbs-name">
              <span>业务类型</span>
            </div>
            <div class="div-select">
              <span class="btn-select" >{{ serviceSelectMassage }}</span>
              <div class="div-select-ul" v-if="serviceSelectShow">
                <ul>
                  <li v-for="item in serviceSelectData">{{item.str}}</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <changeNormal v-if="cur_type_id == '01'"></changeNormal>
    <changeDelay v-else></changeDelay>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
  export default {
    name: 'changeCard',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        cur_type_id: '',            // 当前业务类型 01为补换证  02为延期换证
        serviceSelectShow: false,
        serviceSelectMassage: '驾驶证补换证',
        serviceSelectData: [
          {
            'id': '01',
            'str': '驾驶证补换证'
          },
          {
            'id': '02',
            'str': '驾驶证延期换证'
          }
        ]
      }
    },
    components: {
      'changeNormal': require('./changeNormal.vue'),
      'changeDelay': require('./changeDelay.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    created: function () {
      if (this.$route.params.id === '1') {    // 地址参数为1，载入补换证组件
        this.cur_type_id = '01'
        this.serviceSelectMassage = this.serviceSelectData[0].str
      } else {                                // 地址参数为2，载入延期换证组件
        this.cur_type_id = '02'
        this.serviceSelectMassage = this.serviceSelectData[1].str
      }
    },
    methods: {
      serviceSelectClick: function (str, id) {
        if (str) {
          this.serviceSelectMassage = str
          this.cur_type_id = id
        }
        if (this.serviceSelectShow === true) {
          this.serviceSelectShow = false
        } else {
          this.serviceSelectShow = true
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .changeCard-outer {
    padding: 120px 0 0;
    font-size: 28px;
    color: #000;
    position: relative;
    .changeCard-from {
      background-color: #fff;
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      padding: 20px 40px;
      #changeCard-hbs {
        .changeCard-hbs-list {
          .changeCard-hbs-item {
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .changeCard-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .changeCard-hbs-text {
              width: 100%;
              display: inline-block;
            }
            .changeCard-hbs-code {
              margin-left: 40px;
              text-indent: 28px;
              width: 240px;
              height: 56px;
              text-decoration: underline;
            }
            .div-select {
              height: 60px;
              .div-select-ul {
                top:60px;
              }
              .btn-select{
                background-image: none;
              }
            }
          }
        }
      }
    }
  }
</style>
