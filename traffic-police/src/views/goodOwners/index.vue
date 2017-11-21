<template>
  <div class="m-goodOwnersInfo">
    <div class="main">
      <div class="banner"><img width="100%;" src="./../../images/goodOwners-p4.jpg"></div>
      <div class="part info">
        <div class="title"><img src="./../../images/goodOwners-p5.png"></div>
        <p>为鼓励广大车主文明驾驶、安全出行，为广大驾驶员树立文明驾驶的榜样，同时大力倡导“爱我深圳，停用少用，绿色出行”理念，11月13日至12月2日期间，在市文明办的指导下，深圳市交警局联合平安产险深圳分公司、深圳电台交通频率、市绿联办、市道路货物运输业“反超联盟”共同举办第二届“发现平安好车主，争做文明驾驶人”评选活动。</p>
      </div>
      <div class="part info">
        <div class="title"><img src="./../../images/goodOwners-p14.png"></div>
        <h3>一、报名条件</h3>
        <p>参加活动的驾驶员需同时满足以下条件（如名下有车辆也需满足以下条件）。</p>
        <p>（一）近2年内无交通违法记录。</p>
        <p>（二）近3年来未发生重大道路交通事故。</p>
        <p>（三）无治安处罚和刑事处罚记录。</p>
        <h3>二、报名方式</h3>
        <p>（一）通过深圳交警星级用户平台报名。星级用户可通过深圳交警微信公众号、支付宝城市服务车主服务等渠道参与活动。</p>
        <p>还未注册深圳交警星级用户的朋友，可以通过上述两个渠道注册，报名期内认证通过后即可参与。</p>
        <p>（二）通过平安好车主APP报名。下载平安好车主APP，并按要求注册成功后参与报名。</p>
        <p>（三）快乐1062微信公众号报名。登录快乐1062微信公众号，点击活动宣传推文的“阅读原文”即可参与报名。</p>
        <p>（四）绿色出行申报报名。登陆星级用户服务平台申报停驶的同时，可参与报名。</p>
        <h3>三、报名资料</h3>
        <p>参与报名的驾驶员，需要承诺如实提交以下资料（星级用户须同意活动主办方调用注册资料）。</p>
        <p>（一）驾驶员姓名。</p>
        <p>（二）驾驶证号码。</p>
        <p>（三）本人名下有车辆的，需提供所有车辆的车牌号码。</p>
        <p>（四）本人手机号码。</p>
        <p>（五）本人近照（正面半身或全身照片）。照片模糊或者打有马赛克等其他不能辨识的情形的，视为资料不合格取消参选资格。</p>
        <h3>四、活动时间安排</h3>
        <p>（一）自愿报名</p>
        <p>11月13日至19日，符合条件的驾驶人自愿报名。</p>
        <p>11月20日至23日，活动主办方将按照活动规则遴选出400名候选人开展网络票选活动。</p>
        <p>（二）开展网络投票</p>
        <p>11月24日至28日开展网络投票。市民可通过深圳交警公众号、支付宝城市服务星级车主服务或平安好车主APP活动的界面进行投票。每人每天限投票一次，不得通过软件进行刷票，一旦发现刷票行为则取消参与资格。</p>
        <p>（三）公布票选结果</p>
        <p>11月29日投票截止，票数在前300名的候选人确定为平安好车主评选活动的获奖者。</p>
        <p>活动主办方保留最终解释权。</p>
      </div>
      <div class="part jp">
        <div class="title"><img src="./../../images/goodOwners-p6.png"></div>
        <div class="tips">本次活动共设置3个奖项。</div>
        <div class="item">
          <div class="pic"><img src="./../../images/goodOwners-p7.png"></div>
          <div class="text">
            <h3 class="title"><span class="y">一等奖</span>15名</h3>
            <p>每人奖励1吨汽油加油卡，同时可成为<span class="y">“深圳交通安全志愿者”</span>。</p>
          </div>
        </div>
        <div class="item">
          <div class="pic"><img src="./../../images/goodOwners-p8.png"></div>
          <div class="text">
            <h3 class="title"><span class="y">二等奖</span>30名</h3>
            <p>每人奖励价值3000元的汽车油卡，同时可成为<span class="y">“深圳交通安全志愿者”</span>。</p>
          </div>
        </div>
        <div class="item">
          <div class="pic"><img src="./../../images/goodOwners-p9.png"></div>
          <div class="text">
            <h3 class="title"><span class="y">三等奖</span>255名</h3>
            <p>每人奖励价值300元定制版深圳通，同时可成为<span class="y">“深圳交通安全志愿者”</span>。</p>
          </div>
        </div>
      </div>
    </div>
    <div class="tips">图片仅供参考，请以实物为准</div>
    <div class="next" @click="nextPage">我要报名</div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      isLogin: false,
      popupInfo: window.localStorage.getItem('goodOwners') ? JSON.parse(window.localStorage.getItem('goodOwners')) : {
        show: false,
        time: null,
        status: false
      }
    }
  },
  methods: {
    nextPage () {
      if (this.$route.query.type === 'P') {
        this.$router.push(`/goodOwners/registration_pa?type=P`)
        return false
      }
      if (!this.isLogin) {
        MessageBox('提示', '需要登录星级用户才能申请')
        this.$router.push('/login')
      } else {
        // 如果已经报名，则不显示弹窗
        if (this.popupInfo.status) {
          MessageBox('提示', '您已报名')
          return true
        }
        if (this.$route.query.type === '1062') {
          this.$router.push('/goodOwners/registration?type=1062')
        } else {
          this.$router.push('/goodOwners/registration')
        }
      }
    }
  },
  created () {
    this.isLogin = JSON.parse(window.localStorage.getItem('isLogin'))
  }
}
</script>

<style lang="less" scoped>
@import 'goodOwners.less';
</style>