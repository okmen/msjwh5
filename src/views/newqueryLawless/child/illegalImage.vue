<!-- 违法图片 -->
<template lang="html">
  <div class="illegalImage-outer">
    <img :src="`data:image/png;base64,${imgBase}`" ref="image" id="image">
  </div>
</template>

<script>
import { illegalPictureQuery } from '@/config/baseURL'
import Viewer from 'viewerjs'
export default {
  data () {
    return {
      imgBase: ''
    }
  },
  mounted () {
    // let imgQueryCode = '1A84ED1DECF55BA75C137669273087D6'
    let imgQueryCode = this.$route.query.imgQueryCode
    console.log('imgQueryCode', imgQueryCode)
    this.$axios.post(illegalPictureQuery, {imgQueryCode, sourceOfCertification: 'C'}).then(json => {
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
        this.$toast('无违法图片')
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
