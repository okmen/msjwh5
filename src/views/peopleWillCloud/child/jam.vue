<template>
  <div class="jam-outer">
  <div v-wechat-title="$route.meta.title"></div>
    <div class="jam-form">
      <ul class="jam-form-list pad-right-43 pad-top-24">
        <li class="jam-form-item clear">
          <div class="jam-list-name">
            <span>地点</span>
          </div>
          <div class="jam-list-text left width-90">
            <input class="text-input" type="text" name="" v-model:value="mapObj.showAdd" placeholder="点击右侧按钮选择地址" readonly>
          </div>
          <div class="jam-list-location right" @click.stop='getLocation()'></div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>开始时间</span>
          </div>
          <div class="jam-list-text">
            <el-time-select
              class="time-select"
              v-model="startTime"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: endTime || '23:30'
              }"
              placeholder="00:00"
              :editable=false>
            </el-time-select>
            <!-- <input class="text-input" type="text" name="" v-model:value="startTime" placeholder="00:00"> -->
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>结束时间</span>
          </div>
          <div class="jam-list-text">
            <el-time-select
              class="time-select"
              v-model="endTime"
              :picker-options="{
                start: startTime || '00:00',
                step: '00:30',
                end: '23:30'
              }"
              placeholder="00:00"
              :editable=false>
            </el-time-select>
            <!-- <input class="text-input" type="text" name="" v-model:value="endTime" placeholder="00:00"> -->
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>方向</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="btnDirectionSelect()">{{direction}}</span>
            <div class="div-select-ul" v-if="directionShow">
              <ul>
                <li v-for="item in directionData" @click.stop="btnDirectionSelect(item)">{{item}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>拥堵类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="btnCongestionTypeSelect()">{{congestionType.str}}</span>
            <div class="div-select-ul" v-if="congestionTypeShow">
              <ul>
                <li v-for="(item, index) in congestionTypeData" @click.stop="btnCongestionTypeSelect(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>拥堵等级</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="btnCongestionGradeSelect()">{{congestionGrade.str}}</span>
            <div class="div-select-ul" v-if="congestionGradeShow">
              <ul>
                <li v-for="(item, index) in congestionGradeData" @click.stop="btnCongestionGradeSelect(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>道路服务水平</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="btnServiceLevelSelect()">{{roadServiceLevel.str}}</span>
            <div class="div-select-ul" v-if="roadServiceLevelShow">
              <ul>
                <li v-for="(item, index) in roadServiceLevelData" @click.stop="btnServiceLevelSelect(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>拥堵成因</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="btnCongestionReasonSelect()">{{congestionReason.str}}</span>
            <div class="div-select-ul" v-if="congestionReasonShow">
              <ul>
                <li v-for="(item, index) in congestionReasonData" @click.stop="btnCongestionReasonSelect(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="jam-form-item">
          <div class="jam-list-name">
            <span>改善建议</span>
          </div>
          <div class="common-list-text">
            <textarea class="text-input textarea" name="localeDescript" id="localeDescript" v-model:value="improveAdvice" placeholder="请填写改善建议" maxlength="100"></textarea>
          </div>
        </li>
      </ul>
      <button class="btn" type="button" name="button" @click.stop="submit()">提交</button>
    </div>
  </div>
</template>
<script>
import { jam } from '@/config/baseURL'
import { MessageBox, Toast, Indicator } from 'mint-ui'
export default {
  name: 'jam',
  data () {
    return {
      address: '',
      startTime: '',
      endTime: '',
      // 方向
      directionData: [ '东', '南', '西', '北' ],
      direction: '东',
      directionShow: false,
      // 拥堵类型
      congestionTypeData: [
        {
          'code': 1001,
          'str': '偶发性拥堵'
        },
        {
          'code': 1002,
          'str': '常态化拥堵'
        }
      ],
      congestionType: {
        'code': 1001,
        'str': '偶发性拥堵'
      },
      congestionTypeShow: false,
      // 拥堵等级
      congestionGradeData: [
        {
          'code': 1001,
          'str': '缓行'
        },
        {
          'code': 1002,
          'str': '较拥堵'
        },
        {
          'code': 1003,
          'str': '拥堵'
        }
      ],
      congestionGrade: {
        'code': 1001,
        'str': '缓行'
      },
      congestionGradeShow: false,
      // 道路服务水平
      roadServiceLevelData: [
        {
          'code': 1001,
          'str': '排队起终点'
        },
        {
          'code': 1002,
          'str': '较以往同行延误时间'
        },
        {
          'code': 1003,
          'str': '经过几个信号周期通过'
        }
      ],
      roadServiceLevel: {
        'code': 1001,
        'str': '排队起终点'
      },
      roadServiceLevelShow: false,
      // 拥堵成因
      congestionReasonData: [
        {
          'code': 1001,
          'str': '车流过饱和'
        },
        {
          'code': 1002,
          'str': '交通违法'
        },
        {
          'code': 1003,
          'str': '交通事故'
        },
        {
          'code': 1004,
          'str': '交通秩序乱'
        },
        {
          'code': 1005,
          'str': '设施缺陷'
        },
        {
          'code': 1006,
          'str': '综合因素'
        },
        {
          'code': 1007,
          'str': '违法停车'
        },
        {
          'code': 1008,
          'str': '乱变线'
        },
        {
          'code': 1009,
          'str': '爬头加塞'
        },
        {
          'code': 1010,
          'str': '逆行'
        },
        {
          'code': 1011,
          'str': '轻微事故处理不及时'
        },
        {
          'code': 1012,
          'str': '重大事故道路封闭'
        },
        {
          'code': 1013,
          'str': '车辆交织冲突'
        },
        {
          'code': 1014,
          'str': '人车混行冲突'
        },
        {
          'code': 1015,
          'str': '道路空间利用不合理'
        },
        {
          'code': 1016,
          'str': '信号配时不合理'
        },
        {
          'code': 1017,
          'str': '安全防护设置不合理'
        }
      ],
      congestionReason: {
        'code': 1001,
        'str': '车流过饱和'
      },
      congestionReasonShow: false,
      improveAdvice: ''
    }
  },
  props: ['mapObj'],
  methods: {
    getLocation: function () {
      this.$emit('showMap')
      console.log('获取地理位置')
    },
    btnDirectionSelect: function (str) {
      if (str) {
        this.direction = str
      }
      this.directionShow = !this.directionShow
      this.congestionTypeShow = false
      this.congestionGradeShow = false
      this.roadServiceLevelShow = false
      this.congestionReasonShow = false
    },
    btnCongestionTypeSelect: function (index) {
      this.handle(index, 'congestionType', 'congestionTypeData', 'congestionTypeShow')
    },
    btnCongestionGradeSelect: function (index) {
      this.handle(index, 'congestionGrade', 'congestionGradeData', 'congestionGradeShow')
    },
    btnServiceLevelSelect: function (index) {
      this.handle(index, 'roadServiceLevel', 'roadServiceLevelData', 'roadServiceLevelShow')
    },
    btnCongestionReasonSelect: function (index) {
      this.handle(index, 'congestionReason', 'congestionReasonData', 'congestionReasonShow')
    },
    handle: function (index, selectData, data, show) {
      if (index) {
        index--
        this[selectData] = this[data][index]
      }
      let shows = ['directionShow', 'congestionTypeShow', 'congestionGradeShow', 'roadServiceLevelShow', 'congestionReasonShow']
      for (let i = 0; i < shows.length; i++) {
        if (show === shows[i]) {
          this[show] = !this[show]
        } else {
          this[shows[i]] = false
        }
      }
    },
    submit: function () {
      let reqData = {
        reportingMatters: this.reportingMatters, // 举报事项
        identityCard: this.identityCard, // 身份证号
        mobilephone: this.mobilephone, // 用户手机
        startTime: this.startTime, // 开始时间
        endTime: this.endTime, // 结束时间
        direction: this.direction, // 方向
        congestionType: this.congestionType.str, // 拥堵类型
        congestionGrade: this.congestionGrade.str, // 拥堵等级
        roadServiceLevel: this.roadServiceLevel.str, // 道路服务水平
        congestionReason: this.congestionReason.str, // 拥堵成因
        improveAdvice: this.improveAdvice, // 改善建议
        addressCode: this.mapObj.addressCode, // 站点代码
        address: this.mapObj.detailAddress // 主题地点描述
      }
      for (let key in reqData) {
        if (!reqData[key]) {
          console.log(key)
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      this.$emit('submit')
      Indicator.open('正在提交...')
      this.$axios.post(jam, reqData).then(json => {
        Indicator.close()
        if (json.code !== '0000') {
          Toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        } else {
          MessageBox({
            title: '温馨提示',
            message: '感谢您参与举报，我们会依次不断改进'
          }).then(action => {
            this.$emit('submitSuccess')
          })
        }
      })
    }
  },
  created () {
    document.addEventListener('click', (e) => {
      this.directionShow = false
      this.congestionTypeShow = false
      this.congestionGradeShow = false
      this.roadServiceLevelShow = false
      this.congestionReasonShow = false
    })
    this.reportingMatters = 1003
    this.userName = window.localStorage.getItem('userName') || '' // 用户姓名
    this.mobilephone = window.localStorage.getItem('mobilePhone') || '' // 用户手机号码
    this.identityCard = window.localStorage.getItem('identityCard') || '' // 用户身份证号码
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang='less'>
  .jam-outer{
    font-size: 26px;
    .width-90{
      width: 90%;
    }
    .pad-right-43{
      padding-right: 43px;
    }
    .pad-top-24{
      padding-top: 24px;
    }
    .jam-form-list{
      .jam-form-item{
        margin-top: 24px;
        padding-left: 162px;
        position: relative;
        line-height: 56px;
        .time-select{
          width: 100%;
          margin: 0;
          i{
            visibility: hidden;
          }
          input{
            width: 100%;
            height: 1.6875rem;
            padding: 0;
            text-indent: 0.5625rem;
            line-height: 1.6875rem;
            border: 0.03125rem solid #e2e2e7;
            background-color: #efeff4;
            color: #000;
            border-radius: 0.3125rem;
            outline: none;
          }
        }
        &:first-child{
          margin-top: 0;
        };
        .jam-list-name{
          position: absolute;
          left: 0;
          z-index: 100;
        }
        .jam-list-location{
          width: 32px;
          height: 56px;
          padding: 5px 0;
          box-sizing: border-box;
          background: url('../../../assets/images/location.png') right no-repeat;
          background-size: contain;
        }
        .textarea{
          height: 183px;
          resize: none;
        }
      }
    }
  }
  .white{
    span{
      color: #fff;
    }
  }
</style>