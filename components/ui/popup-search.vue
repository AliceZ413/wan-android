<template>
  <div>
    <transition name="popup-search">
      <div class="popup-search" v-show="popup">
        <div class="m-header" :class="showCancel ? 'no-right-padding': ''">
          <form class="m-header-contain" @submit="submitSearch">
            <input type="text" class="m-header-search"
                   :placeholder="placeHolder"
                   v-model="text"
                   autofocus
            />
          </form>
          <button class="m-cancel" v-show="showCancel" @click="cancelSearch">{{cancelText || '取消'}}</button>
        </div>
        <div class="scroll-view" @scroll="getIsBottom">
          <slot name="main"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'ui-popup-search',
    props: {
      showCancel: {
        type: Boolean,
        default: false
      },
      cancelAndHide: {
        type: Boolean,
        default: true
      },
      placeHolder: String,
      cancelText: String,
      value: Boolean,
      inputSearch: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      value (popup) {
        this.popup = popup;
      },
      popup (val) {
        this.$emit('input', val);
      },
      text (newText, oldText ) {
        if(this.inputSearch) {
          this.$emit("search", newText);
        }
      }
    },
    data () {
      return {
        text: '',
        popup: false
      }
    },
    methods: {
      submitSearch (e) {
        e.preventDefault();
        let $this = this;
        $this.$emit('search', $this.text);
      },
      cancelSearch: function(){
        this.$emit('cancel', this.text);
        this.cancelAndHide && (this.popup = false);
      },
      getIsBottom (e) {
        let target = e.currentTarget || e.target;
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = e.currentTarget.scrollTop;
        //变量windowHeight是可视区的高度
        var targetHeight = target.offsetHeight;
        //变量scrollHeight是滚动条的总高度
        var totalHeight = target.scrollHeight;
        //滚动条到底部的条件
        if(scrollTop + targetHeight == totalHeight) {
          this.$emit('onReachBottom', e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup-search {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: hidden;
    z-index: 1000;
    background-color: $bgc;
    .scroll-view {
      width: 100%;
      height: calc(100% - 5.2rem);
      overflow-y: scroll;
    }
  }
  .m-header{
    padding: .8rem 1.2rem;
    background-color: $mc;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    -o-flex: 1;
    -khtml-flex: 1;
    .m-header-contain {
      background-image: url(~@/../resource/images/search-min.png);
      background-size: 1.5rem 1.5rem;
      background-repeat: no-repeat;
      background-position: 1rem 1rem;
      background-color: #2846C0;
      border-radius: 1.8rem;
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      -khtml-flex: 1;
      flex: 1;
      .m-header-search {
        color: #fff;
        display: block;
        height: 3.6rem;
        font-size: 1.6rem;
        padding: 1rem;
        box-sizing: border-box;
        width: calc(100% - 1.5rem);
        margin-left: 2.5rem;
        border: none;
        background-color: transparent;
      }
    }
  }
  .no-right-padding{
    padding-right: .2rem;
  }
  .m-cancel{
    width: 4rem;
    font-size: 1.6rem;
    color: #fff;
    height: 3.6rem;
    line-height: 1;
    background-color: transparent;
  }
  .popup-search-enter-active, .popup-search-leave-active {
    transition: left .35s cubic-bezier(0.45, 1, 0.4, 1), right .35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .popup-search-enter, .popup-search-leave-to /* .fade-leave-active below version 2.1.8 */ {
    left: 100%;
    right: -100%;
  }
</style>
