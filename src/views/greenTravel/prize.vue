<template>
  <div class="prize">
    <h2>一、精神荣誉奖励</h2>
    <p>年度开展对“绿色出行”活动中表现突出的个人，进行授予荣誉证书及荣誉车主称号。</p>
    <div class="prize-img">
      <img class="prize-one" src="../../assets/images/medal.png" alt="">
      <img class="prize-two" src="../../assets/images/medal1.png" alt="">
    </div>
    <h2>二、商业车险合同延期奖励</h2>
    <p>凡“绿色出行”系统申报连续停使15天及以上的非营业个人客车（9座及9座以下），投保人可凭相关确认手续到保险公司办理商业车险合同期限顺延的批改手续。批改后，在双方约定的期限内，原商业车险合同效力终止，合同止期相应顺延。</p>
    <h3>办理条件: </h3>
    <p>（1）深圳投保商业车险，系统申报连续停驶15天及以上，且连续停驶期间在商业车险合同有效期内。</p>
    <p>（2）车辆行驶证车主为个人，使用性质为非营业，座位数为9座及9座以下。</p>
    <h3>注意事项：</h3>
    <p>1. 合同延期服务仅限于商业车险，交强险不适用，办理商业车险合同延期后，可能造成车辆交强险和商业保险期不一致，车主应当注意及时续保，避免由于脱保而产生的风险。</p>
    <p>2. 车辆办理合同期限顺延后，在申报停驶期间，商业车险合同效力完全中止，无论车辆是否上路停驶，对于发生的事故保险公司均不承担赔偿责任。</p>
    <p>3. 停驶期满后，车辆不需要提交申请，原商业保险合同效力自动恢复，保险公司恢复承担保险责任。</p>
    <p>4. 保险人应在申报停驶期之前前往保险公司办理相关手续。</p>
    <h2>三、碳账户积分奖励</h2>
    <p>用户关注“碳账户”微信公众号后，通过绑定其星级用户账号，可将星级用户车主申报停驶信息同步到深圳市绿色低碳发展基金会“碳账户”中兑换小礼品。</p>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
export default {

  name: 'prize',

  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
  .prize{
    width: 90%;
    margin: 10px auto;
    overflow: hidden;
    .prize-img {
      width: 100%;
      height: 360px;
      margin: 20px 0;
      .prize-one{
        width: 50%;
        height: 100%;
        float: left;
      }
      .prize-two{
        width: 50%;
        height: 100%;
        float: left;
      }
    }
    h2{
      line-height: 50px;
      font-size: 32px;
    }
    h3{
      line-height: 40px;
      font-size: 28px;
    }
    p{
      line-height: 40px;
      text-indent: 34px;
      font-size: 26px;
    }
  }
</style>
