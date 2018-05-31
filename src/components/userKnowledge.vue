<template>
    <div class="knowledge">
     <div class="tp-tips-intro"><p class="MsoNormal" style="text-align:center;">
        “<span>10</span>分钟违停免罚”须知
        </p>
        <p class="MsoNormal">
            <span>1.</span>“<span>10</span>分钟违停免罚”为敬告执法，不是不予处罚，而是在驾驶人主动驶离、提出申请后，给予敬告、免于罚款。<span></span> 
        </p>
        <p class="MsoNormal">
            <span>2.</span>违停被处罚金额为<span>200</span>元罚款的，可以申请“违停免罚”；罚款金额为<span>500</span>元、<span>1000</span>元、<span>2000</span>元的，暂不可申请“违停免罚”。具体处罚标准见《深圳市公安局交通警察局关于机动车违反停放、临时停车规定分档处罚具体执行标准的通告》。<span></span> 
        </p>
        <p class="MsoNormal">
            <span>3.</span>已施划路边收费停车泊位的路段，此类路段已委托交委道交中心管理，因不同业务系统间数据传输的时限影响，此类道路暂未开放“违停免罚”的申请。<span></span> 
        </p>
        <p class="MsoNormal">
            <span>4.</span>交警开具违停告知单后，驾驶人应当在<span>10</span>分钟内完成挪车及使用星级用户平台拍照、上传的流程。<span></span> 
        </p>
        <p class="MsoNormal">
            <span>5.</span>每名星级用户每季度限申请“<span>10</span>分钟违停免罚”<span>1</span>次，申请次数不予累积。<span></span> 
        </p>
        <p class="MsoNormal">
            <span>6.</span>每名星级用户仅可对本账户所绑定车辆进行申请。<span></span> 
        </p>
        <p>
            <br>
        </p>
        <p>
            <br>
        </p>
     </div>
     <!-- <div class="tp-read-checkbox" >
       <input type="checkbox" id="informReadCheckbox" name="informReadCheckbox" v-model="checked">
       <label for="informReadCheckbox"></label>
     </div>
     <span class="read-and-agree">
        我已认真阅读以上内容，并愿意承担相关法律责任。
     </span> -->
    <!-- <g-button @click.native="btnAgreeRequest" text="确认信息"></g-button> -->
    <g-button @click.native="btnReturn" text="返回" ></g-button>
     <div v-wechat-title="$route.meta.title"></div>
    </div>
</template>
<script>
// import { GButton } from 'form'
export default {
  data () {
    return {}
  },
  methods: {
    btnReturn () {
      this.$router.push('/illegalParking')
    }
  }
}
</script>
<style lang="less" scoped>
.knowledge {
  margin: 30px;
  .tp-read-checkbox {
    float: left;
    position: relative;
    margin: 4px 20px 0 0;
    width: 26px;
    height: 26px;
    input[type="checkbox"] {
      visibility: hidden;
    }
    label {
      position: absolute;
      width: 26px;
      height: 26px;
      top: 0;
      left: 0;
      background: #fff;
      border: 1px dotted #6a6a6a;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      border-radius: 6px;
      cursor: pointer;
    }
    label:after {
      opacity: 0.2;
      content: "";
      position: absolute;
      width: 24px;
      height: 8px;
      background: transparent;
      top: 0;
      left: 3px;
      border: 4px solid #333;
      border-top: none;
      border-right: none;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
    label:hover::after {
      opacity: 0.5;
    }
    input[type="checkbox"]:checked + label:after {
      opacity: 1;
    }
  }
}
</style>

