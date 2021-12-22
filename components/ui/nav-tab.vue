<template>
  <nav class="m-nav">
    <ul>
      <li v-for="(tab, index) in tabs" class="ms-one-line"
          :class="activeNav == tab.value ? 'nav-active': ''" :data-index="tab.value" @click="switchTab">
        {{tab.text}}
      </li>
    </ul>
  </nav>
</template>

<script>
  /*
  * tab导航组件
  * */
  export default {
    name: 'ui-nav-tab',
    props: {
      tabs: Array
    },
    data () {
      return {
        activeNav: 1
      }
    },
    methods: {
      initTab:function(value){
        this.activeNav = value;
      },
      switchTab (e) {
        this.activeNav = e.currentTarget.dataset.index;

        this.$emit('onSwitch', this.activeNav);
      }
    }
  }
</script>

<style scoped lang="scss">
  .m-nav{
    ul{
      display: flex;
      display: -webkit-flex;
      li{
        float: left;
        flex: 1;
        font-size: 1.6rem;
        background-color: #fff;
        color: #aaa;
        height: 4.5rem;
        line-height: 4.5rem;
        position: relative;
        text-align: center;
        &.nav-active{
          color: $mc;
          &:after{
            content: ' ';
            display: block;
            width: 50%;
            height: .2rem;
            background-color: $mc;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            z-index: 1;
          }
        }
      }
    }
  }
</style>
