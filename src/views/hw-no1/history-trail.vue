<template>
    <div class="trail-page">
        <!-- 筛选框 -->
        <div :class="['top-bar', activeIndex == 3 ? 'extend' : '']">
            <div class="radio-groups">
                <div class="radio-button" v-for="item in radio" :key="'radio_' + item.id" @click="handleRadioSelect(item.id)">
                    <div class="radio_not-select" v-show="!item.selected"></div>
                    <div class="radio_selected" v-show="item.selected"></div>
                    <div class="radio_label">{{ item.label }}</div>
                </div>
            </div>
            <div class="radio-extend">
                <div class="start-time" @click="handleShowStartPicker">{{ startTime }}</div>
                <div class="divice"></div>
                <div class="end-time" @click="handleShowEndPicker">{{ endTime }}</div>
                <div class="search" @click="handleSearch">查询</div>
            </div>
        </div>
        <!-- 地图 -->
        <div :class="['map', activeIndex == 3 ? 'extend' : '']">
            <l-map class="layer-map" :options="{ attributionControl: false }" :zoom="zoom" :center="center" @update:zoom="handleMapZoom">
                <l-tile-layer :url="tileUrl" :attribution="''"></l-tile-layer>
                <l-polyline :lat-lngs="polyline.polylineList" :color="polyline.color" :weight="polyline.weight"></l-polyline>
                <template v-for="(circle, index) in polyline.latlngs">
                    <l-circle-marker :key="'circle_' + index" v-if="!circle.last && showCircle" :lat-lng="circle.latlng" :radius="polyline.circleRadius" :color="polyline.color" :weight="polyline.circleWeight" :fill="polyline.fill" :fillColor="polyline.fillColor" :fillOpacity="polyline.fillOpacity">
                        <l-popup v-if="circle.hasPic" :options="popupOptions" @ready="readyPopup">
                            <div class="popup-content">
                                <div class="top">
                                    <span>{{ circle.time || '--' }}</span>
                                    <span :class="['behavior', (circle.behavior == '正常' || circle.behavior == '静止') ? 'green' : 'red']">{{ circle.behavior || '--' }}</span>
                                </div>
                                <img class="history-pic" :src="circle.pic" alt="" @click="openPicModal(circle)"/>
                            </div>
                        </l-popup>
                    </l-circle-marker>
                </template>
                <l-rotated-marker :lat-lng="marker.latlng" :icon="markerIcon" :rotationAngle="marker.course" :zIndexOffset="1001">
                    <l-popup v-if="marker.hasPic" :options="popupOptions" @ready="readyPopup">
                        <div class="popup-content">
                            <div class="top">
                                <span>{{ marker.time || '--' }}</span>
                                <span :class="['behavior', (marker.behavior == '正常' || marker.behavior == '静止') ? 'green' : 'red']">{{ marker.behavior || '--' }}</span>
                            </div>
                            <img class="history-pic" :src="marker.pic" alt="" @click="openPicModal(marker)"/>
                        </div>
                    </l-popup>
                </l-rotated-marker>
                <!-- <l-polyline-decorator :paths="[polyline.latlngs]" :patterns="polyline.patterns"></l-polyline-decorator> -->
            </l-map>
        </div>
        <!-- 图片弹窗 -->
        <transition name="fade">
            <div class="pic-modal" v-show="showPicModal">
                <div class="modal-bg"></div>
                <div class="modal-content">
                    <div class="top">
                        <span v-if="currentPic.time">{{ currentPic.time }}</span>
                        <span v-if="currentPic.behavior" :class="['behavior', (currentPic.behavior == '正常' || currentPic.behavior == '静止') ? 'green' : 'red']">{{ currentPic.behavior }}</span>
                    </div>
                    <div class="bottom">
                        <!-- <swiper v-model="photoIndex" :show-dots="false" class="swiper" :aspect-ratio="9/16">
                            <swiper-item v-for="pic in photoList" :key="'pic_'+pic.id">
                                <img style="width: 100%;" :src="pic.shipPhoto[0]" alt="" />
                            </swiper-item>
                        </swiper> -->
                        <img :src="currentPic.pic" alt="" @click="previewBanner(currentPic.pic)">
                        <div class="left-arrow" @click="handleChangePic('left')">
                            <img src="@/assets/image/icon-left-arrow.png" alt=""/>
                        </div>
                        <div class="right-arrow" @click="handleChangePic('right')">
                            <img src="@/assets/image/icon-right-arrow.png" alt=""/>
                        </div>
                    </div>
                    <div class="icon-close" @click="closePicModal"></div>
                </div>
            </div>
        </transition>
        
    </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LPolyline, LCircleMarker, LPopup, LMarker } from 'vue2-leaflet';
import LPolylineDecorator from 'vue2-leaflet-polylinedecorator';
import LRotatedMarker from 'vue2-leaflet-rotatedmarker';
import dayjs from 'dayjs';
import { api_getHistoryGpsMessage } from '@/api/hw.js';
import DateUtil from '../../../resource/js/dateUtil.js';
import { Swiper, SwiperItem } from 'vux';
export default {
    components: {
        LMap,
        LTileLayer,
        LPolyline,
        LPolylineDecorator,
        LCircleMarker,
        LPopup,
        LMarker,
        LRotatedMarker,
        Swiper,
        SwiperItem,
    },
    filters: {
        dayFormat(val) {
            return new dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    data () {
        return {
            query: {},
            activeIndex: 0,
            radio: [
                {
                    id: 0,
                    label: '本日',
                    selected: true,
                },
                {
                    id: 1,
                    label: '本周',
                    selected: false,
                },
                {
                    id: 2,
                    label: '本月',
                    selected: false,
                },
                {
                    id: 3,
                    label: '自定义',
                    selected: false,
                }
            ],
            startTime: new dayjs().format('YYYY-MM-DD'),
            endTime: new dayjs().format('YYYY-MM-DD'),
            zoom: 16,
            center: [39.9, 116.4],
            showCircle: true,
            polyline: {
                polylineList: [],
                latlngs: [],
                color: '#3644ec',
                weight: 4,
                circleRadius: 6,
                circleWeight: 3,
                fill: true,
                fillColor: '#ffffff',
                fillOpacity: 1
            },
            // tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileUrl: 'http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type=vector&style=0',
            
            popupOptions: {
                closeButton: false,
                offset: L.point(0, 7),
                className: 'custom-popup',
            },
            loadingCount: 0,
            coordinate: [],
            marker: {
                latlng: [0, 0],
                course: 0,
                time: '',
                behavior: '',
                pic: '',
                picId: '',
                hasPic: false,
            },
            markerIcon: L.icon({
                iconUrl: require("@/assets/image/ship-normal-selected.png"),
                iconSize: [25, 25],
            }),
            showPicModal: false,
            photoList: [],
            photoIndex: 0,
            currentPic: {},
        }
    },
    watch: {
        activeIndex: {
            handler(val) {
                this.radio.forEach(item => {
                    if (item.id == val) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                })
            }
        },
        photoIndex: {
            handler(val) {
                if (val) {
                    if (this.polyline.latlngs[val]) {
                        let item = this.polyline.latlngs[val];
                        this.currentPic = {
                            pic: item.pic[0],
                            behavior: item.behavior,
                            picId: item.picId,
                            time: new dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
                        };
                    }
                    
                }
            }
        }
    },
    created() {
        this.query = this.$route.query;
        this.getHistoryGpsMessage();
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
        handleSearch() {
            let start = new dayjs(this.startTime);
            let end = new dayjs(this.endTime);
            if (end.diff(start, 'day') > 90) {
                this.$vux.toast.show({
                    type: 'text',
                    text: '查询时间不能超过90天',
                    duration: 1500,
                    position: 'middle',
                    width: '20rem'
                });
                return false;
            }
            this.getHistoryGpsMessage();
        },
        handleRadioSelect(id) {
            if (this.radio[id]) {
                this.activeIndex = id;
            }
            if (id == 0) {
                // 本日
                this.startTime = new dayjs().format('YYYY-MM-DD');
                this.endTime = new dayjs().format('YYYY-MM-DD');
            } else if (id == 1) {
                // 本周
                this.startTime = DateUtil.DateUtil.getStartDayOfWeek();
                this.endTime = DateUtil.DateUtil.getEndDayOfWeek();
            } else if (id == 2) {
                // 本月
                this.startTime = DateUtil.DateUtil.getStartDayOfMonth();
                this.endTime = DateUtil.DateUtil.getEndDayOfMonth();
            } else if (id == 3) {
                return;
            }
            this.getHistoryGpsMessage();
        },
        // 选择开始时间
        handleShowStartPicker() {
            let _this = this;
            _this.$vux.datetime.show({
                value: _this.startTime,
                format: 'YYYY-MM-DD',
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
                }
            });
        },
        // 选择结束时间
        handleShowEndPicker() {
            let _this = this;
            _this.$vux.datetime.show({
                value: _this.endTime,
                format: 'YYYY-MM-DD',
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
                }
            });
        },
        // 获取船舶历史轨迹
        getHistoryGpsMessage() {
            this.beforeReq();
            api_getHistoryGpsMessage({
                shipId: this.query.shipId,
                start: this.startTime + ' 00:00:00',
                end: this.endTime + ' 23:59:59'
            }).then(res => {
                let { code, item, msg } = res.data;
                if ($util.OK(code)) {
                    let { coordinate, photo } = item;
                    let photoList = [];
                    if (coordinate.length > 0) {
                        let polylineList = [];
                        // coordinate = coordinate.filter((item) => {
                        //     return item.photo;
                        // });
                        this.polyline.latlngs = coordinate.map((item, index) => {
                            let obj = {};
                            // if (item.photo) {
                                obj.hasPic = false;
                                let latitude = parseFloat(item.latitude),
                                    longitude = parseFloat(item.longitude);
                                let location = $util.wgs84togcj02(longitude, latitude);
                                obj = {
                                    latlng: [location[1], location[0]],
                                }
                                polylineList.push([location[1], location[0]]);
                                if (index == coordinate.length - 1) {
                                    this.center = [location[1], location[0]];
                                    this.marker.latlng = [location[1], location[0]];
                                    this.marker.course = parseInt(item.course);

                                    if (item.photo) {
                                        this.marker.time = new dayjs(item.photo.time).format('YYYY-MM-DD HH:mm:ss');
                                        this.marker.behavior = item.photo.behavior;
                                        this.marker.pic = item.photo.shipPhoto;
                                        this.marker.picId = item.photo.id;
                                        this.marker.hasPic = true;
                                    }

                                    obj.last = true;
                                }
                                // obj.hasPic = true;
                                if (item.photo) {
                                    obj.time = new dayjs(item.photo.time).format('YYYY-MM-DD HH:mm:ss');
                                    obj.behavior = item.photo.behavior;
                                    obj.pic = item.photo.shipPhoto;
                                    obj.picId = item.photo.id;
                                    obj.hasPic = true;

                                    
                                }
                            // }
                            return obj;
                        });
                        this.polyline.polylineList = polylineList;
                        photoList = coordinate.filter((item) => {
                            return item.photo;
                        });
                        this.photoList = photoList;
                    }
                    // if (photo && photo.length > 0) {
                    //     this.photoList = photo;
                    // }
                } else {
                    this.$vux.toast.text(msg, 'middle');
                }
            }).catch(err => {
                throw err;
            }).finally(() => {
                this.afterRes();
            });
        },
        readyPopup(e) {},
        // 地图缩放
        handleMapZoom(e) {
            if (e <= 9) {
                // 缩放到9，不显示circle
                this.showCircle = false;
            } else {
                this.showCircle = true;
            }
        },
        // 打开图片列表
        openPicModal(circle) {
            let index = this.polyline.latlngs.findIndex((item) => {
                return item.picId == circle.picId;
            });
            if (index != -1) {
                this.photoIndex = index;
            }
            // this.currentPic = {
            //     pic: circle.pic[0],
            //     behavior: circle.behavior,
            //     picId: circle.picId,
            //     time: new dayjs(circle.time).format('YYYY-MM-DD HH:mm:ss'),
            // };
            // if (circle.picId) {
            //     let index = this.photoList.findIndex((item) => {
            //         return item.id == circle.picId;
            //     });
            //     if (index != -1) {
            //         this.photoIndex = index;
            //     }
            // }
            this.showPicModal = true;
        },
        // 关闭图片列表
        closePicModal() {
            this.showPicModal = false;
        },
        // 点击左右按钮
        handleChangePic(direction) {
            if (direction == 'left') {
                this.photoIndex > 0 ? (this.photoIndex -= 1) : (this.photoIndex = 0);
            } else if (direction == 'right') {
                this.photoIndex < this.photoList.length - 1 ? (this.photoIndex += 1) : (this.photoIndex = this.photoList.length - 1);
            }
        },
        // 大图预览
        previewBanner(url) {
            // 不支持base64图片预览
            if (url.indexOf('base64') >= 0) return;
            // 首图预览，包含了优先加载图片监控的图片预览
            let urls = [];
            if (!url) return;
            // if (this.polyline.latlngs) {
            //     urls.push(this.polyline.latlngs)
            // }
            if (this.polyline.latlngs) {
                this.polyline.latlngs.forEach((item) => {
                    if (item.pic.length > 0) {
                        urls.push(item.pic[0]);
                    }
                });
            }
            $util.previewImage({
                urls,
                current: url,
            });
        },
    }
}
</script>
 
<style lang = "scss" scoped>
    .trail-page {
        width: 100%;
        height: 100vh;
        background-color: #ffffff;
        overflow: hidden;
        .top-bar {
            /* position: absolute;
            left: 0;
            top: 0;
            z-index: 1001; */
            width: 100%;
            height: 5rem;
            box-sizing: border-box;
            padding: 0 1.5rem;
            background-color: #ffffff;
            transition: height .25s;
            overflow: hidden;
            &.extend {
                height: 10rem;
            }
            .radio-groups {
                .radio-button {
                    display: inline-block;
                    height: 5rem;
                    line-height: 5rem;
                    &:not(:first-of-type) {
                        margin-left: 2rem;
                    }
                    .radio_not-select, .radio_selected, .radio_label {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .radio_not-select {
                        width: 1.4rem;
                        height: 1.4rem;
                        box-sizing: border-box;
                        border-radius: .7rem;
                        border: 1px solid #939393;
                    }
                    .radio_selected {
                        width: 1.4rem;
                        height: 1.4rem;
                        box-sizing: border-box;
                        border-radius: .7rem;
                        background-color: #3644ec;
                        border: 1px solid #3644ec;
                        position: relative;
                        &::before {
                            content: "";
                            position: absolute;
                            /* top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%); */
                            top: .4rem;
                            left: .4rem;
                            width: .4rem;
                            height: .4rem;
                            background-color: #ffffff;
                            border-radius: .2rem;
                        }
                    }
                    .radio_label {
                        font-size: 14px;
                        color: #777777;
                    }
                }
            }
            .radio-extend {
                width: 100%;
                height: 5rem;
                line-height: 5rem;
                box-sizing: border-box;
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
                  border-radius: .4rem;
                }
                .divice {
                  width: 1.8rem;
                  height: .1rem;
                  margin: 0 1rem;
                  background-color: #bbb;
                }
                .search {
                    background-color: #3644ec;
                    color: #ffffff;
                    height: 3rem;
                    line-height: 3rem;
                    padding: 0 1.5rem;
                    text-align: center;
                    border-radius: .4rem;
                    margin-left: 2rem;
                }
            }
        }
        .map {
            width: 100%;
            /* margin-top: 5rem; */
            height: calc(100vh - 5rem);
            background-color: #ffffff;
            transition: height .25s;
            &.extend {
                height: calc(100vh - 10rem);
            }
            .custom-popup {
                >>>.leaflet-popup-content-wrapper {
                    display: block;
                }
            }
            .popup-content {
                /* width: 23.8rem;
                height: 16.4rem; */
                .top {
                    font-size: 1.4rem;
                    color: #101010;
                    .behavior {
                        float: right;
                        &.green {
                            color: #35C45A;
                        }
                        &.red {
                            color: #EE514E;
                        }
                    }
                }
                .history-pic {
                    display: block;
                    width: 22rem;
                    height: 12rem;
                }
            }
        }
        .pic-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            z-index: 1001;
            .modal-bg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .3);
            }
            .modal-content {
                position: absolute;
                top: 18rem;
                left: 50%;
                transform: translateX(-50%);
                width: 32.8rem;
                /* height: 36.6rem; */
                background-color: #ffffff;
                border-radius: 1.3rem;
                .top {
                    width: 100%;
                    height: 4.5rem;
                    box-sizing: border-box;
                    line-height: 4.5rem;
                    padding: 0 1.6rem;
                    .behavior {
                        float: right;
                        &.red {
                            color: #EE514E;                        
                        }
                        &.green {
                            color: #35C45A;
                        }
                    }
                }
                .bottom {
                    width: 100%;
                    height: 18.4rem;
                    position: relative;
                    overflow: hidden;
                    border-bottom-left-radius: 1.4rem;
                    border-bottom-right-radius: 1.4rem;
                    /* height: calc(100% - 4.5rem); */
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .swiper {
                        height: 100%;
                    }
                    .left-arrow, .right-arrow {
                        position: absolute;
                        width: 4.5rem;
                        height: 4.5rem;
                        background-color: rgba(0, 0, 0, .3);
                        border-radius: 2.5rem;
                        display: flex;
                        img {
                            width: 2rem;
                            height: 2rem;
                            display: block;
                            margin: auto;
                        }
                    }
                    .left-arrow {
                        top: 50%;
                        left: 1rem;
                        transform: translateY(-50%);
                    }
                    .right-arrow {
                        top: 50%;
                        right: 1rem;
                        transform: translateY(-50%);
                    }
                }
            }
            .icon-close {
                position: absolute;
                width: 2.4rem;
                height: 2.4rem;
                background-image: url('../../assets/image/icon-close-white.png');
                background-size: contain;
                background-repeat: no-repeat;
                transform: translateX(-50%) rotate(45deg);
                left: 50%;
                bottom: -3.4rem;
            }
        }
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
</style>