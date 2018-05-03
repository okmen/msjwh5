<template>
  <div class="getLocation-outer">
    <div class="getLocation-search">
      <input id="keywordId" class="text-input" type="text" placeholder="输入地点名称搜索" v-model:value="keywords">
      <div class="search-btn" @click.stop="search()"></div>
    </div>
    <div id="mymap"></div>
    <div class="getLocation-result">
      <p>查询结果</p>
      <div class="submit-btn" @click.stop="submit()" v-if="roads">提交</div>
      <div class="submit-btn" v-else="roads">查询中</div>
    </div>
    <div class="getLocation-options">
      <ul  v-if="roads">
        <li v-for="(item, index) in roads" :class="{active: index===selectIndex}" @click.stop="selectOption(index)">{{item.text}}</li>
      </ul>
      <p v-else="roads">附近没有道路，请移动地图中心点到道路附近</p>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { getLocation } from '@/config/baseURL'
import wx from 'weixin-js-sdk'
import { Toast } from 'mint-ui'
import { flagGreen, geopoint } from './base64'
// import { wgs84togcj02 } from './wgs84togcj02'
export default{
  data () {
    return {
      keywords: '',
      dragendX: '',
      dragendY: '',
      roads: '',
      selectLocation: '',
      selectIndex: 0,
      marker: '',
      pointLayer: '',
      map: '',
      head: '',
      ac: '' // 输入框提示
    }
  },
  methods: {
    /* eslint-disable */
    init: function () {
      let x = this.dragendX || 410942332, // 经度
          y = this.dragendY || 81392068 // 纬度
      let point = new Careland.Point(x, y) // 创建地图中心点
      window.map = new Careland.Map('mymap', point, 18) // 创建地图对象
      window.map.enableCenterIcon() // 启用地图中心点图标
      window.map.enableAutoResize() // 启用自动适应容器尺寸变化
      window.map.load() // 加载地图
      this.head = document.head
      // this.map = window.map
      console.log('初始化', window.map)
      this.getLocationInfo(window.map)

      // 输入框提示
      let ac = new Careland.Autocomplete({
            input : "keywordId",
            location : window.map})
      ac.setLocation(window.map)
      ac.setInputForm('keywordId')
      this.ac = ac
      ac.addEventListener("onConfirm", (e) =>{
        let x = e.item.poi.point.x
        let y = e.item.poi.point.y
        window.map.centerAndZoom(e.item.poi.point, 17)
        this.getLocationInfo(window.map)
        ac.hide()
      });

      // 给地图设置监听
      window.map.addEventListener('mapchange', () => { // 为拖拽地图后添加事件
        this.getLocationInfo(window.map)
      })
    },
    // 根据地图中心位置的坐标搜索附近的路
    getLocationInfo: function (map) {
      let mapTag = document.getElementById('map')
      if (mapTag) {
        this.head.removeChild(mapTag)
      }
      let center = map.getCenter()
      this.dragendX = center.x
      this.dragendY = center.y
      let getLocationInfo = `${getLocation}?d=15&r=100&p=${this.dragendX}+${this.dragendY}&callback=getMapInfoCallback`,
          script = document.createElement('script')
      script.src = getLocationInfo
      script.id = 'map'
      this.head.appendChild(script)
    },
    /* eslint-enable */
    // 选择附近的路
    selectOption: function (index) {
      this.selectIndex = index
      this.selectLocation = this.roads[index]
      this.changeFlagPosition()
    },
    // 添加绿色小旗
    addFlag: function () {
      /* eslint-disable no-new */
      let location = this.selectLocation.location
      let x = location.x
      let y = location.y
      let point = new window.Careland.Point(x, y)
      let pointLayer = new window.Careland.Layer('point', 'layer') // 创建点图层
      window.map.addLayer(pointLayer)

      pointLayer.clear()

      // 创建样式，包括标注点位置的偏移以及文本的偏移
      let style = new window.Careland.PointStyle({offsetX: -6, offsetY: -30, textOffsetX: -5, textOffsetY: -30, src: flagGreen, fontColor: '#FFF'}) // 创建图片标注点
      let marker = new window.Careland.Marker('image')
      marker.setStyle(style) // 设置图片标注点样式
      marker.setPoint(point) // 设置标注点位置
      pointLayer.add(marker) // 将标注点添加到图层上
      this.pointLayer = pointLayer
      this.marker = marker
    },
    // 移动绿色小旗的位置
    changeFlagPosition: function () {
      /* eslint-disable no-new */
      let location = this.selectLocation.location
      let x = location.x
      let y = location.y
      let point = new window.Careland.Point(x, y)
      this.marker.setPoint(point)
    },
    // 移除绿色小旗
    removeFlag: function () {
      window.map.removeLayer(this.pointLayer)
      this.pointLayer = ''
      this.marker = ''
    },
    transN2Ten: function (a) {
      /* eslint-disable */
      var jzsy = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 18, J: 19, K: 20, L: 21, M: 22, N: 23, O: 24, P: 25, Q: 26, R: 27, S: 28, T: 29, U: 30, V: 31, W: 32, X: 33, Y: 34, Z: 35, a: 36, b: 37,
        c: 38, d: 39, e: 40, f: 41, g: 42, h: 43, i: 44, j: 45, k: 46, l: 47, m: 48, n: 49, o: 50, p: 51, q: 52, r: 53, s: 54, t: 55, u: 56, v: 57, w: 58, x: 59, y: 60, z: 61, "!": 62, "@": 63, "|": 64, $: 65, "%": 66, "^": 67, "~": 68, _: 69
      }
      for (var c = 0, d = 0, f = a.length; d < f; d++) {
        c += Number(jzsy[a.substr(d, 1)]) * Math.pow(70, f - (d + 1))
      }
      return c
      /* eslint-enable */
    },
    // 点击搜索按钮出发的事件
    search: function () {
      if (this.keywords) {
        let url = `http://api.careland.com.cn/api/v1/search/keyword?keyword=${this.keywords}&city=440300&xytype=2&count=10&detail_level=DETAIL_REGULAR&ak=3ec66fcdaf712f8647bd6c0d&callback=searchCallback`
        let search = document.getElementById('search')
        if (search) {
          search.remove()
        }
        let script = document.createElement('script')
        script.id = 'search'
        script.src = url
        document.head.appendChild(script)
      }
    },
    // 提交按钮出发的事件
    submit: function () {
      let mapSubmitScript = document.getElementById('mapSubmit')
      if (mapSubmitScript) {
        mapSubmitScript.remove()
      }
      let script = document.createElement('script')
      script.id = 'mapSubmit'
      script.src = `http://api.careland.com.cn/api/v1/rgeo?pn=3&range=10&p=${this.selectLocation.location.x},${this.selectLocation.location.y}&ak=3ec66fcdaf712f8647bd6c0d&callback=mapSubmit`
      document.head.appendChild(script)
    }
  },
  mounted () {
    // 地图初始化
    this.init()
    // 选择附近的路的监听
    window.addEventListener('setItemEvent', (e) => {
      let resData = e.mapData
      let roads = resData.roads
      let roadsArr = []
      for (let i = 0; i < roads.length; i++) {
        if (roads[i].n === '') { continue }
        let resultObj = {}
        resultObj.text = roads[i].n
        let x = this.transN2Ten(roads[i].p.substr(0, 5))
        let y = this.transN2Ten(roads[i].p.substr(5, 5))

        var point = new window.Careland.Point(x, y)
        resultObj.location = point
        resultObj.unitid = '-1'
        roadsArr.push(resultObj)
      }
      this.roads = roadsArr.length === 0 ? '' : roadsArr
      if (this.roads) {
        this.selectIndex = 0
        this.selectLocation = this.roads[0]
        if (this.marker) {
          this.changeFlagPosition()
        } else {
          this.addFlag()
        }
      } else {
        this.removeFlag()
      }
    })
    // 搜索结果的监听
    window.addEventListener('searchCallback', (e) => {
      if (e.searchData.errorCode === 0) {
        let resData = e.searchData
        console.log(resData)
        let cp = new window.Careland.GbPoint(resData.pois[0].xy.y, resData.pois[0].xy.x)
        window.map.setCenter(cp)
        this.ac.hide()
      }
    })
    // 提交选择的监听
    window.addEventListener('mapSubmit', (e) => {
      if (e.submitData.errorCode === '0') {
        let resData = e.submitData
        let poi = resData.results[0].pois[0]
        if (resData.results[0].pois) {
          let obj = {
            lng: this.selectLocation.location.x,
            lat: this.selectLocation.location.y,
            addressCode: '-1',
            addressRegion: poi.pcd.district,
            addressStreet: this.selectLocation.text,
            addressSite: poi.name,
            showAdd: resData.results[0].pois[0].pcd.district + this.selectLocation.text,
            detailAddress: poi.address || poi.pcd.province + poi.pcd.city + poi.pcd.district + poi.name,
            poi: poi
          }
          this.$emit('submit', obj)
        }
      }
    })
    // 定位成功之后处理的事情
    function setCenter (point) {
      // 添加绿色定位的小圆点
      let pointLayer1 = new window.Careland.Layer('point', 'layer1') // 创建点图层
      window.map.addLayer(pointLayer1)
      let style1 = new window.Careland.PointStyle({offsetX: -7, offsetY: -7, src: geopoint}) // 创建图片标注点
      let marker1 = new window.Careland.Marker('image')
      marker1.setStyle(style1) // 设置图片标注点样式
      marker1.setPoint(point) // 设置标注点位置
      pointLayer1.add(marker1)
      // 将地图中心点设置为定位的位置
      window.map.setCenter(point)
    }

    if (/AlipayClient/i.test(window.navigator.userAgent)) {
      // 支付宝定位
      if ((window.Ali.alipayVersion).slice(0, 3) >= 8.1) {
        window.Ali.geolocation.getCurrentPosition({
          timeout: 10000
        }, function (result) {
          if (result.errorCode) {
            // 没有成功定位的情况
            // errorCode=5，调用超时
            switch (result.errorCode) {
              case 5:
                Toast({
                  message: '定位超时',
                  position: 'bottom',
                  className: 'white'
                })
                break
              default:
                Toast({
                  message: '定位失败',
                  position: 'bottom',
                  className: 'white'
                })
            }
          } else {
            // 成功定位的情况
            let cp = new window.Careland.GbPoint(result.coords.latitude, result.coords.longitude)
            setCenter(cp)
          }
        })
      } else {
        Toast({
          message: '请在钱包8.1以上版本运行',
          position: 'bottom',
          className: 'white'
        })
      }
    }

    if (/MicroMessenger/i.test(window.navigator.userAgent)) {
      // 微信定位
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          let cp = new window.Careland.GbPoint(res.latitude, res.longitude)
          setCenter(cp)
        },
        fail: function () {
          Toast({
            message: '定位失败',
            position: 'bottom',
            className: 'white'
          })
        }
      })
    }
    //  else if (navigator.geolocation) {
    //   console.log('浏览器定位')
    //   // 浏览器定位
    //   navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
    //     // 指示浏览器获取高精度的位置，默认为false
    //     enableHighAccuracy: true,
    //     // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
    //     timeout: 5000,
    //     // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
    //     maximumAge: 3000
    //   })
    // } else {
    //   // 定位失败
    //   Toast({
    //     message: '定位失败',
    //     position: 'bottom',
    //     className: 'white'
    //   })
    // }

    // // 浏览器定位成功的回调
    // function locationSuccess (position) {
    //   let xy = wgs84togcj02(position.coords.longitude, position.coords.latitude)
    //   let cp = new window.Careland.GbPoint(xy[1], xy[0])
    //   setCenter(cp)
    // }

    // // 浏览器定位失败的回调
    // function locationError () {
    //   Toast({
    //     message: '浏览器定位失败',
    //     position: 'bottom',
    //     className: 'white'
    //   })
    // }
  },
  beforeDestroy () {
    this.ac.hide()
  }
}
</script>
<style lang="less">
.getLocation-outer{
  width: 100%;
  height: 100%;
  font-size: 28px;
  .getLocation-search{
    display: flex;
    height: 70px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    input{
      width: 87.5%;
      height: 100%;
      text-indent: 0.5625rem;
      border-radius: 0;
      box-sizing: border-box;
    }
    .search-btn{
      display: block;
      flex: 1;
      background: #fff url('../../assets/images/search.png') center no-repeat;
      background-size: 30px;
    }
  }
  #mymap{
    width: 100%;
    height: 1000px;
    /*height: 80%;*/
  }
  .getLocation-result{
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 5px;
    background: #dfefd8;
    p{
      flex: 1;
      text-align: center;
      color: #337ab7;
    }
    .submit-btn{
      width: 125px;
      height: 55px;
      text-align: center;
      line-height: 55px;
      border-radius: 5px;
      border: 1px solid #3db6da;
      color: #fff;
      background: #5cc0de;
    }
  }
  .getLocation-options{
    padding: 23px;
    background: #fff;
    ul{
      border-radius: 8px;
      border: 1px solid #dedede;
      overflow: hidden;
      li{
        background: #fff;
        text-indent: 60px;
        line-height: 60px;
        color: #000;
        border-bottom: 1px solid #dedede;
        &.active{
          background: #b4e5ff;
          color: #fff;
          &:before{
            content: '';
            display: inline-block;
            width: 15px;
            height: 8px;
            border-left: 4px solid #fff;
            border-bottom: 4px solid #fff;
            vertical-align: middle;
            transform: rotate(-45deg) translateY(-6px);
          }
        }
        &:last-child{
          border: none;
        }
      }
    }
    p{
      color: #000;
      font-weight: blod;
      text-align: center;
    }
  }
}
.white{
  span{
    color: #fff;
  }
}
</style>
