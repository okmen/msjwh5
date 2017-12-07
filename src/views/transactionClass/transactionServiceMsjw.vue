<template>
  <div class="transactionServiceMsjw-outer">
    <div class="transactionServiceMsjw-outer-nav">
      <div class="query-link">
        <router-link :to="{ path: '/userAgreement/jszbzhz', query: queryURL }">驾驶证补换证</router-link>
      </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'transactionServiceMsjw',
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    }
  }
</script>
<style lang="less" scopsd>
  .transactionServiceMsjw-outer {
    position: relative;
    background-color: #f2f2f2;
    font-size: 28px;
    padding-top: 30px;
    color: #000;
    .transactionServiceMsjw-outer-nav{
      background-color: #fff;
    }
    .query-link {
      border-bottom: 1px solid #dddddd;
      line-height: 90px;
      margin-left: 30px;
      a {
        display: block;
/*        padding-left: 50px;*/
      }
      p {
        padding: 0 50px;
        position: relative;
        i {
          width: 26px;
          height: 26px;
          display: inline-block;
          position: absolute;
          right: 40px;
          background-size: cover;
          top: 28px;
          &.arrow-open {
            background-image: url("../../assets/images/arrow-open.png");
          }
          &.arrow-close {
            background-image: url("../../assets/images/arrow-close.png");
          }
        }
      }
      .li-box {
        padding: 0 20px;
        background-color: #e9e9e9;
        display: none;
        a {
          display: block;
          text-align: center;
          text-indent: -50px;
          font-size: 28px;
          border-bottom: 1px solid #b5b4b4;
          background-color: #191919;
          &:last-child {
            border: none;
          }
        }
      }
      &.show {
        p {
          color: #fff;
          background-color: #7ab8df;
        }
        .li-box {
          display: block;
        }
      }
    }
  }
</style>
