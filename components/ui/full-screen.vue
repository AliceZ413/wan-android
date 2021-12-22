
<template>
  <a class="ui-fullscreen">
    <span v-if="!fullscreen" @click="requestFullscreen">
      全屏
      <img src="@/../resource/images/icon_map_zoomin-min.png"/>
    </span>
    <span v-if="fullscreen" @click="requestFullscreen">
      退出全屏
      <img src="@/../resource/images/icon_map_zoomin-min.png"/>
    </span>
  </a>
</template>

<script>
  export default {
    name: 'ui-fullscreen',
    data () {
      return {
        fullscreen: false
      }
    },
    methods: {
      requestFullscreen () {
        this.fullscreen = !this.fullscreen;
        this.$emit('onfullscreen', this.fullscreen);
      }
    }
  }
</script>

<style scoped lang="scss">
  .ui-fullscreen {
    font-size: 1.4rem;
    align-items: center;
    font-weight: normal;
    display: inline-block;
    vertical-align: middle;
    img {
      margin-left: .4rem;
      width: 1.2rem;
      height: 1.2rem;
    }
  }
</style>
