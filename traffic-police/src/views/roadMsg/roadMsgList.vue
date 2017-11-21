<template>
  <div class="page-loadmore">
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
        <ul class="page-loadmore-list">
          <li v-for="item in list" class="page-loadmore-listitem" @click="itemFn(item.id)">
            <div class="roadList-item-text">
              <h4>道路名称：<span>{{item.roadName}}</span></h4>
              <div class="roadList-item-text-btm">
                <p>拥堵级别：<span>{{item.eventLevel}}</span></p>
                <p>更新时间：<span class="time">{{item.modifyDate}}</span></p>
              </div>
            </div>
            <div class="roadList-item-ico"></div>
          </li>
        </ul>
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">
            loading...
          </span>
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
import { resultPostNoLoading, resultPost } from '../../service/getData'
import { trafficQuery } from '../../config/baseUrl'
// import { Toast, Indicator } from 'mint-ui'

export default {
  name: 'roadMsgList',
  data () {
    return {
      list: [],
      topStatus: '',
      wrapperHeight: 0,
      translate: 0,
      moveTranslate: 0
    }
  },
  methods: {
    handleTopChange (status) {
      this.moveTranslate = 1
      this.topStatus = status
    },
    translateChange (translate) {
      const translateNum = +translate
      this.translate = translateNum.toFixed(2)
      this.moveTranslate = (1 + translateNum / 70).toFixed(2)
    },
    loadTop () {
      resultPostNoLoading(trafficQuery, {}).then(obj => {
        console.log(obj)
        this.list = obj.data
        this.$refs.loadmore.onTopLoaded()
      }).catch(obj => {
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      })
      // setTimeout(() => {
      //   this.$refs.loadmore.onTopLoaded()
      // }, 1500)
    },
    itemFn (id) {
      console.log(id)
      this.$router.push({name: 'roadMsgDetails', query: { zjz: id }})
    }
  },
  mounted () {
    resultPost(trafficQuery, {}).then(obj => {
      console.log(obj)
      this.list = obj.data
      // this.$refs.loadmore.onTopLoaded()
    }).catch(obj => {
      // setTimeout(() => {
      // }, 1000)
    })
    // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
  }
}
</script>

<style lang="less">

.mint-loadmore-top {
  span {
    display: inline-block;
    transition: .2s linear;
    vertical-align: middle;
  }
  .is-rotate {
    transform: rotate(180deg);
  }
}
.page-loadmore-listitem {
  height: 182px;
  line-height: 70px;
  border-bottom: solid 1px #eee;
  padding: 20px 70px 0px 45px;
  box-sizing: border-box;
  position: relative;
  &:first-child {
    border-top: solid 1px #eee;
  }
  h4{
    font-size: 30px;
    color: #333;
    span{
      color: #666;
    }
  }
  .roadList-item-text-btm{
    display: flex;
    justify-content: space-between;
    p{
      font-size: 26px;
      span{
        color: #666;
      }
      .time{
        color: #666;
      }
    }
  }
  .roadList-item-ico{
    background: url('../../images/arrow_right.png');
    background-size: cover;
    width: 20px;
    height: 34px;
    position: absolute;
    top: 50%;
    right: 28px;
    transform: translateY(-50%);
  }
}
.page-loadmore-wrapper {
  margin-top: -1px;
}
</style>
