<template>
  <!-- 星级用户验证问题反馈 -->
  <div class="issue-main">
    <div class="issue-head">星级用户验证问题反馈</div>
    <div class="issue-content">
      <textarea placeholder="请您描述问题反馈" required class="issue-input" v-model="content"></textarea>
      <div>上传照片</div>
      <div class="issue-upload">
        <div class="issue-upload-img">
          <label class="issue-upload-icon" for="file">
            <input id="file" type="file" accept="image/*">
            <img :src="bgImg"/>
          </label>
        </div>
        <div class="issue-img">
          <img v-if="img1" :src="img1" alt="">
          <img v-if="img2" :src="img2" alt="">
          <img v-if="img3" :src="img3" alt="">
        </div>
      </div>
      <div class="register-submit" @click="registerSubmit">提交</div>
    </div>
    
  </div>
</template>

<script>
  import uploadFile from '../../service/uploadFile'
  import {resultPost} from 'service/getData'
  import {Toast, MessageBox} from 'mint-ui'
  export default {
    data () {
      return {
        content: '',
        bgImg: require('../../images/upload.png'),
        img1: '',
        img2: '',
        img3: '',
        count: 1
      }
    },
    methods: {
      uploadImg () {
        uploadFile.upload({
          id: 'file',
          callback: (res) => {
            if (this.count === 1) {
              this.img1 = res.imgUrl
              this.count++
            } else if (this.count === 2) {
              this.img2 = res.imgUrl
              this.count++
            } else {
              this.img3 = res.imgUrl
            }
          }
        })
      },
      // 提交前的校验
      beforeSubmit () {
        if (!this.content) {
          Toast({
            message: '请您输入故障描述或建议内容',
            duration: 2000
          })
          return false
        }
        if (!this.img1) {
          Toast({
            message: '请您至少上传一张反馈图片',
            duration: 2000
          })
          return false
        }
        return true
      },
      // 提交
      registerSubmit () {
        if (!this.beforeSubmit()) return
        let requestData = {
          remark: this.content,
          img1: this.img1.split(',')[1] || this.img1,
          img2: this.img2.split(',')[1] || this.img2,
          img3: this.img3.split(',')[1] || this.img3,
          status: 0,
          openId: window.localStorage.getItem('openId')
        }
        console.log(requestData)
        resultPost('http://192.168.1.247:8080/web/user/problemFeedback.html', requestData).then(data => {
          MessageBox('温馨提示', data.data)
        })
      }
    },
    mounted () {
      this.uploadImg()
    }
  }
</script>

<style lang="less" scoped>
  .issue-main{
    overflow-y: scroll;
    .issue-head{
      height: 72px;line-height: 72px;font-size:40px;background: #0099C8;color: #fff;font-weight: 500;text-align: center;
    }
    .issue-content{
      padding: 40px;
      .issue-input{
        width: 100%;
        height: 250px;
        border: 1px solid #ccc;
        margin-bottom: 20px;
      }
      .issue-upload{
        margin-top: 30px;
        .issue-upload-img {
          background: #fff;
          width: 45%;
          height: 250px;
          border: 2px solid #eee;
          border-radius: 10px;
          .issue-upload-icon {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            input {
              display: none;
            }
          }
        }
        .issue-img{
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          img {
            margin-top: 10px;
            width:45%;
            object-fit: contain;
            background: #fff;
            height: 300px;
            border: 1px solid #ccc;
          }
        }
      }
      .register-submit {
        height: 100px;
        background: #47A2F0;
        text-align: center;
        line-height: 100px;
        color: white;
        border-radius: 10px;
        margin-top: 80px;
      }
    }
    
  }
</style>
