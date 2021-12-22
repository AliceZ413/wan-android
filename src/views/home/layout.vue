<template>
  <div class="layout">
    <div class="top-bar" :style="{ 'background-color': primaryColor }">
      <div class="left">
        <div class="logo">
          <mu-icon value="android"></mu-icon>
        </div>
        <div class="title">玩安卓</div>
      </div>
      <div class="right">
          <mu-icon value="search" size="28"></mu-icon>
          <mu-icon value="add" size="30" style="margin-left: 0.5rem;"></mu-icon>
      </div>
    </div>
    <div class="content">
      <transition :name="`vux-pop-${direction === 'forward' ? 'in' : 'out'}`">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
      </transition>

      <transition :name="`vux-pop-${direction === 'forward' ? 'in' : 'out'}`">
        <router-view v-if="!$route.meta.keepAlive" />
      </transition>
    </div>
    <div class="footer-bar"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      direction: "",
      activeNav: "home",
      shift: "movies",
    };
  },
  computed: {
    ...mapState("app", {
      primaryColor: (state) => state.primaryColor,
    }),
  },
  watch: {
    $route(to, from) {
      console.log(this.$router);

      this.direction = this.$router.direction;
    },
  },
};
</script>
 
<style lang = "scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .top-bar {
    box-sizing: border-box;
    width: 100%;
    padding: 0 1rem;
    height: 6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      font-size: 2rem;
      font-weight: bold;
      color: #fff;
      .logo {
        display: flex;
      }
      .title {
        margin-left: 0.5rem;
      }
    }
    .right {
        align-items: center;
        color: #fff;
        display: flex;
    }
  }
  .content {
    flex: 1;
  }
}
</style>