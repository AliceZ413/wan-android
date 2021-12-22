<!--船员信息展示组件-->

<template>
  <div class="m-body">
    <nav class="m-nav">
      <nav-tab :tabs="navs" @onSwitch="switchNav"></nav-tab>
    </nav>
    <section class="m-contain">
      <!--船员信息-->
      <div class="m-outer-container" v-show="activeNav != 3">
        <div class="crew-container">
          <crew-basic :idNo="idNo" v-if="idNo" :encode="encode"></crew-basic>
        </div>
      </div>

      <div class="tab-check-info" v-show="activeNav == 1">
        <!-- 证书信息 -->
        <crew-cert :idNo="idNo" v-if="idNo"></crew-cert>
      </div>
      <div class="tab-history-info" v-show="activeNav == 2">
        <crew-record :idx="idNo" v-if="idNo"></crew-record>
      </div>
    </section>
  </div>
</template>
<script>
  import CrewBasic from "./crew-basic";
  import CrewCert from "./crew-cert";
  // import CrewServe from "./crew-serve";
  import CrewRecord from "./crew-record";
  import navTab from "@/../components/ui/nav-tab"

  import { api_officer } from "@/../resource/api/core"
  export default {
    name: 'service-crew',
    props: {
      encode: {
        type: Boolean,
        default: true
      },
      idNo: {
        type: String,
        default: ''
      },
    },
    components: {
      // CrewServe,
      CrewBasic,
      CrewCert,
      navTab,
      CrewRecord
    },
    data () {
      return {
        activeNav: 1,
        navs: [
          {text: '基本信息', value: 1},
          {text: '服务资历', value: 2}
        ],
      }
    },
    watch: {
      idNo (value) {
        this.idNo = value;
      }
    },
    methods: {
      switchNav(index) {
        this.activeNav = index;
      },
      // 查看是否为执法人员显示核查记录
      getOfficer () {
        api_officer().then(res => {
          const {data} = res;
          if ($util.OK(data.code))  {
            if(data.item && Object.keys(data.item).length !== 0) {
              this.navs.push({text: '检查记录', value: 3});
              this.isOfficer = true;
            }
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .m-nav {
    margin-bottom: 1rem;
  }
</style>
