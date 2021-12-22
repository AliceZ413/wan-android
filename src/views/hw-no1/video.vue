<template>
	<div>
    <scroller
      id="ac-scroller"
      :loading="loading"
      :page="page"
      :totalPage="totalPage"
      @scroll-to-bottom="loadMore"
    >
      <div slot="content">
        <div class="banner-video">
          <div class="banner-video-img" v-show="activeLi == 1">
            <span class="ret-txt rec-left">{{shipInfo.photoTime || '--'}}</span>
            <img :onerror="onOutLine" :src="shipInfo.photoPath" class="banner-img" @click="previewBanner(shipInfo.photoPath)"/>
            <div class="sssp-btn">
              <x-button :mini="true" :link="`/live-video/index?shipNo=${shipInfo.shipNo}&shipCode=${shipCode}`">实时视频</x-button>
            </div>
          </div>
          <div class="ferry-video" v-show="activeLi != 1">
            <div v-if="accessDevice.videoStream == 0">
              <video
                id="video-100"
                v-if="userAgent && userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)"
                controls="controls"
                autoplay="autoplay"
                x-webkit-airplay="true"
                x5-video-player-fullscreen="true"
                preload="auto"
                playsinline="true"
                x5-playsinline
                webkit-playsinline
                x5-video-player-typ="h5"
                :src="videoUrl"
                style="width: 100%; height: 100%;"
              ></video>
              <video-player
                :url="videoUrl"
                :controls="true"
                :type="type"
                :autoplay="true"
                @notFound="reloadSource(accessDevice)"
                v-else/>
            </div>
            <div v-if="accessDevice.videoStream == 1">
              <img :onerror="onOutLine" :src="accessDevice.photoUrl" class="banner-img" @click="previewBanner(accessDevice.photoUrl)"/>
              <div class="sssp-btn">
                <x-button :mini="true" @click.native="toRealVideo">实时视频</x-button>
              </div>
            </div>
          </div>
        </div>
        <div class="dv-list" v-if="cameraList.length != 0">
          <div class="dv-list-content">
            <ul class="dv-list-ul">
              <li class="dv-list-li" :class="activeLi == 1 ? 'active' : ''" @click="getVideo(null, 1)">驾驶位</li>
              <li class="dv-list-li" v-for="(item, index) in cameraList" :class="activeLi == index + 2 ? 'active' : ''" :key="'dv-list-li_' + index" @click="getVideo(item, index + 2)">{{item.deviceName || '--'}}</li>
            </ul>
          </div>
        </div>

        <div class="jsc-content">
          <div class="module-title">
            <div>驾驶位情况</div>
            <!-- <router-link class="link-to" :to="`/live-video/index?shipNo=${shipInfo.shipNo}&shipCode=${shipCode}`">实时视频</router-link> -->
          </div>
          <div class="jsc-prop">
            <div>
              <label>船舶名称</label>
              <span v-if="!shipInfo.shipNo">{{ shipInfo.shipName || '--' }}</span>
              <span class="ship-name" v-if="shipInfo.shipNo && shipInfo.shipName" @click="accessShipFile(shipInfo)">
                  {{ shipInfo.shipName }}
                  <img class="r-arrow" src="@/assets/image/arrow-right.png"/>
              </span>
              <span v-if="shipInfo.shipNo && !shipInfo.shipName">--</span>
              <span v-if="shipInfo.showVoyageStatus" :class="['voyage-status', shipInfo.voyageStatusColor]">{{ shipInfo.voyageStatusText }}</span>
            </div>
            <div>
              <label>拍摄时间</label>
              <span>{{ shipInfo.photoTime || '--' }}</span>
            </div>
            <div>
              <label>驾驶状态</label>
              <span :class="['status', shipInfo.behaviorColor]">{{ shipInfo.driverBehaviorText || '--' }}</span>
            </div>
            <div>
              <label>今日里程</label>
              <span>{{ shipInfo.totalMeter >= 0 ? shipInfo.totalMeter : '--' }}/海里</span>
            </div>

            <div class="history-map" @click="toHistoryTrail">
              <img src="@/assets/image/icon-map.png" alt="历史轨迹"/>
            </div>
          </div>
        </div>

        <div class="jsc-content" v-if="shipInfo.driverWarning == 0">
          <div class="module-title">驾驶员</div>
          <div class="crew-info">
            <div class="crew-photo" v-if="crewRecRes.idx">
              <img :onerror="noCrewImg" :src="crewRecRes.crewPhoto" @click="preview(crewRecRes.crewPhoto)"/>
              <div class="ph-sub-txt">船员照</div>
            </div>
            <div class="crew-photo">
              <img  :onerror="onOutLinePhoto" :src="crewRecRes.shootPhoto" @click="preview(crewRecRes.shootPhoto)"/>
              <div class="ph-sub-txt">现场照</div>
            </div>
            <div class="crew-prop">
              <div>
                <label>姓名</label>
                <span class="crew-name" v-if="crewRecRes.idx" @click="accessCrewFile(crewRecRes.idx)">
                  {{ crewRecRes.crewName }}
                  <img class="r-arrow" src="@/assets/image/arrow-right.png"/>
                </span>
                <span v-else>未识别</span>
              </div>
              <div>
                <label>人脸核查</label>
                <span style="color: #35C45A;" v-if="crewRecRes.idx">通过</span>
                <span v-else>--</span>
              </div>
              <div>
                <label>证书检查</label>
                <span v-if="crewRecRes.idx" :class="crewRecRes.checkStatus == 1 ? '' : 'txt-alert'">{{crewRecRes.checkStatusText || '--'}}</span>
                <span v-else>--</span>
              </div>
              <div>
                <label>识别时间</label>
                <span>{{crewRecRes.recTime || '--'}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="jsc-content">
          <div class="module-title">
            <span>异常记录</span>
            <span class="module-title-tip">无人值守：{{ abnormalTotal.nobodyNum }} 次</span>
            <span :class="['module-title-tip']">
              {{ specialList.indexOf(shipCode) == -1 ? '疲劳驾驶：' : '未正视前方：' }}{{ abnormalTotal.tiredNum }} 次
            </span>
            <router-link class="link-to" :to="'/device/video/history-pic?shipId=' + shipInfo.shipId + '&shipCode=' + shipCode">历史照片</router-link>
          </div>
          <div class="yc-container">
            <div class="yc-time-group">
              <div class="yc-time-item" v-for="item in timeRadioGroup" :key="'time_radio_' + item.id" @click="clickTimeRadio(item.id)">
                <icon v-show="item.id == timeRadioIndex" class="icon-selected" type="success"></icon>
                <icon v-show="item.id != timeRadioIndex" class="icon-not-selected" type="circle"></icon>
                <span class="label">{{ item.label }}</span>
              </div>
            </div>
            <!-- 自定义时间选择 -->
            <div :class="['yc-time-zdy', timeRadioIndex == 3 ? 'active' : '']">
              <div class="start-time" @click="handleShowStartPicker">{{ startTime }}</div>
              <div class="divice"></div>
              <div class="end-time" @click="handleShowEndPicker">{{ endTime }}</div>
            </div>
            <ul class="yc-list">
              <li :key="'behavior_' + index" @click="showYcLayer(item)" v-for="(item, index) in actionList" :class="item.read ? 'clr-gray' : ''">
                {{item.behavior || '--'}}
                <div>
                  {{ item.date }}
                  <img src="@/../resource/images/icon_right-min.png" class="r-arrow"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </scroller>

  <!-- showLayer -->
		<div class="layer-model" v-show="showLayer">
			<div class="layer-bg"></div>
			<div class="layer-content">
				<header>
          {{ actionDetail.date }}
					<div class="txt-alert">{{actionDetail.behavior}}</div>
				</header>
				<img v-if="actionDetail.path" :src="actionDetail.path" @click="previewAction(actionDetail.path)" @error="handleImgError"/>
        <l-map v-if="actionDetail.line" class="layer-map" :options="{ attributionControl: false }" :zoom="zoom" :center="actionDetail.center">
          <l-tile-layer :url="tileUrl" :attribution="''"></l-tile-layer>
          <l-rotated-marker v-for="(line, index) in actionDetail.line" :key="'line_' + index" :lat-lng="[line.latitude, line.longitude]" :icon="line.icon" :rotationAngle="line.course"></l-rotated-marker>
        </l-map>
        <div v-else class="layer-map-error">
          {{ lineErrMsg }}
        </div>
				<div class="btn-group">
					<button @click="hideYcLayer">返回</button>
				</div>
			</div>
		</div>
    
	</div>
</template>

<script>
  import noImg from '@/../resource/images/icon_none_pic-min.png';
  import outLinePhoto from '@/assets/image/pic-dislink.png';
  import outLineImg from '@/assets/image/dislink.png';
  import { api_getCaptainShipByShipCode, api_getNowStreamByStreamId, api_getCaptainListByShipCodeV2, api_getTrail } from '@/api/hw'
  import {api_getEquidInfo} from '@/api/checkin'
  import scroller from '@/../components/ui/scroller'
  import videoPlayer from '@/components/videoPlayer';
  import { Tab, TabItem, XImg, Icon, InlineCalendar, XButton } from 'vux';
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LIcon, LCircleMarker, LPolyline } from 'vue2-leaflet';
  import LRotatedMarker from 'vue2-leaflet-rotatedmarker';
  import dayjs from 'dayjs';
  import DateUtil from '../../../resource/js/dateUtil.js';
  import { specialList } from '@/config/specialList.js';
  // 开启console
  // import VConsole from 'vconsole';
  // let vConsole = new VConsole();
  export default {
    name: 'hw-no1-video',
    components: { 
      scroller,
      videoPlayer,
      Tab,
      TabItem,
      XImg,
      XButton,
      Icon,
      InlineCalendar,
      LMap,
      LTileLayer,
      LMarker,
      LIcon,
      LRotatedMarker,
      LCircleMarker,
      LPolyline,
    },
		data () {
    	return {
        noCrewImg: `this.src="${noImg}"`,
        onOutLine: `this.src="${outLineImg}"`,
        onOutLinePhoto: `this.src="${outLinePhoto}"`,
        userAgent: navigator.userAgent,
        shipCode: '',
        deviceId: '',
        shipInfo: {},
				showLayer: false,
        loading: false,
        page: 1,
        totalPage: 0,
        loadingCount: 0,
        actionList: [],
        actionDetail: {},
        crewRecRes: {},
        //证书核查状态字典
        cStatus: {
          '0': '无适任证书',
          '1': '适任证书正常',
          '2': '适任证书过期',
          '3': '适任证书不适岗',
          '4': '设备未绑定',
          '5': '未查到船舶信息',
          '6': '人员未识别',
          '7': '非船员角色'
        },
        videoUrl: '',
        type: 'm3u8',
        cameraList: [],
        accessDevice: {},//当前正在访问的设备
        activeLi: 1,
        getBarWidth: function(index) {
          return 4 + 'rem';
        },
        tabIndex: 0,
        zoom: 10,
        center: [22.9382, 113.3799],
        line: [
          [22.9382, 113.3763],
          [22.9383, 113.3775],
          [22.9383, 113.3775],
          [22.9372, 113.3817],
        ],
        lineErrMsg: '',
        markerLatLng: [22.9382, 113.3799],
        markerIcon: L.icon({
          iconUrl: require("@/assets/image/ship-miss.png"),
          iconSize: [25, 25],
        }),
        startIcon: L.icon({
          iconUrl: require("@/assets/image/icon-start.png"),
          iconSize: [30, 35],
          iconAnchor: [15, 37],
        }),
        endIcon: L.icon({
          iconUrl: require("@/assets/image/icon-end.png"),
          iconSize: [30, 35],
          iconAnchor: [15, 37],
        }),
        tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // tileUrl: 'http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0',
        timeRadioIndex: 0,
        timeRadioGroup: [
          {
            id: 0,
            label: '本日',
          },
          {
            id: 1,
            label: '本周',
          },
          {
            id: 2,
            label: '本月'
          },
          {
            id: 3,
            label: '自定义'
          },
        ],
        timePickerShow: false,
        timePickerValue: '',
        startTime: new dayjs().format('YYYY-MM-DD'),
        endTime: new dayjs().format('YYYY-MM-DD'),
        abnormalTotal: {},
        msaWebappLink: '',
        specialList, // 特殊的船舶Code列表
			}
		},
    created () {
      this.shipCode = this.$route.query.shipCode;
      this.deviceId = this.$route.query.dId;

      console.log(this.specialList.indexOf(this.shipCode));
    },
		mounted () {
      


      this.getActionList(1);
      this.getCaptainShipByShipCode();
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
      handleClick(index) {
        // console.log(index);
        this.activeLi = index + 1;
        if (this.activeLi == 1) return false;
        // console.log(this.cameraList[index - 1]);
        this.accessDevice = this.cameraList[index - 1];

        if (this.cameraList[index - 1].videoStream ==0) {
          this.getVideoSteam(this.cameraList[index - 1])
        }
      },
      getActionList (page) {
        this.loading = true;
        this.beforeReq();
        api_getCaptainListByShipCodeV2({
          shipCode: this.shipCode,
          size: 15,
          page: page,
          start: this.startTime + ' 00:00:00',
          end: this.endTime + ' 23:59:59'
        }).then(res => {
          let data = res.data;
          let item = data.item;
          let pagination = item.pagination;
          let total = item.total;
          let visitedAction = $storage.get('visited-action') || [];

          pagination.list = pagination.list.map(behavior => {
            behavior.read = (visitedAction.indexOf(behavior.time) >= 0);
            if (behavior.nextTime) {
              // 如果是范围时间
              let start = new Date(behavior.time).format('yyyy-MM-dd hh:mm:ss');
              let end = new Date(behavior.nextTime).format('hh:mm:ss');
              behavior.date = `${start} 至 ${end}`;
            } else {
              behavior.date = new Date(behavior.time).format('yyyy-MM-dd hh:mm:ss');
            }
            return behavior;
          });

          if($util.OK(data.code)) {
            if(page == 1) {
              this.actionList = pagination.list || [];
            } else {
              this.actionList = this.actionList.concat(pagination.list)
            }
            this.page = page;
            this.totalPage = pagination.totalPage;
            this.abnormalTotal = total;
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.loading = false;
          this.afterRes();
        });
      },
      getCaptainShipByShipCode (callback) {
        //获取设备列表和识别信息
        // this.$vux.loading.show();
        this.beforeReq();

        api_getCaptainShipByShipCode({shipCode: this.shipCode}).then(res => {
          let data = res.data;

          this.shipInfo = data.item;
          document.title = this.shipInfo.shipName ? this.shipInfo.shipName : '海王一号';
          this.cameraList = data.item.cameraList || [];

          // if (this.shipInfo.shipNo == 'a') {
          //   this.shipInfo.shipNo = null;
          // }

          // 航行状态
          if (this.shipInfo.voyageStatus == 0) {
            // 航行
            this.shipInfo.voyageStatusColor = 'green';
            this.shipInfo.showVoyageStatus = true;
            this.shipInfo.voyageStatusText = '航行中';
          } else if (this.shipInfo.voyageStatus == 1) {
            // 停航
            this.shipInfo.voyageStatusColor = 'purple';
            this.shipInfo.showVoyageStatus = true;
            this.shipInfo.voyageStatusText = '静止';
          } else if (this.shipInfo.voyageStatus == 2) {
            // 设备断电或网络不佳
            this.shipInfo.voyageStatusColor = 'gray';
            this.shipInfo.showVoyageStatus = true;
            this.shipInfo.voyageStatusText = '定位离线';
          } else {
            this.shipInfo.showVoyageStatus = false;
            this.shipInfo.voyageStatusText = '--';
          }

          // 驾驶状态
          if (this.shipInfo.driverBehavior == 2) {
            // 设备离线
            this.shipInfo.behaviorColor = 'red';
            this.shipInfo.driverBehaviorText = '设备离线或网络不佳';
          } else if (this.shipInfo.driverBehavior == 1) {
            // 驾驶员异常
            this.shipInfo.behaviorColor = 'red';
            this.shipInfo.driverBehaviorText = this.shipInfo.behavior;
          } else if (this.shipInfo.driverBehavior == 0) {
            // 正常
            this.shipInfo.behaviorColor = 'green';
            this.shipInfo.driverBehaviorText = this.shipInfo.behavior;
          } else {
            this.shipInfo.driverBehaviorText = '--';
          }

          let access_token = $util.getUserInfo().access_token;
          this.msaWebappLink = `${$util.SERVER}/msa-webapp/?t=${new Date().getTime()}#/ship-attr/index/${this.shipInfo.shipNo}?shipId=${this.shipInfo.shipNo}&access_token=${access_token}`;

        }).catch(err => {
          throw err;
        }).finally(() => {
          this.afterRes();
          // this.$vux.loading.hide();
          this.getEquidInfo();
        });
      },
      accessShipFile (ship) {
        let access_token = $util.getUserInfo().access_token;
        if (!ship.shipNo) {
          return;
        }
        location.href = `${$util.SERVER}/msa-webapp/?t=${new Date().getTime()}#/ship-attr/index/${ship.shipNo}?shipId=${ship.shipNo}&access_token=${access_token}`;
      },
      reloadSource (device) {
        // console.log('重新获取视频推流。。。');
        this.getVideoSteam(device, false);
      },
      getVideo (item, index) {
        this.activeLi = index;
        //第一个展示驾驶舱照片不用加载视频
        if(index == 1) return false;
        //正在访问的节点
        this.accessDevice = item;

        //videoStream 0-支持（优先调用获取视频链接接口-获取视频），1-不支持（优先展示photoUrl的图片）
        if(item.videoStream == 0) {
          this.getVideoSteam(item);
        }
      },
      getVideoSteam (item, loading = true) {
        //根据视频流ID获取视频
        loading && this.$vux.loading.show('请稍候');

        api_getNowStreamByStreamId({streamId: item.streamId, deviceId: item.deviceId}).then(res => {
          let data = res.data;
          if($util.OK(data.code)) {
            this.videoUrl = data.item.url;
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          loading && this.$vux.loading.hide();
        })
      },
      getEquidInfo () {
        if (this.shipInfo.driverWarning != 0) {
          return;
        }
        /**
         * 查询船员识别信息
         * */
        // this.$vux.loading.show();
        this.beforeReq();
        api_getEquidInfo({equipId: this.deviceId}).then(res => {
          let data = res.data;

          if($util.OK(data.code)) {
            let crewRecRes = data.item[0];
            crewRecRes.recTime = new Date(crewRecRes.createdAt).format('yyyy-MMM-dd hh:mm:ss');
            crewRecRes.crewPhoto = $util.accessPhoto(`${$util.crewPhoto}${crewRecRes.idx}`);
            // crewRecRes.shootPhoto = $util.accessPhoto(`https://wx.gd.msa.gov.cn/msa-checkin/file/get?guid=${crewRecRes.faceGuid}`);
            crewRecRes.shootPhoto = $util.accessPhoto(`${$util.staticAccess}${crewRecRes.faceGuid}`);
            crewRecRes.checkStatusText = this.cStatus[crewRecRes.checkStatus];
            this.crewRecRes = crewRecRes;
          } else {
            this.$vux.toast.text(data.msg);
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.afterRes();
          // this.$vux.loading.hide();
        });
      },
      accessCrewFile (idx) {
        let access_token = $util.getUserInfo().access_token;
        location.href = `${$util.SERVER}/msa-webapp/?_t=${new Date().getTime()}#/search/crewDetail?guid=${idx}&access_token=${access_token}`;
      },
      loadMore () {
        this.page = this.page + 1;
        if (this.page <= this.totalPage) {
          this.getActionList(this.page);
        }
      },
			showYcLayer (item) {
        this.beforeReq();
        let start = item.time ? new dayjs(item.time).format('YYYY-MM-DD HH:mm:ss') : '';
        let end = item.nextTime ? new dayjs(item.nextTime).format('YYYY-MM-DD HH:mm:ss') : '';
        let line = null;
        let bounds = null;
        let polyline = null;
        let polylineArr = [];
        api_getTrail({
          shipId: this.shipInfo.shipId,
          start: start,
          end: '',
        }).then(res => {
          let data = res.data;
          let { code, item, msg } = data;
          if ($util.OK(code)) {
            item.forEach((line) => {
              line.longitude = parseFloat(line.longitude);
              line.latitude = parseFloat(line.latitude);
              line.course = parseInt(line.course);
              polylineArr.push([line.latitude, line.longitude]);
            });
            polyline = L.polyline(polylineArr, { color: 'red' });
            bounds = polyline.getBounds();
            line = item;
          } else {
            this.lineErrMsg = msg;
          }
        }).catch(err => {
          throw err;
        }).finally(() => {
          this.afterRes();
          this.showLayer = true;
				  this.actionDetail = item;
          this.actionDetail.bounds = bounds;
          if (line.length > 1) {
            // 如果line大于1
            line[0].icon = this.startIcon;
            line[0].course = 0;
            line[line.length - 1].icon = this.endIcon;
            line[line.length - 1].course = 0;
            this.actionDetail.polyline = polylineArr;
          } else {
            line[0].icon = this.markerIcon;
          }
          this.actionDetail.line = line;
          this.actionDetail.center = [parseFloat(line[0].latitude), parseFloat(line[0].longitude)];
				  item.read = true;
				  let visitedAction = $storage.get('visited-action') || [];

				  if(visitedAction.indexOf(item.time) < 0) {
				    //已经查看过的不再记入已查看列表
            visitedAction.push(item.time);
            $storage.set('visited-action', visitedAction);
          }
        });
			},
			hideYcLayer () {
				this.showLayer = false;
				this.actionDetail = {};
			},
      getTrail(item) {
        this.beforeReq();
        api_getTrail({
          shipCode: this.shipCode,
          start: '',
          end: '',
        }).then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          this.afterRes();
        });
      },
      preview (url) {
        //不支持base64图片预览
        if(url.indexOf('base64') >= 0) return;
        //预览船员照
        let crewRes = this.crewRecRes;
        $util.previewImage({
          urls: [crewRes.crewPhoto, crewRes.shootPhoto],
          current: url
        })
      },
      previewAction (url) {
        $util.previewImage({
          urls: [url],
          current: url
        })
      },
      previewBanner (url) {
        //不支持base64图片预览
        if(url.indexOf('base64') >= 0) return;
        //首图预览，包含了优先加载图片的监控的图片预览
        let urls = [];
        if(!url) return;
        if(this.shipInfo.photoPath) {
          urls.push(this.shipInfo.photoPath);
        }
        this.cameraList.forEach(item => {
          if(item.videoStream == 1) {
            urls.push(item.photoUrl);
          }
        })

        $util.previewImage({
          urls,
          current: url
        })
      },
      // 图片加载错误
      handleImgError(e) {
        
      },
      // 点击时间radio组件
      clickTimeRadio(id) {
        this.timeRadioIndex = id;
        if (id == 0) {
                // 本日
                this.startTime = new dayjs().format('YYYY-MM-DD');
                this.endTime = new dayjs().format('YYYY-MM-DD');
            } else if (id == 1) {
                // 本周
                // console.log(DateUtil.DateUtil);
                this.startTime = DateUtil.DateUtil.getStartDayOfWeek();
                this.endTime = DateUtil.DateUtil.getEndDayOfWeek();
            } else if (id == 2) {
                // 本月
                this.startTime = DateUtil.DateUtil.getStartDayOfMonth();
                this.endTime = DateUtil.DateUtil.getEndDayOfMonth();
            } else if (id == 3) {
                
            }
        this.getActionList(1);
      },
      // 选择开始时间
      handleShowStartPicker() {
        let _this = this;
        _this.$vux.datetime.show({
          value: _this.startTime,
          cancelText: '取消',
          confirmText: '确定',
          onConfirm(value) {
            let startTime = new dayjs(value).valueOf(),
              endTime = new dayjs(_this.endTime).valueOf();
            if (startTime > endTime) {
              _this.$vux.toast.show({
                text: '开始时间不能大于结束时间',
                width: '22rem',
                time: 1500,
                type: 'text',
                isShowMark: false,
                position: 'middle',
              });
              return;
            }
            _this.startTime = value;
            _this.getActionList(1);
          }
        });
      },
      // 选择结束时间
      handleShowEndPicker() {
        let _this = this;
        _this.$vux.datetime.show({
          value: _this.endTime,
          cancelText: '取消',
          confirmText: '确定',
          onConfirm(value) {
            let startTime = new dayjs(_this.startTime).valueOf(),
              endTime = new dayjs(value).valueOf();
            if (startTime > endTime) {
              _this.$vux.toast.show({
                text: '开始时间不能大于结束时间',
                time: 1500,
                width: '22rem',
                type: 'text',
                isShowMark: false,
                position: 'middle',
              });
              return;
            }
            _this.endTime = value;
            _this.getActionList(1);
          }
        });
      },
      // 跳转到历史轨迹页面
      toHistoryTrail() {
        this.$router.push({
          path: '/device/video/history-trail',
          query: {
            shipId: this.shipInfo.shipId
          }
        });
      },
      // 跳转到实时视频
      toRealVideo() {
        let activeIndex = this.activeLi - 2;
        let { deviceId, streamId } = this.cameraList[activeIndex];
        this.$router.push({
          path: '/live-video/index',
          query: {
            deviceId,
            streamId,
            activeIndex: this.activeLi
          }
        });
      },
		},
  }
</script>

<style scoped lang="scss">
  .dv-list-ul-o {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
    li {
      flex: 1;
      color: #fff;
      text-align: center;
      line-height: 3rem;
      &.active {
        background-color: #006fff;
        color: #fff;
        text-align: center;
      }
    }
  }
  .banner-img {
    height: 20.3rem;
    display: block;
    width: 100%;
  }
	.banner-video {
    position: relative;
    // height: 23.3rem;
    .banner-video-img {
      .ret-txt {
        position: absolute;
        background-color: rgba(0,0,0,.5);
        color: #fff;
        font-size: 1.2rem;
        padding: 0.4rem 1rem;
        top: 1rem;
        border-radius: .4rem;
        &.abnormal {
          background-color: #ee514e;
        }
        &.normal {
          background-color: #3fc86c;
        }
      }
      .rec-left {left: 1rem;}
      .rec-right {right: 1rem;}
      .sssp-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        z-index: 1;
        color: #fff;
      }
    }
    .ferry-video {
      position: relative;
      .sssp-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        z-index: 1;
        color: #fff;
      }
    }
	}
  .dv-list {
    display: flex;
    width: 100%;
    height: 6.5rem;
    // line-height: 6.5rem;
    background-color: #f5f5f5;
    box-sizing: border-box;
    padding: 1rem;
    .dv-list-content {
      width: 100%;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 .4rem 1rem 0.2rem rgba(179, 179, 179, .2);
      background-color: #fff;
      overflow-x: auto;
      .vux-tab-wrap {
        width: 100%;
      }
    }
    .dv-list-ul {
      // width: 100%;
      // height: 100%;
      height: 4.5rem;
      background-color: #fff;
      border-radius: .8rem;
      display: inline-flex;
      flex-wrap: nowrap;
      justify-content: center;
      // overflow-x: auto;
      li {
        // flex: 1;
        color: #666;
        text-align: center;
        // line-height: 3rem;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        box-sizing: border-box;
        position: relative;
        padding: 0 2rem;
        height: 4.5rem;
        line-height: 4.5rem;
        white-space: nowrap;
        
        &.active {
          color: #324DD7;
          text-align: center;
          &::before {
            content: "";
            width: 70%;
            height: .3rem;
            border-radius: .15rem;
            // margin: auto;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: #324DD7;
          }
        }
      }
    }
  }
	.jsc-content {
    position: relative;
		.module-title {
			font-size: 1.2rem;
			line-height: 3.2rem;
			padding: 0 1.2rem;
			color: #999;
      background-color: #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .module-title-tip {
        color: #333;
        margin-left: 1.7rem;
      }
		}
    .link-to {
      color: #1c76ff;
      font-size: 1.4rem;
      float: right;
    }
		.jsc-prop {
			font-size: 1.4rem;
			background-color: #fff;
			white-space: nowrap;
			padding: 1.2rem;
      position: relative;
			>div {
				margin-bottom: 0.4rem;
				&:last-child {
					margin-bottom: 0;
				}
        .voyage-status {
          display: inline-block;
          padding: 0 0.5rem;
          height: 2rem;
          line-height: 2rem;
          border-radius: .4rem;
          text-align: center;
          color: #fff;
          margin-left: .5rem;
          &.green {
            background-color: #35C45A;
          }
          &.purple {
            background-color: #8A4EEE;
          }
          &.blue {
            background-color: #324DD7;
          }
          &.red {
            background-color: #EE514E;
          }
          &.gray {
            background-color: #999999;
          }
        }
        .status {
          &.green {
            color: #35C45A;
          }
          &.red {
            color: #EE514E;
          }
          &.purple {
            color: #8A4EEE;
          }
          &.gray {
            color: #999999;
          }
        }
			}
			label {
				color: #999;
				// width: 10rem;
				display: inline-block;
        margin-right: 1.7rem;
			}
      .ship-name {
        display: inline-flex;
        align-items: center;
        color: #006FFF;
      }
      .history-map {
        width: 4rem;
        height: 4rem;
        position: absolute;
        right: 3rem;
        top: 50%;
        transform: translateY(-50%);
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
		}
	}

	.crew-info {
		background-color: #fff;
		display: flex;
		padding: 1rem 1.2rem;
		.crew-photo {
			position: relative;
			width: 6rem;
			height: 8.4rem;
			margin-right: 1rem;
			img {
				display: block;
				width: 6rem;
				height: 8.4rem;
			}
			.ph-sub-txt {
				position: absolute;
				bottom: 0;
				text-align: center;
				color: #fff;
				background-color: rgba(0,0,0,.5);
				left:  0;
				right: 0;
				font-size: 1.2rem;
			}

		}
		.crew-prop {
			flex: 1;
			display: flex;
			flex-direction: column;
			>div {
				flex: 1;
				white-space: nowrap;
				overflow-x: scroll;
				>label {
					display: inline-block;
					width: 7rem;
					color: #999;
				}
				.crew-name {
					color: #006FFF;
				}
			}
		}
	}
	.yc-container {
    .yc-time-group {
      display: flex;
      align-items: center;
      width: 100%;
      height: 5rem;
      background-color: #fff;
      box-sizing: border-box;
      border-bottom: 1px solid #f5f5f5;
      padding-left: 1.2rem;
      .yc-time-item {
        display: flex;
        align-items: center;
        height: 3rem;
        line-height: 3rem;
        margin-right: 1.5rem;
        .icon-selected, .icon-not-selected {
          font-size: 1.6rem;
        }
        .icon-selected {
          color: #0076ff;
        }
        .label {
          margin-left: 0.1rem;
          font-size: 1.4rem;
        }
      }
    }
    .yc-time-zdy {
      width: 100%;
      height: 0;
      line-height: 5rem;
      box-sizing: border-box;
      padding-left: 1.2rem;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      overflow: hidden;
      transition: height .25s;
      &.active {
        height: 5rem;
      }
      .start-time , .end-time {
        width: 9rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        border: 1px solid #bbbbbb;
        box-sizing: border-box;
      }
      .divice {
        width: 1.8rem;
        height: .2rem;
        margin: 0 1rem;
        background-color: #bbb;
      }
    }
		.yc-list {
			background-color: #fff;
			padding: 0 1.2rem;
			li {
				padding: 1rem 0;
				border-bottom: 1px solid #f5f5f5;
				div {
					color: #999;
					float: right;
				}
			}
		}
	}
	.r-arrow {
		width: 1.2rem;
		height: 1.2rem;
		vertical-align: middle;
	}
	.txt-alert {
		color: #E93B3B;
	}
	.layer-model {
		.layer-bg {
			position: fixed;
			z-index: 100;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			background-color: rgba(0,0,0,.3);
		}
		.layer-content {
			border-radius: 0.8rem;
			position: absolute;
			top: 50%;
			left: 50%;
			// width: 90%;
			width: 34.8rem;
			transform: translateX(-50%) translateY(-50%);
			z-index: 103;
			background-color: #fff;
			header {
				padding: 1.4rem 1.2rem;
				>div {
					float: right;
				}
			}
			img {
				display: block;
				width: 100%;
        height: 19rem;
			}
      .layer-map, .layer-map-error {
        width: 100%;
        height: 22rem;
      }
      .layer-map-error {
        color: #969799;
        font-size: 1.5rem;
        line-height: 22rem;
        text-align: center;
        background-color: #fbf9fe;
      }
			.btn-group {
				text-align: center;
				padding: 1rem 0;
				button {
					background-color: #eee;
					color: #333333;
					line-height: 3.4rem;
					border: none;
					width: 10rem;
				}
			}
		}
	}
  .clr-gray {
    color: #999;
  }

</style>
