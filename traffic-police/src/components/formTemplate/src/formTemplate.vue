<template>
  <div class="form-template">
    <div v-for="(item, index) in  thisData" class="no-margin-bottom">
      <div-select v-if="item.type == 'select'" :childInfo="item.content" @getSelected="item.method"></div-select>
      <self-input v-if="item.type == 'input'" :childInfo="item.content" @getSelected="item.method"></self-input>
      <self-textarea v-if="item.type == 'textarea'" :childInfo="item.content" @getSelected="item.method"></self-textarea>
      <self-code v-if="item.type=='verification'" :childInfo="item.content" @getSelected="item.method"></self-code>
      <self-address v-if="item.type=='address'" :childInfo="item.content" @getSelected="item.method"></self-address>
      <self-plate v-if="item.type=='plate'" :childInfo="item.content" @getSelected="item.method"></self-plate>
      <self-radio v-if="item.type=='radio'"  :childInfo="item.content" @getSelected="item.method"></self-radio>
    </div>
    <div class="form-template-submit" @click="getAllData">提 交</div>
  </div>
</template>
<style>

</style>
<script>
  export default {
    data () {
      return {
        allData: []
      }
    },
    props: ['formData', 'linkage'],
    computed: {
      thisData () {
        return this.formData
      }
    },
    methods: {
      getAllData () {
        this.$emit('getAlldata', this.allData)
      }
    },
    components: {
      divSelect: require('components/divSelect'),
      selfInput: require('./selfInput.vue'),
      selfTextarea: require('./selfTextarea.vue'),
      selfCode: require('./selfCode.vue'),
      selfAddress: require('./selfAddress.vue'),
      selfPlate: require('./selfPlate.vue'),
      selfRadio: require('./selfRadio.vue')
    },
    created () {
      this.thisData.map((item, index) => {
        if (item.changeOther) {
          item.method = (val) => {
            this.$set(this.allData, index, val)
            item.to.map(item => {
              this.thisData[item].content.defaultValue = this.linkage[item][val]
            })
          }
        } else {
          item.method = (val) => {
            console.log(val)
            this.$set(this.allData, index, val)
          }
        }
      })
    }
  }
</script>
