<template>
  <div>
    <section class="pop-area" v-show="showLayer">
      <!--弹出层-->
      <div class="popup-bg" @click="closeLayer" :style="`z-index: ${zIndex};`"></div>
      <div class="popup-content" :style="`width: ${width};height: ${height};min-height: ${minHeight};maxHeight: ${maxHeight};minWidth: ${minWidth}; maxWidth: ${maxWidth};z-index: ${zIndex + 1};`">
        <div class="popup-title">
          <slot name="title">{{title || ''}}</slot>
          <div class="popup-closer" @click="closeLayer" v-if="close == true">
            <img src="@/../resource/images/icon_close-min.png"/>
          </div>
        </div>
        <div class="popup-container">
          <slot></slot>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'ui-layer',
    props: {
      title: String,
      value: Boolean,
      width: {
        type: String,
        default: '90%'
      },
      height: String,
      minHeight: {
        type: String,
        default: '10rem'
      },
      maxHeight: {
        type: String,
        default: '90%'
      },
      minWidth: {
        type: String,
        default: '50%'
      },
      maxWidth: {
        type: String,
        default: '95%'
      },
      zIndex: {
        type: Number,
        default: 110
      },
      close: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      value (showLayer) {
        this.showLayer = showLayer;
      },
      showLayer (val) {
        this.$emit('input', val)
      }
    },
    data () {
      return {
        showLayer: false
      }
    },
    methods: {
      closeLayer () {
        this.showLayer = false;
        this.$emit('onClose');
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup-bg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 110;
    background-color: rgba(0,0,0, .1);
  }
  .popup-content {
    z-index: 111;
    position: fixed;
    background-color: #fff;
    left: 50%;
    top: 50%;
    width: 90%;
    max-height: 90%;
    min-height: 10rem;
    overflow-y: scroll;
    transform: translateY(-50%) translateX(-50%);
    border-radius: .4rem;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    flex-direction: column;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    .popup-title {
      height: 4rem;
      line-height: 4rem;
      white-space: nowrap;
      text-align: center;
      font-weight: bold;
      text-overflow: ellipsis;
      font-size: 1.6rem;
      position: relative;
    }
    .popup-container {
      flex: 1;
      overflow-y: scroll;
      padding: 0 1.2rem 2rem;
      position: relative;
    }
  }
  .popup-closer {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 0 1.4rem;
    img {
      width: 1.4rem;
      height: 1.4rem;
    }
  }

</style>
