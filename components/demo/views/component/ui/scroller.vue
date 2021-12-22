<template>
  <div class="scroll-container">
    <ul>
      <li @click="setNav(1)" :class="nav == 1 ? 'active' : ''">列表加载</li>
      <li @click="setNav(2)" :class="nav == 2 ? 'active' : ''">多列表</li>
      <li @click="setNav(3)" :class="nav == 3 ? 'active' : ''">支持flex</li>
      <li @click="setNav(4)" :class="nav == 4 ? 'active' : ''">仅列表无加载</li>
    </ul>
    <div class="scroll-views">
      <div v-show="nav == 1">
        <scroller
          :loading="loading"
          :page="page"
          :totalPage="totalPage"
          @scroll-to-bottom="loadMore('total')"
          id="scroller-1"
        >
          <ul class="scroller-content" slot="content">
            <li v-for="i in total" @click="getPage">返回回到滚动位置{{i}}</li>
          </ul>
        </scroller>
      </div>
      <div v-show="nav == 2">
        <p>列表一：</p>
        <scroller
          height="30vh"
          :loading="loading"
          @scroll-to-bottom="loadMoreInfinity('total1')"
          id="scroller-2"
        >
          <ul class="scroller-content" slot="content">
            <li v-for="i in total1" @click="getPage">返回回到滚动位置{{i}}</li>
          </ul>
        </scroller>
        <p>列表二：</p>
        <scroller
          height="40vh"
          :loading="loading"
          id="scroller-3"
          @scroll-to-bottom="loadMoreInfinity('total2')"
        >
          <ul class="scroller-content" slot="content">
            <li v-for="i in total2" @click="getPage">返回回到滚动位置{{i}}</li>
          </ul>
        </scroller>
      </div>
      <div v-show="nav == 3" class="flex-container">
        <div class="sc-header">头部部分内容固定，剩余内容滚动</div>
        <scroller
          id="scroller-4"
          :loading="loading"
          @scroll-to-bottom="loadMoreInfinity('total3')"
          style="flex: 1"
        >
          <ul class="scroller-content" slot="content">
            <li v-for="i in total3" @click="getPage">返回回到滚动位置{{i}}</li>
          </ul>
        </scroller>
      </div>
      <div v-show="nav == 4" class="flex-container">
        <scroller id="scroller-5" :loader="false">
          <ul class="scroller-content" slot="content">
            <li v-for="i in total4" @click="getPage">返回回到滚动位置{{i}}</li>
          </ul>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
  import scroller from '@/../components/ui/scroller'

  export default {
    name: 'demo-scroller',
    components: {scroller},
    data() {
      return {
        nav: 1,
        total: 20,
        total1: 20,
        total2: 20,
        total3: 20,
        total4: 20,
        loading: false,

        page: 1,
        totalPage: 2
      }
    },
    methods: {
      setNav(nav) {
        this.nav = nav;
      },
      getPage() {
        this.$router.push({
          path: '/demo/component/tabs'
        })
      },
      loadMore(name) {
        let $this = this;
        console.log('加载到底部！' + this.loading);
        ++$this.page;

        //在组件引用页面进行数据加载
        if ($this.page <= $this.totalPage) {
          this.loading = true;
          setTimeout(() => {
            $this[name] = $this[name] + 10;
            $this.loading = false;
          }, 1000)
        }
      },
      loadMoreInfinity(name) {
        let $this = this;
        console.log('加载到底部！' + this.loading);

        //在组件引用页面进行数据加载
        this.loading = true;
        setTimeout(() => {
          $this[name] = $this[name] + 10;
          $this.loading = false;
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="scss">
  .scroll-container {
    background-color: #fff;
    display: flex;
    > ul {
      border-right: 1px solid #eee;
      li {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        &.active {
          background-color: #294fdf;
          color: #fff;
        }
      }
    }
  }

  .scroll-views {
    flex: 1;
  }

  .scroller-content {
    li {
      line-height: 4rem;
      padding: 0 1rem;
      border-bottom: 1px solid #eee;
    }
  }

  .flex-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .sc-header {
      height: 10rem;
    }
  }
</style>
