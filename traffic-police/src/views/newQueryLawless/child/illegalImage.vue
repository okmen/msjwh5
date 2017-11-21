<template lang="html">
  <div class="illegalImage-outer">
    <!-- <div @touchstart="touchstart" @touchmove="touchmove" :style="{width: `${scale*100}%`}"> -->
      <img :src="`data:image/png;base64,${imgBase}`" ref="image" id="image">
    <!-- </div> -->
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
import { resultPost } from '../../../service/getData'
import { illegalPictureQuery } from '../../../config/baseUrl'
import { Toast } from 'mint-ui'
import Viewer from 'viewerjs'
export default {
  data () {
    return {
      imgBase: '',
      touchDistance: 0,
      scale: 1,
      viewer: ''
    }
  },
  mounted () {
    let imgQueryCode = this.$route.query.imgQueryCode
    console.log('imgQueryCode', imgQueryCode)
    resultPost(illegalPictureQuery, {imgQueryCode}).then(json => {
      if (json.data.length > 0) {
        this.imgBase = json.data[0]
        this.$nextTick(() => {
          /* eslint-disable */
          this.viewer = new Viewer(document.getElementById('image'), {
            navbar: false,
            title: false,
            toolbar: false,
            button: false
          })
          /* eslint-enable */
          this.$refs.image.click()
        })
      } else {
        Toast({
          message: '无违法图片',
          position: 'bottom',
          duration: 2000
        })
      }
    })
  },
  beforeDestroy () {
    this.viewer.destroy()
  }
}
</script>

<style lang="less">
.viewer-container{
  background-color: #000;
}
.illegalImage-outer{
  text-align: center;
  img{
    visibility: hidden;
  }
}
</style>
