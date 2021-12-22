<template>
  <div style="background-color: #f4f4f4;">
    <div :class="['company-select']" v-if="showCompany">
      <div class="company-name" @click="showPopup = true">
        <span>{{ selectComName }}</span>
        <span class="triangle"></span>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopup" max-height="50%">
        <group>
          <radio v-if="selectComUuid" :options="radioOption" v-model="selectComUuid" @on-change="changeCompany"></radio>
        </group>
      </popup>
    </div>
    <scroller :class="['scroller', showCompany ? '' : 'normal']">
      <ul slot="content" class="ship-list">
        <li v-for="(account, index) in list" :key="'account_' + account.userId" @click="accessDetail(account)">
          <div class="item-title">{{account.userName || '--'}}</div>
          <div class="item-sub">手机号码：{{account.userPhone || '--'}}</div>
          <div class="item-sub">绑定船舶：{{account.manageShipNum || 0}}</div>
          <div class="item-sub">
            是否接受异常短信：
            <hw-switch v-model="account.msgSelected" @change="handleChangeSwitch($event, account, index)"></hw-switch>
          </div>
          <div class="btn-group">
            <img src="@/assets/image/edit-min.png" @click.stop="editAccount(account)"/>
            <img src="@/assets/image/delete-min.png" @click.stop="removeAccount(account)"/>
          </div>
        </li>
      </ul>
    </scroller>
    <button class="fix-btn" @click="addAccount"><img src="@/assets/image/add-btn-min.png"/>添加账号</button>
  </div>
</template>

<script>
  import scroller from '@/../components/ui/scroller';
  import { 
    api_delCaptainUser, 
    api_getCompanyUser, 
    api_updateIsMessage, 
    api_getUserInfoByUserId, 
    api_getCompany 
  } from '@/api/hw';
  import hwSwitch from '@/components/switch.vue';
  import { Popup, TransferDom, Group, Radio } from 'vux';
  export default {
    name: 'list',
    components: { scroller, hwSwitch, Popup, Group, Radio },
    directives: {
      TransferDom
    },
    data () {
      return {
        query: {},
        arr: [],
        list: [],
        value: false,
        showToast: true,
        loadingCount: 0,
        userInfo: null,
        showCompany: false,
        companyList: [],
        showPopup: false,
        companyName: '',
        selectComName: '',
        selectComUuid: '',
        radioOption: [],
      }
    },
    activated(a,b,c){
      if(this.$store.state.hw.refresh) {
        this.getList(this.selectComUuid);
        this.$store.commit('hw/setRefresh', false);
      }
    },
    mounted () {
      this.query = this.$route.query;
      this.getUserInfo();
      this.getList();
    },
    methods: {
      beforeReq() {
        this.loadingCount += 1;
        this.$vux.loading.show();
      },
      afterRes() {
        this.loadingCount -= 1;
        if (this.loadingCount == 0) {
          this.$vux.loading.hide();
        }
      },
      getList (compId) {
        let query = this.query;
        let companyUuid = query.compId;
        if (compId) {
          companyUuid = compId;
        }
        this.beforeReq();
        api_getCompanyUser({companyUuid}).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            this.list = data.item.map((item) => {
              let msgSelected = item.isMessage == 0 ? true : false;
              return {
                ...item,
                msgSelected,
              };
            });
          } else {
            this.list = [];
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.afterRes();
        });
      },
      removeAccount (account)  {
        let $this = this;
        this.$vux.confirm.show({
          content: '您确定要删除这个账号吗？',
          confirmText: '确定',
          cancelText: '取消',
          showCancel: true,
          onCancel: function (res) { },
          onConfirm () {
            $this.deleteAccount(account);
          }
        })
      },
      deleteAccount (account) {
        let query = this.query;
        this.$vux.loading.show('请稍候');

        api_delCaptainUser({userId: account.userId, deleteBy: query.userId}).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            setTimeout(this.getList, 300)
          } else {
            this.$vux.toast.text(data.entity);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.$vux.loading.hide();
        })
      },
      accessDetail (account) {
        let query = this.query;
        // this.$router.push({
        //   path: `/account/detail?userId=${account.userId}`
        // });
        this.$router.push({
          path: `/account/add?userId=${account.userId}&rId=${account.recordUuid}&compId=${account.companyUuid}`,
        });
      },
      editAccount (account) {
        let query = this.query;
        this.$router.push({
          path: `/account/add?userId=${account.userId}&rId=${account.recordUuid}&compId=${account.companyUuid}`,
        });
      },
      addAccount () {
        this.$router.push({
          path: `/account/add?uid=${this.query.userId}&compId=${this.selectComUuid}`,
        });
      },
      handleChangeSwitch($event, account, index) {
        this.$vux.loading.show();
        this.$vux.toast.hide();
        api_updateIsMessage({
          recordUuid: account.recordUuid,
          isMessage: account.msgSelected ? 0 : 1,
        }).then(res => {
          let { code, msg } = res.data;
          if (!this.showToast) {
            this.showToast = true;
            return;
          }
          if ($util.OK(code)) {
            this.$vux.toast.show({
              type: 'success',
              text: msg,
              duration: 1500,
              position: 'middle'
            });
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: msg,
              duration: 1500,
              position: 'middle'
            });
          }
        }).catch(err => {
          if (!this.showToast) {
            this.showToast = true;
            return;
          }
          this.$vux.toast.show({
            type: 'cancel',
            text: '配置用户短信失败',
            duration: 1500,
            position: 'middle'
          });
          throw err;
        }).finally(() => {
          this.$vux.loading.hide();
        });
      },
      getUserInfo() {
        this.beforeReq();
        api_getUserInfoByUserId({
          userId: this.query.userId
        }).then(res => {
          let { code, item, msg } = res.data;
          if ($util.OK(code)) {
            this.userInfo = item;
            if (item.roleId == 'HW_SUPER_ADMIN') {
              // 超级管理员
              this.getCompany();
            } else {
              // 非超级管理员
              this.showCompany = false;
              this.selectComUuid = item.companyUuid;
            }
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.afterRes();
        });
      },
      getCompany() {
        this.beforeReq();
        api_getCompany({
          userId: this.query.userId
        }).then(res => {
          let { code, item, msg } = res.data;
          if ($util.OK(code)) {
            this.showCompany = true;
            this.companyList = item;
            let radioOption = [];
            item.forEach((item) => {
              if (item.uuid == this.userInfo.companyUuid) {
                this.selectComName = item.companyName;
                this.selectComUuid = item.uuid;
              }
              radioOption.push({
                key: item.uuid,
                value: item.companyName
              });
            });
            this.radioOption = radioOption;
          } else {
            this.$vux.toast.show({
              text: msg,
              type: 'text',
              position: 'middle'
            });
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.afterRes();
        });
      },
      changeCompany(value, label) {
        this.selectComUuid = value;
        this.selectComName = label;
        this.showPopup = false;
        this.getList(this.selectComUuid, true);
      },
    },
    beforeRouteEnter: (to, from, next) => {
        if (from.name == 'account-add') {
          next((vm) => {
            vm.showToast = false;
          });
        } else {
          next();
        }
    },
  }
</script>

<style scoped lang="scss">
  .company-select {
    width: 100%;
    box-sizing: border-box;
    padding: 0 2rem;
    height: 5rem;
    line-height: 5rem;
    color: #101010;
    background-color: #fff;
    box-shadow: 0 .4rem 1rem 0 rgba(197, 197, 197, .4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .triangle {
      display: inline-block;
      width: 0;
      height: 0;
      border: .4rem solid #000;
      border-left-color: transparent;
      border-top-color: transparent;
      transform: rotate(45deg);
      margin-bottom: .3rem;
    }
  }
  .popup-list {
    padding: 1.5rem;
  }
  .scroller {
    margin-top: 5rem;
    height: calc(100vh - 5rem) !important;
    &.normal {
      margin-top: 0;
      height: 100vh !important;
    }
  }
  .ship-list {
    padding: 1.5rem;
    li {
      border-radius: .8rem;
      background-color: #fff;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      position: relative;
      box-shadow: 0 0.4rem 1rem 0 rgba(197, 197, 197, .2);
      .item-title {
        font-weight: bold;
        font-size: 1.8rem;
        margin-bottom: 1rem;
      }
      .item-sub {
        font-size: 1.3rem;
        color: #999;
        margin-top: .6rem;
        >>>.hw-switch {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .btn-group {
        position: absolute;
        right: 1.5rem;
        top: 0;
        bottom: 0;
        height: 1.5rem;
        margin: auto;
        img {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 2rem;
        }
      }
    }
  }
  .fix-btn  {
    position: fixed;
    left:  0;
    right: 0;
    margin: auto;
    width: 11.2rem;
    height: 4.4rem;
    line-height: 4.4rem;
    bottom: 3rem;
    padding: 0;
    color: #fff;
    background-color: #0051E5;
    border-radius: 2.2rem;
    img {
      vertical-align: middle;
      width: 1.5rem;
      height: 1.5rem;
      margin-right: .6rem;
    }
  }
</style>
