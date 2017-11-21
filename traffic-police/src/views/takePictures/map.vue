<template>
  <div>
    <input id="file" type="file" accept="image/*" >
    <img :src="src" alt="">
  </div>
</template>
<script>
/* eslint-disable */
import UploadFile from '../../service/uploadFile'
export default {
  name: 'map',
  data () {
    return {
      src:''
    }
  },
  methods: {
  	init: function() {
      UploadFile.upload({
        id:'file',
        callback:(res)=>{
          console.log(res);
          this.src = res.imgUrl;
        }
      });
    }
  },
  mounted: function(){
    this.init();
  }
}
/* eslint-enable */
</script>
<style>
  
</style>