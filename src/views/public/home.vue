<template>
  <div id="Home">
    <div id="banner">
      <div class="success-login" v-if="isLogin">
        <div class="success-login-top">
          <div class="success-login-userImg">
            <img :src="userImg">
          </div>
          <div class="success-login-userName">
            <p>{{ userName }}</p>
            <router-link to="/myECard" class="success-login-btn">我的电子证件</router-link>
          </div>
        </div>
        <div class="success-login-bottom">
          <div class="success-login-identityCard">{{ userIdentityCard }}</div>
          <!-- 这里要改成一个List -->
          <div class="success-login-plateNumber" v-if="isCarExist">
            <div class="bar-code-icon"></div>
            <div class="div-select">
              <span class="plate-list" @click.stop="licenseSelectClick()">{{ plateSelect }}</span>
              <div class="div-select-ul" v-if="licenseSelectShow">
                <ul>
                  <li v-for="item in plateList" @click.stop="licenseSelectClick(item.myNumberPlate)">
                    {{item.myNumberPlate}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/personalCenter">
          <div class="login-right"></div>
        </router-link>
      </div>
      <div class="not-login" v-else>
        <div class="logo"></div>
        <p>请
          <router-link to="/login" class="enter"> 登录 </router-link>
          /
          <router-link to="/userAgreement/xjyhrz" class="enroll"> 注册 </router-link>
          星级用户
        </p>
      </div>
    </div>
    <div id="nav-outer">
      <div class="home-nav-top">
        <dl>
          <router-link :to="!isLogin ? '/login' : '/trafficCivilization'">
            <dt><img class="top1" src="./../../assets/images/nav1.png" alt=""></dt>
            <dd>交通文明我做主</dd>
          </router-link>
        </dl>
        <dl>
          <router-link to="/newqueryLawless">
            <dt><img class="top2" src="./../../assets/images/nav2.png" alt=""></dt>
            <dd>违法处理</dd>
          </router-link>
        </dl>
        <dl>
          <router-link to="/takePicturesTips">
            <dt><img class="top3" src="./../../assets/images/nav3.png" alt=""></dt>
            <dd>随手拍举报</dd>
          </router-link>
        </dl>
        <dl>
          <router-link to="/feePayment">
            <dt><img class="top4" src="./../../assets/images/nav4.png" alt=""></dt>
            <dd>车管规费缴纳</dd>
          </router-link>
        </dl>
      </div>
      <div class="home-nav-bottom">
        <dl>
          <router-link to="/precontractType">
            <dt><img class="top5" src="./../../assets/images/nav5.png" alt=""></dt>
            <dd>预约类服务</dd>
          </router-link>
        </dl>
        <dl>
          <router-link to="/userAgreement/jszbzhz">
            <dt><img class="top6" src="./../../assets/images/nav6.png" alt=""></dt>
            <dd>办理类服务</dd>
          </router-link>
        </dl>
        <dl>
          <router-link :to="!isLogin ? '/login' : '/credit'">
            <dt><img class="top7" src="./../../assets/images/nav7.png" alt=""></dt>
            <dd>信息单据证明</dd>
          </router-link>
        </dl>
        <dl>
          <router-link :to="!isLogin ? '/login' : '/handyService'">
            <dt><img class="top8" src="./../../assets/images/nav8.png" alt=""></dt>
            <dd>便民服务</dd>
          </router-link>
        </dl>
        <dl>
          <router-link to="/electricCar">
            <dt><img class="top9" src="./../../assets/images/nav9.png" alt=""></dt>
            <dd>电动车管理</dd>
          </router-link>
        </dl>
        <dl>
          <router-link :to="!isLogin ? '/login' : '/wschool'">
            <dt><img class="top10" src="./../../assets/images/nav10.png" alt=""></dt>
            <dd>微课堂</dd>
          </router-link>
        </dl>
        <dl>
          <a :href="icpTara">
            <dt><img class="top6" src="./../../assets/images/nav11.png" alt=""></dt>
            <dd>轻微事故远程<br/>处理中心</dd>
          </a>
        </dl>
        <dl class="new">
          <router-link :to="!isLogin ? '/login' : '/greenTravel/greenApply'">
            <dt><img class="top11" src="./../../assets/images/green-logo.png" alt=""></dt>
            <dd>绿色出行</dd>
          </router-link>
        </dl>
        <dl class="new">
          <router-link :to="!isLogin ? '/login' : '/dieselEngineTrucksTab'">
            <dt style="width: 33%;"><img style="width: 100%; height: 100%;" class="top5" src="./../../assets/images/nav15.png" alt=""></dt>
            <dd>柴油轻型<br/>自卸货车</dd>
          </router-link>
        </dl>
        <dl class="new">
          <router-link :to="!isLogin ? '/login' : '/illegalParking'">
            <dt><img class="top5" src="./../../assets/images/nav14.png" alt=""></dt>
            <dd>十分钟<br>违停免罚</dd>
          </router-link>
        </dl>
      </div>
    </div>
    <mt-swipe :show-indicators="false" id="advertisement-box" :auto="6000" :speed="1500">
      <mt-swipe-item>
        <router-link to="/showpage">
          <img src="./../../assets/images/home-banner1.jpg" style="width:100%;">
        </router-link>
      </mt-swipe-item>
      <mt-swipe-item>
        <a
          href="https://mp.weixin.qq.com/s?__biz=MzA3NDMzNTQ4Mw==&mid=2655304661&idx=5&sn=40768992087ac11546bf9417592c7159&chksm=84b14e41b3c6c7575a760e2afdc4c7c8be73c9ed8d627a46862177cf674f73df32b371d4eb2e&mpshare=1&scene=1&srcid=0503GTNNmIvgWcfV7NhMZXoC&key=03e28d3fd128796c275a4292972ac539cd9c89237723e3776e455f2eec18dea35e3d49650f8e19b7e5a8f1f8cf98f5cd6be7d6995b365cd9cdc9e51d35c98e6c472e26ce3e0689fe838cf0eb8fbde311&ascene=0&uin=MTUxMzU1MjA4MA%3D%3D&devicetype=iMac+MacBookAir7%2C2+OSX+OSX+10.11.6+build(15G1421)&version=12020110&nettype=WIFI&fontScale=100&pass_ticket=Os%2FdaZX6ah4cAnrhZVCRq7P1%2BzkNhag6IoM3Y4r5GHXvcOFKgG3NxpLzqVg0TC8L">
          <img src="./../../assets/images/advertisement2.png">
        </a>
      </mt-swipe-item>
    </mt-swipe>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
        userName: '',
        userImg: require('@/assets/images/no-network-logo.png'),
        userIdentityCard: '',
        userNumberPlate: '',
        isLogin: false,
        openId: '',
        icpTara: '',
        mobilePhone: '',
        plateType: '',
        licenseSelectShow: false,
        plateList: '',
        isCarExist: true,
        plateSelect: ''
      }
    },
    mounted () {
    },
    methods: {
      licenseSelectClick: function (number) {
      }
    },
    created () {
    }
  }
</script>
<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000;
  }

  .pad-side-50 {
    padding: 0 50px;
  }

  .mint-toast-text {
    color: #fff;
  }

  #banner {
    height: 360px;
    width: 100%;
    position: relative;
    background-color: #fff;
    .not-login {
      height: 100%;
      width: 100%;
      position: relative;
      padding-top: 196px;
      box-sizing: border-box;
      text-align: center;
      font-size: 28px;
      background-image: url('./../../assets/images/not-login-banner.png');
      background-size: cover;
      .logo {
        width: 159px;
        height: 149px;
        background-image: url('./../../assets/images/login-logo.png');
        background-size: cover;
        position: absolute;
        left: 50%;
        top: 30px;
        right: 50%;
        transform: translateX(-50%);
      }
      p {
        color: #fff;
      }
      .enter {
        font-size: 30px;
        color: #97f900;
      }
      .enroll {
        font-size: 30px;
        color: #ffbe00;
      }
    }
    .success-login {
      height: 100%;
      width: 100%;
      position: relative;
      font-size: 28px;
      background-image: url('/assets/images/success-login-banner.png');
      background-size: cover;
      .success-login-top {
        height: 174px;
        padding-top: 36px;
        padding-left: 30px;
        box-sizing: border-box;
        .success-login-userImg {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #e4e4e4;
          box-sizing: border-box;
          float: left;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .success-login-userName {
          float: left;
          height: 100%;
          padding-left: 20px;
          p {
            line-height: 80px;
            color: #fff;
            font-size: 30px;
          }
          .success-login-btn {
            display: block;
            padding: 0 10px;
            line-height: 40px;
            border: 4px solid #fff;
            border-radius: 8px;
            color: #fff;
          }
        }
      }
      .success-login-bottom {
        font-size: 30px;
        padding-top: 30px;
        padding-left: 40px;
        div {
          color: #fff;
        }
        .success-login-identityCard {
          display: inline-block;
          background: url('/assets/images/idCard.png') no-repeat left center;
          background-size: 42px;
          padding-left: 60px;
        }
        .success-login-plateNumber {
          display: inline-block;
          .bar-code-icon {
            display: inline-block;
            background: url('/assets/images/plateNumber.png') no-repeat 34px center;
            background-size: 60px;
            width: 94px;
            height: 40px;
            margin-right: 10px;
            vertical-align: text-bottom;
          }
          .div-select {
            display: inline-block;
            width: 180px;
            text-align: center;
            .plate-list {
              color: #fff;
            }
            .div-select-ul {
              border-radius: 6px;
              ul li {
                color: #666;
                text-indent: 0;
              }
            }
          }
        }
      }
    }
    .login-right {
      position: absolute;
      height: 230px;
      width: 72px;
      right: 0;
      top: 0;
      background: url('/assets/images/login-right.png') no-repeat center center;
      background-size: 23px;
    }
  }

  #nav-outer {
    width: 100%;
    position: relative;
    padding: 0 18px;
    box-sizing: border-box;
    color: #666;
    margin-top: -68px;
    .home-nav-top {
      display: flex;
      justify-content: space-around;
      height: 140px;
      padding-top: 24px;
      line-height: 70px;
      background-color: #fff;
      border-radius: 6px;
      font-size: 22px;
      box-shadow: 0 5px 5px rgba(0, 0, 0, .2);
      dl {
        height: 100%;
        text-align: center;
        img {
          display: block;
          margin: 0 auto;
        }
        dt {
          height: 45px;
        }
        .top1 {
          width: 67px;
          height: 46px;
        }
        .top2 {
          width: 49px;
          height: 47px;
        }
        .top3 {
          width: 52px;
          height: 44px;
        }
        .top4 {
          width: 48px;
          height: 48px;
        }
      }
    }
    .home-nav-bottom {
      overflow: hidden;
      margin-top: 20px;
      box-shadow: 0 5px 5px rgba(0, 0, 0, .2);
      border-radius: 6px;
      dl.new:before{
        position: absolute;
        font-size: 20px;
        content: 'NEW';
        right: 10px;
        top: 10px;
        background: #f00;
        color: #fff;
        line-height: 1.2;
        padding: 5px 10px 8px 10px;
        border-radius: 20px;
      }
      dl {
        position: relative;
        width: 50%;
        height: 138px;
        float: left;
        box-sizing: border-box;
        border-bottom: 2px solid #f5f5f5;
        border-right: 2px solid #f5f5f5;
        background-color: #fff;
        a {
          display: block;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          dt {
            padding-left: 62px;
            width: 30%;
            box-sizing: border-box;
          }
          dd {
            width: 70%;
            text-align: center;
            margin-left: -30px;
          }
        }
        .top5 {
          width: 46px;
          height: 49px;
        }
        .top6 {
          width: 45px;
          height: 52px;
        }
        .top7 {
          width: 44px;
          height: 49px;
        }
        .top8 {
          width: 47px;
          height: 52px;
        }
        .top9 {
          width: 42px;
          height: 55px;
        }
        .top10 {
          width: 40px;
          height: 51px;
        }
        .top11 {
          width: 58px;
          height: 58px;
        }
      }
    }
  }

  #advertisement-box {
    width: 100%;
    height: 117px;
    margin-top: 30px;
    a {
      width: 100%;
      height: 100%;
      display: block;
      img {
        display: block;
        width: 100%;
      }
    }
  }

  .m-greenTravel {
    margin-top: 1rem;
    img {
      width: 100%;
    }
  }
</style>
