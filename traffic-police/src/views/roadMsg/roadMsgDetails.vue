<template>
  <div class="roadDetails">
    <div id="roadDetails-map"></div>
    <div class="roadDetails-text">
      <h4>路况信息</h4>
      <div class="roadDetails-dts">
        <p>道路名称：<span>{{roadObj.roadName}}</span></p>
        <p>路段名称：<span>{{roadObj.sectionName}}</span></p>
        <p>拥堵起始路段：<span>{{roadObj.startUnitName}}</span></p>
        <p>拥堵终止路段：<span>{{roadObj.endUnitName}}</span></p>
        <div class="roadDetails-dts-flex">
          <p>拥堵级别：<span>{{roadObj.eventLevel}}</span></p>
          <p>拥堵原因：<span>{{roadObj.eventReason}}</span></p>
        </div>
        <div class="roadDetails-dts-flex">
          <p>拥堵开始时间：<span>{{roadObj.startDate}}</span></p>
          <p>更新时间：<span>{{roadObj.modifyDate}}</span></p>
        </div>
        <div class="roadDetails-dts-btm">
          <p>详细情况说明：</p>
          <span>{{roadObj.summary}}</span>
        </div>
        <div class="roadDetails-dts-img" v-if="imgBoxShow">
            <img :src="'data:image/png;base64,' + roadObj.pic" @click="imgShow = true">
        </div>
      </div>
      <mt-popup v-model="imgShow" popup-transition="popup-fade">
        <img :src="'data:image/png;base64,' + roadObj.pic">
      </mt-popup>
    </div>
  </div>
</template>

<script>
import { resultPost } from '../../service/getData'
import { detailsTrafficQuery } from '../../config/baseUrl'
// import { Toast, Indicator } from 'mint-ui'
/* eslint-disable */
export default {
  name: 'roadMsgDetails',
  data () {
    return {
      roadObj: {
      //   endUnitName: '红岗人行天桥',
      //   eventLevel: '车多',
      //   eventReason: '车流量过大',
      //   gpsX: '114.096667',
      //   gpsY: '22.56861',
      //   id: '537418',
      //   modifyDate: '09:30:54',
      //   pic: '111',
      //   roadName: '泥岗路',
      //   sectionName: '泥岗村段',
      //   startDate: '07:29:28',
      //   startUnitName: '上步立交asdasdasdasdasdasda东',
      //   summary: '泥岗路 在上步立交东 东向西方向上，由于车流量过大造成从上步立交东到泥岗路红岗人行天桥车多'
      },
      imgShow: false,
      imgBoxShow: false
    }
  },
  methods: {
  },
  mounted () {
  resultPost(detailsTrafficQuery, {zjz: this.$route.query.zjz}).then(obj => {
    console.log(obj)
    this.roadObj = obj.data
    this.imgBoxShow = true
    var center = new qq.maps.LatLng(this.roadObj.gpsY,this.roadObj.gpsX)
    var map = new qq.maps.Map(document.getElementById("roadDetails-map"), {
        // 地图的中心地理坐标。
        center: center,
        zoom:15
    });
    //添加地图导航平移控件
    var navControl = new qq.maps.NavigationControl({
        align: qq.maps.ALIGN.TOP_LEFT,
        // margin: new qq.maps.Size(5, 15),
        map: map
    });
    //实时路况图层
    var layer = new qq.maps.TrafficLayer();
    layer.setMap(map);
    })
  }
}
/* eslint-enable */
</script>

<style lang="less">
.roadDetails{
  #roadDetails-map{
    width: 100%;
    height: 500px;
  }
  .roadDetails-text{
    position: relative;
    padding: 0 45px 80px;
    box-sizing: border-box;
    font-size: 26px;
    line-height: 60px;
    h4{
      text-align: center;
      font-size: 30px;
      line-height: 80px;
    }
    .roadDetails-dts{
      position: relative;
      p{
        color: #333;
        span{
          display: inline-block;
          color: #666;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          margin-top: -2px;
        }
      }
      .roadDetails-dts-flex{
        display: flex;
/*         justify-content: space-around; */
        p{
          width: 50%;
          span{
            max-width: 150px;
          }
        }
      }
      .roadDetails-dts-btm{
        position: relative;
        padding-left: 182px;
        p{
          position: absolute;
          left: 0;
        }
        span{
          line-height: 30px;
        }
      }
    }
    .roadDetails-dts-img{
      width: 244px;
      height: 190px;
      border-radius: 8px;
      position: absolute;
      top: 30px;
      right: 0;
      overflow: hidden;
      img{
        display: block;
        width: 100%;
      }
    }
  }
}
.mint-popup{
  width: 80%;
  max-height: 80%;
  img{
    width: 100%;
    display: block;
  }
}

</style>
