<template>
  <div class="video-page">
    <div class="ferry-video">
      <video-player
        :url="videoUrl"
        :controls="true"
        :type="type"
        :autoplay="true"
        fullScreen
      ></video-player>
    </div>
    <div class="reload-btn" @click="reload">
      重新加载<img src="../../assets/image/reload_icon.png" alt="" />
    </div>
  </div>
</template>

<script>
import videoPlayer from "../../components/videoPlayer.vue";
import { api_getRealVideo, api_getNowStreamByStreamId } from "@/api/hw.js";
export default {
  components: { videoPlayer },
  data() {
    return {
      userAgent: navigator.userAgent,
      videoUrl: "",
      shipCode: "",
      shipNo: "",
      deviceId: "",
      streamId: "",
      type: "",
      activeIndex: "",
    };
  },
  methods: {
    getRealVideo() {
      api_getRealVideo({
        type: 1,
        shipCode: this.shipCode,
        cameraLocation: 2,
      })
        .then(({ data }) => {
          let { code, item, msg } = data;
          if ($util.OK(code)) {
            this.videoUrl = item.url || "";
            this.type = "m3u8";
          } else {
            this.$vux.toast.text(msg);
          }
        })
        .catch((err) => {});
    },
    getNowStream() {
      api_getNowStreamByStreamId({
        streamId: this.streamId,
        deviceId: this.deviceId,
      })
        .then(({ data }) => {
          let { code, item, msg } = data;
          if ($util.OK(code)) {
            // console.log(item);
            this.videoUrl = item.url;
          } else {
            this.$vux.toast.text(msg);
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    reload() {
      let url = this.videoUrl;
      if (!url) return;
      this.videoUrl = "";
      this.$vux.loading.show({});
      setTimeout(() => {
        // this.getRealVideo();
        this.videoUrl = url;
        this.$vux.loading.hide();
      }, 1000);
    },
  },
  mounted() {
    const query = this.$route.query;
    this.shipNo = query.shipNo ? query.shipNo : "";
    this.shipCode = query.shipCode ? query.shipCode : "";
    this.deviceId = query.deviceId ? query.deviceId : "";
    this.streamId = query.streamId ? query.streamId : "";
    this.activeIndex = query.activeIndex ? query.activeIndex : "";
    if (!this.shipCode) {
      this.getNowStream();
    } else {
      this.getRealVideo();
    }
  },
};
</script>
 
<style lang = "scss" scoped>
.video-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .reload-btn {
    background: #40b5ff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 4rem;
    margin: 2rem auto 0 auto;
    border-radius: 0.8rem;
    img {
      margin-left: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }
  }
}
</style>