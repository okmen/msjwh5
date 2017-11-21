<template>
    <div class="self-radio form-template-item">
      <span class="form-template-item-left">{{thisInfo.title}}</span>
      <div class="form-template-item-right both-ends" >
        <div  class="form-radio-box" v-for="item in thisInfo.option" @click="chooseRadio(item)">
          <div class="form-radio-box-circle">
            <div class="form-radio-pointer" v-if="item.choose"></div>
          </div>
          <span class="form-radio-box-title">{{item.str}}</span>
        </div>
      </div>
    </div>
</template>
<style>

</style>
<script>
  export default {
    props: ['childInfo'],
    computed: {
      thisInfo () {
        return this.childInfo
      }
    },
    watch: {
      thisInfo: {
        handler (val) {
          this.chooseDefault()
        },
        deep: true
      }
    },
    data () {
      return {
        selectedVal: ''
      }
    },
    methods: {
      chooseDefault () {
        this.thisInfo.option.map(item => {
          if (item.choose === true) {
            if (item.id) {
              this.selectedVal = item.id
            } else {
              this.selectedVal = item.str
            }
          }
        })
        this.$emit('getSelected', this.selectedVal)
      },
      chooseRadio (item) {
        this.childInfo.option.map(choose => {
          choose.choose = false
        })
        item.choose = true
      }
    },
    mounted () {
      this.chooseDefault()
    }
  }
</script>
