<template>
  <div class="hello">

    <group :title="'vux在线demo'" class="list-title">
      <cell
        :title="'vux在线demo'"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="getVux"></cell>
    </group>

    <!--<button @click="getLocation">获取地理位置</button>-->
    <group :title="title" class="list-title">
      <cell
        :title="list.serviceComponents.name"
        is-link
        :border-intent="false"
        :arrow-direction="list.serviceComponents.open ? 'up' : 'down'"
        @click.native="list.serviceComponents.open = !list.serviceComponents.open"></cell>

      <template v-if="list.serviceComponents.open">
        <cell-box
          class="sub-item"
          is-link
          v-for="(item, index) in list.serviceComponents.subItems"
          :key="index"
          :border-intent="(index !== 0)"
          :link="item.url"
        >{{item.name}}</cell-box>
      </template>


    </group>

    <group :title="title" class="list-title">
      <cell
        :title="list.uiComponents.name"
        is-link
        :border-intent="false"
        :arrow-direction="list.uiComponents.open ? 'up' : 'down'"
        @click.native="list.uiComponents.open = !list.uiComponents.open"></cell>

      <template v-if="list.uiComponents.open">
        <cell-box
          class="sub-item"
          is-link
          v-for="(item, i) in list.uiComponents.subItems"
          :key="i"
          :border-intent="(i !== 0)"
          :link="item.url"
        >{{item.name}}</cell-box>
      </template>
    </group>

    <group :title="'util'" class="list-title">
      <cell
        :title="list.util.name"
        is-link
        :border-intent="false"
        :arrow-direction="list.util.open ? 'up' : 'down'"
        @click.native="list.util.open = !list.util.open"></cell>

      <template v-if="list.util.open">
        <cell-box
          class="sub-item"
          is-link
          v-for="(item, index) in list.util.subItems"
          :key="`util-${index}`"
          :border-intent="(index !== 0)"
          :link="item.url"
        >{{item.name}}</cell-box>
      </template>
    </group>

  </div>
</template>

<script>
  import { Cell,CellBox, Group } from 'vux'

  export default {
    name: 'demo-index',
    components: {
      Cell,
      CellBox,
      Group
    },
    data () {
      return {
        title: '海事之眼H5开发demo',
        list: {
          serviceComponents: {
            name: '业务组件',
            open: true,
            subItems: [
              {
                name: '机构选择',
                url: '/demo/component/org-picker'
              },
              {
                name: '验证码',
                url: '/demo/component/validate-code'
              },
              {
                name: '船员基础信息',
                url: '/demo/component/crew/crew-basic'
              },
              {
                name: '船员证书信息',
                url: '/demo/component/crew/crew-cert'
              },
              {
                name: '船员服务资历',
                url: '/demo/component/crew/crew-serve'
              },
              {
                name: '船员信息展示',
                url: '/demo/component/crew/crew'
              },
              {
                name: '在船船员',
                url: '/demo/component/ship/ship-crew'
              },

            ]
          },
          uiComponents: {
            name: 'UI组件',
            open: true,
            subItems: [
              {
                name: '下拉刷新上拉加载',
                url: '/demo/component/scroll-loader'
              },
              {
                name: '头部选项卡',
                url: '/demo/component/tabs'
              },
              {
                name: '搜索弹窗组件',
                url: '/demo/component/popup-search'
              },
              {
                name: '签名板',
                url: '/demo/component/signature'
              },
              {
                name: '拨打电话',
                url: '/demo/component/call'
              },
              {
                name: '发送短信',
                url: '/demo/component/sms'
              },
              {
                name: 'PDF预览',
                url: '/demo/component/show-pdf'
              },
              {
                name: '地图选点',
                url: '/demo/component/map-point'
              },
              {
                name: '单选框',
                url: '/demo/component/demo-radio'
              },
              {
                name: '复选框',
                url: '/demo/component/demo-checkbox'
              },
              {
                name: '滚动加载列表容器',
                url: '/demo/component/scroller'
              }
            ]
          },
          util: {
            name: 'util工具类',
            open: true,
            subItems: [
              {
                name: '基础类',
                url: '/demo/component/util'
              },
              {
                name: '高级类',
                url: '/demo/component/sdk'
              }
            ]
          }

        }
      }
    },
    mounted () {
      // console.log('加密数据：');
      // let encryptData = this.crypto.client.encrypt('123456789');
      // console.log(encryptData);
      // console.log('解密数据：');
      // console.log(this.crypto.client.decrypt(encryptData));

      // console.log('解密数据：');
      // console.log(this.crypto.service.decrypt('G7+aNXEaCkoD15cgGrmb5Su9kNO6DjQh/xmjYiaKt4Q='));
    },

    methods: {
      getLocation () {
        $util.getLocation({
          success (res) {
            console.log(res);
          }
        })
      },
      getVux () {
        location.href = 'https://vux.li/demos/v2/'
      },
      getUtil () {
        this.$router.push({
          path: '/component/util'
        });
      },
      onRoll () {
        if( $util.isReachBottom() ) {
          console.log('到底了');
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  .sub-item {
    color: $mc;
  }
  .list-title{
    color: #333;
  }
</style>
