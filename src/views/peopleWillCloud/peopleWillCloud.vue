<template>
  <div class="peopleWillCloud-wrap">
    <mymap v-if="mapShow" @submit="submitMap" @hide="hideMap()"></mymap>
    <div class="peopleWillCloud-outer"  v-else>
      <div class="peopleWillCloud-select">
        <p>请选择需要举报的事项</p>
        <g-select classType='filled' :data="typeSelectData" v-model="typeSelectDataOne"></g-select>
      </div>
      <div class="peopleWillCloud-form">
        <router-view @showMap="showMap" :mapObj="mapObj" @submitSuccess="submitSuccess()"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import mymap from '../map/map'
import { Indicator } from 'mint-ui'
export default {
  name: 'peopleWillCloud',
  data () {
    return {
      mapShow: false,
      mapObj: '',
      typeSelectDataOne: 'facility',
      typeSelectData: [
        {
          value: 'facility',
          name: '这里设施坏了',
          'path': '/peopleWillCloud/facility'
        },
        {
          value: 'secure',
          name: '这有安全隐患',
          'path': '/peopleWillCloud/secure'
        },
        {
          value: 'jam',
          name: '这里经常拥堵',
          'path': '/peopleWillCloud/jam'
        },
        {
          value: 'order',
          name: '这里秩序混乱',
          'path': '/peopleWillCloud/order'
        }
      ]
    }
  },
  components: {
    mymap
  },
  watch: {
    typeSelectDataOne: function (val) {
      this.mapObj = ''
      window.location.replace(`#/peopleWillCloud/${val}?source=${this.$route.query.source}`)
    }
  },
  methods: {
    submitMap: function (obj) {
      this.mapShow = false
      this.mapObj = obj
      // console.log(this.mapObj)
    },
    showMap: function () {
      this.mapShow = true
    },
    hideMap: function () {
      this.mapShow = false
    },
    submitSuccess: function () {
      Indicator.close()
      console.log('举报成功')
      window.location.replace(`#/trafficCivilization?source=${this.$route.query.source}`)
    }
  },
  created () {
    let str = window.location.hash.split('?')[0]
    switch (str) {
      case '#/peopleWillCloud/facility':
        this.typeSelectDataOne = 'facility'
        break
      case '#/peopleWillCloud/secure':
        this.typeSelectDataOne = 'secure'
        break
      case '#/peopleWillCloud/jam':
        this.typeSelectDataOne = 'jam'
        break
      case '#/peopleWillCloud/order':
        this.typeSelectDataOne = 'order'
        break
    }
  }
}
</script>

<style lang="less" >
.peopleWillCloud-wrap {
  .peopleWillCloud-select {
    position: relative;
    padding-bottom: 24px;
    .g-select {
      padding: 0 40px;
    }
    p {
      padding: 0 40px;
      font-size: 26px;
      color: #666;
      line-height: 68px;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 10px;
      background-color: #F5F5F5;
    }
  }
  .peopleWillCloud-form {
    margin-top: 10px;
  }
}
</style>
