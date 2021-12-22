<template>
  <div>
    <group :title="'搜索组件'" class="list-title">
      <cell
        :title="`搜索弹窗，键盘搜索，点击列表项关闭`"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showSearch1"></cell>

      <cell
        :title="`搜索弹窗，输入搜索`"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showSearch2"></cell>

      <cell
        :title="`搜索弹窗，自定义的右侧按钮`"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showSearch3"></cell>
    </group>

    <popup-search v-model="config1.popup" @search="search1" place-holder="搜点什么..." :input-search="config1.inputSearch">
      <div slot="main" class="popup-content" @click="hideSearch1">{{ config1.searchText || '点击列表选项关闭'}}</div>
    </popup-search>

    <popup-search
      v-model="config2.popup"
      @search="search2"
      place-holder="搜点什么..."
      :input-search="config2.inputSearch"

      :show-cancel="config2.showCancel"
      @onReachBottom="getBottom"
    >
      <div slot="main" class="popup-content" @click="hideSearch2">{{ config2.searchText || '点击列表选项关闭'}}</div>
    </popup-search>

    <popup-search
      v-model="config3.popup"
      @search="search3"
      place-holder="搜点什么..."
      :input-search="config3.inputSearch"

      :show-cancel="config3.showCancel"
      :cancel-text="config3.cancelText"
      :cancel-and-hide="config3.cancelAndHide"
      @onReachBottom="getBottom"
    >
      <div slot="main" style="background-color: #fff;">
        <cell @click.native="hideSearch3" v-for="count in 20" :title="config2.searchText || '点击列表选项关闭'" :key="count"></cell>
      </div>
    </popup-search>
  </div>
</template>

<script>
  import { Cell, Group } from 'vux'
  import popupSearch from '@/../components/ui/popup-search'
  export default {
    name: 'demo-popup-search',
    components: {
      popupSearch,
      Cell,
      Group
    },
    data () {
      return {
        config1: {
          popup: false,
          searchText: '',
          inputSearch: false
        },
        config2: {
          popup: false,
          searchText: '',
          inputSearch: true,
          showCancel: true
        },
        config3: {
          popup: false,
          searchText: '',
          inputSearch: true,
          showCancel: true,
          cancelText: '搜索',
          cancelAndHide: false
        }
      }
    },
    methods: {
      showSearch1 () {
        this.config1.popup = true;
      },
      hideSearch1 () {
        this.config1.popup = false;
      },
      search1 (text) {
        this.config1.searchText = text;
      },

      showSearch2 () {
        this.config2.popup = true;
      },
      hideSearch2 () {
        this.config2.popup = false;
      },
      search2 (text) {
        this.config2.searchText = text;
      },

      showSearch3 () {
        this.config3.popup = true;
      },
      hideSearch3 () {
        this.config3.popup = false;
      },
      search3 (text) {
        this.config3.searchText = text;
      },
      getBottom (e) {
        console.log('容器元素对象：');
        console.log(e);
        alert('到达底部了');
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup-content {
    background-color: #fff;
    text-align: center;
    height: 4.4rem;
    line-height: 4.4rem;
  }
</style>
