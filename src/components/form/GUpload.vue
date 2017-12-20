<template>
<div class="g-upload v-center" @click="uploadImg">
  <label class="g-upload-img h-center" :for="id" v-if="$route.query.source === 'M'">
    <input :id="id" type="file" accept="image/*">
    <img :src="bg" v-if="!imgSrc">
    <img :src="imgSrc" alt="" v-if="imgSrc">
  </label>
  <div class="g-upload-img h-center" :id="id" v-if="$route.query.source === 'G'">
    <img :src="bg" v-if="!imgSrc">
    <img :src="imgSrc" alt="" v-if="imgSrc">
  </div>
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
      }
    },
    methods: {
      uploadImg () {
        /* eslint-disable */
        if (this.$route.query.source === 'M') return
        let _this = this
        window.AmapApp.ready(function () {
          window.AmapApp.addPhoto('SSJJ','上传图片', '300',false, function (res) {
            _this.imgSrc = 'data:image/jpeg;base64,' + res
            _this.$emit('input', res)
          })
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
