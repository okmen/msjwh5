<template>
    <div class="pop-up_G">
      <div class="content">
        <div class="title" :style="{color: title.color}">{{title.name}}</div>
        <div class="description" v-if="description" >{{description}}</div>
        <div class="button" v-for="button in buttons" :class="[button.class]" @click="button.methods">{{button.title}}</div>
      </div>
    </div>
</template>
<style lang="less" scoped>
.pop-up_G{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  .content{
    margin-top: -20%;
   background: white;
    width: 70%;
    text-align: center;
    padding-top: 50px;
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    .title{
      color: #2696dd;
      font-size: 40px;
      width: 75%;
      margin-bottom: 30px;
    }
    .description{
      color: #666666;
      font-size: 27px;
      width: 75%;
      margin-bottom: 30px;
    }
    .button{
       font-size: 35px;
      width: 80%;
      height: 70px;
      line-height: 70px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    .btn1{
      color: white;
      background: #2696dd;
    }
    .btn2{
      color: #2696dd;
      border: 2px solid #2696dd;
    }
  }
}
</style>
<script>
  export default {
    data () {
      return {}
    },
    props: ['title', 'description', 'buttons']
  }
</script>
