<template>
  <div class="queryByCard-outer">
    <div class="queryByCard-from pad-side-50">
      <div id="queryByCard-hbs">
        <ul class="queryByCard-hbs-list">
          <li class="queryByCard-hbs-item">
            <div class="queryByCard-hbs-name">
              <span>身份证号</span>
            </div>
            <div class="queryByCard-hbs-text">
              <input v-model="identityCard" class="text-input" type="text" name="" value="" placeholder="请输入身份证号">
            </div>
          </li>
          <li class="queryByCard-hbs-item clear">
            <div class="queryByCard-hbs-name">
              <span>验证码</span>
            </div>
            <div class="queryByCard-hbs-text width-40 left">
              <input class="text-input" type="text" name="" value="" maxlength="4" placeholder="请输入验证码" id="inp">
            </div>
            <div class="left queryByCard-hbs-code" id="code"></div>
          </li>
        </ul>
      </div>
      <button class="btn btn-blue" type="button" name="button" @click.stop="queryLawlessByCard()">提交</button>
    </div>
  <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { verifyCode } from '../../../../config/verifyCode'
  import { Toast } from 'mint-ui'
  export default {
    name: 'queryByCard',
    data () {
      return {
        identityCard: '',            // 身份证
        verifyCode: false                    // 验证码验证
      }
    },
    mounted () {
      verifyCode(document.getElementById('inp'), document.getElementById('code'), (result, code) => {
        this.verifyCode = result
      })
    },
    methods: {
      queryLawlessByCard: function () {
        if (!this.identityCard) {
          Toast({
            message: '请输入正确身份证号码',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
        if (!this.verifyCode) {
          Toast({
            message: '验证码输入错误',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
        this.$router.push({ path: 'queryProgress', query: {'identityCard': this.identityCard} })
      }
    }
  }
</script>
<style lang="less">
  .queryByCard-outer {
    font-size: 28px;
    color: #000;
    position: relative;
    background-color: white;
    .width-40{
      width: 40% !important;
    }
    .queryByCard-from {
      background-color: #fff;
      #queryByCard-hbs {
        padding-bottom: 20px;
        .queryByCard-hbs-list {
          overflow: hidden;
         .queryByCard-hbs-item {
           margin-top: 24px;
           padding-left: 180px;
           position: relative;
           line-height: 56px;
            .queryByCard-hbs-name {
               width: 180px;
               position: absolute;
               left: 0;
            }
           .queryByCard-hbs-text {
               width: 100%;
               display: inline-block;
            }
          .queryByCard-hbs-code {
            margin-left: 40px;
            text-indent: 28px;
            width: 240px;
            height: 56px;
            text-decoration: underline;
            }
         }
        }
      }
    }
    .queryResults {
      color: #333 !important;
      margin: 100px 0;
      .results-box {
        border: 1px solid #a7d9f9;
        background-color: #fff;
        border-radius: 4px;
        .box-header {
          height: 80px;
          line-height: 80px;
          border-bottom: 1px solid #a7d9f9;
          &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
          .header-item {
            font-size: 1rem;
            padding: 0 24px;
            font-weight: bold;
            &.order-print {
               color: #2696dd;
               text-decoration: underline;
             }
          }
        }
        .box-body {
          color: #333;
          padding: 0 24px 10px;
          position: relative;
          .body-left-side {
            width: 80%;
            .left-number {
              font-size: 0.95rem;
              font-weight: bold;
              height: 80px;
              line-height: 80px;
              i {
                color: #f46263;
                margin-left: 30px;
              }
            }
            .left-line {
              padding: 8px 0;
              font-size: 0.9rem;
              &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
              span {
                display: inline-block;
                width: 50px;
                text-align: center;
                position: absolute;
              }
              p {
                display: inline-block;
                position: relative;
                left: 70px;
                vertical-align: middle;
              }
              i {
                display: inline-block;
                width: 34px;
                height: 34px;
                background-image: url("../../../../images/A.png");
                background-size: 100%;
                vertical-align: middle;
                &.time {
                   background-image: url("../../../../images/time_2.png");
                 }
                &.car {
                   background-image: url("../../../../images/car.png");
                   background-repeat: no-repeat;
                   width: 40px;
                 }
                &.punish {
                   background-image: url("../../../../images/punish.png");
                   background-repeat: no-repeat;
                   width: 36px;
                   height: 38px;
                 }
                &.local {
                   background-image: url("../../../../images/local.png");
                   width: 32px;
                   height: 40px;
                 }
                &.warn {
                   background-image: url("../../../../images/warn.png");
                   width: 36px;
                   height: 38px;
                 }
              }
            }
          }
          .body-right-side {
            position: absolute;
            top: 50%;
            right: 20px;
            margin-top: -20px;
            display: block;
            width: 20px;
            height: 40px;
            background-image: url("../../../../images/login-right.png");
            background-size: cover;
          }
        }
      }
    }
  }
</style>
