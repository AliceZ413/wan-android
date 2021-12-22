<template>
  <div>
    <group :title="'搜索组件'" class="list-title">
      <cell
        :title="`搜索弹窗，键盘搜索，点击列表项关闭`"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showMapLayer"></cell>
    </group>

    <map-point v-model="showMap"></map-point>
  </div>
</template>

<script>
  import { Cell, Group } from 'vux'
  import MapPoint from "@/../components/ui/map-point";

  export default {
    name: 'demo-map-point',
    components: {
      MapPoint,
      Cell,
      Group,
    },
    data () {
      return {
        showMap: false
      }
    },
    watch: {

    },
    methods: {
      showMapLayer () {
        this.showMap = true;
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
