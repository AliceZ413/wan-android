<template>
  <div class="crew-info">
    <div class="crew-contain">
      <div>
        <img :onerror="noImg" class="img-crew" :src="crewBasic.photoUrl" :data-src="crewBasic.photoUrl" @click="preview(crewBasic.photoUrl)"/>
      </div>

      <div class="crew-adv">
        <div class='user-item'>
          <img src='@/../resource/images/icon_user_name-min.png'/>
          <div class="item-name">
            {{ crewBasic.crewName || '未知船员' }}
            <span class="key-trc" v-show="isKeyTrack">重点跟踪</span>
          </div>
        </div>
        <div class="info-bottom user-item">
          <img src='@/../resource/images/icon_user_id-min.png'/>
          <div class="item-name">{{ (encode ? crewBasic.parseIdNo : crewBasic.crewIdNo) || '暂无信息' }}</div>
        </div>
        <div class='user-item'>
          <img src='@/../resource/images/icon_user-phone.png'/>
          <div class="item-name gray" v-if="!crewBasic.mobilePhone">
            暂无信息
          </div>
          <div v-if="crewBasic.mobilePhone">
            <phone-call :mobile="crewBasic.mobilePhone">
              {{crewBasic.mobilePhone}}
            </phone-call>
          </div>
        </div>
        <div class='user-item'>
          <img src='@/../resource/images/clock-min.png'/>
          <div class="item-name">
            本年度累计在船{{serveDay}}天
            <span v-show="serveDay != '--'">
              <img src="@/../resource/images/icon_info-min.png"/>
              <span class="serve-info" @click="showServeRes">
                详情
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="ms-layer" v-show="showWorkInfo">
      <div class="ms-layer-contain work-info">
        <div class="ms-layer-close" @click="hideServeRes">
          <img src="@/../resource/images/icon_close-min.png" class="ms-layer-close-img"/>
        </div>
        <div>
          <div class="work-title">本年在船信息</div>
          <p class="work-content">本年度累计在船<span>{{serveDay}}</span>天，结束剩{{resDays}}天</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import noImg from '@/../resource/images/icon_none_pic-min.png';
  import { api_getCrewInfo, api_getSeniority, api_getCrewKeyTrack } from '@/../resource/api/core'
  import PhoneCall from "../../ui/phone-call";

  export default {
    components: {PhoneCall},
    name: 'service-crew-basic',
    props: {
      idNo: String,
      encode: {
        type: Boolean,
        default: true
      },
      focusTracking:  {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        noImg: `this.src="${noImg}"`,
        crewBasic: {},
        serveDay: '--',
        resDays: '--',
        showWorkInfo: false,
        isKeyTrack: false
      }
    },
    watch: {
      idNo (value) {
        this.idNo = value;
        this.initCrew(value);
      }
    },
    mounted () {
      this.initCrew(this.idNo);
    },
    methods: {
      initCrew (idNo) {
        this.getCertBasicInfo(idNo);
        this.getServeDay(idNo);

        if(this.focusTracking) {
          this.getFocusTrackingInfo(idNo);
        }
      },
      getCertBasicInfo: function(idNo){
        let $this = this;
        this.$vux.loading.show({text: '请稍候'});

        api_getCrewInfo({guid: idNo}).then(function(response){
          $this.$vux.loading.hide();
          let data = response.data;
          if (data.success){
            $this.crewBasic = {
              crewIdNo: data.item.idNo,
              crewName: data.item.name,
              photoUrl: `${$util.crewPhoto}${idNo}`,
              mobilePhone: data.item.mobilePhone || '',
              officePhone: data.item.officePhone || '',
              parseIdNo: data.item.idNo
            }
          } else{
            $this.$vux.toast.text(data.message);
          }
        }).catch(function(error){
          $this.$vux.loading.hide();
        })
      },
      getServeDay (idNo) {
        let $this = this;
        this.$vux.loading.show({text: '请稍候'});

        api_getSeniority({guid: idNo, year: new Date().getFullYear()}).then(function(response){
          $this.$vux.loading.hide();
          let data = response.data;
          if (data.success){
            $this.serveDay = data.item;
          } else{
            $this.$vux.toast.text(data.message);
          }
        }).catch(function(error){
          $this.$vux.loading.hide();
        })
      },
      getFocusTrackingInfo (idNo) {
        this.$vux.loading.show({text: '请稍候'});

        api_getCrewKeyTrack({guid: idNo}).then(res => {
          let data = res.data;
          if ($util.OK(data.code)){
            this.isKeyTrack = (data.item.isKeyTrack == 1);
          } else{
            this.$vux.toast.text(data.msg);
          }
        }).catch((error) =>  {
          throw error
        }).finally(() => {
          this.$vux.loading.hide();
        })
      },
      preview (url){
        let urls = [url];

        console.log(urls);
        $util.previewImage({
          urls: urls,
          current: url
        })
      },
      showServeRes () {
        let now = new Date();
        let curYear = now.getFullYear();
        let nextYear = ++curYear;
        let endDate = `${nextYear}/01/01`;
        let resTime = new Date(endDate).getTime() - now.getTime();
        let resDays = parseInt(resTime / 1000 / 60 / 60 / 24);

        this.resDays = resDays;
        this.showWorkInfo = true;
      },
      hideServeRes () {
        this.showWorkInfo = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .crew-info{
    background-color: #fff;
    box-shadow: .1rem 0 .5rem rgba(133,136,141,.1);
  }
  /*船员基本信息*/
  .crew-info{
    padding-top: 1rem;
    margin-bottom: 1rem;
  }
  .crew-contain{
    display: flex;
    padding: 0 1.2rem;
  }
  .crew-contain .img-crew{
    background-color: #e9e9e9;
    width: 8rem;
    height: 10rem;
    margin-right: 1rem;
  }
  .crew-adv{
    flex: 1;
    padding: .5rem 0;
    position: relative;
  }
  .user-item {
    display: flex;
    margin-bottom: .3rem;
  }
  .user-item img {
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
  }
  .user-item .item-name {
    font-size: 1.6rem;
    color: #333;
    img{width: 1.4rem;height: 1.4rem;vertical-align: middle;margin-left: .6rem;margin-right: 0;}
    .serve-info{
      color: $mc;
      font-size: 1.2rem;
      vertical-align: middle;
      padding: 1rem 0;
    }
    .key-trc {
      border: 1px solid #FBAE17;
      color: #FBAE17;
      border-radius: 4px;
      font-weight: bold;
      padding: 2px 4px;
      font-size: 1.2rem;
      vertical-align: middle;
    }
  }
  .user-item .gray {
    color: #ccc;
  }
  .link-style{
    color: #2A4EDF;
    font-size: 1.6rem !important;
  }
  .work-title{
    font-size: 1.7rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .work-content{
    font-size: 1.2rem;
    text-align: center;
    span{color: $mc;font-weight: bold;}
  }
  .work-info{
    width: 26.3rem;
    padding: 2.6rem 2.2rem !important;
  }
</style>
