<template>
  <div class="civilization-outer pad-side-50">
    <!-- 导航上部分 -->
    <div class="civilization-nav margin-center radius-top border-bot-1">
      <router-link class="civilization-link border-right-1" :to="{ path: '/peopleWillCloud/facility', query: queryURL }">
        <div class="civilization-img">
          <em class="facility"></em>
        </div>
        <p class="civilization-str">这里设备坏了</p>
      </router-link>
      <router-link class="civilization-link" :to="{ path: '/peopleWillCloud/secure', query: queryURL }">
        <div class="civilization-img">
          <em class="secure"></em>
        </div>
        <p class="civilization-str">这有安全隐患</p>
      </router-link>
    </div>
    <!-- 导航下部分 -->
    <div class="civilization-nav margin-center radius-bot">
      <router-link class="civilization-link border-right-1" :to="{ path: '/peopleWillCloud/jam', query: queryURL }">
        <div class="civilization-img">
          <em class="jam"></em>
        </div>
        <p class="civilization-str">这里经常拥堵</p>
      </router-link>
      <router-link class="civilization-link" :to="{ path: '/peopleWillCloud/order', query: queryURL }">
        <div class="civilization-img">
          <em class="order"></em>
        </div>
        <p class="civilization-str">这里秩序混乱</p>
      </router-link>
    </div>
    <div class="civilization-news margin-center">
      <ul>
        <li v-for='(item, index) in sliceNews' :key="index">
          <a :href="item.filePath">{{item.fileName}}</a>
        </li>
      </ul>
    </div>
    <ul class="civilization-pagination">
      <li v-for="(i, index) in newsLength" :key="index" :class="{active: i==index}" @click.stop="changeIndex(i)" v-if="i == index || i == index+1 || i == index-1">{{i}}</li>
      <li v-if="(length > 3)" class="more">···</li>
    </ul>
  </div>
</template>

<script>
import { getDOC } from '@/config/baseURL'
export default {
  name: 'trafficCivilization',
  data () {
    return {
      news: [
        {
          'fileName': '深圳交警民意云2017年第六期办理情况通报（2017年3月13日至2017年3月19日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20170313-20170319.doc'
        },
        {
          'fileName': '深圳交警民意云2017年第五期办理情况通报（2017年3月6日至2017年3月12日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20170306-20170312.doc'
        },
        {
          'fileName': '深圳交警民意云2017年第四期办理情况通报（2017年2月20日至2017年2月26日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20170220-20170226.doc'
        },
        {
          'fileName': '深圳交警民意云2017年第三期办理情况通报（2017年2月14日至2017年2月19日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20170214-20170219.docx'
        },
        {
          'fileName': '深圳交警民意云2017年第二期办理情况通报（2017年2月3日至2017年2月13日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20170203-20170213.doc'
        },
        {
          'fileName': '深圳交警民意云2017年第一期办理情况通报（2017年1月13日至2017年2月5日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20170113-20170205.docx'
        },
        {
          'fileName': '深圳交警民意云2016年第三期办理情况通报（2016年12月23日至2017年1月12日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20161223-20170112.docx'
        },
        {
          'fileName': '深圳交警民意云2016年第二期办理情况通报（2016年12月8日至2016年12月22日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20161208-20161222.docx'
        },
        {
          'fileName': '深圳交警民意云2016年第一期办理情况通报（2016年12月2日至2016年12月8日）',
          'filePath': 'http://gzh.stc.gov.cn/szjjpro/assets/doc/20161202-20161208.docx'
        }
      ],
      index: 1,
      length: 0
    }
  },
  methods: {
    changeIndex: function (index) {
      this.index = index
    }
  },
  computed: {
    sliceNews: function () {
      return this.news.slice((this.index - 1) * 5, this.index * 5)
    },
    newsLength: function () {
      this.length = Math.ceil(this.news.length / 5)
      return this.length
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted () {
    this.$axios.get(getDOC).then(json => {
      console.log(json)
      this.news = json.data
    })
  }
}
</script>

<style lang="less">
.civilization-outer{
  padding-top: 47px;
  .margin-center{
    margin: 0 auto;
  }
  .border-bot-1{
    border-bottom: 2px solid #eaeaea;
    box-sizing: border-box;
  }
  .border-right-1{
    border-right: 2px solid #eaeaea;
    box-sizing: border-box;
  }
  .radius-top{
    border-radius: 5px 5px 0 0;
  }
  .radius-bot{
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 1px #dedede;
  }
  .civilization-nav{
    display: flex;
    width: 100%;
    height: 300px;
    overflow: hidden;
    text-align: center;
    justify-content: space-between;
    align-content: space-between;
    .civilization-link{
      display: block;
      width: 100%;
      height: 100%;
      background: #fff;
      .civilization-img{
        width: 100%;
        height: 190px;
        padding: 45px 0;
        box-sizing: border-box;
        em{
          display: block;
          width: 100%;
          height: 100%;
        }
        .facility{
          background: url('../../assets/images/trafficCivilization-facility.png') center no-repeat;
          background-size: contain;
        }
        .secure{
          background: url('../../assets/images/trafficCivilization-secure.png') center no-repeat;
          background-size: contain;
        }
        .jam{
          background: url('../../assets/images/trafficCivilization-jam.png') center no-repeat;
          background-size: contain;
        }
        .order{
          background: url('../../assets/images/trafficCivilization-order.png') center no-repeat;
          background-size: contain;
        }
      }
    }
  }
  .civilization-news{
    width: 100%;
    margin-top: 28px;
    background: #fff;
    border-radius: 5px;
    ul{
      // padding: 0 34px;
      li{
        border-bottom: 2px solid #eaeaea;
        &:last-child{
          border: none;
        }
        a{
          display: block;
          width: 100%;
          line-height: 50px;
          padding: 10px 0 10px 26px;
          color: #4d7fa7;
          font-size: 28px;
          position: relative;
          &::before{
            display: block;
            content: '';
            width: 21px;
            height: 21px;
            position: absolute;
            background: url('../../assets/images/list-style.png') no-repeat;
            background-size: cover;
            left: -16px;
            top: 28px;
          }
        }
      }
    }
  }
  .civilization-pagination{
    display: flex;
    justify-content: flex-end;
    margin: 30px 0;
    li{
      width: 60px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 28px;
      color: #999;
      background: #fff;
      margin-left: 2px;
      &.active{
        color: #658fb2;
      }
      &:first-child{
        border-radius: 8px 0 0 8px;
      }
      &:last-child{
        border-radius: 0 8px 8px 0;
      }
    }
  }
}
</style>