<template>
  <scroll-loader @page-size="15" @up="loadData" @down="loadData">
    <div class="list-item" v-for="(item, index) in list" slot="content">
      {{ item }} {{ index }}
    </div>
  </scroll-loader>
</template>

<script>
  import ScrollLoader from "@/../components/ui/scroll-loader";

  export default {
    components: {ScrollLoader},
    name: 'scroll-loader-demo',
    data () {
      return {
        currentPage: 1,
        totalPage: 3,
        list: []
      }
    },
    mounted () {

    },
    methods: {
      loadDataFn () {
        this.loadData(1)
      },
      async loadData (page, scrollEnd) {
        let $this = this;
        console.log(`正在加载第${page}页数据`);

        let data = await this.myRequest({ page: page, pageSize: 15 });

        if(page == 1) {
          $this.list = data;
        } else {
          $this.list = $this.list.concat(data);
        }

        scrollEnd(data);
      },
      myRequest (args) {
        //模拟数据加载
        let count = 36;

        return new Promise((resolve, reject) => {
          let $this = this;
          let data = [];

          setTimeout(() => {
            for(let i = 0;i < args.pageSize && ((args.page - 1) * args.pageSize + i) < count;i++ ) {
              data.push(`选项`)
            }

            resolve(data);
          }, 2000)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .list-item {
    padding: 1.2rem;
    border-bottom: 1px solid $bdc;
    background-color: #fff;
  }
</style>
