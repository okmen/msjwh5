<template>
  <div class="starUser-outer">
    <div class="starUser-select pad-side-50">
      <p>请根据您的出行方式来选择服务认证类型</p>
      <div class="div-select">
        <span id="btnSelect" class="btn-select" @click.stop="typeSelectClick()">{{ typeSelectMassage.str }}</span>
        <div class="div-select-ul" v-if='typeSelectShow'>
          <ul>
            <li v-for="(item, index) in typeSelectData" @click.stop = "typeSelectClick(index+1)">
              <router-link class="link" :to="item.path">{{ item.str }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="starUser-from pad-side-50">
      <router-view></router-view>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
export default {
  name: 'starUser',
  data () {
    return {
      curTab: 'carOwner',
      typeSelectShow: false,
      typeSelectMassage: '',
      typeSelectData: [
        {
          'name': 'carOwner',
          'str': '我是车主',
          'path': '/starUser/carOwner'
        },
        {
          'name': 'carUser',
          'str': '我不是车主，我是车辆长期使用人',
          'path': '/starUser/carUser'
        },
        {
          'name': 'drivingLicense',
          'str': '我有驾驶证，但没固定车辆',
          'path': '/starUser/drivingLicense'
        },
        {
          'name': 'passerBy',
          'str': '我是行人，非机动车驾驶人',
          'path': '/starUser/passerBy'
        }
      ]
    }
  },
  methods: {
    typeSelectClick: function (index) {
      if (index) {
        index--
        this.typeSelectMassage = this.typeSelectData[index]
        this.curTab = this.typeSelectMassage.name
      }
      this.typeSelectShow = !this.typeSelectShow
    },
    select: function () {
      this.typeSelectShow = false
    }
  },
  created () {
    document.addEventListener('click', (e) => {
      this.typeSelectShow = false
    })
    switch (window.location.hash) {
      case '#/starUser/carOwner':
        this.typeSelectMassage = this.typeSelectData[0]
        break
      case '#/starUser/carUser':
        this.typeSelectMassage = this.typeSelectData[1]
        break
      case '#/starUser/drivingLicense':
        this.typeSelectMassage = this.typeSelectData[2]
        break
      case '#/starUser/passerBy':
        this.typeSelectMassage = this.typeSelectData[3]
        break
    }
  }
}
</script>
<style lang="less" >
.starUser-outer {
  font-size: 26px;
  color: #000;
  position: relative;
  .width-120 {
    width: 120px !important;
  }
  .width-70 {
    width: 70% !important;
  }
  .width-40{
    width: 40% !important;
  }
  .starUser-select {
    background-color: #fff;
    padding-bottom: 24px;
    position: relative;
    p {
      color: #666;
      line-height: 68px;
    }
    .link{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .starUser-from{
    background:#FFF;
    margin-top:10px;
  }
}
</style>
