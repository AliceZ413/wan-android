<template>
  <div class="form-data">
    <div class="b-title">基本信息</div>
    <div class="b-form">
      <div>
        <div><span>*</span>姓名</div>
        <input type="text" placeholder="请输入姓名" v-model="form.userName"/>
      </div>
      <div>
        <div><span>*</span>手机号码</div>
        <input type="text" placeholder="请输入手机号码" v-model="form.userMobile"/>
      </div>
      <div style="display: inline-block;">
        <div style="display: inline-block;"><span>*</span>是否接受异常短信</div>
        <hw-switch style="display: inline-block;vertical-align: middle;margin-left: 1rem;" v-model="msgSelected"></hw-switch>
      </div>
      <div>
        <div>备注</div>
        <textarea placeholder="请输入" v-model="form.remark"></textarea>
      </div>
    </div>

    <div class="b-title">
      船舶列表
      <div class="abs-btn" @click="showLayer"><img src="@/assets/image/add-min.png"/>添加</div>
    </div>
    <ul class="ship-list">
      <li v-for="(ship, index) in selectedShips">
        {{ship.shipName || '--'}}
        <img src="@/assets/image/ico-remove-min.png" @click="removeUserShip(index)"/>
      </li>
    </ul>

    <section class="ship-layer">
      <div class="layer-bg" :class="openLayer ? 'trans-bg' : ''" @click="hideLayer"></div>
      <div class="layer-content" :class="openLayer ? 'trans-content' : ''">
        <div class="search-area">
          <input type="text" placeholder="请输入船舶名称" v-model="keyword"/>
        </div>
        <div class="ship-view">
          <div v-for="(ship, index) in compShips" :key="ship.shipUuid">
            <checkbox :value="index.toString()" :checked="ship.checked" name="ship-selection" @change="checkShip(ship, index)">{{ship.shipName || '--'}}</checkbox>
          </div>
        </div>
        <div class="option-group">
          <div class="radio-group">
            <a>
              <ui-radio value="1" name="group-1" @change="setSelect">全选</ui-radio>
            </a>
            <a>
              <ui-radio value="2" name="group-1" @change="setSelect">全不选</ui-radio>
            </a>
          </div>
          <div class="btn-group">
            <button class="btn-cancel" @click="hideLayer">取消</button>
            <button class="btn-confirm" @click="confirmShips">确定</button>
          </div>
        </div>
      </div>
    </section>

    <div class="fix-btn-group">
      <div @click="cancelForm">取消</div>
      <div class="confirm" @click="submitForm">保存</div>
    </div>
  </div>
</template>

<script>
  import { api_delManageShip, api_getCompanyShip, api_getUserInfo, api_addCaptainUser } from '@/api/hw'
  import UiRadio from "@/../components/ui/radio";
  import Checkbox from "@/../components/ui/checkbox";
  import hwSwitch from '@/components/switch.vue';

  export default {
    components: {
      Checkbox,
      UiRadio,
      hwSwitch
    },
    name: 'add',
    data () {
      return {
        openLayer: false,
        query: {},
        detail: {},
        selectedShips: [],
        compShips: [],
        form: {
          userName: '',
          userMobile: '',
          remark: '',
          userId: '',
          companyUuid: '',
          manageShipList: '',
          recordUuid: '',
          isMessage: 0,
        },
        msgSelected: true,
        keyword: '',
        mode: 'add'// add-新增/update-更新
      }
    },
    watch: {
      keyword (val) {
        let reg = /[a-z]+/;

        if (!reg.test(val) || !val) {
          //搜索
          this.searchShips(val);
        }
      },
      msgSelected(val) {
        this.form.isMessage = val ? 0 : 1;
      }
    },
    mounted () {
      /**
       * uid      当前用户Id
       * compId   公司ID
       * rId   被编辑用户的userId
       * */
      let query = this.query = this.$route.query;

      if(query.userId) {
        document.title = '编辑账号';
        this.mode = 'update';
        this.form.userId = query.userId;
        this.form.companyUuid = query.compId;
        this.form.recordUuid = query.rId;
        this.getDetail();
      } else {
        document.title = '新增账号';
        this.mode = 'add';
        this.form.userId = query.uid;
        this.form.companyUuid = query.compId;
        delete this.form.recordUuid;
      }
    },
    methods: {
      removeUserShip (index) {
        let $this = this;

        if($this.compShips.length) {
          $this.compShips = $this.compShips.map(ship => {
            console.log($this.selectedShips[index]);
            if($this.selectedShips[index].shipUuid == ship.shipUuid) {
              ship.checked = false;
            }
            return ship;
          })
        }
        $this.selectedShips.splice(index, 1);
      },
      cancelForm () {
        this.$router.go(-1);
      },
      confirmShips () {
        let ships = [];

        this.compShips.forEach(ship => {
          if(ship.checked) {
            ships.push(ship);
          }
        });
        this.selectedShips = ships;
        this.openLayer = false;
      },
      setSelect (val) {
        //全选/全不选
        if(val == 1) {
          this.compShips = this.compShips.map(item => {
            item.checked = true;
            return item;
          })
        } else {
          this.compShips = this.compShips.map(item => {
            item.checked = false;
            return item;
          })
        }
      },
      submitForm () {
        let $this = this;
        if(!this.form.userName) {
          this.$vux.toast.text('请输入用户姓名');
          return;
        }
        if(!this.form.userMobile) {
          this.$vux.toast.text('请输入用户手机号码');
          return;
        }
        if(!this.selectedShips.length) {
          this.$vux.toast.text('请选择船舶');
          return;
        }

        let ships = [];
        this.selectedShips.forEach(ship => {
          ships.push(ship.shipUuid);
        });
        this.form.manageShipList = ships.join(',');

        this.$vux.loading.show('请稍候');

        api_addCaptainUser(this.form).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            this.$vux.alert.show({
              content: (this.mode == 'add' ? '新增' : '修改') + '成功',
              onHide () {
                $this.$store.commit('hw/setRefresh', true);
                $this.$router.go(-1)
              }
            });
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.$vux.loading.hide();
        })
      },
      getDetail () {
        let query = this.query;
        this.$vux.loading.show('请稍候');

        api_getUserInfo({userId: query.userId}).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            this.detail = data.item;
            this.form.userName = data.item.userName;
            this.form.userMobile = data.item.userPhone;
            this.form.remark = data.item.remark;
            this.msgSelected = data.item.isMessage == 0 ? true : false;
            this.selectedShips = data.item.shipList;
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.$vux.loading.hide();
        })
      },
      checkShip (ship, index) {
        let mark = null;
        this.compShips[index].checked = !this.compShips[index].checked;
        let matchRes = this.selectedShips.filter((item, index) => {
          if(item.shipUuid == ship.shipUuid) {
            mark = index;
            return true;
          }
          return false;
        });

        //如果勾选了一艘船，则添加一艘船
        if(this.compShips[index].checked) {
          if(!matchRes.length) {
            this.selectedShips.push(ship);
          }
        } else {
          //如果移除了一艘船，则在已选择的列表移除该船
          if(mark) this.selectedShips.splice(mark, 1);
        }
      },
      showLayer () {
        this.openLayer = true;

        if(!this.compShips.length) {
          this.searchShips()
        }
      },
      searchShips (keyword) {
        let $this = this;
        //加载公司船舶
        let query = this.query;
        this.$vux.loading.show('请稍候');

        let form = {companyUuid: query.compId};
        keyword && (form.shipName = keyword);

        api_getCompanyShip(form).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            $this.compShips = data.item;
            if($this.selectedShips.length) {
              $this.compShips = $this.compShips.map(item => {
                let matchRes = $this.selectedShips.filter(ship => ship.shipUuid == item.shipUuid);
                if(matchRes.length) {
                  item.checked = true
                } else {
                  item.checked = false;
                }
                return item;
              })
            }
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.$vux.loading.hide();
        })
      },
      hideLayer () {
        this.openLayer = false;
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
      img {width: 1.5rem;height: 1.5rem;vertical-align: middle; margin-right: .4rem;}
      color: #0051E5;
      margin: auto;
    }
  }
  .b-form {
    background-color: #fff;
    padding: 1.5rem;
    >div {
      margin-bottom: 1.5rem;
      color: #666;
      >div {
        margin-bottom: .9rem;
        span {color: red;font-weight: bold;}
      }
      input, textarea {
        padding: 1.3rem 1rem;
        border-radius: .4rem;
        border: 1px solid #d2d2d2;
        display: block;
        width: 100%;
        box-sizing: border-box;
        &::placeholder {
          color: #999;
        }
      }
      textarea {
        height: 7.8rem;
        resize: none;
      }
    }
  }
  .ship-list {
    padding: 0 1.5rem;
    li {
      padding: 1.5rem;
      background-color: #fff;
      position: relative;
      border-radius: .4rem;
      margin-bottom: .9rem;
      img {
        position: absolute;
        z-index: 1;
        width: 1.5rem;
        height: 1.5rem;
        right: 1.5rem;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
  .layer-bg {
    position: fixed;
    z-index: 10;
    top: 100%;
    bottom: 0;
    right: 0;
    left:  0;
    background: rgba(0,0,0,.3);
    transition: opacity 0.3s;
  }
  .trans-bg {
    top: 0;
    opacity: 1 !important;
  }
  .trans-content {
    bottom: 0 !important;
  }
  .layer-content {
    height: 37.8rem;
    position: fixed;
    bottom: -40rem;
    left: 0;
    right: 0;
    z-index: 11;
    background-color: #fff;
    border-radius: .4rem .4rem 0 0;
    display: flex;
    flex-direction: column;

    -webkit-transition: bottom 0.3s;
    -moz-transition: bottom 0.3s;
    -ms-transition: bottom 0.3s;
    -o-transition: bottom 0.3s;
    transition: bottom 0.3s;

    .search-area {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f1f1;
      input {
        background-image: url('~@/assets/image/search-min.png');
        display: block;
        box-sizing: border-box;
        width: 100%;
        padding: 1.1rem 1.5rem 1.1rem 3.5rem;
        border: 1px solid #d2d2d2;
        background-size: 1.7rem;
        background-position: 1.1rem  1.1rem;
        background-repeat: no-repeat;
        border-radius: .4rem;
      }
    }
    .ship-view {
      flex: 1;
      border-bottom: 1px solid #f1f1f1;
      >div{
        margin-bottom: 1.5rem;
        label { margin-left: .6rem; }
      }
      overflow: scroll;
      padding: 1.5rem;
    }
    .option-group {
      padding: 1.5rem;
      position: relative;
      .radio-group {
        a{ margin-right: 3.2rem; }
      }
      .btn-group {
        position: absolute;
        top: 0;
        right: 2.5rem;
        bottom: 0;
        height: 1.6rem;
        line-height: 1.6rem;
        margin: auto;
        z-index: 1;
        button {background-color: transparent;}
        .btn-cancel {color: #999; margin-right: 1.9rem; }
        .btn-confirm { color: #0051E5; }
      }
    }
  }
  .fix-btn-group {
    position: fixed;
    height: 4.4rem;
    display: flex;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: #fff;
    line-height: 4.4rem;
    >div {
      text-align: center;
      flex: 1;
      color: #333;
      &.confirm {
        background-color: #2a4edf;
        color: #fff;
      }
    }
  }
  .form-data {
    padding-bottom: 5rem;
  }
</style>
