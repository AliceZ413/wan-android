<template>
  <div>
    <div :class="['block', mode == 0 ? 'list' : 'edit']">
      <div class="edit-button" @click="changeEditMode">编辑</div>
    </div>
    <scroller :class="['scroller', mode == 0 ? 'list' : 'edit']">
      <ul slot="content" class="ship-list">
        <li v-for="(ship) in list" :key="ship.shipUuid">
          <div class="cell-button" @click="handleClickCell(ship)">
            <div class="item-title">
              <transition name="fade">
                <div v-show="mode == 1" style="margin-right: .5rem;">
                  <icon v-show="ship.selected" class="icon-selected" type="success"></icon>
                  <icon v-show="!ship.selected" class="icon-no-selected" type="circle"></icon>
                </div>
              </transition>
              {{ ship.shipName || "--" }}
            </div>
            <img
              class="icon-right-arrow"
              src="../../../resource/images/icon_right-min.png"
              alt=""
            />
          </div>
        </li>
      </ul>
    </scroller>
    <div :class="['edit-controller', mode == 0 ? 'list' : 'edit']">
      <div class="edit-controller-l">
        <div class="check-button" @click="handleAllSelected">
          <icon v-show="allSelected" class="icon-selected" type="success"></icon>
          <icon v-show="!allSelected" class="icon-no-selected" type="circle"></icon>
          <div class="label">全选</div>
        </div>
        <div class="check-button" style="margin-left: 2.8rem;" @click="handleAllNotSelected">
          <icon v-show="allNotSelected" class="icon-selected" type="success"></icon>
          <icon v-show="!allNotSelected" class="icon-no-selected" type="circle"></icon>
          <div class="label">全不选</div>
        </div>
      </div>
      <div class="edit-controller-r">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="submit" @click="handleSubmit">一键配置</div>
      </div>
    </div>
  </div>
</template>

<script>
import scroller from "@/../components/ui/scroller";
import { CheckIcon, Icon } from 'vux';
import { api_getCompanyShip } from '@/api/hw.js';
export default {
  name: "message-list",
  components: { 
    scroller,
    CheckIcon,
    Icon
  },
  data() {
    return {
      query: {},
      arr: [],
      list: [],
      selectedList: [],
      mode: 0, // 0列表，1编辑
      allSelected: false, // 是否全选
      allNotSelected: false, // 是否全不选
    };
  },
  activated(a, b, c) {
    if (this.$store.state.hw.refresh) {
      this.getList();
      this.$store.commit("hw/setRefresh", false);
    }
  },
  watch: {
    
  },
  mounted() {
    this.query = this.$route.query;
    this.getList();
  },
  methods: {
    getList() {
      let query = this.query;
      this.$vux.loading.show('请稍候');
      let form = { companyUuid: query.compId };
      api_getCompanyShip(form).then(res => {
        let data = res.data;
        if($util.OK(data.code)) {
          this.list = data.item.map(item => {
            item.selected = false;
            return item;
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
    changeEditMode() {
      this.mode = this.mode == 0 ? 1 : 0;
    },
    // 全选
    handleAllSelected() {
      this.allSelected = !this.allSelected;
      this.allNotSelected = false;
      let list = this.list;
      if (list.length > 0) {
        for (let item of list) {
          item.selected = true;
        }
        this.list = list;
      }
    },
    // 全不选
    handleAllNotSelected() {
      this.allNotSelected = !this.allNotSelected;
      this.allSelected = false;
      let list = this.list;
      if (list.length > 0) {
        for (let item of list) {
          item.selected = false;
        }
        this.list = list;
      }
    },
    handleCancel() {
      this.mode = 0;
    },
    handleSubmit() {
      let query = this.query;
      let list = this.list.filter((item) => {
        return item.selected == true;
      });
      if (list.length == 0) {
        this.$vux.toast.show({
          text: '至少选中一艘船',
          duration: 1500,
          width: '15rem',
          position: 'middle',
          type: 'text'
        });
        return;
      }
      this.$router.push({
        name: 'device-edit',
        params: {
          userId: query.userId,
          shipList: list,
        }
      });
    },
    handleClickCell(ship) {
      let query = this.query;
      if (this.mode == 0) {
        // 跳转到单独配置
        this.$router.push({
          name: 'device-edit',
          params: {
            userId: query.userId,
            shipUuid: ship.shipUuid,
            shipName: ship.shipName,
          }
        });
      } else {
        // 多选
        let foundIndex = this.list.findIndex(item => item.shipUuid == ship.shipUuid);
        this.list[foundIndex].selected = !this.list[foundIndex].selected;
        let hasFalse = this.list.some(item => item.selected == false);
        if (!hasFalse) {
          this.allSelected = true;
          this.allNotSelected = false;
        } else {
          // 如果选完之后，有未选中的，
          this.allNotSelected = false;
          this.allSelected = false;
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  width: 0;
}
.fade-leave, .fade-enter-to {
  opacity: 1;
  width: 100%;
}
.scroller {
  &.list {
    height: calc(100vh - 3.6rem) !important;
  }
  &.edit {
    height: calc(100vh - 6.7rem) !important;
    .cell-button {
      padding-left: 1rem;
    }
  }
}
.block {
  width: 100%;
  line-height: 3.6rem;
  transition: height 0.5s;
  overflow: hidden;
  &.list {
    height: 3.6rem;
  }
  &.edit {
    height: 0;
  }
  .edit-button {
    padding: 0 1.4rem;
    float: right;
    color: #1c76ff;
    font-size: 1.4rem;
  }
}
.ship-list {
  width: 100%;
  li {
    width: 100%;
    height: 5rem;
    line-height: 5rem;
    font-size: 1.6rem;
    color: #101010;
    box-sizing: border-box;
    padding: 0 1rem;
    background-color: #fff;
    .cell-button {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 1.4rem 0 1.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title {
        display: flex;
        align-items: center;
        vertical-align: middle;
        white-space: nowrap;
      }
      .icon-right-arrow {
        width: 1.6rem;
        height: 1.6rem;
        display: inline-block;
        vertical-align: middle;
      }
    }
    &:not(:last-child) {
      .cell-button {
        border-bottom: 1px solid #dbdbdb;
      }
    }
  }
}
.fix-btn {
  position: fixed;
  left: 0;
  right: 0;
  margin: auto;
  width: 11.2rem;
  height: 4.4rem;
  line-height: 4.4rem;
  bottom: 3rem;
  padding: 0;
  color: #fff;
  background-color: #0051e5;
  border-radius: 2.2rem;
  img {
    vertical-align: middle;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.6rem;
  }
}
.edit-controller {
  width: 100%;
  box-sizing: border-box;
  font-size: 1.4rem;
  color: #959595;
  box-shadow: 0 -0.2rem 0.6rem 0 rgba(153, 153, 153, .4);
  background-color: #ffffff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.2rem;
  overflow: hidden;
  transition: height 0.5s;
  &.list {
    height: 0rem;
  }
  &.edit {
    height: 5rem;
  }
  .edit-controller-l {
    display: flex;
    .check-button {
      display: flex;
      align-items: center;
    }
  }
  .edit-controller-r {
    display: flex;
    align-items: center;
    height: 100%;
    .cancel {
      padding: 0 1rem;
      color: #b5b5b5;
      height: 3rem;
      line-height: 3rem;
    }
    .submit {
      color: #1C76FF;
      padding: 0 1rem;
      height: 3rem;
      line-height: 3rem;
    }
  }
}
.icon-selected {
  color: #0076ff;
}
</style>
