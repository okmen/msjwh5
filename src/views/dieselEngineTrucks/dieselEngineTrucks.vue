<template>
  <div class="dieselEngineTrucks">
    <div class="dieselEngineTrucks-form">
      <!-- <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>业务类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="typeClick()">{{ typeMsg }}</span>
            <div class="div-select-ul" v-if="typeShow">
              <ul>
                <li v-for="(item, index) in typeData" :key="index" @click.stop="typeClick(item.str, item.id)">{{ item.str }}</li>
              </ul>
            </div>
          </div>
        </li>
      </ul> -->
      <g-select title="业务类型" :data="typeData" v-model="typeId"></g-select>
      <div v-if="this.typeId === '2'">
        <g-select title="车牌号码" :data="plateNumber" v-model="plateNumberOne" ref="plateNumberName"></g-select>
      </div>
      <ul v-if="this.typeId === '2'">
        <div class="form-line clear">
          <div class="form-line-item item-name">
            <span>车牌号码</span>
          </div>
            <div class="div-select left" >
              <span class="btn-select width-45">{{ abbreviationSelectMassage }}</span>
            </div>
          <div class="div-select left abbreviationLeft" >
            <span class="btn-select width-45">{{ mold }}</span>
          </div>
          <div class="width-53 right">
            <input class="text-input bg-colour" type="text" v-model="numberPlate" name="" value="" maxlength="5" placeholder="请输入车牌号码" >
          </div>
        </div>
        <div class="form-line">
          <div class="form-line-item item-name">
            <span>rfid号码</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" v-model="rfidVal" placeholder="请输入rfid车号"/>
          </div>
        </div>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车架号</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" maxlength="4" v-model="vehicleIdentificationNumber" placeholder="请输入车架号后4位"/>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>申请类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select stylebackground" @click.stop="ownerClick()">{{ ownerTimeMsg }}</span>
            <div class="div-select-ul" v-if="ownerShow">
              <ul>
                <li v-for="item in ownerData" @click.stop="ownerClick(item.longName, item.id)">{{item.longName}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line" v-if ="this.ownerid === '2'">
          <div class="form-line-item item-name">
            <span>单位名称</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" v-model="monadName" placeholder="请输入单位名称"/>
          </div>
        </li>
        <li class="form-line clear">
          <div class="form-line-item item-name">
            <span>车牌号码</span>
          </div>
            <div class="div-select left" >
              <span class="btn-select width-45" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
              <div class="div-select-ul" v-if="abbreviationSelectShow">
                <ul>
                  <li v-for="item in abbreviationSelectData" @click.stop="abbreviationSelectClick(item.str, item.id)">{{item.str}}</li>
                </ul>
              </div>
            </div>
          <div class="div-select left abbreviationLeft" >
            <span class="btn-select width-45" @click.stop="moldClick()">{{ mold }}</span>
            <div class="div-select-ul" v-if="moldShow">
              <ul>
                 <li v-for="item in moldData" @click.stop="moldClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
          <div class="width-53 right">
            <input class="text-input bg-colour" type="text" v-model="numberPlate" name="" value="" maxlength="5" placeholder="请输入车牌号码" >
          </div>
        </li>

        <!-- <li class="form-line clear">
          <div class="form-line-item item-name">
            <span>车牌号码</span>
          </div>
           <div class="div-select left dirs-color " >
            {{ abbreviationSelectMassage }}
          </div>
          <div class="div-select left abbreviationLeft dirs-color" >
            {{ mold }}
          </div>
          <div class="width-92 right">
            <input class="text-input bg-colour" type="text" v-model="numberPlate" name="" value="" maxlength="5" placeholder="请输入车牌号码" >
          </div>
        </li> -->
        <!-- <li class="form-line">
          <div class="form-line-item item-name">
            <span>发动机号</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" v-model="behindTheFrame4Digits" placeholder="请输入发动机号"/>
          </div>
        </li> -->
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>车架号</span>
          </div>
          <div class="form-line-item">
            <input class="text-input bg-colour" type="text" value="" maxlength="4" v-model="vehicleIdentificationNumber" placeholder="请输入车架号后4位"/>
          </div>
        </li>
        <!-- <li class="form-li">
          <span>年审有效期</span>
        </li>
        <li class="form-li">
          <div class="form-line-item text-input stylebackground subscript" @click="datetimePick('picker')">
            <span>{{mtDateTimeMsg}}</span>
          </div>
        </li> -->
        <template v-if ="this.ownerid === '2'">
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>单位法人姓名</span>
            </div>
            <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="monadPersonName" placeholder="请输入单位法人姓名"/>
            </div>
          </li>
          <li class="form-li">
            <span>组织机构代码／统一社会信用代码</span>
          </li>
          <li class="form-li">
             <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="monadPersonIdentityCard" placeholder="请输入组织机构代码／统一社会信用代码"/>
            </div>
          </li>
          <!-- <li class="form-li">
            <span>单位申请人姓名</span>
          </li>
          <li class="form-li">
             <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="monadPersonProposerName" placeholder="请输入单位申请人姓名"/>
            </div>
          </li>
          <li class="form-li">
            <span>单位申请人身份证号</span>
          </li>
          <li class="form-li">
            <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="monadIdentityCard" placeholder="请输入单位申请人身份证号"/>
            </div>
          </li>
          <li class="form-li">
            <span>单位申请人联系电话</span>
          </li>
          <li class="form-li">
            <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="monadmobile" placeholder="请输入单位申请人联系电话"/>
            </div>
          </li> -->
        </template>
        <template v-if ="this.ownerid === '1'">
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车主姓名</span>
            </div>
            <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="ownerName" placeholder="请输入车主姓名"/>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车主身份证号</span>
            </div>
            <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="ownerItyCard" placeholder="请输入车主身份证号"/>
            </div>
          </li>
          <li class="form-line">
            <div class="form-line-item item-name">
              <span>车主联系电话</span>
            </div>
            <div class="form-line-item">
              <input class="text-input bg-colour" type="text" value="" v-model="ownerMobile" placeholder="请输入车主联系电话"/>
            </div>
          </li>
        </template>
        <li class="form-line">
          <div class="form-line-item item-name width-40">
            <span v-if ="this.ownerid === '2'">单位申请人联系地址</span>
            <span v-if ="this.ownerid === '1'">车主联系地址</span>
          </div>
          <div class="form-line-item width-40 city form-coloe">
            <span class="form-coloe">深圳市</span>
          </div>
          <div class="div-select form-line-item width-50">
            <span class="btn-select stylebackground" @click.stop="areaSelectClick()">{{ areaSelectMassage }}</span>
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
            <input class="text-input bg-colour" v-model="distpSite" type="text" name="" value="" placeholder="请输入详细地址">
          </div>
        </li>
        <template v-if ="this.ownerid === '1'">
          <li class="form-li">
            <span>是否是挂靠车辆</span>
          </li>
          <li class="form-li width-100">
            <div class="div-select">
              <span class="btn-select stylebackground" @click.stop="handCar()">{{ handCarName }}</span>
              <div class="div-select-ul" v-if="handShow">
                <ul>
                  <li v-for="item in handData" @click.stop="handCar(item.longName, item.id)">{{item.longName}}</li>
                </ul>
              </div>
            </div>
          </li>
        </template>
      </ul>
      <div class="upload-photo" v-if="this.typeId === '1'">
        <div v-show="ownerid == '2'">
          <div>上传证件照片</div>
          <div class="upload-all-img">
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file1">
                <input id="file1" type="file" accept="image/*" >
                <img :src="imgOne1" />
              </label>
              <div class="upload-item-text-one">单位法人身份证(正面)</div>
            </div>
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file11">
                <input id="file11" type="file" accept="image/*" >
                <img :src="imgOne11" />
              </label>
              <div class="upload-item-text-one">单位法人身份证(反面)</div>
            </div>
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file2">
                <input id="file2" type="file" accept="image/*" >
                <img :src="imgOne2" />
              </label>
              <div class="upload-item-text-one">申请人身份证(正面)</div>
            </div>
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file3">
                <input id="file3" type="file" accept="image/*" >
                <img :src="imgOne3" />
              </label>
              <div class="upload-item-text-one">车辆行驶证</div>
            </div>
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file4">
                <input id="file4" type="file" accept="image/*" >
                <img :src="imgOne4" />
              </label>
              <div class="upload-item-text-one">申请人驾驶证</div>
            </div>
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file5">
                <input id="file5" type="file" accept="image/*" >
                <img :src="imgOne5" />
              </label>
              <div class="upload-item-text-one two">申请人手持身份证及组织机构代码证照片</div>
            </div>
          </div>
        </div>
        <div v-show="ownerid == '1'">
          <div>上传证件照片</div>
          <div class="upload-all-img">
            <div class="upload-item-img">
              <label class="upload-item-img-one" for="file6">
                <input id="file6" type="file" accept="image/*" >
                <img :src="imgOne6" />
              </label>
              <div class="upload-item-text-one">车主身份证(正面)</div>
            </div>
            <div class="upload-all-img">
              <div class="upload-item-img">
                <label class="upload-item-img-one" for="file7">
                  <input id="file7" type="file" accept="image/*" >
                  <img :src="imgOne7" />
                </label>
                <div class="upload-item-text-one">车主驾驶证</div>
              </div>
            </div>
            <div class="upload-all-img">
              <div class="upload-item-img">
                <label class="upload-item-img-one" for="file8">
                  <input id="file8" type="file" accept="image/*" >
                  <img :src="imgOne8" />
                </label>
                <div class="upload-item-text-one">车主行驶证</div>
              </div>
            </div>
            <div class="upload-item-img" v-show="handid == '1'">
              <label class="upload-item-img-one" for="file9">
                <input id="file9" type="file" accept="image/*" >
                <img :src="imgOne9" />
              </label>
              <div class="upload-item-text-one two">申请人手持身份证及组织机构代码证照片</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btns" @click.stop="typeSubFn()" v-if="typeId === '2'">提交</button>
    <button class="btn btns" @click.stop="subFn()" v-else>提交</button>
    <!-- <mt-datetime-picker ref="picker" type="date" v-model="informTime" @confirm=""></mt-datetime-picker> -->
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
import { informationCollection, informationCollection2 } from '@/config/baseURL'
// import UploadFile from '../../service/uploadFile'
import VDistpicker from 'v-distpicker'
import { mapActions } from 'vuex'
export default {

  name: 'dieselEngineTrucks',

  data () {
    return {
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
      mold: 'B',
      moldShow: false,
      moldData: [
        {
          'str': 'A'
        },
        {
          'str': 'B'
        },
        {
          'str': 'C'
        },
        {
          'str': 'D'
        },
        {
          'str': 'E'
        },
        {
          'str': 'F'
        },
        {
          'str': 'G'
        },
        {
          'str': 'H'
        },
        {
          'str': 'I'
        },
        {
          'str': 'J'
        },
        {
          'str': 'K'
        },
        {
          'str': 'L'
        },
        {
          'str': 'N'
        },
        {
          'str': 'M'
        },
        {
          'str': 'O'
        },
        {
          'str': 'P'
        },
        {
          'str': 'Q'
        },
        {
          'str': 'R'
        },
        {
          'str': 'S'
        },
        {
          'str': 'T'
        },
        {
          'str': 'U'
        },
        {
          'str': 'V'
        },
        {
          'str': 'W'
        },
        {
          'str': 'X'
        },
        {
          'str': 'Y'
        },
        {
          'str': 'Z'
        }
      ],
      imgOne1: require('../../assets/images/IDcard-front.png'),
      imgOne11: require('../../assets/images/IDcard-back.png'),
      imgOne2: require('../../assets/images/IDcard-front.png'),
      imgOne3: require('../../assets/images/drivinglicense.png'),
      imgOne4: require('../../assets/images/license-card.png'),
      imgOne5: require('../../assets/images/ID-organizations.png'),
      imgOne6: require('../../assets/images/IDcard-front.png'),
      imgOne7: require('../../assets/images/license-card.png'),
      imgOne8: require('../../assets/images/drivinglicense.png'),
      imgOne9: require('../../assets/images/ID-organizations.png'),
      typeShow: false,             // 业务类型选择
      typeMsg: '柴油轻型自卸货车(新申请)',
      typeId: '2',
      typeData: [
        {name: '柴油轻型自卸货车(新申请)', value: '1'},
        {name: '已装rfid车辆绑定', value: '2'}
      ],
      ownerShow: false,
      ownerTimeMsg: '单位车辆',
      ownerid: '2',
      ownerData: [
        {
          'id': '2',
          'longName': '单位车辆'
        },
        {
          'id': '1',
          'longName': '个人车辆(含挂靠)'
        }
      ],
      rfidVal: '',      // RFID值
      handShow: false,
      handCarName: '是',
      handid: '1',   // 是否是挂靠车
      handData: [
        {
          'id': '0',
          'longName': '否'
        },
        {
          'id': '1',
          'longName': '是'
        }
      ],
      name: '柴油轻型自卸货车',
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
      distpSite: '',                   // 申请人单位联系地址
      // informTime: this.currentTime(),  // 保险生效时间当前时间
      // mtDateTimeMsg: '',           // 年审时间
      monadName: '',               // 单位名称
      numberPlate: '',             // 车牌号码
      // behindTheFrame4Digits: '',   // 发动机号
      vehicleIdentificationNumber: '',  // 车架号
      monadPersonIdentityCard: '',  // 单位法人身份证号
      // monadPersonProposerName: '',  // 单位法人申请人姓名
      // monadIdentityCard: '',        // 单位申请人身份证
      // monadmobile: '',             // 单位申请人联系电话
      monadPersonName: '',         // 单位法人名字
      ownerName: '',               // 车主姓名
      ownerItyCard: '',            // 车主身份证号
      ownerMobile: '',             // 车主联系电话
      ownerSite: '',                // 车主联系地址
      plateNumberOne: '0'
    }
  },
  components: {
    VDistpicker
  },
  computed: {
    plateNumber () {
      var plateInfo = {
        title: '车牌号码',
        option: []
      }
      let cars = this.$store.state.user.cars
      if (!cars) return plateInfo.option
      cars.map((item, index) => {
        if (+item.isMySelf === 0) {
          plateInfo.option.push({'name': item.myNumberPlate, 'value': index + ''})
        }
      })
      return plateInfo.option
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted: function () {
    document.addEventListener('click', (e) => {
      this.ownerShow = false
      this.verifyCode = false
      this.licenseSelectShow = false
      this.areaSelectShow = false
      this.moldShow = false
      this.abbreviationSelectShow = false
    })
    // let getTime = this.currentTime()
    // this.mtDateTimeMsg = getTime
    this.uploadImg()
  },
  methods: {
    abbreviationSelectClick: function (str, id) {
      this.moldShow = false
      if (str) {
        this.abbreviationSelectMassage = str
      }
      if (this.abbreviationSelectShow === true) {
        this.abbreviationSelectShow = false
      } else {
        this.abbreviationSelectShow = true
      }
    },
    moldClick: function (str, id) {
      this.abbreviationSelectShow = false
      if (str) {
        this.mold = str
      }
      if (this.moldShow === true) {
        this.moldShow = false
      } else {
        this.moldShow = true
      }
    },
    // 业务类型
    typeClick: function (str, id) {
      if (str) {
        this.typeMsg = str
        this.typeId = id
      }
      this.typeShow = !this.typeShow
    },
    // 申请类型
    ownerClick: function (str, id) {
      if (str) {
        this.ownerTimeMsg = str
        this.ownerid = id
      }
      if (this.ownerShow === true) {
        this.ownerShow = false
      } else {
        this.ownerShow = true
      }
    },
    // 是否是挂靠车辆
    handCar: function (str, id) {
      if (str) {
        this.handCarName = str
        this.handid = id
      }
      if (this.handShow === true) {
        this.handShow = false
      } else {
        this.handShow = true
      }
    },
    // // 保险生效日期
    // : function (informTime) {
    //   this.formatTime = this.format(this.informTime.toString(), 'yyyy-MM-dd')
    //   this.mtDateTimeMsg = this.formatTime
    // },
    //  // 年审时间
    // datetimePick: function (picker) {
    //   this.$refs.picker.open()
    // },
    ...mapActions({
      postAppoin: 'postAppoin'
    }),
    // currentTime: function (str) {  // 获取时间
    //   let now = new Date()
    //   let year = now.getFullYear()       // 年
    //   let month = now.getMonth() + 1     // 月
    //   let day = now.getDate()            // 日
    //   if (str === 'take') {
    //     let clock = year + 1 + '-'
    //     if (month < 10) {
    //       clock += '0'
    //     }
    //     clock += month + '-'
    //     if (day < 10) {
    //       clock += '0'
    //     }
    //     clock += day
    //     return (clock)
    //   } else {
    //     let clock = year + '-'
    //     if (month < 10) {
    //       clock += '0'
    //     }
    //     clock += month + '-'
    //     if (day < 10) {
    //       clock += '0'
    //     }
    //     clock += day
    //     return (clock)
    //   }
    // },
    // format: function (time, format) {   // 中国标准时间转换为datetime格式
    //   var t = new Date(time)
    //   var tf = function (i) { return (i < 10 ? '0' : '') + i }
    //   return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    //     switch (a) {
    //       case 'yyyy':
    //         return tf(t.getFullYear())
    //       case 'MM':
    //         return tf(t.getMonth() + 1)
    //       case 'mm':
    //         return tf(t.getMinutes())
    //       case 'dd':
    //         return tf(t.getDate())
    //       case 'HH':
    //         return tf(t.getHours())
    //       case 'ss':
    //         return tf(t.getSeconds())
    //     }
    //   })
    // },
    // 收件人地址
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
    // uploadImg () {
    //   // 单位法人身份证(正面)
    //   UploadFile.upload({
    //     id: 'file1',
    //     callback: (res) => {
    //       this.imgOne1 = res.imgUrl
    //       this.IDcardFront = res.imgUrl
    //     }
    //   })
    //   // 单位法人身份证(正面)
    //   UploadFile.upload({
    //     id: 'file11',
    //     callback: (res) => {
    //       this.imgOne11 = res.imgUrl
    //       this.IDcardFrontReverse = res.imgUrl
    //     }
    //   })
    //   // 申请人身份证(正面)
    //   UploadFile.upload({
    //     id: 'file2',
    //     callback: (res) => {
    //       this.imgOne2 = res.imgUrl
    //       this.IDcarfBack = res.imgUrl
    //     }
    //   })
    //   // 车辆行驶证
    //   UploadFile.upload({
    //     id: 'file3',
    //     callback: (res) => {
    //       this.imgOne3 = res.imgUrl
    //       this.registerCredential = res.imgUrl
    //     }
    //   })
    //   // 组织机构代码证
    //   UploadFile.upload({
    //     id: 'file4',
    //     callback: (res) => {
    //       this.imgOne4 = res.imgUrl
    //       this.organizationCodeCertificate = res.imgUrl
    //     }
    //   })
    //   // 申请人手持身份证组织机构代码证照片
    //   UploadFile.upload({
    //     id: 'file5',
    //     callback: (res) => {
    //       this.imgOne5 = res.imgUrl
    //       this.handOrganization = res.imgUrl
    //     }
    //   })
    //   // 车主身份证(正面)
    //   UploadFile.upload({
    //     id: 'file6',
    //     callback: (res) => {
    //       this.imgOne6 = res.imgUrl
    //       this.ownerIDcardFront = res.imgUrl
    //     }
    //   })
    //   // 车主驾驶证
    //   UploadFile.upload({
    //     id: 'file7',
    //     callback: (res) => {
    //       this.imgOne7 = res.imgUrl
    //       this.ownerRegisterCredential = res.imgUrl
    //     }
    //   })
    //   // 车主行驶证
    //   UploadFile.upload({
    //     id: 'file8',
    //     callback: (res) => {
    //       this.imgOne8 = res.imgUrl
    //       this.handOwnerIDcardFront = res.imgUrl
    //     }
    //   })
    //   // 申请人手持身份证组织机构代码证照片
    //   UploadFile.upload({
    //     id: 'file9',
    //     callback: (res) => {
    //       this.imgOne9 = res.imgUrl
    //       this.handOwnerNine = res.imgUrl
    //     }
    //   })
    // },
    // typeSubFn: function () {
    //   if (!this.numberPlate) {
    //     Toast({message: '请输入车牌号码', position: 'bottom', className: 'white'})
    //     return
    //   }
    //   if (!this.rfidVal) {
    //     Toast({message: '请输入RFID', position: 'bottom', className: 'white'})
    //     return
    //   } else {
    //     MessageBox.confirm('您是否确认提交').then(action => {
    //       this.typeSubFnData()
    //     }).catch(() => {})
    //   }
    // },
    // subFn: function () {
    //   if (!this.numberPlate) {
    //     Toast({message: '请输入车牌号码', position: 'bottom', className: 'white'})
    //     return
    //   } else if (!this.vehicleIdentificationNumber) {
    //     Toast({message: '请输入车架号后4位', position: 'bottom', className: 'white'})
    //     return
    //   }
    //   if (this.ownerid === '2') {
    //     console.log('2')
    //     if (!this.monadName) {
    //       Toast({message: '请输入单位名称', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.monadPersonName) {
    //       Toast({message: '请输入单位法人姓名', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.monadPersonIdentityCard) {
    //       Toast({message: '请输入单位法人身份证号', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.distpSite) {
    //       Toast({message: '请输入单位申请人联系地址', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.IDcardFront) {
    //       Toast({message: '请上传单位法人身份证(正面)', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.IDcarfBack) {
    //       Toast({message: '请上传申请人身份证(正面)', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.registerCredential) {
    //       Toast({message: '请上传车辆行驶证', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.organizationCodeCertificate) {
    //       Toast({message: '申请人驾驶证', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.handOrganization) {
    //       Toast({message: '请上传申请人手持身份证组织机构代码证照片', position: 'bottom', className: 'white'})
    //       return
    //     } else {
    //       MessageBox.confirm('您是否确认提交').then(action => {
    //         this.subFnData()
    //       })
    //     }
    //   } else if (this.ownerid === '1') {
    //     if (!this.ownerName) {
    //       Toast({message: '请输入车主姓名', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.ownerItyCard) {
    //       Toast({message: '请输入车主身份证号', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.ownerMobile) {
    //       Toast({message: '请输入车主联系电话', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.distpSite) {
    //       Toast({message: '请输入车主联系地址', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.ownerIDcardFront) {
    //       Toast({message: '请上传车主身份证', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.ownerRegisterCredential) {
    //       Toast({message: '请上传车主驾驶证', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.handOwnerIDcardFront) {
    //       Toast({message: '请上传车主行驶证', position: 'bottom', className: 'white'})
    //       return
    //     } else if (!this.handOwnerNine && this.handid === '1') {
    //       Toast({message: '请上传申请人手持身份证组织机构代码证照片', position: 'bottom', className: 'white'})
    //       return
    //     } else {
    //       MessageBox.confirm('您是否确认提交').then(action => {
    //         this.subFnData()
    //       })
    //     }
    //   }
    // },
    typeSubFnData: function () {
      let reqData = {
        licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`,
        numberPlate: '02',
        rfId: this.rfidVal,
        loginUser: window.localStorage.getItem('identityCard'),
        mobilePhone: window.localStorage.getItem('mobilePhone'),
        cjh4: this.vehicleIdentificationNumber,
        carType: 'H37'
      }
      this.$axios.post(informationCollection2, reqData).then(json => {
        if (json.code === '0000') {
          console.log(json.data)
          let dataInfo = {
            // state: '1',
            // businessType: '绑定已有的RFID',
            // rfId: this.rfidVal,
            // licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`
            state: '2'
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$router.push('/submitSuccessCommon')
        } else {
          this.$MessageBox({
            title: '提示',
            message: json.msg
          })
        }
      })
    },
    subFnData: function () {
      let dieselData
      if (this.ownerid === '2') {
        dieselData = {
          isAttached: '0',
          issuingBrigade: `深圳市${this.areaSelectMassage}`,    // 发卡大队
          certificationType: this.ownerid,   // 申请类型
          // licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`, // 车牌号码
          licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`, // 车牌号码
          numberPlate: '02', // 车牌种类
          carType: 'H37', // 车辆类型
          // engineNumber: this.behindTheFrame4Digits, // 发动机号
          legalEntityName: this.monadPersonName,   // 车主姓名
          vehicleIdentificationNumber: this.vehicleIdentificationNumber, // 车架号
          // validityOfAnnualAudit: this.mtDateTimeMsg, // 年审有效期
          ownerIdentityCard: this.monadPersonIdentityCard, // 单位法人身份证号或车主身份证号码
          ownerMobilephone: window.localStorage.getItem('mobilePhone'), // 单位申请人联系电话或者车主联系电话
          ownerAddress: `深圳市${this.areaSelectMassage}${this.distpSite}`, // 车主地址
          identityCard: this.monadPersonIdentityCard, // 身份证
          mobilephone: window.localStorage.getItem('mobilePhone'), // 联系电话
          address: `深圳市${this.areaSelectMassage}${this.distpSite}`, // 地址
          copyOfOwnerIdentityCard: this.IDcarfBack.split(',')[1], // 车辆所有人身份证复印件
          copyOfDriverLicense: this.organizationCodeCertificate.split(',')[1], // 车辆驾驶人驾驶证复印件
          copyOfVehicleTravelLicense: this.registerCredential.split(',')[1], // 车辆行驶证复印件
          copyOfLegalEntityA: this.IDcardFront.split(',')[1], // 单位法人复印件正面
          copyOfLegalEntity: this.IDcardFrontReverse.split(',')[1], // 单位法人复印件反面
          copyOfApplicant: this.handOrganization.split(',')[1], // 申请人手持身份证+组织代码证复印件
          loginUser: window.localStorage.getItem('identityCard'), // 申请星级用户身份证明号码
          userMobilepbone: window.localStorage.getItem('mobilePhone') // 申请星级用户手机号码
        }
      } else if (this.ownerid === '1') {
        // let handOwnerNine = this.handid === '0' ? '' : this.handOwnerNine
        dieselData = {
          isAttached: this.handid,  // 0-否,1-是
          issuingBrigade: `深圳市${this.areaSelectMassage}`,    // 发卡大队
          certificationType: this.ownerid,
          licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`, // 车牌号码
          numberPlate: '02', // 车牌种类
          carType: 'H37', // 车辆类型
          // engineNumber: this.behindTheFrame4Digits, // 发动机号
          legalEntityName: this.ownerName,   // 车主姓名
          vehicleIdentificationNumber: this.vehicleIdentificationNumber, // 车架号
          // validityOfAnnualAudit: this.mtDateTimeMsg, // 年审有效期
          ownerIdentityCard: this.ownerItyCard, // 车主身份证号码
          ownerMobilephone: this.ownerMobile, // 车主联系电话
          ownerAddress: `深圳市${this.areaSelectMassage}${this.distpSite}`, // 车主地址
          identityCard: this.ownerItyCard, // 身份证
          mobilephone: this.ownerMobile, // 联系电话
          address: `深圳市${this.areaSelectMassage}${this.distpSite}`, // 地址
          copyOfOwnerIdentityCard: this.ownerIDcardFront.split(',')[1], // 车辆所有人身份证复印件
          copyOfDriverLicense: this.ownerRegisterCredential.split(',')[1], // 车辆驾驶人驾驶证复印件
          copyOfVehicleTravelLicense: this.handOwnerIDcardFront.split(',')[1], // 车辆行驶证复印件
          copyOfLegalEntity: '', // 单位法人复印件
          copyOfLegalEntityA: '',
          copyOfApplicant: this.handid === '0' ? '' : this.handOwnerNine.split(',')[1], // 申请人手持身份证+组织代码证复印件
          loginUser: window.localStorage.getItem('identityCard'), // 申请星级用户身份证明号码
          userMobilepbone: window.localStorage.getItem('mobilePhone') // 申请星级用户手机号码
        }
      }
      console.log(dieselData)
      this.$axios.post(informationCollection, dieselData).then(json => {
        if (json.code === '0000') {
          // let typeName = {
          //   type: this.ownerid,
          //   areaSelectMassage: this.areaSelectMassage,
          //   licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`
          // }
          // let numData = json.data
          // this.$router.push({path: 'dieseSucceed', query: { myNumber: JSON.stringify(numData), typeName: JSON.stringify(typeName) }})
          this.$store.commit('saveSuccessInfo', {
            type: 4,
            ownerid: this.ownerid,   // 申请类型
            areaSelectMassage: this.areaSelectMassage, // 发卡大队
            licenseNumber: `${this.abbreviationSelectMassage}${this.mold}${this.numberPlate}`, // 车牌号码
            JsonData: json.data   // 流水号
          })
          this.$router.push('/submitSuccess')
        } else {
          this.$MessageBox({
            title: '提示',
            message: json.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dieselEngineTrucks{
  padding: 40px 0 40px 0;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
// .dieselEngineTrucks {
// width: 100%;
// background-color: #fff;
// position: absolute;
// left: 0;
// right: 0;
// padding: 20px 40px;
//   .dieselEngineTrucks-form {
//     background-color: #fff;
//     padding-top:20px;
//     .form-line {
//       padding: 20px 0 0 180px;
//       position: relative;
//       line-height: 56px;
//       .form-line-item {
//         width: 100%;
//         display: inline-block;
//         height: 60px;
//         line-height:60px;
//         .photo-ex {
//           color: #2696dd;
//         }
//         span {
//           /*vertical-align: middle;*/
//         }
//         .browse-code {
//           margin: 0;
//           display: inline-block;
//           height: 56px;
//           width: 100%;
//           line-height: 56px;
//           border-radius: 10px;
//           text-align: center;
//           color:#fff;
//           vertical-align:middle;
//         }
//         &.city {
//           margin: 0 18px;
//         }
//         &.form-coloe {
//           text-align: center;
//         }
//       }
//       .item-name {
//         width: 180px;
//         position: absolute;
//         left: 0;
//       }
//       .div-select {
//         font-size: 26px;
//       }
//     }
//     .form-li{
//       width: 100%;
//       display: inline-block;
//       height: 60px;
//       line-height:60px;
//       span{
//         font-size: 26px !important;
//       }
//     }
//     .form-annotation{
//       padding-top: 16px;
//       color: red;
//       font-size: 26px !important;
//     }
//   }
//   .width-25 {
//     width: 25% !important;
//   }
//   .width-40 {
//     width: 40% !important;
//   }
//   .width-35 {
//     width: 35% !important;
//   }
//   .width-50 {
//     width: 50% !important;
//   }
//   .width-60 {
//     width: 60% !important;
//   }
//    .width-92 {
//     width: 80% !important;
//   }
//   .width-100 {
//     width: 100% !important;
//   }
//   .btn {
//     width: 280px;
//     margin-top:30px;
//     display: inline-block;
//   }
//   .btns{
//     margin: 60px 0 30px 0;
//     width: 100%;
//   }
//   .btn-select{
//     height: 56px;
//   }
//   .div-select-ul{
//     font-size: 26px;
//   }
//   .width-25 {
//     width: 25% !important;
//   }
//   .width-53 {
//     width: 53% !important;
//   }
//   .abbreviationLeft{
//     margin-left: 2%;
//   }
//   .bg-colour{
//     background-color: #fff;
//   }
//   .subscript{
//     background: url(../../assets/images/select1.png) no-repeat;
//     background-size: 18px;
//     background-position: 96% center;
//   }
//   .upload-all-img {
//     display: flex;
//     justify-content: space-between;
//     flex-wrap: wrap;
//     align-items: center;
//     margin-top: 10px;
//   }
//   .upload-photo {
//     margin-top: 30px;
//     display: block;
//     .upload-item-text-one {
//       margin-top: 10px;
//       margin-bottom: 30px;
//       color: #7e7e7e;
//       text-align: center;
//     }
//     .upload-item-img {
//       flex-shrink: 0;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }
//     .upload-item-img-one {
//       width: 300px;
//       height: 300px;
//       border: 2px solid #eee;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       border-radius: 10px;
//       input {
//         display: none;
//       }
//       img {
//         max-height: 90%;
//         max-width: 90%;
//       }
//     }
//     .two{
//       width: 300px;
//     }
//     .dirs-color{
//       line-height: 30px;
//     }
//   }
// }
</style>

<style lang="less">
  .distp{
    margin: 20px 0;
    select{
      width: 32%;
      padding: .3rem .75rem !important;
      height: 1.8rem !important;
      font-size: 26px !important;
    }
  }
</style>
