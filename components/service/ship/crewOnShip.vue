<template>
  <div class="m-list-contain">
    <div class="m-margin-title">
      <div>
        <span>{{shipName}}在船船员</span>
      </div>
    </div>
    <div class="m-list-crew">
      <ul class="m-source">
        <li :class="sourceTabNav == 1 ? 'nav-active' : ''" @click="switchSourceTab(1)">报告制</li>
        <!-- <li :class="sourceTabNav == 1 ? 'nav-active' : ''" @click="switchSourceTab(1)">动态2.0</li> -->
        <li :class="sourceTabNav == 2 ? 'nav-active' : ''" @click="switchSourceTab(2)">海事之眼</li>
      </ul>
      <p class="check-time" v-show="(sourceTabNav == 1) && (reportTime != '')">报告时间：{{reportTime}}</p>
      <p class="check-time" v-show="(sourceTabNav == 2) && (crewListTemp.length)">核查时间：{{checkTime}}</p>
      <ul class="m-list">
        <li class="m-item" v-for="(position,index) in crewListTemp" :key="index" @click="getCrewData(position)">
          <div class="m-item-p">{{position.positionName}}</div>
          <div class="m-item-c">
            <div class="m-item-avatar">
              <img :onerror="noImg" class="m-item-avatar" :src="position.photoUrl" :data-index="index"/>
              <img v-if='position.ifG' class='m-g-img' src='@/../resource/images/icon_g-min.png'/>
            </div>
            <div class="m-item-main">
              <div class="m-item-title">
                <span>{{position.crewName}}</span>
              </div>
              <p class="m-info-text" style="margin-bottom: .8rem;">
                <img class="m-info-icon" src="@/../resource/images/icon_user_id-min.png"/>
                <span>{{position.parseIdNo}}</span>
              </p>
              <!--为了安全，列表不能返回手机-->
              <!--<p class="m-info-text">-->
              <!--<img class="m-info-icon" src="@/../resource/images/icon_user-phone.png"/>-->
              <!--<a :href="`tel:${position.mobile}`" class="link-style">{{position.mobile}}</a>-->
              <!--</p>-->
            </div>
          </div>
        </li>
      </ul>
      <p class="empty-block" v-show="(sourceTabNav == 1) && loadedOnShip && (crewList.length < 1)">暂无记录</p>
      <p class="empty-block" v-show="loadedShip && (crewList1.length < 1) && (sourceTabNav == 2)">无核查记录</p>
    </div>

    <div class="crew-container">
      <div class="c-layer" :class="showCrew ? 'layer-show':'layer-hide'" @click="hideCrew"></div>

      <div class="crew-info" :class="showCrew ? 'popup': 'popdown'">
        <crew :idNo="displayGuid" v-if="displayGuid"></crew>
      </div>
    </div>
  </div>

</template>

<script>

  import {
    api_getShip,
    api_getCrewOnShipBGZ
  } from '@/../resource/api/ship'
  import { api_getCrewListByShipId } from '@/../resource/api/core'
  import noImg from '@/../resource/images/icon_none_pic-min.png'
  import Crew from '@/../components/service/crew/crew'

  export default {
    name: 'service-crew-on-ship',
    props: {shipId: String, shipName: String},
    components: {Crew},
    data () {
      return  {
        sourceTabNav: 1,
        loadedOnShip: false,
        crewList: [], // 动态2.0
        crewList1: [], // 海事之眼
        noImg: `this.src="${noImg}"`,
        loadedShip: false,
        crewListTemp: [],
        checkTime: '--',
        reportTime: '',

        displayGuid: '',
        showCrew: false
      }
    },
    watch: {
      shipId (shipId) {
        this.shipId = shipId;
        if(shipId) {
          this.searchOnShip();
        }
      }
    },
    mounted () {
      if(this.shipId) {
        this.searchOnShip();
      }
    },
    methods: {
      // 切换动态2.0/海事之眼
      switchSourceTab(index) {
        this.sourceTabNav = index;
        if ((this.sourceTabNav == 1) && !this.loadedOnShip) {
          this.searchOnShip();
        }
        if ((this.sourceTabNav == 2) && !this.loadedShip) {
          this.getShip();
        }
        if ((this.sourceTabNav == 1) && this.loadedOnShip) {
          this.crewListTemp = this.crewList
        }
        if ((this.sourceTabNav == 2) && this.loadedShip) {
          this.crewListTemp = this.crewList1
        }
      },
      searchOnShip: function () {
        let $this = this;
        /*
         * 报告制
        */
        $this.$vux.loading.show({text: '请稍候'});

        api_getCrewListByShipId({ shipId: $this.shipId }).then(function (response) {
          let data = response.data;
          $this.$vux.loading.hide();
          if (data.success) {
            $this.loadedOnShip = true;
            let crewList = [];
            // let reportTime = data.item.createdAt ? new Date(parseInt(data.item.createdAt)).format('yyyy-MM-dd hh:mm') : '';

            $this.reportTime = data.item.createdAt;
            for (let i = 0; i < data.list.length; i++) {
              let item = data.list[i];
              item.positionName = item.positionName || '';
              if (item.positionName.indexOf('GMDSS') == -1) {
                let ifG = false;
                for (let j = 0; j < data.list.length; j++) {
                  let item1 = data.list[j];
                  item1.positionName = item1.positionName || '';
                  if (item.idNo == item1.idNo && (item1.positionName.indexOf('GMDSS') != -1)) {
                    ifG = true;
                    break;
                  }
                }
                let crew = {
                  photoUrl: $util.crewPhoto + item.guid,
                  idNo: item.idNo,
                  guid: item.guid,
                  parseIdNo: item.idNo ? $util.parseNo(item.idNo) : '暂无',
                  crewName: item.crewName || '--',
                  positionName: item.positionName || '其他',
                  mobile: item.mobile ? item.mobile : '暂无',
                  ifG: ifG
                };
                crewList.push(crew);
              }
            }
            $this.crewList = crewList;
            $this.crewListTemp = [];
            $this.crewListTemp = crewList;
          } else {
            $this.crewListTemp = [];
            $this.$vux.alert.show({
              title: '信息',
              content: data.message
            })
          }
        }).catch(function (error) {
          $this.$vux.loading.hide();
        });
      },
      getShip: function () {
        let $this = this;
        /*
         * 船员所在船（海事之眼）
        */
        $this.$vux.loading.show({text: '请稍候'});

        api_getShip({ shipId: $this.shipId }).then(function (response) {
          let data = response.data;
          $this.$vux.loading.hide();
          if (data.success) {
            $this.loadedShip = true;
            let crewList = [];
            let checkTime = data.item.createdAt ? new Date(parseInt(data.item.createdAt)).format('yyyy-MM-dd hh:mm') : '--';
            for (let i = 0; i < data.list.length; i++) {
              let item = data.list[i];
              item.positionName = item.positionName || '';
              if (item.positionName.indexOf('GMDSS') == -1) {
                let ifG = false;
                for (let j = 0; j < data.list.length; j++) {
                  let item1 = data.list[j];
                  item1.positionName = item1.positionName || '';
                  if (item.crewIdNo == item1.crewIdNo && (item1.positionName.indexOf('GMDSS') != -1)) {
                    ifG = true;
                    break;
                  }
                }
                let crew = {
                  photoUrl: $util.crewPhoto + item.guid,
                  idNo: item.crewIdNo,
                  guid: item.guid,
                  parseIdNo: item.crewIdNo ? $util.parseNo(item.crewIdNo) : '暂无',
                  crewName: item.crewName || '--',
                  positionName: item.positionName || '其他',
                  mobile: item.userMobile ? item.userMobile : '暂无',
                  ifG: ifG
                };
                crewList.push(crew);
              }
            }
            $this.crewList1 = crewList;
            $this.crewListTemp = [];
            $this.crewListTemp = crewList;
            $this.checkTime = checkTime
          } else {
            $this.crewListTemp = [];
            $this.loadedShip = true;
          }
        }).catch(function (error) {
          $this.$vux.loading.hide();
        });
      },
      getCrewData (position) {
        this.showCrew = true;
        this.displayGuid = position.guid;
      },
      hideCrew () {
        this.showCrew = false;
      }
    }
  }
</script>

<style scoped lang="scss">

  .m-margin-title{
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    text-align: center;
    font-weight: bold;
    font-size: 1.8rem;
    background-color: #fff;
    border-bottom: 1px solid $bdc;
    line-height: 1;
    span{
      vertical-align: middle;
    }
    img{
      width: 1.4rem;
      height: 1.4rem;
      vertical-align: middle;
    }
  }

  .m-list-contain {
    background-color: #ebeff4;
    position: relative;
    .m-list-crew{
      padding: 0 1.5rem;
    }
    .empty-block {
      padding: 1rem;
      text-align: center;
      background: #fff;
      color: #ccc;
    }
    .m-list .m-item {
      // padding: 1.5rem 1.5rem 1.5rem 0;
      border-bottom: .5px solid $bdc;
      background: #fff;
      margin-bottom: 1rem;
      border-radius: .2rem;
      overflow: hidden;
      position: relative;
      .m-item-p {
        font-size: 1.6rem;
        color: #333333;
        font-weight: bold;
        padding: .75rem 1.5rem;
        border-bottom: .05rem solid #E9E9E9;
      }
      .m-item-c {
        padding: 1rem 1.5rem;
        overflow: hidden;
      }
      .m-item-avatar{
        width: 7.8rem;
        height: 7.8rem;
        border-radius: .4rem;
        float: left;
        position: relative;
        .m-g-img{
          position: absolute;
          top: 6rem;
          right: -.9rem;
          width: 2.3rem;
          height: 2.3rem;
        }
      }
      .m-item-main{
        box-sizing: border-box;
        margin: 0 1.5rem 0 7.8rem;
        padding-left: 1.5rem;
      }
      .link-style{color: $mc;}
      .m-item-title{font-size: 1.6rem;font-weight:bold;margin-bottom: .8rem;}
      .m-info-text{
        *{
          vertical-align: middle;
        }
      }
      .m-info-icon{
        width: 1.6rem;
        height: 1.4rem;
        margin-right: .8rem;
      }
    }
    .check-time {
      margin-bottom: 1rem;
    }
    .m-source{
      padding: 1rem 0;
      display: flex;
      li {
        background: #E5E8F8;
        border-radius: .2rem;
        padding: 1rem 1.65rem;
        font-size: 1.2rem;
        color: #324ED7;
        margin-right: 1.5rem;
        &.nav-active {
          color: #FFFFFF;
          background: #6481F8;
        }
      }
    }
  }

  /*船员信息展示*/
  .c-layer{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 101;
    background-color: rgba(51, 51, 51, 0.3);
    transition: opacity .5s;
  }
  .layer-hide{
    display: none;
    opacity: 0;
  }
  .layer-show {
    display: block;
    opacity: 1;
    z-index: 101;
  }
  .crew-info {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    transition: top .5s;
    background-color: $bgc;
    z-index: 102;
    overflow: scroll;
  }
  .popup {
    top: 20%;
  }
  .popdown {
    top: 100%;
    overflow: hidden;
  }
</style>
