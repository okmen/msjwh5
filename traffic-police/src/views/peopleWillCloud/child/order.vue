<template>
  <div class="order-outer">
  <div v-wechat-title="$route.meta.title"></div>
    <div class="order-form">
      <ul class="order-form-list padding-right-43">
        <li class="order-form-item clear">
          <div class="order-list-name">
            <span>地点</span>
          </div>
          <div class="order-list-text left width-90">
            <input class="text-input" type="text" name="" v-model:value="mapObj.showAdd" placeholder="点击右侧按钮选择地址" readonly>
          </div>
          <div class="order-list-location right" @click.stop='getLocation()'></div>
        </li>
        <li class="order-form-item">
          <div class="order-list-name">
            <span>开始时间</span>
          </div>
          <div class="order-list-text">
            <!-- <input class="text-input" type="text" name="" v-model:value="startTime" placeholder="00:00"> -->
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
          </div>
        </li>
        <li class="order-form-item">
          <div class="order-list-name">
            <span>结束时间</span>
          </div>
          <div class="order-list-text">
            <!-- <input class="text-input" type="text" name="" v-model:value="endTime" placeholder="00:00"> -->
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
          </div>
        </li>
        <li class="order-form-item">
          <div class="order-list-name">
            <span>拥堵类型</span>
          </div>
          <div class="div-select">
            <span id="btnJamRangeSelect" class="btn-select" @click.stop="btnOrderTypeSelect()">{{congestionType.str}}</span>
            <div class="div-select-ul" v-if="orderSelectShow">
              <ul>
                <li v-for="(item, index) in congestionTypeData" @click.stop="btnOrderTypeSelect(index+1)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="order-form-item">
          <div class="order-list-name">
            <span>现场描述</span>
          </div>
          <div class="order-list-textarea">
            <textarea class="text-input textarea" name="localeDescript" id="localeDescript" v-model:value="description" placeholder="请填写改善建议" maxlength="100"></textarea>
          </div>
        </li>
      </ul>
      <button class="btn" type="button" name="button" @click.stop="submit()">提交</button>
    </div>
  </div>
</template>
<script>
import { resultPost } from '../../../service/getData'
import { order } from '../../../config/baseUrl'
import { MessageBox, Toast, Indicator } from 'mint-ui'
export default {
  name: 'order',
  data () {
    return {
      address: '',
      startTime: '',
      endTime: '',
      congestionType: {
        'code': 1001,
        'str': '机动车违法停放'
      },
      congestionTypeData: [
        {
          'code': 1001,
          'str': '机动车违法停放'
        },
        {
          'code': 1002,
          'str': '机动车占用应急车道'
        },
        {
          'code': 1003,
          'str': '大货车、泥头车超载'
        },
        {
          'code': 1004,
          'str': '机动车不按规定安装、悬挂号牌'
        },
        {
          'code': 1005,
          'str': '机动车遮挡号牌'
        },
        {
          'code': 1006,
          'str': '机动车污损号牌'
        },
        {
          'code': 1007,
          'str': '机动车压导流线驾驶'
        },
        {
          'code': 1008,
          'str': '机动车路口压线变道'
        },
        {
          'code': 1009,
          'str': '机动车冲红灯'
        },
        {
          'code': 1010,
          'str': '大中型货车驶入禁行区域'
        },
        {
          'code': 1011,
          'str': '小型汽车驶入禁行区域'
        },
        {
          'code': 1012,
          'str': '机动车占用公交车专用道'
        },
        {
          'code': 1013,
          'str': '醉酒驾驶'
        },
        {
          'code': 1014,
          'str': '酒后驾驶'
        },
        {
          'code': 1015,
          'str': '机动车违反禁止标线行驶'
        },
        {
          'code': 1016,
          'str': '电动车、摩托车驶入禁行区域'
        },
        {
          'code': 1017,
          'str': '开超标电动力车'
        },
        {
          'code': 1018,
          'str': '电动车载客'
        },
        {
          'code': 1019,
          'str': '残疾人专用车载客、载物'
        },
        {
          'code': 1020,
          'str': '斑马线不礼让行人'
        }
      ],
      orderSelectShow: false,
      description: ''
    }
  },
  props: ['mapObj'],
  methods: {
    getLocation: function () {
      this.$emit('showMap')
      console.log('获取地理位置')
    },
    btnOrderTypeSelect: function (index) {
      if (index) {
        index--
        this.congestionType = this.congestionTypeData[index]
      }
      this.orderSelectShow = !this.orderSelectShow
    },
    submit: function () {
      let reqData = {
        reportingMatters: this.reportingMatters, // 举报事项
        identityCard: this.identityCard, // 身份证号
        mobilephone: this.mobilephone, // 用户手机
        startTime: this.startTime, // 开始时间
        endTime: this.endTime, // 结束时间
        congestionCode: this.congestionType.code, // 拥堵类型码
        congestionType: this.congestionType.str, // 拥堵类型
        description: this.description, // 现场描述
        addressCode: this.mapObj.addressCode, // 站点代码
        address: this.mapObj.detailAddress // 主题地点描述
      }
      console.log(reqData)
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
      resultPost(order, reqData).then(json => {
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
        console.log(json)
      })
    }
  },
  created () {
    document.addEventListener('click', (e) => {
      this.orderSelectShow = false
    })
    this.reportingMatters = 1004
    this.identityCard = window.localStorage.getItem('identityCard') || ''
    this.mobilephone = window.localStorage.getItem('mobilePhone') || ''
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang='less'>
  .order-outer{
    font-size: 26px;
    .width-90{
      width: 90%;
    }
    .padding-right-43{
      padding-right: 43px;
    }
    .order-form-list{
      overflow: hidden;
      padding-bottom: 237px;
      .order-form-item{
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
        .order-list-name{
          position: absolute;
          left: 0;
        }
        .order-list-location{
          width: 32px;
          height: 56px;
          padding: 5px 0;
          box-sizing: border-box;
          background: url('../../../images/location.png') right no-repeat;
          background-size: contain;
        }
        .textarea{
          height: 183px;
          resize: none;
        }
        .order-list-textarea{
          display: flex;
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