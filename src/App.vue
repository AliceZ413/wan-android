<!--请不要改动此文件，否则更新配置会造成你的改动被覆盖-->

<template>
  <div id="app">
    <div class="app-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { api_signature } from '@/../resource/api/common';

  export default {
    components: {},
    name: 'App',
    data () {
      return {
        direction: ''
      }
    },
    watch: {
      '$route' (to, from) {
        console.log(this.$router);

        this.direction = this.$router.direction;
      }
    },
    async beforeCreate () {

    },
    computed: {

    },
    mounted: function(){

    },
    methods: {

    }
  }
</script>

<style lang="scss">
  *{padding:0;margin:0;}
  html{
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    /*-webkit-user-select: none;*/
    /*-moz-user-select: none;*/
    /*-ms-user-select: none;*/
    /*user-select: none;*/
  }
  body{
    font-size: 1.4rem;
    background-color: $bgc;
    height:100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
  }
  ul,ul>li{
    list-style-type: none;
  }
  input,select,button{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  textarea,input,select,option,table,button{
    outline: none;
    font-size: 1.4rem;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  input::placeholder,textarea::placeholder{
    color: $fc-c;
  }
  button:active{
    opacity: .6;
  }
  button:disabled{
    background-color: #F0F1F4 !important;
    background-image: none !important;
    color: #999 !important;
  }
  table{
    border-collapse: collapse;
  }
  a{
    color: inherit;
    text-decoration: none;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  /* vux profill */
  .vux-cell-box:not(:first-child):before{
    width: auto !important;
    right: 0;
  }
  .vux-popup-header-right{
    color: #666!important;
  }
  .vux-popup-header{
    background-color: #FAFAFA!important;
  }
  .vux-popup-dialog{
    overflow-y: hidden;
  }

  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: opacity 300ms;
    height: 100%;
    width: 100%;
    opacity: .5;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
  }

  .vux-pop-out-leave-active {
    opacity: 0;
  }

  .vux-pop-in-enter {
    opacity: 0;
  }

  .vux-pop-in-leave-active {
    opacity: 0;
  }

  /*.vux-cell-box:not(:first-child):before{border-top: 0 !important;}*/
</style>
<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
