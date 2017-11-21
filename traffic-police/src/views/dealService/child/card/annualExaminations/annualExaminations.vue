<template>
  <!-- 驾驶证年审组件 -->
  <div class="annualExaminations-outer">
    <div class="annualExaminations-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="name" class="text-input" type="text" name="" placeholder="请输入姓名">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>身份证号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="IDcard" class="text-input" type="text" name="" placeholder="请输入身份证号码">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>手机号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="mobilephone" class="text-input" type="text" name="" placeholder="请输入手机号码">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>户籍所在地</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="placeSelectClick()">{{ placeSelectMassage }}</span>
            <div class="div-select-ul" v-if="placeSelectShow">
              <ul>
                <li v-for="item in placeSelectData" @click.stop="placeSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverName" class="text-input" type="text" name="" value="" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人号码</span>
          </div>
          <div class="form-line-item">
            <input  v-model="receiverNumber" class="text-input" type="text" name="" value=""  readonly>
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
            <input v-model="mailingAddress" class="text-input" type="text" name="" placeholder="请输入详细地址">
          </div>
        </li>
      </ul>
    </div>
    <userUpload :buttonIsClick="buttonIsClick" :idCard1="true" :idCard2="true" :eduTable="true" :outTable="outTable" @btnSureStar="btnSureStar()" ref="getImgUrl"></userUpload>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<style lang="less" scoped>
  .annualExaminations-outer {
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    padding: 20px 40px;
    .annualExaminations-form {
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
        }
        .item-name {
          width: 180px;
          position: absolute;
          left: 0;
        }
        .div-select {
          font-size: 24px;
        }
      }
    }
    .width-25 {
      width: 25% !important;
    }
    .width-40 {
      width: 40% !important;
    }
    .width-35 {
      width: 35% !important;
    }
    .width-50 {
      width: 50% !important;
    }
    .width-60 {
      width: 60% !important;
    }
    .width-70 {
      width: 70% !important;
    }
  }

</style>
<script>
  import { annualExaminations } from '../../../../../config/baseUrl'
  import { Toast, MessageBox } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'annualExaminations',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        buttonIsClick: false,
        name: window.localStorage.getItem('userName'),
        IDcard: window.localStorage.getItem('identityCard'),
        mobilephone: window.localStorage.getItem('mobilePhone'),
        cur_place_id: '1',                                          // 默认户籍所在地id  1为深圳
        cur_area_id: '01',                                          // 默认区名id  01为福田
        placeSelectShow: false,
        placeSelectMassage: '深圳',
        placeSelectData: [
          {
            'id': '1',
            'str': '深圳'
          },
          {
            'id': '2',
            'str': '港澳台籍'
          },
          {
            'id': '3',
            'str': '外国籍'
          },
          {
            'id': '4',
            'str': '其他'
          }
        ],
        receiverName: window.localStorage.getItem('userName'),
        receiverNumber: window.localStorage.getItem('mobilePhone'),
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
        mailingAddress: '',
        outTable: false                                             // 境外人员临住表 默认不显示
      }
    },
    components: {
      'userUpload': require('../../userUpload.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    methods: {
      placeSelectClick: function (str, id) {
        if (str) {
          this.placeSelectMassage = str
          this.cur_place_id = id
          if (this.cur_place_id === '3') {                          // 当选择户籍为外国籍时 显示境外人员临住表上传
            this.outTable = true
          } else {
            this.outTable = false
          }
        }
        if (this.placeSelectShow === true) {
          this.placeSelectShow = false
        } else {
          this.placeSelectShow = true
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
        let idImgThree = this.$refs.getImgUrl.imgEducate
        let idImgThreeIf = idImgThree.substr(0, 4) === 'data' || false
        let idImgFour = this.$refs.getImgUrl.imgOut
        let idImgFourIf = idImgFour.substr(0, 4) === 'data' || false
        if (!this.IDcard) {
          Toast({message: '请输入证件号码', position: 'bottom', className: 'white'})
        } else if (!this.name) {
          Toast({message: '请输入姓名', position: 'bottom', className: 'white'})
        } else if (!this.IDcard) {
          Toast({message: '请输入手机号', position: 'bottom', className: 'white'})
        } else if (!this.mailingAddress) {
          Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
        } else if (!idImgOneIf || !idImgTwoIf) {
          Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
        } else if (!idImgThreeIf) {
          Toast({message: '请上传审核教育绘制表', position: 'bottom', className: 'white'})
        } else if (!idImgFourIf && this.cur_place_id === '3') {
          Toast({message: '请上传境外人员临住表', position: 'bottom', className: 'white'})
        } else {
          let reqData = {
            type: '驾驶证年审',
            url: annualExaminations,
            textObj: {
              identityCard: this.IDcard,
              userName: this.name,
              mobilephone: this.mobilephone,
              placeOfDomicile: this.cur_place_id,
              receiverName: this.receiverName,
              receiverNumber: this.receiverNumber,
              receiverAddress: '深圳市' + this.areaSelectMassage + this.mailingAddress
            },
            imgObj: {
              PHOTO9: idImgOne.split(',')[1] || '',
              PHOTO10: idImgTwo.split(',')[1] || '',
              PHOTO31: idImgFour.split(',')[1] || '',
              SHJYPXB: idImgThree.split(',')[1] || ''
            },
            invisibleObj: {
              JZZA: idImgOne.split(',')[1] || '',      // 居住证照片 页面不给居住证上传入口 直接传与身份证正反面同样的数据
              JZZB: idImgTwo.split(',')[1] || '',
              loginUser: window.localStorage.getItem('identityCard'),
              userSource: 'C',
              identificationNO: 'A'
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
        this.placeSelectShow = false
        this.areaSelectShow = false
      })
    }
  }
</script>
