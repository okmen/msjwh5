<template>
 <div id="takePhotoTips">
    <div class="tp-title">
      {{getNoticeTitle}}
    </div>
    <div class="tp-tips-intro" v-html="userAgreementCon"></div>
   <div>
     
   </div>
   <div class="tp-red-packet">
     <div class="tp-inform-box">
       <router-link :to="{ path: '/userAgreement/wfsspjbzy', query: queryURL }">有奖举报范围及奖励金额</router-link>
       <router-link :to="{ path: '/userAgreement/sspjbgz', query: queryURL }">奖金领取须知</router-link>
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
   <g-button text="确认" @click.native="btnAgreeRequest"></g-button>
 </div>
</template>
<script>
import { userAgreement } from '@/config/baseURL.js'
export default {
  data () {
    return {
      checked: '',
      getNoticeTitle: '',
      userAgreementCon: ''
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted: function () {
    let userAgreementData = {
      noticeKey: 'sspjbzysx'
    }
    this.$axios.post(userAgreement, userAgreementData).then(json => { // 调取随手拍举报接口
      console.log(json)
      this.getNoticeTitle = json.data.title
      this.userAgreementCon = json.data.content
    })
  },
  methods: {
    btnAgreeRequest: function () {
      if (this.checked === true) {
        this.$router.push({path: '/takePicturesInform', query: this.queryURL})
      } else {
        this.$toast({
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
  padding-bottom: 40px;
.tp-title{
  width:100%;
  height:74px;
  background:url("../../assets/images/takePictureTipBg.png") no-repeat;
  background-size:100% 100%;
  font-size:30px;
  line-height:74px;
  text-align:center;
  color:#FFF;
}
.tp-tips-intro{
  padding:0 50px;
  /*width:100%;*/
  p{
    font-size:24px;
    line-height:40px;
  }
  p:first-child{
    margin-top:10px;
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
    height:180px;
    a{
      display:block;
      font-size:26px;
      color:#24a6f8;
      text-decoration:underline;
    }
    a:first-child{
      margin: 20px 0 20px 0;
    }
  }
}
.tp-read{
  padding:0 50px;
  width:100%;
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
.tp-bottom{
  text-align: center;
  font-size: 16px;

}
}
</style>
