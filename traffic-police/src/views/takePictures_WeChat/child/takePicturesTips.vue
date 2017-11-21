<template>
 <div id="takePhotoTips">
    <div class="tp-title">
      随手拍举报温馨提示
    </div>
   <div class="tp-tips-intro">
     <p>
       欢迎使用随手拍举报交通违法功能。举报人应仔细阅读举报范
       围说明、举报注意事项，确保举报信息真实有效，并承担相应法律
       责任。遇紧急、重大交通违法或其它违法行为请立即拨打110报警，
       感谢您的支持！
     </p>
     <p>
       根据相关法律规定，请属实举报，如提供虚假举报信息将承担
       相关法律责任。同时，交警部门会保护好您的个人隐私，敬请放心。
     </p>
   </div>
   <div class="tp-red-packet">
     <h3>红包领取须知</h3>
     <div class="tp-red-intro">
       <p>
         1、为便于市民有奖举报奖金的领取，深圳交警“星级用户”登录举报
         的，将根据用户注册信息以“微信红包”方式发放奖金；非“星级用户”
         通过填报个人信息采取其它方式（现金、转账等）发放奖金。
       </p>
       <p>
         2、“微信红包”领取奖金仅限于人民币200元及以下金额。
       </p>
     </div>
     <div class="tp-inform-box">
       <router-link to="/userAgreement_WeChat/wfsspjbzy">举报范围说明</router-link>
       <router-link to="/userAgreement_WeChat/sspjbzysx">举报注意事项</router-link>
     </div>
   </div>
   <div class="tp-read">
     <div class="tp-read-checkbox">
       <input type="checkbox" id="informReadCheckbox" name="informReadCheckbox" v-model="checked">
       <label for="informReadCheckbox"></label>
     </div>
     <span>
       我已认真阅读以上内容，并愿意承担相关法律责任。
     </span>
   </div>
   <div class="tp-btn-sure">
     <button @click="btnAgreeRequest">确认</button>
   </div>
   <page-bottom></page-bottom>
   <div v-wechat-title="$route.meta.title"></div>
 </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      checked: ''
    }
  },
  components: {
    'pageBottom': require('./../../../components/pageBottom.vue')
  },
  methods: {
    btnAgreeRequest: function () {
      if (this.checked === true) {
        this.$router.push('/takePicturesInform_Wechat')
      } else {
        Toast({
          message: '请勾选已阅读温馨提示',
          position: 'bottom',
          duration: 1500
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
#takePhotoTips{
.tp-title{
  width:100%;
  height:74px;
  background:url("../../../images/takePictureTipBg.png") no-repeat;
  background-size:100% 100%;
  font-size:30px;
  line-height:74px;
  text-align:center;
  color:#FFF;
}
.tp-tips-intro{
  padding:0 50px;
  width:100%;
  height:350px;
  p{
    text-indent:60px;
    font-size:24px;
    line-height:36px;
  }
  p:first-child{
    margin-top:54px;
    margin-bottom:50px;
  }
}
.tp-red-packet{
  padding:0 50px;
  width:100%;
  h3{
    width:100%;
    height:80px;
    font-size:26px;
    line-height:90px;
  }
  .tp-red-intro{
    width:100%;
    height:260px;
    p{
      font-size:24px;
      line-height:36px;
    }
    p:first-child{
      margin-bottom:38px;
    }
  }
  .tp-inform-box{
    width:100%;
    height:200px;
    a{
      display:block;
      font-size:26px;
      color:#24a6f8;
      text-decoration:underline;
    }
    a:first-child{
      margin-bottom:34px;
    }
  }
}
.tp-read{
  padding:0 50px;
  width:100%;
  height:106px;
  .tp-read-checkbox{
    float:left;
    position:relative;
    margin:4px 20px 0 0;
    width:26px;
    height:26px;
    input[type=checkbox]{
      visibility: hidden;
    }
    label{
      position:absolute;
      width:26px;
      height:26px;
      top:0;
      left:0;
      background:#FFF;
      border:1px dotted #6a6a6a;
      -webkit-border-radius:6px;
      -moz-border-radius:6px;
      border-radius:6px;
      cursor:pointer;
    }
    label:after{
      opacity:0.2;
      content:'';
      position:absolute;
      width:24px;
      height:8px;
      background:transparent;
      top:0;
      left:3px;
      border:4px solid #333;
      border-top:none;
      border-right:none;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
    label:hover::after{
      opacity:0.5;
    }
    input[type=checkbox]:checked + label:after{
      opacity:1;
    }
  }
  span{
    display:block;
    float:left;
    font-size:22px;
  }
}
.tp-btn-sure{
  width:100%;
  height:108px !important;
  button{
    margin-left:52px;
    width:646px;
    height:80px;
    background:#09bb07;
    color:#FFF;
    font-size:36px;
    text-align:center;
    line-height:80px;
    outline:none;
    -webkit-border-radius:8px;
    -moz-border-radius:8px;
    border-radius:8px;
  }
}
}
</style>
