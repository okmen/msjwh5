<template>
  <div id="takePhotosInform">
    <div class="tp-inform-box">
      <div class="tp-inform-left">违法时间</div>
      <div class="tp-inform-right tp-pick-time" @click="datetimePick('picker')">
        {{mtDateTimeMsg}}
      </div>
    </div>
    <div class="tp-inform-box">
      <div class="tp-inform-left">违法路段</div>
      <div class="tp-inform-right">
        <input type="text" maxlength="8" v-model="informRoad" placeholder="请输入违法路段(例如深南大道)" v-on:input="btnGetRoad">
        <ul v-if="showSelectRoad">
          <li v-for="(roadSelect, index) in roadSelectLists" @click="roadLiClick(index)">{{roadSelect.wfdd}}</li>
        </ul>
      </div>
    </div>
    <div class="form-line">
      <div class="form-line-item item-name">
        <span>车牌号码</span>
      </div>
      <div class="form-line-item div-select width-25">
        <span class="btn-select min-btn-select" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
        <div class="div-select-ul" v-if="abbreviationSelectShow">
          <ul>
            <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str)">
              {{item.str}}
            </li>
          </ul>
        </div>
      </div>
      <div class="form-line-item width-70 right">
        <input v-model="carNumber" class="text-input" type="text" style="text-transform:uppercase;" name="" value="" placeholder="请输入车牌号码">
      </div>
    </div>
    <div class="form-line">
      <div class="form-line-item item-name">
        <span>车牌类型</span>
      </div>
      <div class="form-line-item div-select width-100">
        <span class="btn-select" @click.stop="licenseSelectClick()" :data-type="licenseSelectType">{{ licenseSelectMassage }}</span>
        <div class="div-select-ul" v-if="licenseSelectShow">
          <ul>
            <li v-for="(item, index) in licenseSelectData" @click.stop = "licenseSelectClick(item.str, index)">{{item.str}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div class="form-line">
      <div class="form-line-item item-name">
        <span>违法行为</span>
      </div>
      <div class="form-line-item div-select width-100">
        <span class="btn-select" @click.stop="behaviorSelectClick()" :data-type="behaviorSelectType">{{ behaviorSelectMassage }}</span>
        <div class="div-select-ul" v-if="behaviorSelectShow">
          <ul>
            <li v-for="(item, index) in behaviorSelectData" @click.stop = "behaviorSelectClick(item.str, index)">{{item.str}}</li>
          </ul>
        </div>
      </div>
    </div> -->
    <div class="tp-photo-box">
      <div class="tp-photo-left">上传照片</div>
      <div class="tp-photo-right">
        <label class="tp-photo-1" for="file1">
          <input id="file1" type="file" accept="image/*" >
          <img :src="imgOne">
        </label>
        <label class="tp-photo-1" for="file2">
          <input id="file2" type="file" accept="image/*">
          <img :src="imgTwo">
        </label>
        <label class="tp-photo-1" for="file3">
          <input id="file3" type="file" accept="image/*">
          <img :src="imgThree">
        </label>
      </div>
    </div>
    <div class="tp-case-intro">
      <div class="tp-case-left">违法行为</div>
      <div class="tp-case-right">
        <textarea v-model="informIntroWhy" placeholder="请认真填写被举报车辆的违法项目"></textarea>
      </div>
    </div>
    <div class="tp-inform-box">
      <div class="tp-inform-left">举报人</div>
      <div class="tp-inform-right">
        <input type="text" maxlength="10" v-model="informName" placeholder="请输入您的名字"
         v-bind:readonly="this.loginJudge">
      </div>
    </div>
    <div class="tp-inform-box">
      <div class="tp-inform-left">身份证号</div>
      <div class="tp-inform-right">
        <input type="text" maxlength="19" v-model="informIdNumber" placeholder="请输入身份证号码"
         v-bind:readonly="this.loginJudge">
      </div>
    </div>
    <div class="tp-inform-box">
      <div class="tp-inform-left">联系电话</div>
      <div class="tp-inform-right">
        <input type="text" maxlength="11" v-model="informTel" placeholder="请输入正确的电话号码"
          v-bind:readonly="this.loginJudge">
      </div>
    </div>
    <div class="tp-btn-submit" @click="btnSurePutInform">确认提交</div>
    <div class="tp-look-tips">
      <!--<a>点击查看温馨提示</a>-->
      <!-- <router-link to="takePicturesTips">点击查看温馨提示</router-link> -->
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <mt-datetime-picker ref="picker" v-model="informTime" @confirm="handleTime"></mt-datetime-picker>
  </div>
</template>
<script>
  import { resultPost } from '../../service/getData'
  import { takePictures, getRoad } from '../../config/baseUrl'
  import UploadFile from '../../service/uploadFile-watermark'
  import { Toast, Indicator } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'takePicturesInform',
    data () {
      return {
        mtDateTimeMsg: '',                                              // 一进来默认当前时间
        showSelectRoad: false,                                          // 是否显示路段列表
        roadSelectLists: [],                                            // 路段列表
        informTime: this.currentTime(),                                 // 违法时间
        informRoad: '',                                                 // 违法路段
        informType: '',                                                 // 违法路段数值
        informItem: '',                                                 // 违法路段数值加文字
        licenseSelectShow: false,
        licenseSelectMassage: '蓝牌',
        licenseSelectType: '02',
        licenseSelectData: [
          {
            'str': '蓝牌',
            'type': '02'
          },
          {
            'str': '黄牌',
            'type': '01'
          },
          {
            'str': '黑牌',
            'type': '06'
          },
          {
            'str': '个性牌',
            'type': '02'
          },
          {
            'str': '小型新能源车号牌',
            'type': '52'
          },
          {
            'str': '大型新能源车号牌',
            'type': '51'
          }
        ],
        behaviorSelectShow: false,
        behaviorSelectMassage: '未使用专用清障车拖曳转向或照明、信号装置失效的机动车的',
        behaviorSelectType: '6010---未使用专用清障车拖曳转向或照明、信号装置失效的机动车的',
        behaviorSelectData: [],
        abbreviationSelectShow: false,
        abbreviationSelectMassage: '粤',
        abbreviationSelectData: [
          {
            'str': '粤'
          },
          {
            'str': '鄂'
          },
          {
            'str': '豫'
          },
          {
            'str': '皖'
          },
          {
            'str': '赣'
          },
          {
            'str': '冀'
          },
          {
            'str': '鲁'
          },
          {
            'str': '浙'
          },
          {
            'str': '苏'
          },
          {
            'str': '湘'
          },
          {
            'str': '闽'
          },
          {
            'str': '蒙'
          },
          {
            'str': '京'
          },
          {
            'str': '辽'
          },
          {
            'str': '渝'
          },
          {
            'str': '沪'
          },
          {
            'str': '陕'
          },
          {
            'str': '川'
          },
          {
            'str': '黑'
          },
          {
            'str': '晋'
          },
          {
            'str': '桂'
          },
          {
            'str': '吉'
          },
          {
            'str': '宁'
          },
          {
            'str': '贵'
          },
          {
            'str': '琼'
          },
          {
            'str': '甘'
          },
          {
            'str': '青'
          },
          {
            'str': '津'
          },
          {
            'str': '云'
          },
          {
            'str': '藏'
          },
          {
            'str': '新'
          }
        ],
        carNumber: 'B',         // 车牌号
        imgOne: '',                                                     // 上传照片
        imgOneTime: '',
        imgTwo: '',
        imgTwoTime: '',
        imgThree: '',
        imgThreeTime: '',
        informIntroWhy: '',                                             // 情况说明
        informName: '',                                                 // 举报人姓名
        informIdNumber: '',                                             // 举报人身份证号
        informTel: '',                                                  // 举报人电话号码
        loginJudge: window.localStorage.isLogin,                        // 判读是否登录
        formatTime: '',                                                  // 使用mt组件后，时间是中国标准时间，格式转换
        t: ''
      }
    },
    mounted: function () {                                              // 组件加载完成之后立即获取
      this.init()
      // let that = this
      let getTime = this.currentTime()
      this.mtDateTimeMsg = getTime
      if (this.loginJudge) {
        this.informName = window.localStorage.userName
        this.informIdNumber = window.localStorage.identityCard
        this.informTel = window.localStorage.mobilePhone
      }
      document.addEventListener('click', (e) => {
        this.behaviorSelectShow = false
        this.licenseSelectShow = false
        this.abbreviationSelectShow = false
      })
      // resultGet(getTheChoiceOfIllegalActivities).then(json => {
      //   json.data.list.forEach((item, index) => {
      //     that.behaviorSelectData[index] = {
      //       'type': item.wfxw.split('---')[0],
      //       'str': item.wfxw.split('---')[1],
      //       'wfxw': item.wfxw
      //     }
      //   })
      // })
    },
    methods: {
      licenseSelectClick: function (str, index) {
        if (str) {
          this.licenseSelectMassage = str
          this.licenseSelectType = this.licenseSelectData[index].type
        }
        if (this.licenseSelectShow === true) {
          this.licenseSelectShow = false
        } else {
          this.licenseSelectShow = true
          this.abbreviationSelectShow = false
          this.behaviorSelectShow = false
        }
      },
      behaviorSelectClick: function (str, index) {
        if (str) {
          this.behaviorSelectMassage = str
          this.behaviorSelectType = this.behaviorSelectData[index].wfxw
        }
        if (this.behaviorSelectShow === true) {
          this.behaviorSelectShow = false
        } else {
          this.behaviorSelectShow = true
          this.abbreviationSelectShow = false
        }
      },
      abbreviationSelectClick: function (str) {
        if (str) {
          this.abbreviationSelectMassage = str
        }
        if (this.abbreviationSelectShow === true) {
          this.abbreviationSelectShow = false
        } else {
          this.abbreviationSelectShow = true
          this.licenseSelectShow = false
          this.behaviorSelectShow = false
        }
      },
      datetimePick: function (picker) {
        this.$refs.picker.open()
      },
      handleTime: function (informTime) {
        this.formatTime = this.format(this.informTime.toString(), 'yyyy-MM-dd HH:mm:ss')
        this.mtDateTimeMsg = this.formatTime
        console.log(this.mtDateTimeMsg)
      },
      init: function () {  // 上传图片
        UploadFile.upload({
          id: 'file1',
          callback: (res) => {
            console.log(res)
            this.imgOne = res.imgUrl
            this.imgOneTime = res.dateTime
          }
        })
        UploadFile.upload({
          id: 'file2',
          callback: (res) => {
            console.log(res)
            this.imgTwo = res.imgUrl
            this.imgTwoTime = res.dateTime
          }
        })
        UploadFile.upload({
          id: 'file3',
          callback: (res) => {
            console.log(res)
            this.imgThree = res.imgUrl
            this.imgThreeTime = res.dateTime
          }
        })
      },
      btnSurePutInform: function () {  // 提交拍照举报按钮
        let numbers = this.abbreviationSelectMassage + this.carNumber.toLocaleUpperCase()   // 车牌号码
        let imgArr = [this.imgOne, this.imgTwo, this.imgThree].filter(x => x !== '')
        if (!this.informTime) {
          Toast({message: '请点击设置违法时间', position: 'bottom', className: 'white'})
        } else if (!this.informRoad) {
          Toast({message: '请输入违法路段', position: 'bottom', className: 'white'})
        } else if (this.$plateerification(numbers)) {
          Toast({message: this.$plateerification(numbers), position: 'bottom', className: 'white'})
        } else if (imgArr.length < 2) {
          Toast({message: '举报图片不得少于两张', position: 'bottom', className: 'white'})
        } else if (!this.informIntroWhy) {
          Toast({message: '请输入情况说明', position: 'bottom', className: 'white'})
        } else if (!this.informName) {
          Toast({message: '请输入举报人姓名', position: 'bottom', className: 'white'})
        } else if (!this.informIdNumber) {
          Toast({message: '请输入您的身份证号', position: 'bottom', className: 'white'})
        } else if (/[（* | ）* ]/g.test(this.informIdNumber)) {
          Toast({message: '请使用英文状态下的括号', position: 'bottom', className: 'white'})
        } else if (!this.informTel) {
          Toast({message: '请输入您的电话号码', position: 'bottom', className: 'white'})
        } else {
          Indicator.open('提交中...') // 图片转换为base64后提交会需要时间
          let informData = {
            illegalTime: this.mtDateTimeMsg,                        // 违法时间
            illegalSections: this.informItem,                       // 违法路段
            reportImgOne: !this.imgOne.split(',')[1] ? '' : this.imgOne.split(',')[1],                // 上传照片
            reportImgOneT1: this.imgOneTime || '',
            reportImgTwo: !this.imgTwo.split(',')[1] ? '' : this.imgTwo.split(',')[1],
            reportImgOneT2: this.imgTwoTime || '',
            reportImgThree: !this.imgThree.split(',')[1] ? '' : this.imgThree.split(',')[1],
            reportImgOneT3: this.imgThreeTime || '',
            licensePlateType: this.licenseSelectType,               // 车牌类型
            licensePlateNumber: this.abbreviationSelectMassage + this.carNumber.toLocaleUpperCase(),
            illegalActivitieOne: this.informIntroWhy,               // 违法行为
            inputManName: this.informName,                          // 举报人
            identityCard: this.informIdNumber,                      // 身份证号
            inputManPhone: this.informTel,                          // 电话号码
            userSource: 'C',
            openId: window.localStorage.openId
          }
          resultPost(takePictures, informData).then(json => { // 调取随手拍举报接口
            Indicator.close()
            if (json.code === '0000') {
              this.postInform({
                takePicturesRecord: json.data.recordNumber,
                takePicturesPassword: json.data.queryPassword
              })
              this.$router.push('/takePicturesSuccess')
            } else {
              Toast({
                message: json.msg,
                position: 'bottom',
                className: 'white'
              })
            }
          })
        }
      },
      btnGetRoad: function () {  // 点击选择交通路段
        clearTimeout(this.t)
        this.t = setTimeout(() => {
          if (this.informRoad === '') { // 判断输入为空时不显示下拉列表
            this.showSelectRoad = false
          } else {
            this.showSelectRoad = true
          }
          let getRoadData = {
            keyword: this.informRoad
          }
          let that = this
          resultPost(getRoad, getRoadData).then(json => {
            if (json.data) {
              let roadLists = json.data.list
              let roadArry = []
              if (roadLists.length >= 2) {
                roadLists.forEach((item, index) => {
                  let roadObj = {
                    'wfdd': item.wfdd.split('---')[1],
                    'type': item.wfdd.split('---')[0],
                    'roadLi': item.wfdd
                  }
                  roadArry.push(roadObj)
                  that.roadSelectLists = roadArry
                })
              }
            } else {
              Toast({
                message: '请输入正确的路段，不用太详细',
                position: 'bottom',
                className: 'white'
              })
            }
          })
        }, 2000)
      },
      currentTime: function () {  // 获取时间
        let now = new Date()
        let year = now.getFullYear()       // 年
        let month = now.getMonth() + 1     // 月
        let day = now.getDate()            // 日
        let hh = now.getHours()            // 时
        let mm = now.getMinutes()          // 分
        let ss = now.getSeconds()          // 秒
        let clock = year + '-'
        if (month < 10) {
          clock += '0'
        }
        clock += month + '-'
        if (day < 10) {
          clock += '0'
        }
        clock += day + ' '
        if (hh < 10) {
          clock += ' '
        }
        clock += hh + ':'
        if (mm < 10) {
          clock += '0'
        }
        clock += mm + ':'
        if (ss < 10) {
          clock += '0'
        }
        clock += ss
        return (clock)
      },
      roadLiClick: function (index) { // Li的点击事件
        this.informRoad = this.roadSelectLists[index].wfdd
        this.informType = this.roadSelectLists[index].type
        this.informItem = this.roadSelectLists[index].roadLi
        this.showSelectRoad = false
      },
      inputTime: function () {
        console.log(111)
      },
      ...mapActions({
        postInform: 'postInform'
      }),
      format: function (time, format) {   // 中国标准时间转换为datetime格式
        var t = new Date(time)
        var tf = function (i) { return (i < 10 ? '0' : '') + i }
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
          switch (a) {
            case 'yyyy':
              return tf(t.getFullYear())
            case 'MM':
              return tf(t.getMonth() + 1)
            case 'mm':
              return tf(t.getMinutes())
            case 'dd':
              return tf(t.getDate())
            case 'HH':
              return tf(t.getHours())
            case 'ss':
              return tf(t.getSeconds())
          }
        })
      }
    }
  }
</script>
<style lang="less" >
#takePhotosInform{
  padding:0 50px;
  .tp-inform-box{
    margin-top:38px;
    width:100%;
    height:60px;
    .tp-inform-left{
      float:left;
      width:130px;
      height:100%;
      font-size:26px;
      line-height:60px;
      color:#000;
    }
    .tp-inform-right{
      float:left;
      width:520px;
      height:100%;
      background:#efeff4;
      border:1px solid #eaeaed;
      -webkit-border-radius:8px;
      -moz-border-radius:8px;
      border-radius:8px;
      input{
        padding:17px 0 17px 20px;
        width:518px;
        height:100%;
        background:none;
        font-size:26px;
        outline:none;
        -webkit-border-radius:8px;
        -moz-border-radius:8px;
        border-radius:8px;
      }
      input:focus{
        background:#efeff4;
      }
      .el-date-editor{
         border:none;
         .el-input__icon{
           display:none;
         }
         .el-input__inner{
           width:518px;
           height:100%;
           border:none;
         }
      }
      .el-input{
        width:518px;
        height:60px;
        line-height:60px;
      }
      ul{
        position:relative;
        overflow:hidden;
        overflow-y:auto;
        width:518px;
        height:520px;
        z-index:999;
        li{
          width:100%;
          height:50px;
          background:#FFF;
          border-bottom:1px solid #efeff4;
          font-size:26px;
          line-height:50px;
          text-align:center;
          z-index:999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .tp-pick-time{
      padding:10px 0 17px 20px;
      width:518px;
      height:100%;
      background:#efeff4;
      font-size:26px;
    }
  }
  .tp-photo-box{
    margin-top:30px;
    width:100%;
    height:164px;
    .tp-photo-left{
      float:left;
      width:130px;
      height:100%;
      font-size:26px;
      color:#000;
    }
    .tp-photo-right{
      float:left;
      width:520px;
      .tp-photo-1{
        position:relative;
        float:left;
        margin-right:8px;
        width:163px;
        height:163px;
        background:#FFF url("../../images/tpInformAngle.png") center no-repeat;
        background-size:80%;
        border:1px solid #dddde1;
        -webkit-border-radius:8px;
        -moz-border-radius:8px;
        border-radius:8px;
        img{
          width:163px;
          height:163px;
          -webkit-border-radius:8px;
          -moz-border-radius:8px;
          border-radius:8px;
        }
        input{
          position:absolute;
          width:100%;
          height:100%;
          visibility:hidden;
          top:0;
          left:0;
          z-index:998;
        }
      }
      .tp-photo-1:last-child{
        margin-right:0;
        float:right;
      }
    }
  }
  .tp-case-intro{
    margin-top:30px;
    width:100%;
    height:294px;
    .tp-case-left{
      float:left;
      width:130px;
      height:100%;
      font-size:26px;
      color:#000;
    }
    .tp-case-right{
      float:left;
      width:520px;
      height:294px;
      textarea{
        padding:8px 20px 0;
        width:100%;
        height:100%;
        background:#efeff4;
        font-size:26px;
        outline:none;
        resize:none;
        border:1px solid #dddde1;
        -webkit-border-radius:8px;
        -moz-border-radius:8px;
        border-radius:8px;
      }
      textarea:focus{
        background:#efeff4;
      }
    }
  }
  .tp-btn-submit{
    margin-top:50px;
    margin-bottom:26px;
    width:100%;
    height:80px;
    background:#09bb07;
    color:#FFF;
    font-size:32px;
    line-height:80px;
    text-align:center;
    -webkit-border-radius:8px;
    -moz-border-radius:8px;
    border-radius:8px;
  }
  .tp-look-tips{
    width:100%;
    height:26px;
    margin-bottom:30px;
    a{
      font-size:26px;
      color:#24a6f8;
      text-decoration:underline;
    }
  }
}
.mint-toast{
  .mint-toast-text{
    color:#FFF;
  }
}
.width-25 {
   width: 25% !important;
}
.width-70 {
   width: 70% !important;
}
.width-100 {
   width: 100% !important;
}
.form-line {
padding: 20px 0 0 130px;
position: relative;
line-height: 56px;
.form-line-item {
   display: inline-block;
   height: 60px;
   line-height:60px;
   font-size:26px;
     span {
       vertical-align: middle;
     }
    .browse-code {
       display: inline-block;
       height: 56px;
       width: 100%;
      line-height: 52px;
      border-radius: 10px;
       text-align: center;
       color:#fff;
       vertical-align:middle;
        .code-icon {
          background: url("./../../images/browse.png");
          background-size: 32px 32px;
          display: inline-block;
          width:32px;
          height: 32px;
          vertical-align: -6px;
          margin-right: 10px;
        }
     }
}
.item-name {
   width: 130px;
   position: absolute;
   left: 0;
}
.payLawless-hbs-code {
  margin-left: 40px;
  text-indent: 28px;
  width: 240px;
  height: 60px;
  text-decoration: underline;
}
}
</style>

