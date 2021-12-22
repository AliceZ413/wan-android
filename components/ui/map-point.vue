<template>
  <div>
    <ui-layer v-model="open" :title="title" width="90%" height="80%" onClose="hideMapLayer">
      <div class="map-container">
        <baidu-map :id="id" :ak="baiduAK" :center="mapCenter" :zoom="mapZoom" class="map-pos">
          <bm-overlay>
            <div class="addr-search-box">
              <input type="text"/>
              <button>搜索</button>
            </div>
          </bm-overlay>
        </baidu-map>
      </div>
    </ui-layer>
  </div>
</template>

<script>
  import UiLayer from "@/../components/ui/layer";
  import BaiduMap from 'vue-baidu-map/components/map/Map';
  import BmMarker from 'vue-baidu-map/components/overlays/Marker'
  import BmLabel from 'vue-baidu-map/components/overlays/Label'
  import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'

  export default {
    components: {
      UiLayer,
      BaiduMap,
      BmMarker,
      BmLabel,
      BmOverlay
    },
    name: 'map-point',
    props: {
      value: Boolean,
      baiduAK: {
        type: String,
        default: $util.constant.baiduAK
      },
      id: {
        type: String,
        default: 'map-positions'
      }
    },
    watch: {
      value (showLayer) {
        this.open = showLayer;
      },
      open (val) {
        this.$emit('input', val)
      }
    },
    data () {
      return {
        mapCenter: {lng: 116.404, lat: 39.915},
        mapZoom: 12,
        open: false,
        title: '选择地点'
      }
    },
    methods: {
      hideMapLayer () {
        this.showMap = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .map-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .map-pos {
      flex: 1;
      width: 100%;
    }
    .addr-search-box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      display: -webkit-flex;
      width: 100%;
      input {
        display: block;
        flex: 1;
        padding: 1rem 1.2rem;
        height: 1.4rem;
        border: none;
        border-bottom: .5px solid $bdc;
      }
      button {
        width: 5rem;
        color: #fff;
        background-color: $mc;
        height: 3.4rem;
        border: none;
        border-radius: 0;
      }
    }

  }

</style>
