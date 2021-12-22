<template>
  <div>
    <nav-tab :tabs="navTabs" @onSwitch="switchNav"></nav-tab>
  </div>
</template>

<script>
  import navTab from '@/../components/ui/nav-tab'

  export default {
    name: 'demo-tabs',
    components: {
      navTab
    },
    data () {
      return {
        navTabs: [
          {value: 1, text: '选项卡1'},
          {value: 2, text: '选项卡2'}
        ]
      }
    },
    methods: {
      switchNav (nav) {
        console.log(nav);
        this.$vux.confirm.show({
          title: '返回值',
          content: nav,
          onConfirm (res) {

          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
