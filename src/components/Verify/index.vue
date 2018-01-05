<template>
    <div class="g-verify">
      <div class="g-verify-title">
        {{title}}
      </div>
      <!-- 验证码容器 -->
      <components v-if="componentType"
                  :is="componentType"
                  :type="verifyType"
                  :figure="figure"
                  :arith="arith"
                  :width="width"
                  :height="height"
                  :fontSize="fontSize"
                  :codeLength="codeLength"
                  :mode="mode"
                  :vOffset="vOffset"
                  :vSpace="vSpace"
                  :explain="explain"
                  :imgUrl="imgUrl"
                  :imgName="imgName"
                  :imgSize="imgSize"
                  :blockSize="blockSize"
                  :barSize="barSize"
                  :defaultNum="defaultNum"
                  :checkNum="checkNum"
                  ref="instance">
      </components>
      <!-- 确定按钮容器 -->
      <!-- <div @click="checkCode" style="width:0; height:0;">
          <slot name="check">
              <button class="verify-btn">{{i18n('ok')}}</button>
          </slot>
      </div> -->
    </div>
</template>

<script type="text/babel">
/**
     * Verify 验证码组件
     * @description 分发验证码使用
     * */
import VerifyCode from './Verify/VerifyCode'

export default {
  name: 'Vue2Verify',
  props: {
    // 双语化
    locale: {
      require: false,
      type: String,
      default () {
        // 默认语言不输入为浏览器语言
        if (navigator.language) {
          this.language = navigator.language
        } else {
          this.language = navigator.browserLanguage
        }
      }
    },
    type: {
      type: String | Number,
      require: false,
      default: 'picture'
    },
    figure: {
      type: Number
    },
    arith: {
      type: Number
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    fontSize: {
      type: String
    },
    codeLength: {
      type: Number
    },
    mode: {
      type: String
    },
    vOffset: {
      type: Number
    },
    vSpace: {
      type: Number
    },
    explain: {
      type: String
    },
    imgUrl: {
      type: String
    },
    imgName: {
      type: Array
    },
    imgSize: {
      type: Object
    },
    blockSize: {
      type: Object
    },
    barSize: {
      type: Object
    },
    defaultNum: {
      type: Number
    },
    checkNum: {
      type: Number
    },
    title: {
      type: String | Number
    }
  },
  data () {
    return {
      verifyType: undefined,
      componentType: undefined,
      language: ''
    }
  },
  methods: {
    /**
             * i18n
             * @description 兼容vue-i18n 调用$t来转换ok
             * @param {String} text-被转换的目标
             * @return {String} i18n的结果
             * */
    i18n (text) {
      if (this.$t) {
        return this.$t(text)
      } else {
        // 兼容不存在的语言
        let i18n =
          this.$options.i18n.messages[this.locale] ||
          this.$options.i18n.messages['en-US']
        return i18n[text]
      }
    },
    /**
             * checkCode
             * @description 判断验证码
             * */
    checkCode () {
      if (this.instance.checkCode) {
        this.instance.checkCode()
      }
    },
    /**
             * refresh
             * @description 刷新
             * */
    refresh () {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    }
  },
  computed: {
    instance () {
      return this.$refs.instance || {}
    }
  },
  watch: {
    type: {
      immediate: true,
      handler (type) {
        switch (type.toString()) {
          case 'picture':
            this.verifyType = '1'
            this.componentType = 'VerifyCode'
            break
          case '1':
            this.verifyType = '1'
            this.componentType = 'VerifyCode'
            break
          case 'compute':
            this.verifyType = '2'
            this.componentType = 'VerifyCode'
            break
          default:
            this.verifyType = undefined
            this.componentType = undefined
            console.error('Unsupported Type:' + type)
        }
      }
    }
  },
  components: {
    VerifyCode
  },
  i18n: {
    messages: {
      'en-US': {
        ok: 'ok'
      },
      'zh-CN': {
        ok: '确定'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.g-verify {
  display: flex;
  padding: 10px 40px;
  box-sizing: border-box;
  align-items: center;
  .g-verify-title{
    width: 30%;
  }
}
</style>