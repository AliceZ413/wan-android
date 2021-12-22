<template>
  <div class="org-container">
    <transition name="fade">
      <div class="org-mask" :class="showPicker ? 'popup': ''" @click="hidePicker" v-show="showPicker">

      </div>
    </transition>

    <transition name="org-picker">
      <div class="org-picker__content" v-show="showPicker">
        <div class="org-picker__title">
          请选择海事机构
          <div class="close-picker__icon" @click="hidePicker">
            <img src="@/../resource/images/icon_close-min.png"/>
          </div>
        </div>

        <div class="org-select">
          <ul>
            <li @click="rePickProvince" :class="province.orgCode ? 'select-active': ''" v-show="(!provinces || (provinces && provinces.length > 1))">{{province.orgName}}</li>
            <li v-show="province.orgCode" @click="rePickCity" :class="city.orgCode ? 'select-active': ''">{{city.orgName}}</li>
            <li v-show="city.orgCode"  @click="rePickArea" :class="area.orgCode ? 'select-active': ''">{{area.orgName}}</li>
          </ul>
        </div>
        <div class="org-scroll-view">
          <div class="org-loader" v-if="loadingOrg">加载中...</div>
          <ul v-show="province.show">
            <li
              v-for="(province, index) in orgProvinces"
              @click="pickProvince(province)"
              v-show="!(!showRoot && province.isRoot == 1)"
            >{{ province.orgName }}</li>
          </ul>
          <ul v-if="city.show">
            <li
              v-for="(city, index) in orgCities"
              v-show="!(!showRoot && city.isRoot == 1)"
              @click="pickCity(city)"
            >{{ city.orgName }}</li>
          </ul>
          <ul v-if="area.show">
            <li
              v-for="(area, index) in  orgAreas"
              v-show="!(!showRoot && area.isRoot == 1)"
              @click="pickArea(area)"
            >{{ area.orgName }}</li>
          </ul>
        </div>
        <button class="ms-primary org-select__bottom" :disabled="!!!currentSelected.orgCode" @click="confirmSelect">{{ (!!currentSelected.orgCode) ? `选择${currentSelected.orgName}` : '请选择' }}</button>
      </div>
    </transition>
  </div>
</template>

<script>
  import {api_org} from '@/../resource/api/msa'

  export default {
    name: 'org-picker',
    props: {
      value: Boolean,
      setting: Object,
      showRoot: {
        type: Boolean,
        default: true
      },
      provinces: Array,
      cities: Array
    },
    data () {
      return {
        showPicker: false,

        province: {
          orgName: '请选择',
          orgCode: '',
          selectIndex: 0,
          show: true
        },
        city: {
          orgName: '请选择',
          orgCode: '',
          selectIndex: 0,
          show: false
        },
        area: {
          orgName: '请选择',
          orgCode: '',
          selectIndex: 0,
          show: false
        },

        orgProvinces: [],
        orgCities: [],
        orgAreas: [],
        //加载中
        loadingOrg: false,

        currentSelected: {orgName: '', orgCode: ''}
      }
    },
    watch: {
      value (showPicker) {
        this.showPicker = showPicker;
      },
      showPicker (val) {
        this.$emit('input', val);
      },
      provinces (val) {
        this.getProvinces();
      },
      cities (val) {
        this.getProvinces();
      }
    },
    mounted () {
      this.getProvinces();
    },
    methods: {
      hidePicker () {
        this.showPicker = false;
      },
      rePickProvince () {
        this.city.show = false;
        this.area.show = false;
        this.province.show = true;
      },
      rePickCity () {
        this.province.show = false;
        this.area.show = false;
        this.city.show = true;
      },
      rePickArea () {
        this.province.show = false;
        this.city.show = false;
        this.area.show = true;
      },
      async getProvinces () {
        let $this = this;
        let defaultSelectProvince = null;
        let defaultOrgCode = '00';

        if ( $this.provinces && $this.provinces.length == 1 ) {
          defaultOrgCode = $this.provinces[0];
        }

        if( !this.orgProvinces.length ) {
          let orgProvinces = await this.searchOrg(defaultOrgCode);
          let provincesArr = [];

          orgProvinces.forEach( (province, index) => {
            province.selected = false;
            province.index = index;

            if( $this.provinces ) {
              //设置了省份名单
              if ($this.provinces.length && this.provinces.indexOf(province.orgCode) >= 0) {
                provincesArr.push(province);
                if($this.provinces.length == 1) {
                  defaultSelectProvince = province;
                }
              }
            } else {
              //未设置省份名单
              provincesArr.push(province)
            }
          });

          this.orgProvinces = provincesArr;

          if( defaultSelectProvince) {
            this.pickProvince(defaultSelectProvince);
            this.setCurrentSelected('', '');
          }
        }
      },
      pickProvince (province) {
        //选择省级海事局
        this.province.orgName = province.orgName;
        this.province.orgCode = province.orgCode;
        this.province.selectIndex = province.index;
        this.province.show = false;
        this.city.show = true;

        //重置已选的city及area
        this.initCity();
        this.initArea();

        province.selected = true;
        this.setCurrentSelected(province.orgCode, province.orgName);

        this.loadCities(province);
      },
      initCity () {
        this.city.orgName = '请选择';
        this.city.orgCode = '';
        this.city.selectIndex = 0;
      },
      initArea () {
        this.area.orgName = '请选择';
        this.area.orgCode = '';
        this.area.selectIndex = 0;
      },
      async loadCities (province) {
        let $this = this;
        let cities = await this.searchOrg(province.orgCode);
        let citiesArr = [];
        let defaultSelectCity = null;

        cities.forEach( (city, index) => {
          city.selected = false;
          city.index = index;

          if( $this.cities ) {
            //设置了城市名单
            if ($this.cities.length && this.cities.indexOf(city.orgCode) >= 0) {
              citiesArr.push(city)
              if($this.cities.length == 1) {
                defaultSelectCity = city;
              }
            }
          } else {
            //未设置城市名单
            if($this.provinces && $this.provinces.length == 1) {
              citiesArr.push(city)
            } else {
              if(city.isRoot != 1) {
                citiesArr.push(city);
              }
            }
          }
        });

        this.orgCities = citiesArr;
        if( defaultSelectCity ) {
          this.pickCity(defaultSelectCity);
          this.setCurrentSelected('', '');
        }
      },
      pickCity (city) {
        let $this = this;
        this.city.orgName = city.orgName;
        this.city.orgCode = city.orgCode;
        this.city.selectIndex = city.index;
        this.city.show = false;
        this.area.show = true;

        city.selected = true;
        this.setCurrentSelected(city.orgCode, city.orgName);

        this.initArea();

        this.loadAreas(city, (areas) => {
          let hasArea = true;
          let areaArr = [];

          areas.forEach((area, index) => {
            area.selected = false;
            area.index = index;

            if($this.cities && $this.cities.length == 1) {
              //传入了城市，就要允许展示根节点
              areaArr.push(area);
            } else {
              if(area.isRoot != 1) {
                areaArr.push(area);
              }
            }
            // areaArr.push(area);
          });

          if( !areaArr.length ) { hasArea = false; }

          if ( !hasArea ) {
            //选到城市，没有下级行政机构就返回触发pickup事件
            let result = $this.getResult(city.orgCode, city.orgName);

            this.city.show = true;
            $this.setPickUp(result);
          }

          $this.orgAreas = areaArr;
        });
      },
      setPickUp (result) {
        this.showPicker = false;
        this.$emit('onPickup', result);
      },
      getResult (orgCode, orgName) {
        let reseter = function (name) { return name === '请选择' ? '': name };

        return {
          orgCode: orgCode,
          orgName: orgName,
          path: {
            province: {
              orgCode: this.province.orgCode,
              orgName: reseter(this.province.orgName)
            },
            city: {
              orgCode: this.city.orgCode,
              orgName: reseter(this.city.orgName)
            },
            area: {
              orgCode: this.area.orgCode,
              orgName: reseter(this.area.orgName)
            }
          }
        }
      },
      async loadAreas (city, Fn) {
        Fn = Fn || function () {};
        let areas = await this.searchOrg(city.orgCode);

        areas.forEach( (area, index) => {
          area.selected = false;
          area.index = index;
        });

        city.areas = areas;
        Fn(areas);
      },
      pickArea (area) {
        this.area.orgName = area.orgName;
        this.area.orgCode = area.orgCode;
        this.area.selectIndex = area.index;
        this.city.show = false;

        area.selected = true;

        let result = this.getResult(this.area.orgCode, this.area.orgName);
        this.setCurrentSelected(area.orgCode, area.orgName);

        this.setPickUp(result);

      },
      searchOrg: function (code) {
        //查询海事机构
        let $this = this;
        this.loadingOrg = true;

        return new Promise((resolve, reject) => {

          api_org(code).then(function (res) {
            $this.loadingOrg = false;
            res = res.data;
            if (res.success) {
              resolve(res.list);
            } else {
              resolve([]);
              $this.$vux.toast.text(res.message)
            }
          }).catch(function (error) {
            $this.loadingOrg = false;
            resolve([]);
            throw error;
          })
        })
      },
      setCurrentSelected (orgCode, orgName) {
        this.currentSelected = { orgCode, orgName };
      },

      confirmSelect () {
        let currentSelected = this.currentSelected;

        let result = this.getResult(currentSelected.orgCode, currentSelected.orgName);

        this.setPickUp(result);
      },
    }
  }
</script>

<style scoped lang="scss">
  .org-mask {
    position: fixed;
    background-color: rgba(51, 51, 51, 0.3);
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 101;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .org-picker__content {
    position: fixed;
    left: 0;
    right: 0;
    height: 60%;
    bottom: 0;
    z-index: 102;
    background-color: #fff;
    .org-picker__title {
      height: 4rem;
      line-height: 4rem;
      font-size: 1.6rem;
      text-align: center;
      position: relative;
      .close-picker__icon {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        padding: 1.2rem;
        img{width: 1.6rem;height: 1.6rem;display: block;}
      }
    }

    .org-select {
      height: 3rem;
      line-height: 3rem;
      padding: 0 1.2rem;
      border-bottom: .5px solid $bdc;
      ul{
        li {
          display: inline-block;
          padding-right: 1.2rem;
          position: relative;
          max-width: 33.3333%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          height: 3rem;
          line-height: 3rem;
          &.active {
            color: $mc;
          }
        }
      }
    }

    .org-scroll-view {
      position: absolute;
      top: 7rem;
      left: 0;
      right: 0;
      padding-top: 1rem;
      padding-bottom: 1rem;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      height: calc(100% - 11.4rem);
      overflow-y: scroll;
      ul {
        li {
          padding: 0 1.2rem;
          height: 3rem;
          line-height: 3rem;
          &.select-active {
            color: $mc;
          }
        }
      }
      .org-loader{
        line-height: 3rem;
        padding: 0 1.2rem;
        text-align: left;
      }
    }
  }
  .org-picker-enter-active, .org-picker-leave-active {
    transition: bottom .35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .org-picker-enter, .org-picker-leave-to /* .fade-leave-active below version 2.1.8 */ {
    bottom: -60%;
  }
  .select-active{
    color: $mc;
  }
  .org-select__bottom {
    position: absolute;
    z-index: 99;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
