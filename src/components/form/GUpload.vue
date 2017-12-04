<template>
<div class="g-upload v-center">
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
        imgSrc: ''
      }
    },
    props: ['text', 'bg', 'id'],
    created () {
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
