<template>
    <div class="m-goodOwnersRegistration">
      <div class="header"><img src="./../../images/goodOwners-p13.png" /> 报名信息</div>
      <div class="from">
        <div class="item">
          <label>车主姓名：</label>
          <div class="box">
            <input type="text" v-model="form.userName" placeholder="请输入车主姓名">
          </div>
        </div>
        <div class="item">
          <label>驾驶证号：</label>
          <div class="box">
            <input type="text" v-model="form.identityCard" placeholder="请输入驾驶证号">
          </div>
        </div>
        <div class="item">
          <label>车牌号码：</label>
          <div class="box">
            <input type="text" v-model="form.numberPlate" placeholder="请输入车牌号码">
          </div>
        </div>
        <div class="item">
          <label>手机号码：</label>
          <div class="box">
            <input type="text" v-model="form.mobilePhone" placeholder="请输入手机号码">
          </div>
        </div>
        <div class="upload-img">
          <div class="title">
            上传个人照片
            <span class="more" @click="sampleStatus = true">示例照片</span>
          </div>
          <label for="file">
            <input id="file" type="file" accept="image/*">
            <img :src="form.img" v-if="form.img" />
          </label>
          <div class="info">温馨提示：请按照示例上传本人正面半身或全身照片。照片不能辨别或者打有马赛克的均视为不合格。照片不合格将失去参选资格。</div>
        </div>
        <div class="text">
          <div class="title">交通安全宣言</div>
          <div class="box"><textarea rows="4" placeholder="这一刻，想要说什么 ..." v-model="form.text"></textarea></div>
        </div>
        <div class="submit" @click="confirmInfo">
          下一步
        </div>
      </div>
      <!-- 示例照片 -->
      <div class="samplebox" v-show="sampleStatus">
        <div class="sample">
          <div class="close" @click="sampleStatus = false"><img src="./../../images/goodOwners-p3.png"></div>
          <div class="title">示例照片<p>请按照示例上传本人正面半身或全身照片。</p></div>
          <div class="box">
            <dl>
              <dt>半身照（正面）</dt>
              <dd><img src="./../../images/goodOwners-p1.jpg"></dd>
            </dl>
            <dl>
              <dt>全身照（正面）</dt>
              <dd><img src="./../../images/goodOwners-p2.jpg"></dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Select, Option } from 'element-ui'
  import { Toast } from 'mint-ui'
  import uploadFile from 'src/service/uploadFile2.js'
  export default {
    components: {
      'el-select': Select,
      'el-option': Option
    },
    data () {
      return {
        sampleStatus: false,
        cars: [],
        selectCars: null,
        form: {
          img: null,
          userName: '',
          identityCard: '',
          mobilePhone: '',
          numberPlate: '',
          carNumber: '',
          text: ''
        }
      }
    },
    methods: {
      confirmInfo () {
        console.log(this.form.userName)
        if (this.form.userName === '') {
          Toast({
            message: '车主姓名不能为空',
            position: 'bottom'
          })
          return false
        }
        if (this.form.identityCard === '') {
          Toast({
            message: '驾驶证号不能为空',
            position: 'bottom'
          })
          return false
        }
        if (this.form.mobilePhone === '') {
          Toast({
            message: '手机号码不能为空',
            position: 'bottom'
          })
          return false
        }
        if (!/^1\d{10}$/.test(this.form.mobilePhone)) {
          Toast({
            message: '手机号码格式错误',
            position: 'bottom'
          })
          return false
        }
        if (!this.form.img) {
          Toast({
            message: '您还没有上传图片',
            position: 'bottom'
          })
          return false
        }
        if (this.form.text.length < 3 || this.form.text.length > 30 || /^\d*$/.test(this.form.text)) {
          Toast({
            message: '交通安全宣言为3到30个有效字符',
            position: 'bottom'
          })
          return false
        }
        this.$store.commit('savePageRecord', this.form)
        this.$router.push(`/goodOwners/confirminfo?type=${this.$route.query.type}`)
      },
      handleCarChange () {
        this.form.carNumber = this.selectCars.myNumberPlate
        this.form.numberPlate = this.selectCars.plateType
      }
    },
    mounted () {
      uploadFile.upload({
        id: 'file',
        callback: (res) => {
          console.log(res)
          this.form.img = res.imgUrl
        }
      })
      // 如果存在历史记录，则使用历史记录
      let record = this.$store.state.pageRecord.data
      this.form.carNumber = record.carNumber || ''
      this.form.img = record.img || null
      this.form.text = record.text || ''
      this.form.userName = record.userName || ''
      this.form.identityCard = record.identityCard || ''
      this.form.numberPlate = record.numberPlate || ''
      this.form.mobilePhone = record.mobilePhone || ''
    }
  }
  </script>
  
  <style lang="less" scoped>
  @import 'goodOwners.less';
  </style>