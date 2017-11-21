<template>
  <div class="changeConnect-outer">
    <div class="changeConnect-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件名称</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="cardSelectClick()">{{ cardSelectMassage }}</span>
            <div class="div-select-ul" v-if="cardSelectShow">
              <ul>
                <li v-for="item in cardSelectData" @click.stop="cardSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="IDcard" maxlength="20" class="text-input" type="tel" placeholder="请输入证件号码">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>用户姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="name" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>用户性别</span>
          </div>
          <div class="form-line-item width-40 sex">
            <input type="radio"  name="sex" value="1" v-model:checked="sex">
            <label>男</label>
          </div>
          <div class="form-line-item width-40 sex">
            <input type="radio"  name="sex" value="2" v-model:checked="sex">
            <label>女</label>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>驾驶证号</span>
          </div>
          <div class="form-line-item">
            <input v-model="driverLicense" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>手机号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="mobilephone" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>邮寄地址</span>
          </div>
          <div class="form-line-item width-40 city">
            <span>深圳市</span>
          </div>
          <div class="div-select form-line-item width-50">
            <span class="btn-select" @click.stop="areaSelectClick()">{{ areaSelectMassage }}</span>
            <div class="div-select-ul" v-if="areaSelectShow">
              <ul>
                <li v-for="item in areaSelectData" @click.stop="areaSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span></span>
          </div>
          <div class="form-line-item">
            <input class="text-input" v-model="mailingAddress" type="text" placeholder="请输入详细地址">
          </div>
        </li>
      </ul>
    </div>
    <userUpload :buttonIsClick="buttonIsClick" :idCard1="true" :idCard2="true" :license="true" @btnSureStar="btnSureStar()" ref="getImgUrl"></userUpload>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
  // import { resultPost } from '../../../../../service/getData'
  import { changeConnect } from '../../../../../config/baseUrl'
  import { Toast, MessageBox } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        buttonIsClick: false,
        IDcard: window.localStorage.getItem('identityCard'),
        name: window.localStorage.getItem('userName'),
        sex: '',                                                        // 性别checkbox选择
        driverLicense: window.localStorage.getItem('identityCard'),
        mobilephone: window.localStorage.getItem('mobilePhone'),
        cur_card_id: 'A',                                               // 默认证件类型id A为身份证
        cur_area_id: '01',                                              // 默认区名id 01为福田区
        cardSelectShow: false,
        cardSelectMassage: '居民身份证',
        cardSelectData: [
          {
            'id': 'A',
            'str': '居民身份证'
          },
          {
            'id': 'B',
            'str': '组织机构代码书'
          },
          {
            'id': 'C',
            'str': '军官证'
          },
          {
            'id': 'E',
            'str': '军官离退休证'
          },
          {
            'id': 'D',
            'str': '士兵证'
          },
          {
            'id': 'F',
            'str': '境外人员身份证明'
          },
          {
            'id': 'G',
            'str': '外交人员身份证明'
          },
          {
            'id': 'H',
            'str': '居民户口簿'
          },
          {
            'id': 'J',
            'str': '单位注销证明'
          },
          {
            'id': 'K',
            'str': '居住暂住证明'
          },
          {
            'id': 'L',
            'str': '驻华机构证明'
          },
          {
            'id': 'M',
            'str': '临时居民身份证'
          }
        ],
        areaSelectShow: false,
        areaSelectMassage: '福田区',
        areaSelectData: [
          {
            'id': '01',
            'str': '福田区'
          },
          {
            'id': '02',
            'str': '罗湖区'
          },
          {
            'id': '03',
            'str': '南山区'
          },
          {
            'id': '04',
            'str': '宝安区'
          },
          {
            'id': '05',
            'str': '龙岗区'
          },
          {
            'id': '06',
            'str': '盐田区'
          },
          {
            'id': '07',
            'str': '龙华新区'
          },
          {
            'id': '08',
            'str': '光明新区'
          },
          {
            'id': '09',
            'str': '坪山新区'
          },
          {
            'id': '10',
            'str': '大鹏新区'
          }
        ],
        mailingAddress: ''
      }
    },
    components: {
      'userUpload': require('../../userUpload.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    methods: {
      cardSelectClick: function (str, id) {
        if (str) {
          this.cardSelectMassage = str
          this.cur_card_id = id
          if (this.cur_card_id === 'A') {
            this.IDcard = window.localStorage.getItem('identityCard')
          } else {
            this.IDcard = ''
          }
        }
        if (this.cardSelectShow === true) {
          this.cardSelectShow = false
        } else {
          this.cardSelectShow = true
        }
      },
      areaSelectClick: function (str, id) {
        if (str) {
          this.areaSelectMassage = str
          this.cur_area_id = id
        }
        if (this.areaSelectShow === true) {
          this.areaSelectShow = false
        } else {
          this.areaSelectShow = true
        }
      },
      btnSureStar: function () {   // 确认提交按钮
        let idImgOne = this.$refs.getImgUrl.imgIDcard1
        let idImgOneIf = idImgOne.substr(0, 4) === 'data' || false
        let idImgTwo = this.$refs.getImgUrl.imgIDcard2
        let idImgTwoIf = idImgTwo.substr(0, 4) === 'data' || false
        let idImgThree = this.$refs.getImgUrl.imgLicense
        let idImgThreeIf = idImgThree.substr(0, 4) === 'data' || false
        console.log(idImgOneIf, idImgTwoIf, idImgThreeIf)
        if (!this.IDcard) {
          Toast({message: '请输入证件号码', position: 'bottom', className: 'white'})
        } else if (!this.sex) {
          Toast({message: '请选择性别', position: 'bottom', className: 'white'})
        } else if (!this.mailingAddress) {
          Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
        } else if (!idImgOneIf || !idImgTwoIf) {
          Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
        } else if (!idImgThreeIf) {
          Toast({message: '请上传驾驶证照片', position: 'bottom', className: 'white'})
        } else {
          let reqData = {
            type: '驾驶人联系方式变更',
            url: changeConnect,
            textObj: {
              identificationNO: this.cur_card_id,
              identificationNum: this.IDcard,
              userName: this.name,
              gender: this.sex,
              driverLicense: this.driverLicense,
              mobilephone: this.mobilephone,
              receiverAddress: '深圳市' + this.areaSelectMassage + this.mailingAddress
            },
            imgObj: {
              PHOTO9: idImgOne.split(',')[1] || '',
              PHOTO10: idImgTwo.split(',')[1] || '',
              JSZZP: idImgThree.split(',')[1] || ''
            },
            invisibleObj: {
              loginUser: window.localStorage.getItem('identityCard'),
              userSource: 'C'
            }
          }
          console.log(reqData)
          this.$store.commit('saveMotorVehicleHandling', reqData)
          this.$router.push(this.isWeChat ? '/affirmInfo_WeChat' : '/affirmInfo')
        }
      },
      beforeDestory () {
        Toast.close()
      },
      ...mapActions({
        postAppoin: 'postAppoin'
      })
    },
    created () {
      if (!window.localStorage.getItem('fileNumber')) {
        MessageBox('温馨提示', '您还没绑定驾驶证,请到星级用户中心绑定！')
        this.buttonIsClick = true
      }
      document.addEventListener('click', (e) => {
        this.cardSelectShow = false
        this.areaSelectShow = false
      })
    }
  }
</script>
<style lang="less" scoped>
  .changeConnect-outer {
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    padding: 20px 40px;
    .changeConnect-form {
      background-color: #fff;
      padding-top:20px;
      .form-line {
        padding: 20px 0 0 180px;
        position: relative;
        line-height: 56px;
        .form-line-item {
          width: 100%;
          display: inline-block;
          height: 60px;
          line-height:60px;
          span {
            vertical-align: middle;
          }
          &.city {
            margin: 0 18px;
          }
          &.sex {
            text-align: center;
          }
        }
        .item-name {
          width: 180px;
          position: absolute;
          left: 0;
          margin-right: 20px;
        }
        .div-select {
          font-size: 24px;
        }
      }
    }
    .width-40 {
      width: 40% !important;
    }
    .width-50 {
      width: 50% !important;
    }
  }
</style>
