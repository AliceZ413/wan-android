<template>
  <div class="container-main" :class="id" :style="`height: ${height}`">
    <div class="comp-scroller">
      <slot name="content"></slot>
    </div>

    <div v-if="loader">
      <div class="loading-bar" v-show="loading">
        <div class="loader">加载中...</div>
      </div>
      <div v-show="!loading && page < totalPage" class="loading-bar load-more" @click="loadMore">加载更多</div>
      <div class="loading-bar" v-show="!loading && page > totalPage">无更多数据</div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "ui-scroller",

    props: {
      id: {
        type: String,
        default: 'scroller-' + parseInt(Math.random() * 1000000, 10)
      },
      loading: {
        type: Boolean,
        default: false
      },
      height: {
        type: String,
        default: '100vh'
      },
      page: {
        type: Number,
        default: 1
      },
      totalPage: {
        type: Number,
        default: 1
      },
      loader: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      loading (old, newVal) {
        console.log('加载状态变更：' + newVal);
      }
    },
    mounted () {
      document.querySelector("." + this.id).onscroll = this.handleScroll();
    },
    data() {
      return {
      }
    },
    methods: {
      debounce (fn) {
        let timer = null;

        return function () {
          if(timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(fn, 1000 / 60)
        }
      },
      handleScroll() {
        return this.debounce(() => {
          let id = '.' + this.id;
          let element = document.querySelectorAll(id)[0];
          //scrollTop是滚动条滚动时，距离顶部的距离
          //scrollLeft是滚动条滚动时，距离左侧的距离
          let scrollInfo = {
            x: element.scrollLeft,
            y: element.scrollTop,
            id: this.id
          };

          this.$store.commit('app/setScroll', scrollInfo);

          this.$emit("scroll", scrollInfo);

          if($util.isReachBottom('.' + this.id) && !this.loading) {
            this.$emit("scroll-to-bottom");
          }
        })
      },
      loadMore () {
        this.$emit("scroll-to-bottom");
      }
    }
  }
</script>

<style lang="scss">

  .container-main {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /*解决ios上滑动不流畅*/
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2rem;
  }
  .loading-bar {
    line-height: 4.4rem;
    background-color: #fff;
    text-align: center;
  }

  .load-more {
    color: $mc;
  }
</style>
