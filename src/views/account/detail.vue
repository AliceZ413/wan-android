<template>
  <div>
    <div class="b-title">基本信息</div>
    <div class="b-form">
      <div>
        <label>姓名</label>
        <span>{{detail.userName || '--'}}</span>
      </div>
      <div>
        <label>手机号码</label>
        <span>{{detail.userPhone || '--'}}</span>
      </div>
      <div>
        <label>备注</label>
        <span>{{detail.remark || '--'}}</span>
      </div>
    </div>

    <div class="b-title">
      船舶列表
      <div class="abs-btn">共{{detail.shipList.length}}艘</div>
    </div>
    <ul class="ship-list">
      <li v-for="ship in detail.shipList">
        {{ship.shipName || '--'}}
      </li>
    </ul>
  </div>
</template>

<script>
  import { api_getUserInfo } from '@/api/hw'

  export default {
    name: 'account-detail',
    data () {
      return {
        detail: {
          shipList: []
        }
      }
    },
    mounted () {
      this.query = this.$route.query;

      this.getDetail();
    },
    methods: {
      getDetail () {
        let query = this.query;
        this.$vux.loading.show('请稍候');

        api_getUserInfo({userId: query.userId}).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            this.detail = data.item;
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.$vux.loading.hide();
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .b-title {
    padding: 1rem 1.2rem;
    position: relative;
    .abs-btn {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 1.5rem;
      z-index: 1;
      height: 1.5rem;
      margin: auto;
    }
  }
  .b-form {
    background-color: #fff;
    padding: 1.5rem;
    >div {
      margin-bottom: 1.5rem;
      color: #666;
      display: flex;
      label {
        width: 10rem;
      }
      span {
        flex: 1;
        word-break: break-all;
      }
    }
  }
  .ship-list {
    padding: 1.5rem;
    padding-bottom: 0;
    background-color: #fff;
    border-bottom: 1px solid transparent;
    li {
      padding: 1.2rem 1.5rem;
      background-color: #F1F4FA;
      position: relative;
      border-radius: .4rem;
      margin-bottom: 1rem;
    }
  }
</style>
