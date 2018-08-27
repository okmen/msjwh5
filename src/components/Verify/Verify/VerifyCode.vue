<template>
    <div class="cerify-code-panel">
        <div class="verify-code-area" :style="{'width': width}">
            <div class="verify-input-area">
                <input type="text" v-model="currentValue" class="letify-input-code"/>
            </div>
        </div>
        <div class="verify-code"
             @click="setCode"
             :style="{
                    'width': width,
                    'height': height,
                    'line-height': height,
                    'font-size': fontSize,
                    'background-color': containerBackgroundColor,
                    'color': containerColor
                }">
            <!-- 显示字符串 -->
            <span :style="code.style" v-for="(code, index) in codeShow" :key="index">
                {{code.char || code}}
            </span>
        </div>
    </div>
</template>
<script type="text/babel">
/**
     * Code
     * @description 常规的图片文字识别或者数字计算
     * */
import { codeChars, codeColor1, codeColor2 } from './util'

export default {
  name: 'VerifyCode',
  props: {
    type: {
      type: String,
      default: '1'
    },
    figure: {
      type: Number,
      default: 100
    },
    arith: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '120px'
    },
    height: {
      type: String,
      default: '28px'
    },
    fontSize: {
      type: String,
      default: '20px'
    },
    codeLength: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      isEnd: false,
      // 颜色
      containerBackgroundColor: '#fff',
      containerColor: '#fff',

      codeChose: '', // 应该输入的code
      codeShow: [], // 显示用的
      tmparith: '',

      currentValue: ''
    }
  },
  methods: {
    init () {
      this.setCode()

      this.$parent.$emit('ready', this)
    },
    /**
             * setCode
             * @description 设置验证码
             * */
    setCode () {
      if (this.isEnd === false) {
        this.containerBackgroundColor =
          codeColor1[Math.floor(Math.random() * 3)]
        this.containerColor = codeColor2[Math.floor(Math.random() * 5)]

        // this.currentValue = ''

        this.codeShow = []
        this.codeChose = ''

        if (this.type === '1') {
          for (let i = 0; i < this.codeLength; i++) {
            let charNum = Math.floor(Math.random() * 52)
            let tmpStyle =
              charNum % 2 === 0
                ? 'font-style:italicmargin-right: 10px'
                : 'font-weight:bolder'
            tmpStyle +=
              Math.floor(Math.random() * 2) === 1 ? 'font-weight:bolder' : ''
            this.codeChose += codeChars[charNum]
            this.codeShow.push({
              style: tmpStyle,
              char: codeChars[charNum]
            })
          }
        } else if (this.type === '2') {
          // 算法验证码
          let num1 = Math.floor(Math.random() * this.figure)
          let num2 = Math.floor(Math.random() * this.figure)

          let codeShow = ''

          if (this.arith === 0) {
            this.tmparith = Math.floor(Math.random() * 3)
          }

          switch (this.tmparith) {
            case 1:
              this.codeChose = parseInt(num1) + parseInt(num2)
              codeShow = num1 + ' + ' + num2 + ' = ?'
              break
            case 2:
              if (parseInt(num1) < parseInt(num2)) {
                let tmpnum = num1
                num1 = num2
                num2 = tmpnum
              }
              this.codeChose = parseInt(num1) - parseInt(num2)
              codeShow = num1 + ' - ' + num2 + ' = ?'
              break
            default:
              this.codeChose = parseInt(num1) * parseInt(num2)
              codeShow = num1 + ' × ' + num2 + ' = ?'
              break
          }

          this.codeShow = codeShow.split('') // 转数组
        }
      }
    },
    /**
             * checkCode
             * @description 验证验证码
             * */
    checkCode () {
      let inputValue
      let codeChose
      if (this.type === '1' && this.currentValue) {
        inputValue = this.currentValue.toUpperCase()
        codeChose = this.codeChose.toUpperCase()
      } else {
        inputValue = this.currentValue
        codeChose = this.codeChose
      }

      if (!inputValue) {
        this.$toast({message: '请输入验证码', position: 'middle', duration: 3000})
        return false
      }

      if (inputValue === codeChose) {
        // this.isEnd = true
        // this.$parent.$emit('success', this)
        return true
      } else {
        this.setCode()
        this.$toast({message: '请输入正确的验证码', position: 'middle', duration: 3000})
        return false
        // this.$parent.$emit('error', this)
      }
    },
    /**
    * refresh
    * @description 刷新
    * */
    refresh () {
    //   this.isEnd = false
      this.currentValue = ''
      this.setCode()
    }
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler () {
        this.init()
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
      }
    }
  },
  mounted () {
    // 禁止拖拽
    this.$el.onselectstart = function () {
      return false
    }
    this.currentValue = this.value
  },
  i18n: {
    messages: {
      'en-US': {},
      'zh-CN': {}
    }
  }
}
</script>

<style lang="less" scoped>
/*常规验证码*/
.verify-code {
  font-size: 20px;
  text-align: center;
  border: 1px solid #ddd;
  margin-left: 0;
}
.cerify-code-panel {
  display: flex;
  align-items:center;
}
.verify-input-area {
  padding-left: 10px;
  width: 90%;
}
.letify-input-code {
  display: inline-block;
  width: 100%;
}
</style>
