<template>
  <div>
    <mescroll-vue ref="mescroll" :down="down" :up="up" :reset="reset" @init="mescrollInit">
      <div id="mescroll-wrap">
        <slot name="content"></slot>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue';

  export default {
    name: 'ui-scroll-loader',
    components: { MescrollVue },

    props: {
      pageSize: {
        type: Number,
        default: 10
      }
    },
    data () {
      let $this = this;
      let pageSize = this.pageSize;

      return {
        mescroll: null, // mescroll实例对象
        down: {
          callback: function (mescroll) {
            //下拉刷新
            $this.$emit('down', 1, (data) => {
              $this.up.page.num = 1;
              mescroll.endSuccess(data.length)
            })
          },
          auto: false //默认不执行下拉刷新的回调
        }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        up: {
          // 上拉加载的配置
          callback: function (page, mescroll) {
            $this.$emit('up', page.num, (data) => {
              mescroll.endSuccess(data.length)
            })
          },
          noMoreSize: pageSize, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          htmlContent: '<p class="downwarp-progress"></p><p class="downwarp-tip">下拉刷新 </p>', //布局内容
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', //上拉加载中的布局
          htmlNodata: '<p class="upwarp-nodata">没有更多了~</p>', //无数据的布局
          empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: 'mescroll-wrap', //父布局的id (1.3.5版本支持传入dom元素)
            icon: null, //图标,默认null,支持网络图
            tip: '暂无记录' //提示
          },
          page: {
            num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10, // 每页数据条数
            time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
          }
        }
      }
    },
    methods: {
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      reset() {
        this.mescroll.resetUpScroll();
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
