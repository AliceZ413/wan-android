<template>
  <div class="video videoBox">
    <!-- {{loading}} -->
    <!-- {{controls}} -->
    <!-- <div v-if="error || loading" class="emptyVideo">
      <div class="loader" v-if="loading"></div>
      <i class="el-icon-close" v-else></i>
    </div> -->
    <div :class="['video-loading']" v-show="loading">
      <div class="top-tips">正在进行视频拉流，请耐心等待。</div>
      <load-more class="loading-more" background-color="#ffffff"></load-more>
    </div>
    <div
      :class="['video-wrap', [loading ? 'hide' : 'show'], [error && 'error']]"
      v-show="!error && !loading"
    >
      <video
        :id="id"
        ref="videoElement"
        class="video-component video-js vjs-default-skin vjs-big-play-centered"
        :controls="true"
        :data-setup="{}"
      >
        您的浏览器版本过低，请先升级！
        <!-- <source :src="url"  /> -->
      </video>
    </div>
  </div>
</template>
<script>
  // import videoJs from 'video.js';
  // import 'video.js/dist/video-js.css';
  // require('../../node_modules/video.js/dist/lang/zh-CN.js')
  import { LoadMore } from 'vux';
  export default {
    name: 'video-player',
    components: {
      LoadMore,
    },
    props: {
      fullScreen: {
        type: Boolean,
        default: false,
      },
      id: {
        type: String,
        default: 'videoElement',
      },
      type: {
        type: String,
        default: 'm3u8',
      },
      url: {
        type: String,
        default: '',
      },
      controls: {
        type: Boolean,
        default: false,
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      muted: {
        type: Boolean,
        default: true,
      },
      warning: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        videoPlayer: null,
        loading: true,
        timer1: null,
        backUrl: '',
        error: false,
        countTimes: 0,
      };
    },
    watch: {
      url(curVal) {
        const _this = this,
          type = _this.type;
        _this.backUrl = curVal;
        console.log(curVal);
        if (curVal) {
          _this.error = false;
          _this.countTimes = 0;
          if (this.videoPlayer) {
            _this.videoPlayer.src({
              src: curVal,
              type: type === 'm3u8' ? 'application/x-mpegURL' : 'video/mp4',
            });
          } else {
            this.createVideo();
          }
        }
      },
      backUrl(curVal) {
			  const _this = this;
			  this.error = false;
			  if (curVal) {
			  	if (this.videoPlayer) {
            this.videoPlayer.src({
              src: curVal,
              type: this.type === 'm3u8' ? 'application/x-mpegURL' : 'video/mp4',
            });
			  	} else {
            this.createVideo();
          }
			  }
		  },
    },
    mounted() {
      const _this = this;
      this.backUrl = this.url;
      this.$nextTick(() => {
        _this.createVideo();
      });
    },
    beforeDestroy() {
      if (this.videoPlayer) {
        this.videoPlayer.dispose();
      }
    },
    methods: {
      reload() {
        const vm = this;
        this.backUrl = '';
        setTimeout(() => {
          vm.backUrl = vm.url;
          // vm.countTimes += 1;
        }, 2000);
      },
      createVideo() {
        const _this = this,
          type = _this.type,
          url = _this.backUrl;
        if (!url || !this.id) {
          _this.error = '暂无视频源';
          _this.loading = false;
          return false;
        }
        _this.loading = true;
        // console.log(this.$refs['videoElement']);

        _this.videoPlayer = videojs(this.id, {
          language: "zh-CN",
          autoplay: "play",
          muted: true,
        });

        this.videoPlayer.on('error', (err) => {
          //处理404的情况
          if(err.target && err.target.player.error_.code == 4) {
            this.$emit('notFound');
          }
          _this.reload();
          // if (_this.countTimes < 5) {
          //   _this.reload();
          // } else {
          //   _this.error = true;
          //   _this.loading = false;
          // }
        });

        this.videoPlayer.on('ready', function () {});
        this.videoPlayer.on('canplay', () => {
          if (this.loading) {
            this.loading = false;
          }
        });

        _this.videoPlayer.src({
          src: url,
          type: type === 'm3u8' ? 'application/x-mpegURL' : 'video/mp4',
        });
        if (_this.fullScreen) {
          // _this.videoPlayer.requestFullscreen();
        }
      },
      /** 视频状态 */
      changeVideoStatus(status) {
        this.$emit('changeVideoStatus', status);
      },
    },
  };
</script>

<style lang="scss">
  .vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
    opacity: 1 !important;
  }

  .videoBox {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 20.3rem;
    background: #2e4096;
    overflow: hidden;
    .vjs-tech {
      pointer-events: none;
    }
    .loader-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 20.3rem;
      box-sizing: border-box;
      background: #2e4096;
      z-index: 10;
    }
    .zhrs-wrap {
      white-space: nowrap;
      position: absolute;
      transition: 0.3s all ease;
      z-index: 10;
      left: 0.3vw;
      font-size: 0.8em;
      box-sizing: border-box;
      bottom: 6.3vw;
      height: 1.2vw;
      // padding:0 8%;
      min-width: 4.55vw;
      display: flex;
      align-items: center;
      // width: 100%;
      display: flex;
      align-items: center;
      padding-left: 0.5em;
      // justify-content: flex-end;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      transition: 0.3s all ease;
    }
    .video-wrap {
      // opacity: 0;
      // visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 20.3rem;
      z-index: 10;
      // z-index: ;
      video {
        position: relative;
        z-index: 0;
      }
      &.show {
        opacity: 1;
        visibility: visible;
        // display: block;
        // z-index: 10;
      }
      &.error {
        opacity: 0;
      }
    }
    .emptyVideo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      // background: #2e4096;
      z-index: 0;
      flex-wrap: wrap;
      .empty_wrap {
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        .empty_icon {
          width: 120px;
          height: 120px;
        }
        .empty_tip {
          clear: both;
          width: 100%;
          text-align: center;
          font-size: 18px;
        }
      }
    }
    .video-component {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 6;
      object-fit: fill;
      .vjs-tech {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
  }

  .bigVideo {
    .zhrs-wrap {
      left: 0.9vw;
      font-size: 1.6em;
      bottom: 17.8vw;
      height: 3vw;
      width: 13.2vw;
      padding-left: 1.5vw;
    }
  }

  .video-loading {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 20.3rem;
    z-index: 1000;
    background-color: #000;
    color: #fff;
    .top-tips {
      font-size: 1.5rem;
      position: absolute;
      top: 3rem;
    }
    .loading-more {
      .weui-loading {
        width: 3rem;
        height: 3rem;
      }
    }
  }
</style>
