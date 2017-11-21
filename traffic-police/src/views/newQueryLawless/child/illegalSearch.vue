<template>
  <div class="newQueryByCar-outer earlyQuery-outer">
    <div class="newQueryByCar-carArr">
      <ul>
        <li v-for="item in carArr" @click="getLawlessData(item)">
          <span>{{ item.myNumberPlate }}</span>
          <i></i>
          <em class="blue" v-if="item.isMySelf == '0'">本人</em>
          <em class="yellow" v-else>他人</em>
        </li>
      </ul>
    </div>
    <div class="newQueryByCar-btn">
      <!-- <router-link to="newqueryByCar_manual">其他车辆查询</router-link> -->
      <!--<router-link to="newqueryByCard">驾驶证查询</router-link>-->
      <div class="newQueryByCar-hint">
        <p>温馨提示：可预约粤B牌车全国的违法及外地车深圳的违法</p>
      </div>
    </div>
    <div v-for="(reserve, index) in reserveList" class="queryResults pad-side-50">
      <div class="results-box">
        <div class="box-header">
          <div class="header-item">预约结果</div>
        </div>
        <div class="box-body">
          <div class="left-line">
            预约编号:
            <p>{{ reserve.yylsh }}</p>
          </div>
          <div class="left-line">
            车牌号码:
            <p>{{ reserve.hphm }}</p>
          </div>
          <div class="left-line">
            手机号码:
            <p>{{ reserve.sjhm }}</p>
          </div>
          <div class="left-line">
            服务点&nbsp;&nbsp;&nbsp;:
            <p>{{ reserve.cldbmmc }}</p>
          </div>
          <div class="left-line">
            预约时间:
            <p>{{ reserve.yydate }} {{ reserve.yydate_sjd }}</p>
          </div>
          <div class="left-line" v-if="reserve.zt == '正常'">
            <div class="cancel" @click.stop="CancelConfirm(reserve.yylsh, index)">
              取消预约
            </div>
          </div>
          <div class="left-line" v-if="reserve.zt == '取消'">
            <div class="cancel canceled">
              已取消
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { earlyQuery, earlyCancel } from '../../../config/baseUrl'
  // import { verifyCode } from '../../../config/verifyCode'
  import { MessageBox, Toast } from 'mint-ui'
  export default {
    name: 'newQueryByCar',
    data () {
      return {
        carArr: [],
        reserveList: [],
        currentItem: ''
      }
    },
    mounted () {
      this.carArr = window.localStorage.cars === undefined ? [] : JSON.parse(window.localStorage.cars)
    },
    methods: {
      getLawlessData (item) {
        if (item) {
          this.currentItem = item
        }
        resultPost(earlyQuery, {
          car_number: this.currentItem.myNumberPlate.substr(1),
          licensePlateNo: this.currentItem.myNumberPlate,
          licensePlateType: this.currentItem.plateType,
          mobilephone: this.currentItem.mobilephone
        }).then(json => {
          console.log(json)
          if (json.code === '0000') {
            this.reserveList = json.data
            if (json.data.length === 0) {
              MessageBox('提示', '该车辆暂无预约信息')
            }
          } else {
            MessageBox('提示', json.msg)
          }
        })
      },
      CancelConfirm (subscribeNo, index) {
        MessageBox({
          title: '',
          message: '确定要取消预约吗？',
          showCancelButton: true,
          confirmButtonText: '是的'
        }).then(action => {
          action === 'confirm' && this.earlyCancel(subscribeNo, index)
        })
      },
      earlyCancel: function (subscribeNo, index) {
        let data = this.reserveList[index]
        let yydate = data.yydate // 预约日期
        let ccsjd = data.yydate_sjd // 预约时间段
        let cldbmmc = data.cldbmmc // 预约处理点
        let reqData = {
          subscribeNo: subscribeNo, // 预约编号
          businessName: '违法处理预约', // 业务名称
          yydate, // 预约日期
          ccsjd, // 预约时间段
          cldbmmc // 服务点
        }
        resultPost(earlyCancel, reqData).then(json => {
          if (json.code === '0') {
            // this.isWeChat ? window.location.href = json.data : this.earlyQuery() // 城市服务取消预约 跳转消息通路结果页
            this.getLawlessData() // 重新查询
            Toast({
              message: json.msg,
              position: 'middle',
              className: 'white',
              duration: 3000
            })
          } else {
            Toast({
              message: json.msg,
              position: 'middle',
              className: 'white',
              duration: 3000
            })
          }
        })
      }
    }
  }
</script>
