<template>
<div class="g-upload v-center" @click="uploadImg">
  <label class="g-upload-img h-center" :for="id">
    <input :id="id" type="file" accept="image/*">
    <img :src="bg" v-if="!imgSrc">
    <img :src="imgSrc" alt="" v-if="imgSrc">
  </label>
  <div class="g-upload-text">
    {{text}}
  </div>
</div>
</template>

<script>
  import uploadFile from '@/utils/uploadFile'
  export default {
    data () {
      return {
        imgSrc: '',
        uploadFile: ''
      }
    },
    props: ['text', 'bg', 'id'],
    created () {
      if (this.$route.query.source === 'M') {
        this.$nextTick(() => {
          uploadFile.upload({
            id: this.id,
            callback: (res) => {
              this.imgSrc = res.imgUrl
              this.$emit('input', res.imgUrl.split(',')[1])
            }
          })
        })
      } else if (this.$route.query.source === 'G') {}
    },
    methods: {
      uploadImg () {
        /* eslint-disable */
        console.log('我点击了')
        let _this = this
        if(_this.$route.query.source === 'M') return
        console.log('我要进去AmapApp')
        AmapApp.Bridge.ready(function (res) {
          /**
           * 获取用户id.
           * 获取用户id.
           * @param {Function} handler 回调函数。
           *    参数为对象，如果其属性 userid 为空则登录失败||未登录，否则登录成功||已登录
           * @param {Boolean} [默认onlyGetId=false] 可选，是否只获取id，false的话用户未登录时就会自动跳转登录面板
           * @param {Boolean} [默认needRelogin=false] 可选，是否强制重新登录
           */
          console.log('我进去AmapApp')
          AmapApp.Bridge.send({
            "action": "addPhoto",
            "businessName": "测试",
            "titleText": "测试",
            "maxLength": "300",
            "onlyCamera": false//(是否直接调起摄像头拍照 （7.7.8+支持）),
          },function (base64) {
            alert(base64)
            _this.$nextTick(() => {
              _this.$emit('input', base64.split(',')[1])
            })
          },false,true)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .g-upload{
    margin-top: 20px;
  }
.g-upload-img{
  width: 304px;
  height: 304px;
  background-color: #efeff4;
  border-radius: 8px;
  border: 2px solid #dddde1;
  margin-bottom: 15px;
  input{
    display: none;
  }
  img{
    max-width: 90%;
    max-height: 90%;
  }
}
</style>
